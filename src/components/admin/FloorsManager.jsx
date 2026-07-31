import React, { useState } from "react";
import { useProjects, useBuildings, useFloors, useCrud } from "@/hooks/useUnitData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const empty = { building_id: "", floor_number: "", name: "" };

export default function FloorsManager() {
  const { data: projects = [] } = useProjects();
  const { data: buildings = [] } = useBuildings();
  const { data: floors = [], isLoading } = useFloors();
  const { create, update, remove } = useCrud("Floor", ["floors"]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (f) => { setEditing(f); setForm({ ...empty, ...f, floor_number: String(f.floor_number ?? "") }); setOpen(true); };

  const buildingName = (id) => buildings.find((b) => b.id === id)?.name || "—";
  const projectName = (bid) => {
    const b = buildings.find((x) => x.id === bid);
    return projects.find((p) => p.id === b?.project_id)?.name || "—";
  };

  const save = () => {
    const building = buildings.find((b) => b.id === form.building_id);
    const payload = {
      building_id: form.building_id,
      project_id: building?.project_id,
      floor_number: Number(form.floor_number),
      name: form.name,
    };
    if (editing) update.mutate({ id: editing.id, data: payload }, { onSuccess: () => setOpen(false) });
    else create.mutate(payload, { onSuccess: () => setOpen(false) });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Floors</h2>
        <Button onClick={openNew} disabled={!buildings.length} className="gap-2"><Plus className="w-4 h-4" /> New floor</Button>
      </div>

      {!buildings.length ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Create a building first before adding floors.
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : floors.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">No floors yet.</div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sidebar/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">Floor</th>
                <th className="text-left font-medium px-4 py-3">Name</th>
                <th className="text-left font-medium px-4 py-3">Building</th>
                <th className="text-left font-medium px-4 py-3">Project</th>
                <th className="text-right font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...floors].sort((a, b) => b.floor_number - a.floor_number).map((f) => (
                <tr key={f.id} className="hover:bg-sidebar/30">
                  <td className="px-4 py-3 font-medium">{f.floor_number}</td>
                  <td className="px-4 py-3 text-muted-foreground">{f.name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{buildingName(f.building_id)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{projectName(f.building_id)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm("Delete this floor?")) remove.mutate(f.id); }}><Trash2 className="w-4 h-4" /></Button>
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
          <DialogHeader><DialogTitle>{editing ? "Edit floor" : "New floor"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Building</Label>
              <Select value={form.building_id} onValueChange={(v) => setForm({ ...form, building_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select building" /></SelectTrigger>
                <SelectContent>
                  {buildings.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Floor number</Label>
              <Input type="number" value={form.floor_number} onChange={(e) => setForm({ ...form, floor_number: e.target.value })} placeholder="3" />
            </div>
            <div className="space-y-2">
              <Label>Display name (optional)</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Penthouse level" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={!form.building_id || !form.floor_number || create.isPending || update.isPending}>
              {(create.isPending || update.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? "Save changes" : "Create floor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}