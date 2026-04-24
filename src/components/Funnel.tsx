import { num, pct, numOr0 } from "@/lib/config";
import type { Sourced } from "@/lib/config";
import type { MeetingKpi } from "@/lib/dashboard-data";
import { Ref } from "./Ref";

type Props = {
  totalMeetings: MeetingKpi;
  menuai: MeetingKpi;
  kyansuRate: MeetingKpi;
  keiyakuRate: MeetingKpi;
  keiyakuSu: MeetingKpi;
  nyuukinSu: MeetingKpi;
  failuresSum: number;
  failuresLabel: string;
  spreadsheetId: string;
};

type Stage = {
  label: string;
  value: number;
  src: Sourced;
  footnote?: string;
  sub?: string;
  tone?: "default" | "loss" | "win";
};

export function Funnel({
  totalMeetings,
  menuai,
  kyansuRate,
  keiyakuRate,
  keiyakuSu,
  nyuukinSu,
  failuresSum,
  failuresLabel,
  spreadsheetId,
}: Props) {
  const maxVal = Math.max(
    numOr0(totalMeetings.actual.value),
    numOr0(menuai.actual.value),
    numOr0(keiyakuSu.actual.value),
    numOr0(nyuukinSu.actual.value),
    failuresSum,
    1
  );

  const stages: Stage[] = [
    {
      label: "面談実施",
      value: totalMeetings.actual.value,
      src: totalMeetings.actual,
      footnote: `目標 ${num(totalMeetings.target.value)}`,
      tone: "default",
    },
    {
      label: "有効面談",
      value: menuai.actual.value,
      src: menuai.actual,
      footnote: `キャンセル ${pct(kyansuRate.actual.value, 0)}`,
      sub: `目標 ${num(menuai.target.value)}`,
      tone: "default",
    },
    {
      label: "失格",
      value: failuresSum,
      src: menuai.actual,
      footnote: failuresLabel,
      tone: "loss",
    },
    {
      label: "契約",
      value: keiyakuSu.actual.value,
      src: keiyakuSu.actual,
      footnote: `契約率 ${pct(keiyakuRate.actual.value, 1)}`,
      sub: `目標 ${num(keiyakuSu.target.value)}`,
      tone: "win",
    },
    {
      label: "入金",
      value: nyuukinSu.actual.value,
      src: nyuukinSu.actual,
      footnote:
        isFinite(keiyakuSu.actual.value) &&
        keiyakuSu.actual.value > 0 &&
        isFinite(nyuukinSu.actual.value)
          ? `対契約 ${pct(nyuukinSu.actual.value / keiyakuSu.actual.value, 0)}`
          : undefined,
      tone: "win",
    },
  ];

  const conversion =
    isFinite(totalMeetings.actual.value) &&
    totalMeetings.actual.value > 0 &&
    isFinite(keiyakuSu.actual.value)
      ? keiyakuSu.actual.value / totalMeetings.actual.value
      : NaN;

  const toneBg = {
    default: "bg-ink-2",
    loss: "bg-bad",
    win: "bg-accent",
  };

  return (
    <div className="panel p-6">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <div className="label">Funnel</div>
          <h3 className="display-serif text-2xl text-ink mt-1">
            流入から成約まで
          </h3>
        </div>
        <div className="text-right">
          <div className="label">総転換率</div>
          <div className="num text-3xl font-semibold text-accent tracking-tight3 leading-none mt-1">
            {pct(conversion, 1)}
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {stages.map((stage, i) => {
          const widthPct = Math.max(6, (numOr0(stage.value) / maxVal) * 100);
          return (
            <div key={stage.label} className="group">
              <div className="flex items-baseline justify-between mb-1">
                <div className="flex items-baseline gap-3">
                  <span className="num text-[10px] text-ink-muted font-semibold w-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-ink-2">
                    {stage.label}
                  </span>
                  {stage.sub && (
                    <span className="text-[11px] text-ink-4 num">
                      {stage.sub}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-3">
                  {stage.footnote && (
                    <span className="text-[11px] text-ink-4 num">
                      {stage.footnote}
                    </span>
                  )}
                  <Ref
                    src={stage.src}
                    spreadsheetId={spreadsheetId}
                    display={num(stage.value)}
                    className="num text-xl font-semibold text-ink tracking-tight3"
                  />
                </div>
              </div>
              <div className="h-2 bg-line-soft rounded-sm overflow-hidden">
                <div
                  className={`h-full ${toneBg[stage.tone ?? "default"]} rounded-sm transition-all`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
