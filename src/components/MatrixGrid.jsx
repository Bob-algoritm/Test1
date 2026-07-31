import React from "react";
import { cn } from "@/lib/utils";
import { getStatus } from "@/lib/unitStatus";

function UnitCard({ unit, onClick }) {
  const s = getStatus(unit.status);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative rounded-xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20",
        s.bg,
        s.border
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">Unit {unit.unit_number}</span>
        <span className={cn("w-2.5 h-2.5 rounded-full ring-2 ring-offset-2 ring-offset-background", s.dot, s.ring)} />
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {unit.size_sqm ? `${unit.size_sqm} m²` : "—"}
      </div>
      <div className={cn("mt-2 inline-block text-[10px] font-semibold uppercase tracking-wider", s.text)}>
        {s.label}
      </div>
    </button>
  );
}

export default function MatrixGrid({ floors, units, onSelect }) {
  const sorted = [...floors].sort((a, b) => b.floor_number - a.floor_number);

  if (!sorted.length) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
        No floors defined for this building yet.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sorted.map((floor) => {
        const floorUnits = units
          .filter((u) => u.floor_id === floor.id)
          .sort((a, b) => String(a.unit_number).localeCompare(String(b.unit_number), undefined, { numeric: true }));
        return (
          <div key={floor.id}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 shrink-0 rounded-lg bg-sidebar border border-border flex flex-col items-center justify-center">
                <span className="text-[9px] uppercase text-muted-foreground leading-none">Fl</span>
                <span className="font-semibold text-sm leading-none mt-0.5">{floor.floor_number}</span>
              </div>
              <div className="text-sm font-medium">{floor.name || `Floor ${floor.floor_number}`}</div>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{floorUnits.length} units</span>
            </div>
            {floorUnits.length === 0 ? (
              <div className="ml-[60px] text-xs text-muted-foreground italic">No units on this floor</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {floorUnits.map((u) => (
                  <UnitCard key={u.id} unit={u} onClick={() => onSelect(u)} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}