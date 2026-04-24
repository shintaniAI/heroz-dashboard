import { yen, pct, num } from "@/lib/config";
import type { Sourced } from "@/lib/config";
import type { KgiRow, MeetingKpi } from "@/lib/dashboard-data";
import { Ref } from "./Ref";

type Props = {
  cpa: Sourced;
  cpm: Sourced;
  kokoku: KgiRow;
  keiyakuSu: MeetingKpi;
  menuai: MeetingKpi;
  spreadsheetId: string;
};

export function CpaCard({ cpa, cpm, kokoku, keiyakuSu, menuai, spreadsheetId }: Props) {
  const budgetUse =
    isFinite(kokoku.target.value) &&
    kokoku.target.value > 0 &&
    isFinite(kokoku.actual.value)
      ? kokoku.actual.value / kokoku.target.value
      : NaN;

  return (
    <div className="panel p-5">
      <div className="mb-5">
        <div className="label">Acquisition Cost</div>
        <h3 className="display-serif text-xl text-ink mt-1">獲得コスト</h3>
      </div>

      <div className="mb-5">
        <div className="label text-ink-4 mb-2">契約あたり (CPA)</div>
        <Ref
          src={cpa}
          spreadsheetId={spreadsheetId}
          display={yen(cpa.value)}
          className="num text-3xl sm:text-4xl font-semibold text-accent tracking-tight3 leading-none"
        />
        <div className="text-[11px] text-ink-4 mt-2 num">
          広告費{" "}
          <Ref
            src={kokoku.actual}
            spreadsheetId={spreadsheetId}
            display={yen(kokoku.actual.value)}
            className="text-ink-3"
          />{" "}
          ÷ 契約{" "}
          <Ref
            src={keiyakuSu.actual}
            spreadsheetId={spreadsheetId}
            display={`${num(keiyakuSu.actual.value)}件`}
            className="text-ink-3"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-line-soft">
        <div>
          <div className="label text-ink-4">面談あたり</div>
          <Ref
            src={cpm}
            spreadsheetId={spreadsheetId}
            display={yen(cpm.value)}
            className="num text-lg font-semibold text-ink mt-1.5 inline-block"
          />
        </div>
        <div>
          <div className="label text-ink-4">予算消化</div>
          <div className="num text-lg font-semibold text-ink mt-1.5">
            {pct(budgetUse, 0)}
          </div>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-line-soft text-[11px] text-ink-4 num flex justify-between">
        <span>
          広告目標{" "}
          <Ref
            src={kokoku.target}
            spreadsheetId={spreadsheetId}
            display={yen(kokoku.target.value)}
            className="text-ink-3"
          />
        </span>
        <span>
          実績{" "}
          <Ref
            src={kokoku.actual}
            spreadsheetId={spreadsheetId}
            display={yen(kokoku.actual.value)}
            className="text-ink-3"
          />
        </span>
      </div>
    </div>
  );
}
