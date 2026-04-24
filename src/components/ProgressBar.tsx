export function ProgressBar({
  value,
  max,
  className = "",
}: {
  value: number;
  max: number;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const color = pct >= 0.9 ? "bg-emerald-500" : pct >= 0.6 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className={`w-full bg-slate-800 rounded-full h-2 overflow-hidden ${className}`}>
      <div className={`${color} h-full rounded-full`} style={{ width: `${pct * 100}%` }} />
    </div>
  );
}
