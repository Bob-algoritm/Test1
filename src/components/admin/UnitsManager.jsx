import React, { useState } from "react";
import { useProjects, useBuildings, useFloors, useUnits, useCrud } from "@/hooks/useUnitData";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { getStatus, formatPrice, STATUSES } from "@/lib/unitStatus";
import { cn } from "@/lib/utils";

const empty = {
  unit_number: "", project_id: "", building_id: "", floor_id: "",
  size_sqm: "", price: "", status: "available", bedrooms: "", bathrooms: "",
  photo_url: "", floor_plan_url: "", description: "",
};

export default function UnitsManager() {
  const { data: projects = [] } = useProjects();
  const { data: buildings = [] } = useBuildings();
  const { data: floors = [] } = useFloors();
  const { data: units = [], isLoading } = useUnits();
  const { create, update, remove } = useCrud("Unit", ["units"]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [uploading, setUploading] = useState(null);

  const [projFilter, setProjFilter] = useState("all");
  const [bldgFilter, setBldgFilter] = useState("all");

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (u) => {
    setEditing(u);
    setForm({
      ...empty,
      ...u,
      size_sqm: u.size_sqm ?? "",
      price: u.price ?? "",
      bedrooms: u.bedrooms ?? "",
      bathrooms: u.bathrooms ?? "",
    });
    setOpen(true);
  };

  const upload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm((f) => ({ ...f, [field]: file_url }));
    } finally { setUploading(null); }
  };

  const save = () => {
    const floor = floors.find((f) => f.id === form.floor_id);
    const payload = {
      unit_number: form.unit_number,
      project_id: form.project_id,
      building_id: form.building_id,
      floor_id: form.floor_id,
      floor_number: floor?.floor_number,
      size_sqm: form.size_sqm ? Number(form.size_sqm) : undefined,
      price: form.price ? Number(form.price) : undefined,
      status: form.status,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : 0,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : 0,
      photo_url: form.photo_url,
      floor_plan_url: form.floor_plan_url,
      description: form.description,
    };
    if (editing) update.mutate({ id: editing.id, data: payload }, { onSuccess: () => setOpen(false) });
    else create.mutate(payload, { onSuccess: () => setOpen(false) });
  };

  const projectBuildings = buildings.filter((b) => b.project_id === form.project_id);
  const buildingFloors = floors.filter((f) => f.building_id === form.building_id).sort((a, b) => a.floor_number - b.floor_number);

  const filteredUnits = units.filter((u) =>
    (projFilter === "all" || u.project_id === projFilter) &&
    (bldgFilter === "all" || u.building_id === bldgFilter)
  );

  const projName = (id) => projects.find((p) => p.id === id)?.name || "—";
  const bldgName = (id) => buildings.find((b) => b.id === id)?.name || "—";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold">Units</h2>
        <Button onClick={openNew} disabled={!floors.length} className="gap-2"><Plus className="w-4 h-4" /> New unit</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Select value={projFilter} onValueChange={setProjFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All projects" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={bldgFilter} onValueChange={setBldgFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All buildings" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All buildings</SelectItem>
            {buildings.filter((b) => projFilter === "all" || b.project_id === projFilter).map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="ml-auto text-sm text-muted-foreground self-center">{filteredUnits.length} units</span>
      </div>

      {!floors.length ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Create a project, building, and floor before adding units.
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : filteredUnits.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">No units yet.</div>
      ) : (
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sidebar/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">Unit</th>
                <th className="text-left font-medium px-4 py-3">Building</th>
                <th className="text-left font-medium px-4 py-3">Floor</th>
                <th className="text-left font-medium px-4 py-3">Size</th>
                <th className="text-right font-medium px-4 py-3">Price</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUnits.map((u) => {
                const s = getStatus(u.status);
                return (
                  <tr key={u.id} className="hover:bg-sidebar/30">
                    <td className="px-4 py-3 font-medium">{u.unit_number}</td>
                    <td className="px-4 py-3 text-muted-foreground">{bldgName(u.building_id)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.floor_number ?? "—"}</td>
                    <td className="px-4 py-3">{u.size_sqm ? `${u.size_sqm} m²` : "—"}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(u.price)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", s.bg, s.text)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />{s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(u)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm("Delete this unit?")) remove.mutate(u.id); }}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit unit" : "New unit"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project</Label>
                <Select value={form.project_id} onValueChange={(v) => setForm({ ...form, project_id: v, building_id: "", floor_id: "" })}>
                  <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Building</Label>
                <Select value={form.building_id} onValueChange={(v) => setForm({ ...form, building_id: v, floor_id: "" })} disabled={!form.project_id}>
                  <SelectTrigger><SelectValue placeholder="Select building" /></SelectTrigger>
                  <SelectContent>
                    {projectBuildings.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Floor</Label>
                <Select value={form.floor_id} onValueChange={(v) => setForm({ ...form, floor_id: v })} disabled={!form.building_id}>
                  <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
                  <SelectContent>
                    {buildingFloors.map((f) => <SelectItem key={f.id} value={f.id}>Floor {f.floor_number}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Unit number</Label>
                <Input value={form.unit_number} onChange={(e) => setForm({ ...form, unit_number: e.target.value })} placeholder="12B" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Size (m²)</Label>
                <Input type="number" value={form.size_sqm} onChange={(e) => setForm({ ...form, size_sqm: e.target.value })} placeholder="85" />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="350000" />
              </div>
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} placeholder="2" />
              </div>
              <div className="space-y-2">
                <Label>Bathrooms</Label>
                <Input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} placeholder="2" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{getStatus(s).label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Unit photo</Label>
                <Input type="file" accept="image/*" onChange={(e) => upload(e, "photo_url")} disabled={uploading === "photo_url"} />
                {uploading === "photo_url" && <p className="text-xs text-muted-foreground">Uploading…</p>}
                {form.photo_url && <p className="text-xs text-emerald-400">Uploaded</p>}
              </div>
              <div className="space-y-2">
                <Label>Floor plan</Label>
                <Input type="file" accept="image/*" onChange={(e) => upload(e, "floor_plan_url")} disabled={uploading === "floor_plan_url"} />
                {uploading === "floor_plan_url" && <p className="text-xs text-muted-foreground">Uploading…</p>}
                {form.floor_plan_url && <p className="text-xs text-emerald-400">Uploaded</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={!form.unit_number || !form.floor_id || create.isPending || update.isPending}>
              {(create.isPending || update.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? "Save changes" : "Create unit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}