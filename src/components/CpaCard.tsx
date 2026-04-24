import { yen, num } from "@/lib/config";

type Props = {
  kokokuActual: number;
  kokokuTarget: number;
  keiyakuSu: number;
  menuaiSu: number;
};

export function CpaCard({ kokokuActual, kokokuTarget, keiyakuSu, menuaiSu }: Props) {
  const cpa = keiyakuSu > 0 ? kokokuActual / keiyakuSu : 0;
  const cpm = menuaiSu > 0 ? kokokuActual / menuaiSu : 0;
  const budgetUse = kokokuTarget > 0 ? kokokuActual / kokokuTarget : 0;

  return (
    <div className="card p-5">
      <div className="mb-4">
        <div className="label-caps text-ink-secondary">Acquisition Cost</div>
        <h3 className="text-base font-semibold text-ink mt-1">獲得コスト</h3>
      </div>

      <div className="mb-5">
        <div className="label-caps text-ink-tertiary mb-2">契約あたり (CPA)</div>
        <div className="num text-4xl font-semibold text-accent tracking-tight3 leading-none">
          {yen(cpa)}
        </div>
        <div className="text-[11px] text-ink-tertiary mt-2 num">
          広告費 {yen(kokokuActual)} ÷ 契約 {num(keiyakuSu)}件
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-line">
        <div className="bg-surface pt-3">
          <div className="label-caps text-ink-tertiary">面談あたり</div>
          <div className="num text-lg font-semibold text-ink mt-1.5">{yen(cpm)}</div>
        </div>
        <div className="bg-surface pt-3 pl-3">
          <div className="label-caps text-ink-tertiary">予算消化</div>
          <div className="num text-lg font-semibold text-ink mt-1.5">
            {(budgetUse * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-line text-[11px] text-ink-tertiary num">
        広告目標 {yen(kokokuTarget)} / 実績 {yen(kokokuActual)}
      </div>
    </div>
  );
}
