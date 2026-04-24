import { pct } from "@/lib/config";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string;
  sub?: string;
  progress?: number;
  accent?: "brand" | "success" | "warning" | "danger" | "neutral";
  icon?: LucideIcon;
  hero?: boolean;
};

const accentStyles = {
  brand: {
    ring: "bg-brand-500/10 text-brand-500 ring-brand-500/30",
    gradient: "from-brand-500/10 to-transparent",
    iconBg: "bg-brand-500/10 text-brand-400",
    border: "border-brand-500/20",
  },
  success: {
    ring: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
    gradient: "from-emerald-500/10 to-transparent",
    iconBg: "bg-emerald-500/10 text-emerald-400",
    border: "border-emerald-500/20",
  },
  warning: {
    ring: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
    gradient: "from-amber-500/10 to-transparent",
    iconBg: "bg-amber-500/10 text-amber-400",
    border: "border-amber-500/20",
  },
  danger: {
    ring: "bg-rose-500/10 text-rose-400 ring-rose-500/30",
    gradient: "from-rose-500/10 to-transparent",
    iconBg: "bg-rose-500/10 text-rose-400",
    border: "border-rose-500/20",
  },
  neutral: {
    ring: "bg-slate-500/10 text-slate-400 ring-slate-500/30",
    gradient: "from-slate-500/5 to-transparent",
    iconBg: "bg-slate-500/10 text-slate-400",
    border: "border-slate-700",
  },
};

export function Kpi({
  label,
  value,
  sub,
  progress,
  accent = "brand",
  icon: Icon,
  hero = false,
}: Props) {
  const s = accentStyles[accent];

  return (
    <div
      className={`card p-5 flex flex-col justify-between ${hero ? "min-h-[140px]" : "min-h-[120px]"} bg-gradient-to-br ${s.gradient} ${s.border} relative overflow-hidden transition-transform hover:scale-[1.01]`}
    >
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium text-slate-400 tracking-wide">{label}</div>
        {Icon && (
          <div className={`p-1.5 rounded-md ${s.iconBg}`}>
            <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between mt-2">
        <div
          className={`${hero ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"} font-bold tabular-nums text-white leading-none`}
        >
          {value}
        </div>
        {progress !== undefined && (
          <div className={`text-xs px-2 py-1 rounded-full ring-1 ${s.ring} shrink-0 ml-2`}>
            {pct(progress, 0)}
          </div>
        )}
      </div>
      {sub && <div className="text-xs text-slate-400 mt-2">{sub}</div>}
    </div>
  );
}
