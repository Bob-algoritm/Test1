import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const AIRTABLE_API = 'https://api.airtable.com/v0';

// Airtable column name -> how it's used. If you rename a column in Airtable,
// update the corresponding key here only.
const FIELDS = {
  unitNumber: 'Unit number',
  project: 'Project',
  building: 'Building',
  entrance: 'Entrance',
  floor: 'Floor',
  status: 'Status',
  price: 'Price',
  size: 'Size',
  bedrooms: 'Bedrooms',
  bathrooms: 'Bathrooms',
  photoUrl: 'Photo URL',
  photoAttachment: 'Photo',
  floorPlanUrl: 'Floor plan',
  videoUrl: 'Video',
  description: 'Description',
};

function cell(record, key) {
  const name = FIELDS[key];
  if (!name) return undefined;
  const v = record.fields?.[name];
  if (v === null || v === undefined) return undefined;
  // Airtable returns arrays for some field types; take first element for scalar text/number
  if (Array.isArray(v)) return v.length ? v[0] : undefined;
  return v;
}

function firstAttachmentUrl(record, key) {
  const name = FIELDS[key];
  const v = record.fields?.[name];
  if (!Array.isArray(v) || !v.length) return undefined;
  const first = v[0];
  return first?.url || first?.thumbnails?.large?.url;
}

// Accept either a plain text URL or an attachment field for a URL column.
function urlField(record, key) {
  const name = FIELDS[key];
  const v = record.fields?.[name];
  if (v == null) return undefined;
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) {
    const first = v[0];
    return first?.url || first?.thumbnails?.large?.url;
  }
  return undefined;
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function normStatus(v) {
  const s = String(v || '').toLowerCase().trim();
  if (s === 'reserved' || s === 'occupied' || s === 'available') return s;
  return 'available';
}

