import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  useProjects,
  useBuildings,
  useEntrances,
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
import { LayoutGrid, Table2, Loader2, Building2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatus, STATUSES } from "@/lib/unitStatus";
import MatrixGrid from "@/components/MatrixGrid";
import UnitTable from "@/components/UnitTable";
import UnitDetailDialog from "@/components/UnitDetailDialog";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLang } from "@/lib/i18n.jsx";

export default function Matrix() {
  const { t } = useLang();
  const { user } = useAuth();
  const canEdit = user?.role === "admin" || user?.can_edit_units === true;

  const { data: projects = [], isLoading: lp } = useProjects();
  const { data: buildings = [], isLoading: lb } = useBuildings();
  const { data: entrances = [], isLoading: le } = useEntrances();
  const { data: floors = [], isLoading: lf } = useFloors();
  const { data: units = [], isLoading: lu } = useUnits();

  const [projectId, setProjectId] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [entranceId, setEntranceId] = useState("");
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

  const buildingEntrances = entrances.filter((e) => e.building_id === effectiveBuilding);
  const effectiveEntrance =
    entranceId && buildingEntrances.some((e) => e.id === entranceId)
      ? entranceId
      : buildingEntrances[0]?.id || "";

  const buildingFloors = floors.filter((f) => f.building_id === effectiveBuilding);
  const buildingUnits = units.filter(
    (u) => u.building_id === effectiveBuilding && (!effectiveEntrance || u.entrance_id === effectiveEntrance)
  );

  const stats = useMemo(() => {
    const counts = { available: 0, reserved: 0, occupied: 0 };
    buildingUnits.forEach((u) => {
      if (counts[u.status] != null) counts[u.status] += 1;
    });
    return counts;
  }, [buildingUnits]);

  const loading = lp || lb || le || lf || lu;

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
          title={t("matrix.noProjectsTitle")}
          message={t("matrix.noProjectsMsg")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="leading-none">
              <div className="font-semibold tracking-tight">UnitMatrix</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Living</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button asChild size="sm" variant="outline" className="gap-2">
              <Link to="/"><ArrowLeft className="w-4 h-4" /> {t("matrix.home")}</Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t("nav.availability")}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {t("matrix.subtitle")}
            </p>
          </div>
          <div className="flex rounded-lg border border-border p-1">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition",
                view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="w-4 h-4" /> {t("matrix.grid")}
            </button>
            <button
              onClick={() => setView("table")}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition",
                view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Table2 className="w-4 h-4" /> {t("matrix.table")}
            </button>
          </div>
        </div>

        {/* Controls + legend */}
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={effectiveProject} onValueChange={(v) => { setProjectId(v); setBuildingId(""); }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("matrix.selectProject")} />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={effectiveBuilding}
            onValueChange={(v) => { setBuildingId(v); setEntranceId(""); }}
            disabled={!projectBuildings.length}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("matrix.selectBuilding")} />
            </SelectTrigger>
            <SelectContent>
              {projectBuildings.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={effectiveEntrance}
            onValueChange={setEntranceId}
            disabled={!buildingEntrances.length}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("matrix.selectEntrance")} />
            </SelectTrigger>
            <SelectContent>
              {buildingEntrances.map((e) => (
                <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-2 ml-auto">
            {STATUSES.map((st) => {
              const cfg = getStatus(st);
              return (
                <div key={st} className="flex items-center gap-1.5 text-sm">
                  <span className={cn("w-2.5 h-2.5 rounded-full", cfg.dot)} />
                  <span className="font-semibold">{stats[st]}</span>
                  <span className="text-muted-foreground">{t(`status.${st}`)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      {!effectiveBuilding ? (
        <EmptyState
          title={t("matrix.noBuildingsTitle")}
          message={t("matrix.noBuildingsMsg")}
        />
      ) : !effectiveEntrance ? (
        <EmptyState
          title={t("matrix.noEntrancesTitle")}
          message={t("matrix.noEntrancesMsg")}
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