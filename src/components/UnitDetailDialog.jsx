import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { getStatus, formatPrice } from "@/lib/unitStatus";
import { cn } from "@/lib/utils";
import { Bed, Bath, Maximize, ImageOff } from "lucide-react";
import { useLang } from "@/lib/i18n.jsx";

function MediaBlock({ url, alt, label }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">{label}</div>
      <div className="aspect-video rounded-xl overflow-hidden border border-border bg-sidebar/40">
        {url ? (
          <Image src={url} alt={alt} className="w-full h-full" fittingType="fit" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <ImageOff className="w-6 h-6 mb-1" />
            <span className="text-xs">No {label.toLowerCase()} uploaded</span>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export default function UnitDetailDialog({ unit, open, onOpenChange }) {
  const { t } = useLang();

  if (!unit) return null;

  const s = getStatus(unit.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-3">
            <span>{t("matrix.unit")} {unit.unit_number}</span>
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", s.bg, s.text)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
              {t(`status.${unit.status}`)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 px-6 pb-2">
          <div className="space-y-4">
            <MediaBlock url={unit.photo_url} alt={`Unit ${unit.unit_number}`} label="Photo" />
            <MediaBlock url={unit.floor_plan_url} alt="Floor plan" label="Floor Plan" />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border p-3 text-center">
                <Maximize className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                <div className="text-sm font-semibold">{unit.size_sqm ? `${unit.size_sqm}` : "—"}</div>
                <div className="text-[10px] text-muted-foreground uppercase">m²</div>
              </div>
              <div className="rounded-xl border border-border p-3 text-center">
                <Bed className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                <div className="text-sm font-semibold">{unit.bedrooms ?? "—"}</div>
                <div className="text-[10px] text-muted-foreground uppercase">{t("matrix.beds")}</div>
              </div>
              <div className="rounded-xl border border-border p-3 text-center">
                <Bath className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                <div className="text-sm font-semibold">{unit.bathrooms ?? "—"}</div>
                <div className="text-[10px] text-muted-foreground uppercase">{t("matrix.baths")}</div>
              </div>
            </div>

            <div>
              <div className="text-3xl font-bold tracking-tight">{formatPrice(unit.price)}</div>
              <div className="text-xs text-muted-foreground mt-1">{t("matrix.price")}</div>
            </div>

            <div>
              <DetailRow label={t("matrix.floor")} value={unit.floor_number ?? "—"} />
              <DetailRow label={t("matrix.size")} value={unit.size_sqm ? `${unit.size_sqm} m²` : "—"} />
              <DetailRow label={t("matrix.beds")} value={unit.bedrooms ?? "—"} />
              <DetailRow label={t("matrix.baths")} value={unit.bathrooms ?? "—"} />
            </div>

            {unit.description && (
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{t("matrix.status")}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{unit.description}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}