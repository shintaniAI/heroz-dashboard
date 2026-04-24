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
  const color = pct >= 0.9 ? "bg-ok" : pct >= 0.6 ? "bg-warn" : "bg-bad";
  return (
    <div className={`w-full bg-line-soft h-1.5 overflow-hidden rounded-full ${className}`}>
      <div className={`${color} h-full rounded-full`} style={{ width: `${pct * 100}%` }} />
    </div>
  );
}
