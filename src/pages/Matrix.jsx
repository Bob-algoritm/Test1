import React, { useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
  useProjects,
  useBuildings,
  useFloors,
  useUnits,
} from "@/hooks/useUnitData";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LayoutGrid, Table2, Loader2, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatus, STATUSES } from "@/lib/unitStatus";
import MatrixGrid from "@/components/MatrixGrid";
import UnitTable from "@/components/UnitTable";
import UnitDetailDialog from "@/components/UnitDetailDialog";

export default function Matrix() {
  const { user } = useAuth();
  const canEdit = user?.role === "admin" || user?.can_edit_units === true;

  const { data: projects = [], isLoading: lp } = useProjects();
  const { data: buildings = [], isLoading: lb } = useBuildings();
  const { data: floors = [], isLoading: lf } = useFloors();
  const { data: units = [], isLoading: lu } = useUnits();

  const [projectId, setProjectId] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [view, setView] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  // Auto-select first project/building when data loads
  const effectiveProject = projectId || (projects[0] && projects[0].id) || "";
  const projectBuildings = buildings.filter((b) => b.project_id === effectiveProject);
  const effectiveBuilding =
    buildingId && projectBuildings.some((b) => b.id === buildingId)
      ? buildingId
      : projectBuildings[0]?.id || "";

  const buildingFloors = floors.filter((f) => f.building_id === effectiveBuilding);
  const buildingUnits = units.filter((u) => u.building_id === effectiveBuilding);

  const stats = useMemo(() => {
    const counts = { available: 0, reserved: 0, occupied: 0 };
    buildingUnits.forEach((u) => {
      if (counts[u.status] != null) counts[u.status] += 1;
    });
    return counts;
  }, [buildingUnits]);

  const loading = lp || lb || lf || lu;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="p-8 md:p-12 max-w-6xl mx-auto">
        <EmptyState
          title="No projects yet"
          message="An admin needs to create projects, buildings, and units before the availability matrix can be viewed."
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Availability Matrix</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Browse unit availability across projects and buildings.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="flex flex-wrap gap-3">
            <Select value={effectiveProject} onValueChange={(v) => { setProjectId(v); setBuildingId(""); }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={effectiveBuilding}
              onValueChange={setBuildingId}
              disabled={!projectBuildings.length}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select building" />
              </SelectTrigger>
              <SelectContent>
                {projectBuildings.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View toggle */}
          <div className="flex rounded-lg border border-border p-1 ml-auto">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition",
                view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="w-4 h-4" /> Grid
            </button>
            <button
              onClick={() => setView("table")}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition",
                view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Table2 className="w-4 h-4" /> Table
            </button>
          </div>
        </div>

        {/* Stats + legend */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((st) => {
              const cfg = getStatus(st);
              return (
                <div key={st} className={cn("flex items-center gap-2 rounded-lg border px-3 py-2", cfg.bg, cfg.border)}>
                  <span className={cn("w-2.5 h-2.5 rounded-full", cfg.dot)} />
                  <span className={cn("text-sm font-semibold", cfg.text)}>{stats[st]}</span>
                  <span className="text-xs text-muted-foreground">{cfg.label}</span>
                </div>
              );
            })}
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
              <span className="text-sm font-semibold">{buildingUnits.length}</span>
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {!effectiveBuilding ? (
        <EmptyState
          title="No buildings in this project"
          message="Select a different project, or ask an admin to add buildings."
        />
      ) : view === "grid" ? (
        <MatrixGrid floors={buildingFloors} units={buildingUnits} onSelect={setSelected} />
      ) : (
        <UnitTable
          units={buildingUnits}
          statusFilter={statusFilter}
          onStatusFilter={setStatusFilter}
          onSelect={setSelected}
        />
      )}

      <UnitDetailDialog
        unit={selected}
        open={!!selected}
        onOpenChange={(v) => !v && setSelected(null)}
        canEdit={canEdit}
      />
    </div>
  );
}

function EmptyState({ title, message }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-12 text-center">
      <div className="w-12 h-12 rounded-xl bg-sidebar border border-border flex items-center justify-center mx-auto mb-4">
        <Building2 className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm mt-1 max-w-md mx-auto">{message}</p>
    </div>
  );
}