import React from "react";
import { cn } from "@/lib/utils";
import { getStatus, formatPrice } from "@/lib/unitStatus";
import { STATUSES } from "@/lib/unitStatus";
import { Button } from "@/components/ui/button";

export default function UnitTable({ units, statusFilter, onStatusFilter, onSelect }) {
  const filtered = statusFilter === "all" ? units : units.filter((u) => u.status === statusFilter);
  const sorted = [...filtered].sort(
    (a, b) => (a.floor_number || 0) - (b.floor_number || 0) || String(a.unit_number).localeCompare(String(b.unit_number), undefined, { numeric: true })
  );

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-sidebar/40 px-4 py-3">
        <span className="text-sm font-medium mr-2">Status filter</span>
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusFilter("all")}
        >
          All
        </Button>
        {STATUSES.map((s) => {
          const cfg = getStatus(s);
          return (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusFilter(s)}
              className={statusFilter === s ? "" : "gap-2"}
            >
              {statusFilter !== s && <span className={cn("w-2 h-2 rounded-full", cfg.dot)} />}
              {cfg.label}
            </Button>
          );
        })}
        <span className="ml-auto text-xs text-muted-foreground">{sorted.length} units</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-sidebar/30 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-3">Unit</th>
              <th className="text-left font-medium px-4 py-3">Floor</th>
              <th className="text-left font-medium px-4 py-3">Size</th>
              <th className="text-left font-medium px-4 py-3">Beds</th>
              <th className="text-left font-medium px-4 py-3">Baths</th>
              <th className="text-right font-medium px-4 py-3">Price</th>
              <th className="text-left font-medium px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No units match the current filter.
                </td>
              </tr>
            ) : (
              sorted.map((u) => {
                const s = getStatus(u.status);
                return (
                  <tr
                    key={u.id}
                    onClick={() => onSelect(u)}
                    className="cursor-pointer hover:bg-sidebar/40 transition"
                  >
                    <td className="px-4 py-3 font-medium">Unit {u.unit_number}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.floor_number ?? "—"}</td>
                    <td className="px-4 py-3">{u.size_sqm ? `${u.size_sqm} m²` : "—"}</td>
                    <td className="px-4 py-3">{u.bedrooms ?? "—"}</td>
                    <td className="px-4 py-3">{u.bathrooms ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(u.price)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", s.bg, s.text)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}