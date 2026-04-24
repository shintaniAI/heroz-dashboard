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

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="flex rounded-lg overflow-hidden border border-slate-700">
        {(["契約", "発生"] as const).map((b) => (
          <button
            key={b}
            onClick={() => update(b, day)}
            className={`px-4 py-2 text-sm font-medium ${
              basis === b
                ? "bg-brand-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {b}ベース
          </button>
        ))}
      </div>
      <div className="flex rounded-lg overflow-hidden border border-slate-700">
        {(["本日", "昨日"] as const).map((d) => (
          <button
            key={d}
            onClick={() => update(basis as "契約" | "発生", d)}
            className={`px-4 py-2 text-sm font-medium ${
              day === d
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
