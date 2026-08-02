export const STATUSES = ["available", "reserved", "occupied"];

export const STATUS_CONFIG = {
  available: {
    label: "Available",
    dot: "bg-emerald-500",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    solid: "bg-emerald-500",
    ring: "ring-emerald-500/40",
    hex: "#22C55E",
  },
  reserved: {
    label: "Reserved",
    dot: "bg-amber-500",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    solid: "bg-amber-500",
    ring: "ring-amber-500/40",
    hex: "#F59E0B",
  },
  occupied: {
    label: "Occupied",
    dot: "bg-rose-500",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    solid: "bg-rose-500",
    ring: "ring-rose-500/40",
    hex: "#EF4444",
  },
};

export const getStatus = (s) => STATUS_CONFIG[s] || STATUS_CONFIG.available;

export const formatPrice = (value) => {
  if (value == null) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "UZS",
    maximumFractionDigits: 0,
  }).format(value);
};