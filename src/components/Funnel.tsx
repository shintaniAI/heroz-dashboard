import { num, pct } from "@/lib/config";

type Stage = {
  label: string;
  value: number;
  sub?: string;
  tone: "inflow" | "meeting" | "fail" | "contract" | "payment";
};

type Props = {
  totalMeetings: number;
  totalMeetingsTarget: number;
  menuaiSu: number;
  menuaiTarget: number;
  failures: number;
  keiyakuSu: number;
  keiyakuSuTarget: number;
  keiyakuRate: number;
  kyansuRate: number;
  nyuukinSu: number;
};

const toneClasses: Record<Stage["tone"], string> = {
  inflow: "from-sky-500/20 to-sky-500/5 border-sky-500/40 text-sky-200",
  meeting: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/40 text-indigo-200",
  fail: "from-rose-500/20 to-rose-500/5 border-rose-500/40 text-rose-200",
  contract: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/40 text-emerald-200",
  payment: "from-amber-500/20 to-amber-500/5 border-amber-500/40 text-amber-200",
};

export function Funnel({
  totalMeetings,
  totalMeetingsTarget,
  menuaiSu,
  menuaiTarget,
  failures,
  keiyakuSu,
  keiyakuSuTarget,
  keiyakuRate,
  kyansuRate,
  nyuukinSu,
}: Props) {
  const stages: Stage[] = [
    {
      label: "面談実施",
      value: totalMeetings,
      sub: `目標 ${num(totalMeetingsTarget)}`,
      tone: "inflow",
    },
    {
      label: "有効面談",
      value: menuaiSu,
      sub: `目標 ${num(menuaiTarget)} / キャンセル率 ${pct(kyansuRate, 0)}`,
      tone: "meeting",
    },
    {
      label: "失格",
      value: failures,
      sub: `審査落ち・ブラック等`,
      tone: "fail",
    },
    {
      label: "契約",
      value: keiyakuSu,
      sub: `目標 ${num(keiyakuSuTarget)} / 契約率 ${pct(keiyakuRate, 1)}`,
      tone: "contract",
    },
    {
      label: "入金",
      value: nyuukinSu,
      sub: keiyakuSu > 0 ? `対契約 ${pct(nyuukinSu / keiyakuSu, 0)}` : undefined,
      tone: "payment",
    },
  ];

  const maxVal = Math.max(...stages.map((s) => s.value), 1);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-slate-100 text-base">マーケティングファネル</h3>
          <p className="text-xs text-slate-400 mt-0.5">流入から成約まで一気通貫</p>
        </div>
        <div className="text-xs text-slate-500">
          転換率 {totalMeetings > 0 ? pct(keiyakuSu / totalMeetings, 1) : "-"}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {stages.map((stage, i) => {
          const widthPct = (stage.value / maxVal) * 100;
          return (
            <div key={stage.label} className="relative">
              <div className="flex items-center justify-center text-xs text-slate-400 mb-1.5">
                {i > 0 && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 text-slate-600 hidden sm:inline">
                    ›
                  </span>
                )}
                {stage.label}
              </div>
              <div
                className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${toneClasses[stage.tone]} border px-2 py-4 sm:px-3 sm:py-6 min-h-[90px] flex flex-col justify-center`}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-white/5 transition-all"
                  style={{ width: `${widthPct}%` }}
                />
                <div className="relative">
                  <div className="text-xl sm:text-2xl font-bold tabular-nums text-white text-center">
                    {num(stage.value)}
                  </div>
                  {stage.sub && (
                    <div className="text-[10px] sm:text-xs text-center mt-1 opacity-80 leading-tight">
                      {stage.sub}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
