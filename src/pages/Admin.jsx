import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Shield, LayoutDashboard } from "lucide-react";
import { useProjects, useBuildings, useFloors, useUnits } from "@/hooks/useUnitData";
import { getStatus, STATUSES, formatPrice } from "@/lib/unitStatus";
import { cn } from "@/lib/utils";
import ProjectsManager from "@/components/admin/ProjectsManager";
import BuildingsManager from "@/components/admin/BuildingsManager";
import FloorsManager from "@/components/admin/FloorsManager";
import UnitsManager from "@/components/admin/UnitsManager";
import UsersManager from "@/components/admin/UsersManager";

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className={cn("text-3xl font-bold tracking-tight", accent)}>{value}</div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function Overview() {
  const { data: projects = [] } = useProjects();
  const { data: buildings = [] } = useBuildings();
  const { data: floors = [] } = useFloors();
  const { data: units = [] } = useUnits();

  const counts = { available: 0, reserved: 0, occupied: 0 };
  units.forEach((u) => { if (counts[u.status] != null) counts[u.status] += 1; });
  const occupancy = units.length ? Math.round((counts.occupied / units.length) * 100) : 0;
  const totalPrice = units.reduce((sum, u) => sum + (u.price || 0), 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Projects" value={projects.length} />
        <StatCard label="Buildings" value={buildings.length} />
        <StatCard label="Floors" value={floors.length} />
        <StatCard label="Units" value={units.length} />
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Availability breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATUSES.map((s) => {
            const cfg = getStatus(s);
            return (
              <div key={s} className={cn("rounded-xl border p-5", cfg.bg, cfg.border)}>
                <div className={cn("text-3xl font-bold", cfg.text)}>{counts[s]}</div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mt-1">{cfg.label}</div>
              </div>
            );
          })}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-3xl font-bold tracking-tight">{occupancy}%</div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mt-1">Occupancy rate</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Portfolio value</h3>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-3xl font-bold tracking-tight">{formatPrice(totalPrice)}</div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mt-1">Sum of all unit prices</div>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return (
      <div className="p-8 md:p-12 max-w-md mx-auto text-center">
        <div className="w-12 h-12 rounded-xl bg-destructive/15 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Admin access required</h2>
        <p className="text-muted-foreground text-sm mt-2">
          You need an administrator account to access the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage projects, buildings, floors, units, users, and pricing.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex flex-wrap h-auto bg-sidebar/40 p-1 mb-6 gap-1">
          <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="w-4 h-4" /> Overview</TabsTrigger>
          <TabsTrigger value="projects" className="gap-2">Projects</TabsTrigger>
          <TabsTrigger value="buildings" className="gap-2">Buildings</TabsTrigger>
          <TabsTrigger value="floors" className="gap-2">Floors</TabsTrigger>
          <TabsTrigger value="units" className="gap-2">Units</TabsTrigger>
          <TabsTrigger value="users" className="gap-2">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview"><Overview /></TabsContent>
        <TabsContent value="projects"><ProjectsManager /></TabsContent>
        <TabsContent value="buildings"><BuildingsManager /></TabsContent>
        <TabsContent value="floors"><FloorsManager /></TabsContent>
        <TabsContent value="units"><UnitsManager /></TabsContent>
        <TabsContent value="users"><UsersManager /></TabsContent>
      </Tabs>
    </div>
  );
}