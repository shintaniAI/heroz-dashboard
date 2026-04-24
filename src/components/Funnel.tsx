import { num, pct } from "@/lib/config";

type Stage = {
  label: string;
  value: number;
  sub?: string;
  tone: "neutral" | "bad" | "ok";
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

const toneValue: Record<Stage["tone"], string> = {
  neutral: "text-ink",
  bad: "text-bad",
  ok: "text-ok",
};

const toneBar: Record<Stage["tone"], string> = {
  neutral: "bg-ink-muted",
  bad: "bg-bad/60",
  ok: "bg-ok/60",
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
      tone: "neutral",
    },
    {
      label: "有効面談",
      value: menuaiSu,
      sub: `目標 ${num(menuaiTarget)} ・ キャンセル ${pct(kyansuRate, 0)}`,
      tone: "neutral",
    },
    {
      label: "失格",
      value: failures,
      sub: "審査落ち・ブラック等",
      tone: "bad",
    },
    {
      label: "契約",
      value: keiyakuSu,
      sub: `目標 ${num(keiyakuSuTarget)} ・ 契約率 ${pct(keiyakuRate, 1)}`,
      tone: "ok",
    },
    {
      label: "入金",
      value: nyuukinSu,
      sub: keiyakuSu > 0 ? `対契約 ${pct(nyuukinSu / keiyakuSu, 0)}` : undefined,
      tone: "ok",
    },
  ];

  const maxVal = Math.max(...stages.map((s) => s.value), 1);
  const conversion = totalMeetings > 0 ? keiyakuSu / totalMeetings : 0;

  return (
    <div className="card p-6">
      <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
        <div>
          <div className="label-caps text-ink-secondary">Funnel</div>
          <h3 className="text-lg font-semibold text-ink tracking-tight2 mt-1">
            流入から成約まで
          </h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="label-caps">総転換率</span>
          <span className="num text-2xl font-semibold text-accent tracking-tight3">
            {pct(conversion, 1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-px bg-line">
        {stages.map((stage, i) => {
          const widthPct = (stage.value / maxVal) * 100;
          return (
            <div key={stage.label} className="bg-surface p-3 sm:p-4 relative">
              <div className="flex items-center gap-1 mb-2">
                <span className="label-caps">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xs text-ink-secondary font-medium">
                  {stage.label}
                </span>
              </div>
              <div
                className={`num text-2xl sm:text-3xl font-semibold ${toneValue[stage.tone]} tracking-tight3 leading-none`}
              >
                {num(stage.value)}
              </div>
              <div className="h-1 mt-3 bg-line overflow-hidden rounded-sm">
                <div
                  className={`h-full ${toneBar[stage.tone]}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              {stage.sub && (
                <div className="text-[11px] text-ink-tertiary mt-2 leading-tight">
                  {stage.sub}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
