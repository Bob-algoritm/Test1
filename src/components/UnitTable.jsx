import React from "react";
import { cn } from "@/lib/utils";
import { getStatus, formatPrice, STATUSES } from "@/lib/unitStatus";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n.jsx";

export default function UnitTable({ units, statusFilter, onStatusFilter, onSelect }) {
  const { t } = useLang();
  const filtered = statusFilter === "all" ? units : units.filter((u) => u.status === statusFilter);
  const sorted = [...filtered].sort(
    (a, b) => (a.floor_number || 0) - (b.floor_number || 0) || String(a.unit_number).localeCompare(String(b.unit_number), undefined, { numeric: true })
  );

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-sidebar/40 px-4 py-3">
        <span className="text-sm font-medium mr-2">{t("matrix.statusFilter")}</span>
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusFilter("all")}
        >
          {t("matrix.all")}
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
              {t(`status.${s}`)}
            </Button>
          );
        })}
        <span className="ml-auto text-xs text-muted-foreground">{sorted.length} {t("matrix.units")}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-sidebar/30 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-3">{t("matrix.unit")}</th>
              <th className="text-left font-medium px-4 py-3">{t("matrix.floor")}</th>
              <th className="text-left font-medium px-4 py-3">{t("matrix.size")}</th>
              <th className="text-left font-medium px-4 py-3">{t("matrix.rooms")}</th>
              <th className="text-right font-medium px-4 py-3">{t("matrix.price")}</th>
              <th className="text-left font-medium px-4 py-3">{t("matrix.status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  {t("matrix.noUnitsFilter")}
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
                    <td className="px-4 py-3 font-medium">{u.unit_number}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.floor_number ?? "—"}</td>
                    <td className="px-4 py-3">{u.size_sqm ? `${u.size_sqm} m²` : "—"}</td>
                    <td className="px-4 py-3">{u.rooms ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(u.price)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", s.bg, s.text)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
                        {t(`status.${u.status}`)}
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