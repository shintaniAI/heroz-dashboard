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
    <div className="card p-5 bg-gradient-to-br from-violet-500/5 to-transparent border-violet-500/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-100 text-base">獲得コスト (CPA)</h3>
          <p className="text-xs text-slate-400 mt-0.5">広告投資対効果</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-900/50 rounded-lg p-4 border border-violet-500/30">
          <div className="text-xs text-violet-300 mb-1">契約あたり獲得コスト</div>
          <div className="text-3xl font-bold text-white tabular-nums">{yen(cpa)}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            広告費 {yen(kokokuActual)} ÷ 契約 {num(keiyakuSu)}件
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/30 rounded-lg p-3">
            <div className="text-[11px] text-slate-400">面談あたり</div>
            <div className="text-lg font-semibold text-slate-100 tabular-nums mt-0.5">
              {yen(cpm)}
            </div>
          </div>
          <div className="bg-slate-900/30 rounded-lg p-3">
            <div className="text-[11px] text-slate-400">予算消化</div>
            <div className="text-lg font-semibold text-slate-100 tabular-nums mt-0.5">
              {(budgetUse * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 text-xs text-slate-500">
          広告目標 {yen(kokokuTarget)} / 実績 {yen(kokokuActual)}
        </div>
      </div>
    </div>
  );
}
