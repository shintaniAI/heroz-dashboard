import { yen, pct, num } from "@/lib/config";
import type { Sourced } from "@/lib/config";
import type { KgiRow, MeetingKpi } from "@/lib/dashboard-data";
import { Ref } from "./Ref";

type Props = {
  cpa: Sourced;
  cpm: Sourced;
  cpo: Sourced;
  roi: Sourced;
  kokoku: KgiRow;
  keiyakuSu: MeetingKpi;
  menuai: MeetingKpi;
  spreadsheetId: string;
};

export function CpaCard({ cpa, cpm, cpo, roi, kokoku, keiyakuSu, menuai, spreadsheetId }: Props) {
  const budgetUse =
    isFinite(kokoku.target.value) &&
    kokoku.target.value > 0 &&
    isFinite(kokoku.actual.value)
      ? kokoku.actual.value / kokoku.target.value
      : NaN;

  return (
    <div className="panel p-2">
      <h3 className="display-serif text-sm text-ink leading-tight mb-1.5">獲得コスト</h3>

      <div className="mb-1.5">
        <div className="label text-ink-4 text-[9.5px] mb-0.5">契約あたり CPA</div>
        <Ref
          src={cpa}
          spreadsheetId={spreadsheetId}
          display={yen(cpa.value)}
          className="num text-xl font-semibold text-accent tracking-tight3 leading-none"
        />
        <div className="text-[9.5px] text-ink-4 mt-1 num">
          広告{" "}
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

      <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-line-soft">
        <div>
          <div className="label text-ink-4 text-[9.5px]">面談CPA</div>
          <Ref
            src={cpm}
            spreadsheetId={spreadsheetId}
            display={yen(cpm.value)}
            className="num text-sm font-semibold text-ink inline-block leading-none"
          />
        </div>
        <div>
          <div className="label text-ink-4 text-[9.5px]">契約CPO</div>
          <Ref
            src={cpo}
            spreadsheetId={spreadsheetId}
            display={yen(cpo.value)}
            className="num text-sm font-semibold text-ink inline-block leading-none"
          />
        </div>
        <div>
          <div className="label text-ink-4 text-[9.5px]">ROI</div>
          <Ref
            src={roi}
            spreadsheetId={spreadsheetId}
            display={pct(roi.value, 0)}
            className={`num text-sm font-semibold inline-block leading-none ${
              isFinite(roi.value) && roi.value >= 0 ? "text-ok" : "text-bad"
            }`}
          />
        </div>
        <div>
          <div className="label text-ink-4 text-[9.5px]">予算消化</div>
          <div className="num text-sm font-semibold text-ink leading-none">
            {pct(budgetUse, 0)}
          </div>
        </div>
      </div>

      <div className="pt-1.5 mt-1.5 border-t border-line-soft text-[9.5px] text-ink-4 num flex justify-between">
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
