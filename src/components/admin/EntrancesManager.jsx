import React, { useState } from "react";
import { useBuildings, useEntrances, useProjects, useCrud } from "@/hooks/useUnitData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, DoorOpen } from "lucide-react";

const empty = { name: "", building_id: "" };

export default function EntrancesManager() {
  const { data: projects = [] } = useProjects();
  const { data: buildings = [] } = useBuildings();
  const { data: entrances = [], isLoading } = useEntrances();
  const { create, update, remove } = useCrud("Entrance", ["entrances"]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (e) => { setEditing(e); setForm({ name: e.name || "", building_id: e.building_id || "" }); setOpen(true); };

  const save = () => {
    const building = buildings.find((b) => b.id === form.building_id);
    const payload = {
      name: form.name,
      building_id: form.building_id,
      project_id: building?.project_id || "",
    };
    if (editing) update.mutate({ id: editing.id, data: payload }, { onSuccess: () => setOpen(false) });
    else create.mutate(payload, { onSuccess: () => setOpen(false) });
  };

  const bldgName = (id) => buildings.find((b) => b.id === id)?.name || "—";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Подъезды</h2>
        <Button onClick={openNew} disabled={!buildings.length} className="gap-2"><Plus className="w-4 h-4" /> Новый подъезд</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : !buildings.length ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Сначала создайте проект и здание.
        </div>
      ) : entrances.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">Подъездов пока нет.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {entrances.map((e) => (
            <div key={e.id} className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <DoorOpen className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{e.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{bldgName(e.building_id)}</div>
                <div className="flex gap-1 mt-3">
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openEdit(e)}><Pencil className="w-3.5 h-3.5" /> Изменить</Button>
                  <Button variant="ghost" size="sm" className="text-destructive ml-auto" onClick={() => { if (confirm("Удалить подъезд?")) remove.mutate(e.id); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Изменить подъезд" : "Новый подъезд"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Здание</Label>
              <Select value={form.building_id} onValueChange={(v) => setForm({ ...form, building_id: v })}>
                <SelectTrigger><SelectValue placeholder="Выберите здание" /></SelectTrigger>
                <SelectContent>
                  {buildings.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Название</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Подъезд 1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
            <Button onClick={save} disabled={!form.name || !form.building_id || create.isPending || update.isPending}>
              {(create.isPending || update.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}