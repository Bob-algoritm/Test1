import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const AIRTABLE_API = 'https://api.airtable.com/v0';

async function airtableFetch(token, url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = { raw: text }; }
  if (!res.ok) {
    return { error: true, status: res.status, body };
  }
  return body;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('airtable');

    // 1. List bases
    const basesRes = await airtableFetch(accessToken, `${AIRTABLE_API}/meta/bases`);
    if (basesRes.error) return Response.json({ step: 'bases', ...basesRes }, { status: 500 });
    const bases = (basesRes.bases || []).map((b) => ({ id: b.id, name: b.name, permissionLevel: b.permissionLevel }));

    // 2. For each base, list tables + fields
    const result = [];
    for (const base of bases) {
      const schemaRes = await airtableFetch(accessToken, `${AIRTABLE_API}/meta/bases/${base.id}/tables`);
      const tables = schemaRes.error
        ? { error: schemaRes }
        : (schemaRes.tables || []).map((t) => ({
            id: t.id,
            name: t.name,
            fields: (t.fields || []).map((f) => ({ name: f.name, type: f.type })),
          }));
      result.push({ base, tables });
    }

    return Response.json({ bases, detail: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}