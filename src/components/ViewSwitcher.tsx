"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { VIEWS, type ViewKey } from "@/lib/config";

export function ViewSwitcher({ current }: { current: ViewKey }) {
  const router = useRouter();
  const params = useSearchParams();

  const basis = current.startsWith("契約") ? "契約" : "発生";
  const day = current.endsWith("本日") ? "本日" : "昨日";

  const update = (newBasis: "契約" | "発生", newDay: "本日" | "昨日") => {
    const next = `${newBasis}${newDay}` as ViewKey;
    const sp = new URLSearchParams(params.toString());
    sp.set("view", next);
    router.push(`/?${sp.toString()}`);
  };

  const pillBase =
    "px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors";

  return (
    <div className="flex items-center gap-2">
      <div className="flex rounded overflow-hidden border border-line">
        {(["契約", "発生"] as const).map((b) => (
          <button
            key={b}
            onClick={() => update(b, day)}
            className={`${pillBase} ${
              basis === b
                ? "bg-ink text-bg"
                : "bg-surface text-ink-secondary hover:bg-surface-elevated"
            }`}
          >
            {b}
          </button>
        ))}
      </div>
      <div className="flex rounded overflow-hidden border border-line">
        {(["本日", "昨日"] as const).map((d) => (
          <button
            key={d}
            onClick={() => update(basis as "契約" | "発生", d)}
            className={`${pillBase} ${
              day === d
                ? "bg-accent text-bg"
                : "bg-surface text-ink-secondary hover:bg-surface-elevated"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
      <span aria-hidden className="hidden">
        {VIEWS.length}
      </span>
    </div>
  );
}
