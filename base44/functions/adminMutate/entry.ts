import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Strong admin password — kept server-side only (never shipped to the client bundle).
// Share this with the site owner out-of-band. Change it here to rotate.
const ADMIN_PASSWORD = "q8Tm!K3pL9#vXw2Z";

const ALLOWED_ENTITIES = [
  "Project",
  "Building",
  "Floor",
  "Entrance",
  "Unit",
  "SiteContent",
];

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const { password, entity, operation, id, data } = body || {};

    // 1) Password is the only auth mechanism (no user accounts by design).
    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: "Неверный пароль" }, { status: 403 });
    }

    // 2) Lightweight check used by the password gate to verify the password.
    if (operation === "verify") {
      return Response.json({ ok: true });
    }

    // 3) Validate the entity + operation before touching the DB.
    if (!ALLOWED_ENTITIES.includes(entity)) {
      return Response.json({ error: "Unknown entity" }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const repo = base44.asServiceRole.entities[entity];

    let result;
    if (operation === "create") {
      result = await repo.create(data);
    } else if (operation === "update") {
      result = await repo.update(id, data);
    } else if (operation === "delete") {
      result = await repo.delete(id);
    } else {
      return Response.json({ error: "Unknown operation" }, { status: 400 });
    }

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}