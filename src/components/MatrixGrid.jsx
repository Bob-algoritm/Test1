import React from "react";
import { cn } from "@/lib/utils";
import { getStatus, formatPrice } from "@/lib/unitStatus";
import { useLang } from "@/lib/i18n.jsx";

function UnitCard({ unit, onClick }) {
  const { t } = useLang();
  const s = getStatus(unit.status);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30",
        s.bg,
        s.border
      )}
    >
      {/* Status color strip */}
      <div className={cn("h-1.5 w-full", s.solid)} />

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold leading-tight">{unit.unit_number}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {unit.size_sqm ? `${unit.size_sqm} m²` : t("matrix.sizeNone")}
            </div>
          </div>
          <div className={cn("shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", s.solid, "text-black")}>
            {t(`status.${unit.status}`)}
          </div>
        </div>

        <div className="mt-2.5 pt-2.5 border-t border-border/60 flex items-center justify-between">
          <span className="text-xs font-medium">{formatPrice(unit.price)}</span>
          <span className={cn("text-[10px] uppercase tracking-wide", s.text)}>{t("matrix.floorShort")} {unit.floor_number ?? "—"}</span>
        </div>
      </div>
    </button>
  );
}

export default function MatrixGrid({ floors, units, onSelect }) {
  const { t } = useLang();
  const sorted = [...floors].sort((a, b) => b.floor_number - a.floor_number);

  if (!sorted.length) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
        {t("matrix.noFloors")}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sorted.map((floor) => {
        const floorUnits = units
          .filter((u) => u.floor_id === floor.id)
          .sort((a, b) => String(a.unit_number).localeCompare(String(b.unit_number), undefined, { numeric: true }));

        const counts = { available: 0, reserved: 0, occupied: 0 };
        floorUnits.forEach((u) => { if (counts[u.status] != null) counts[u.status] += 1; });

        return (
          <div key={floor.id}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 shrink-0 rounded-lg bg-sidebar border border-border flex flex-col items-center justify-center">
                <span className="text-[9px] uppercase text-muted-foreground leading-none">{t("matrix.floorShort")}</span>
                <span className="font-semibold text-sm leading-none mt-0.5">{floor.floor_number}</span>
              </div>
              <div>
                <div className="text-sm font-medium">{floor.name || `${t("matrix.floor")} ${floor.floor_number}`}</div>
                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{counts.available}</span>
                  <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{counts.reserved}</span>
                  <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" />{counts.occupied}</span>
                  <span className="ml-1">· {floorUnits.length} {t("matrix.units")}</span>
                </div>
              </div>
              <div className="flex-1 h-px bg-border" />
            </div>
            {floorUnits.length === 0 ? (
              <div className="ml-[60px] text-xs text-muted-foreground italic">{t("matrix.noUnitsFloor")}</div>
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