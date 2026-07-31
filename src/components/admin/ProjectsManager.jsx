import React, { useState } from "react";
import { useProjects, useCrud } from "@/hooks/useUnitData";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, MapPin } from "lucide-react";

const empty = { name: "", location: "", description: "", image_url: "" };

export default function ProjectsManager() {
  const { data: projects = [], isLoading } = useProjects();
  const { create, update, remove } = useCrud("Project", ["projects"]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [uploading, setUploading] = useState(false);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...empty, ...p }); setOpen(true); };

  const save = () => {
    const payload = { ...form };
    if (editing) update.mutate({ id: editing.id, data: payload }, { onSuccess: () => setOpen(false) });
    else create.mutate(payload, { onSuccess: () => setOpen(false) });
  };

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm((f) => ({ ...f, image_url: file_url }));
    } finally { setUploading(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Projects &amp; Complexes</h2>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> New project</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No projects yet. Create your first project to get started.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
              <div className="h-32 bg-sidebar border-b border-border flex items-center justify-center text-muted-foreground">
                {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <MapPin className="w-8 h-8" />}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="font-semibold">{p.name}</div>
                {p.location && <div className="text-xs text-muted-foreground mt-0.5">{p.location}</div>}
                {p.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{p.description}</p>}
                <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5" /> Edit</Button>
                  <Button variant="ghost" size="sm" className="text-destructive ml-auto" onClick={() => { if (confirm("Delete this project?")) remove.mutate(p.id); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit project" : "New project"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Skyline Residences" />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Downtown District" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Cover image</Label>
              <Input type="file" accept="image/*" onChange={upload} disabled={uploading} />
              {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
              {form.image_url && <p className="text-xs text-emerald-400">Image uploaded</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={!form.name || create.isPending || update.isPending}>
              {(create.isPending || update.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? "Save changes" : "Create project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}