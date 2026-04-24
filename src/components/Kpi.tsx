import { pct } from "@/lib/config";

type Props = {
  label: string;
  value: string;
  sub?: string;
  progress?: number;
  accent?: "brand" | "success" | "warning" | "danger";
};

export function Kpi({ label, value, sub, progress, accent = "brand" }: Props) {
  const ring =
    accent === "success"
      ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30"
      : accent === "warning"
      ? "bg-amber-500/10 text-amber-400 ring-amber-500/30"
      : accent === "danger"
      ? "bg-rose-500/10 text-rose-400 ring-rose-500/30"
      : "bg-brand-500/10 text-brand-500 ring-brand-500/30";

  return (
    <div className="card p-5 flex flex-col justify-between min-h-[120px]">
      <div className="text-xs font-medium text-slate-400 tracking-wide">{label}</div>
      <div className="flex items-end justify-between mt-2">
        <div className="text-2xl sm:text-3xl font-bold tabular-nums text-white">{value}</div>
        {progress !== undefined && (
          <div className={`text-xs px-2 py-1 rounded-full ring-1 ${ring}`}>{pct(progress, 0)}</div>
        )}
      </div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}