async function airtableGet(token, url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const body = await res.json();
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${JSON.stringify(body)}`);
  return body;
}

// Fetch ALL records from a table (manual pagination, pageSize=100).
async function listAllRecords(token, baseId, tableId) {
  const records = [];
  let offset;
  do {
    const url = `${AIRTABLE_API}/${baseId}/${tableId}?pageSize=100${offset ? `&offset=${offset}` : ''}`;
    const data = await airtableGet(token, url);
    records.push(...(data.records || []));
    offset = data.offset;
  } while (offset);
  return records;
}

// Find or create hierarchy entities by name within their parent.
async function resolveProject(base44, name) {
  const nameTrim = (name || '').trim();
  if (!nameTrim) throw new Error('Project column is required for every Airtable row');
  const existing = await base44.asServiceRole.entities.Project.filter({ name: nameTrim });
  if (existing.length) return existing[0];
  return base44.asServiceRole.entities.Project.create({ name: nameTrim });
}

async function resolveBuilding(base44, projectId, name) {
  const nameTrim = (name || '').trim();
  if (!nameTrim) throw new Error('Building column is required');
  const existing = await base44.asServiceRole.entities.Building.filter({ project_id: projectId, name: nameTrim });
  if (existing.length) return existing[0];
  return base44.asServiceRole.entities.Building.create({ name: nameTrim, project_id: projectId });
}

async function resolveEntrance(base44, projectId, buildingId, name) {
  const nameTrim = (name || '').trim() || 'Подъезд 1';
  const existing = await base44.asServiceRole.entities.Entrance.filter({ building_id: buildingId, name: nameTrim });
  if (existing.length) return existing[0];
  return base44.asServiceRole.entities.Entrance.create({ name: nameTrim, building_id: buildingId, project_id: projectId });
}

async function resolveFloor(base44, projectId, buildingId, floorNumber) {
  const fn = num(floorNumber);
  if (fn === undefined) throw new Error('Floor column is required and must be a number');
  const existing = await base44.asServiceRole.entities.Floor.filter({ building_id: buildingId, floor_number: fn });
  if (existing.length) return existing[0];
  return base44.asServiceRole.entities.Floor.create({ building_id: buildingId, project_id: projectId, floor_number: fn });
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    // Allow scheduled (no user) and admin manual runs; block logged-in non-admins.
    const authed = await base44.auth.isAuthenticated().catch(() => false);
    if (authed) {
      const user = await base44.auth.me();
      if (user && user.role !== 'admin') {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('airtable');

    // Discover base + table: use the first base, then the first table that has
    // our "Unit Number" field — robust to base/table renames.
    const basesRes = await airtableGet(accessToken, `${AIRTABLE_API}/meta/bases`);
    const bases = basesRes.bases || [];
    if (!bases.length) return Response.json({ error: 'No Airtable bases found' }, { status: 400 });
    const baseId = bases[0].id;

    const schemaRes = await airtableGet(accessToken, `${AIRTABLE_API}/meta/bases/${baseId}/tables`);
    const tables = schemaRes.tables || [];
    const table = tables.find(
      (t) => t.fields?.some((f) => f.name === FIELDS.unitNumber)
        && t.fields?.some((f) => f.name === FIELDS.project)
    );
    if (!table) {
      return Response.json({
        error: `No table with a "${FIELDS.unitNumber}" column was found in base "${bases[0].name}".`,
        availableTables: tables.map((t) => ({ id: t.id, name: t.name, fields: t.fields?.map((f) => f.name) })),
      }, { status: 400 });
    }
    const tableId = table.id;

    const airRecords = await listAllRecords(accessToken, baseId, tableId);

    // Load existing units indexed by airtable_id for upsert.
    const existing = await base44.asServiceRole.entities.Unit.list('-updated_date', 500);
    const byAirtableId = new Map();
    const byKey = new Map();
    for (const u of existing) {
      if (u.airtable_id) byAirtableId.set(u.airtable_id, u);
      if (u.building_id) byKey.set(`${u.building_id}|${u.unit_number}`, u);
    }

    let created = 0, updated = 0, skipped = 0;
    const errors = [];

    for (const rec of airRecords) {
      try {
        const unitNumber = String(cell(rec, 'unitNumber') ?? '').trim();
        if (!unitNumber) { skipped++; continue; }

        const project = await resolveProject(base44, cell(rec, 'project'));
        const building = await resolveBuilding(base44, project.id, cell(rec, 'building'));
        const entrance = await resolveEntrance(base44, project.id, building.id, cell(rec, 'entrance'));
        const floor = await resolveFloor(base44, project.id, building.id, cell(rec, 'floor'));

        const payload = {
          unit_number: unitNumber,
          project_id: project.id,
          building_id: building.id,
          entrance_id: entrance.id,
          floor_id: floor.id,
          floor_number: floor.floor_number,
          status: normStatus(cell(rec, 'status')),
          price: num(cell(rec, 'price')),
          size_sqm: num(cell(rec, 'size')),
          bedrooms: num(cell(rec, 'bedrooms')) ?? 0,
          bathrooms: num(cell(rec, 'bathrooms')) ?? 0,
          photo_url: urlField(rec, 'photoUrl') || urlField(rec, 'photoAttachment'),
          floor_plan_url: urlField(rec, 'floorPlanUrl'),
          video_url: urlField(rec, 'videoUrl'),
          description: cell(rec, 'description') || '',
          airtable_id: rec.id,
        };

        const match = byAirtableId.get(rec.id) || byKey.get(`${building.id}|${unitNumber}`);
        if (match) {
          await base44.asServiceRole.entities.Unit.update(match.id, payload);
          updated++;
        } else {
          await base44.asServiceRole.entities.Unit.create(payload);
          created++;
        }
      } catch (e) {
        errors.push({ id: rec.id, error: e.message });
      }
    }

    return Response.json({
      ok: true,
      base: bases[0].name,
      table: table.name,
      airtableRecords: airRecords.length,
      created,
      updated,
      skipped,
      errors,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}