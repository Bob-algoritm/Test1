import React, { useState } from "react";
import { useProjects, useBuildings, useCrud } from "@/hooks/useUnitData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Building } from "lucide-react";

const empty = { name: "", project_id: "", address: "", floors_count: "" };

export default function BuildingsManager() {
  const { data: projects = [] } = useProjects();
  const { data: buildings = [], isLoading } = useBuildings();
  const { create, update, remove } = useCrud("Building", ["buildings"]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (b) => { setEditing(b); setForm({ ...empty, ...b, floors_count: b.floors_count ?? "" }); setOpen(true); };

  const save = () => {
    const payload = { ...form, floors_count: form.floors_count ? Number(form.floors_count) : undefined };
    if (editing) update.mutate({ id: editing.id, data: payload }, { onSuccess: () => setOpen(false) });
    else create.mutate(payload, { onSuccess: () => setOpen(false) });
  };

  const projName = (id) => projects.find((p) => p.id === id)?.name || "—";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Buildings</h2>
        <Button onClick={openNew} disabled={!projects.length} className="gap-2"><Plus className="w-4 h-4" /> New building</Button>
      </div>

      {!projects.length ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Create a project first before adding buildings.
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : buildings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No buildings yet.
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sidebar/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">Name</th>
                <th className="text-left font-medium px-4 py-3">Project</th>
                <th className="text-left font-medium px-4 py-3">Address</th>
                <th className="text-left font-medium px-4 py-3">Floors</th>
                <th className="text-right font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {buildings.map((b) => (
                <tr key={b.id} className="hover:bg-sidebar/30">
                  <td className="px-4 py-3 font-medium flex items-center gap-2"><Building className="w-4 h-4 text-muted-foreground" />{b.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{projName(b.project_id)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.address || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.floors_count ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm("Delete this building?")) remove.mutate(b.id); }}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit building" : "New building"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={form.project_id} onValueChange={(v) => setForm({ ...form, project_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tower A" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="120 Skyline Ave" />
            </div>
            <div className="space-y-2">
              <Label>Total floors</Label>
              <Input type="number" value={form.floors_count} onChange={(e) => setForm({ ...form, floors_count: e.target.value })} placeholder="8" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={!form.name || !form.project_id || create.isPending || update.isPending}>
              {(create.isPending || update.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? "Save changes" : "Create building"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}