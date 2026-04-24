"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  VIEWS,
  encodeView,
  type ViewKey,
  type MonthKey,
  type KindKey,
  type DayKey,
} from "@/lib/config";

type Props = { current: ViewKey };

export function ViewSwitcher({ current }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const go = (v: ViewKey) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("view", encodeView(v));
    router.push(`/?${sp.toString()}`);
  };

  const months: MonthKey[] = Array.from(
    new Set(VIEWS.map((v) => v.month))
  ) as MonthKey[];

  const findView = (
    month: MonthKey,
    kind: KindKey,
    day: DayKey
  ): ViewKey | undefined =>
    VIEWS.find(
      (v) => v.month === month && v.kind === kind && v.day === day
    ) ??
    VIEWS.find((v) => v.month === month && v.kind === kind) ??
    VIEWS.find((v) => v.month === month);

  const onMonthChange = (m: string) => {
    const next = findView(m as MonthKey, current.kind, current.day);
    if (next) go(next);
  };

  const onKindChange = (k: KindKey) => {
    const next = findView(current.month, k, current.day);
    if (next) go(next);
  };

  const onDayChange = (d: DayKey) => {
    const next = findView(current.month, current.kind, d);
    if (next) go(next);
  };

  const kindsForMonth = (m: MonthKey): KindKey[] => {
    const set = new Set<KindKey>();
    VIEWS.filter((v) => v.month === m).forEach((v) => set.add(v.kind));
    return Array.from(set);
  };

  const daysForMonthKind = (m: MonthKey, k: KindKey): DayKey[] => {
    return VIEWS.filter((v) => v.month === m && v.kind === k).map(
      (v) => v.day
    );
  };

  const pillBase =
    "px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors num";

  const availableKinds = kindsForMonth(current.month);
  const availableDays = daysForMonthKind(current.month, current.kind);
  const hasDays = availableDays.some((d) => d !== null);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={current.month}
        onChange={(e) => onMonthChange(e.target.value)}
        className="num text-xs font-semibold px-3 py-1.5 bg-paper border border-line rounded-md text-ink hover:border-line-strong focus:outline-none focus:border-accent transition-colors"
      >
        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <div className="flex rounded-md overflow-hidden border border-line bg-paper">
        {availableKinds.map((k) => (
          <button
            key={k}
            onClick={() => onKindChange(k)}
            className={`${pillBase} ${
              current.kind === k
                ? "bg-ink text-paper"
                : "text-ink-3 hover:bg-canvas"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {hasDays && (
        <div className="flex rounded-md overflow-hidden border border-line bg-paper">
          {availableDays
            .filter((d): d is "本日" | "昨日" => d !== null)
            .map((d) => (
              <button
                key={d}
                onClick={() => onDayChange(d)}
                className={`${pillBase} ${
                  current.day === d
                    ? "bg-accent text-paper"
                    : "text-ink-3 hover:bg-canvas"
                }`}
              >
                {d}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
