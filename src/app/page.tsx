import { VIEWS, type ViewKey, yen, num, pct } from "@/lib/config";
import { fetchDashboard } from "@/lib/dashboard-data";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import { Kpi } from "@/components/Kpi";
import { Funnel } from "@/components/Funnel";
import { DisqualifiedCard } from "@/components/DisqualifiedCard";
import { CpaCard } from "@/components/CpaCard";
import { MediaTable } from "@/components/MediaTable";
import { DailyChart } from "@/components/DailyChart";
import { SalesTable } from "@/components/SalesTable";
import { PlanTable } from "@/components/PlanTable";
import {
  TrendingUp,
  Target,
  CircleDollarSign,
  Percent,
  Users,
  Briefcase,
  Megaphone,
  Wallet,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 300;

function isValidView(v: string | undefined): v is ViewKey {
  return !!v && (VIEWS as readonly string[]).includes(v);
}

function ErrorScreen({ view, message }: { view: ViewKey; message: string }) {
  const hasEmail = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const hasKey = !!process.env.GOOGLE_PRIVATE_KEY;
  const emailSample = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.slice(0, 20) ?? "(未設定)";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">HEROZZ 経営ダッシュボード</h1>
        <div className="card p-6 border-rose-700 space-y-4">
          <h2 className="text-lg font-semibold text-rose-300">Sheets API 接続エラー</h2>
          <pre className="text-sm bg-slate-900 p-3 rounded overflow-x-auto text-rose-200">{message}</pre>
          <div className="text-sm text-slate-300 space-y-2">
            <div>環境変数状態:</div>
            <ul className="list-disc pl-6 text-xs space-y-1">
              <li>GOOGLE_SERVICE_ACCOUNT_EMAIL: {hasEmail ? `設定済 (${emailSample}...)` : "未設定"}</li>
              <li>GOOGLE_PRIVATE_KEY: {hasKey ? "設定済" : "未設定"}</li>
              <li>現在のビュー: {view}</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const sp = await searchParams;
  const view: ViewKey = isValidView(sp.view) ? sp.view : "契約本日";

  let data;
  try {
    data = await fetchDashboard(view);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return <ErrorScreen view={view} message={message} />;
  }

  const { kgi, meeting, failures, organic, ads, daily, salespeople, plans } = data;

  const uriageAccent =
    kgi.uriageProgress >= 0.9 ? "success" : kgi.uriageProgress >= 0.6 ? "warning" : "danger";
  const contractProgress =
    meeting.keiyakuSuTarget > 0 ? meeting.keiyakuSu / meeting.keiyakuSuTarget : 0;
  const contractAccent =
    contractProgress >= 0.9 ? "success" : contractProgress >= 0.6 ? "warning" : "danger";
  const rateAccent =
    meeting.keiyakuRate >= 0.3 ? "success" : meeting.keiyakuRate >= 0.2 ? "warning" : "danger";
  const eigyoAccent = kgi.eigyoRiekiActual >= 0 ? "success" : "danger";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              HEROZZ 経営ダッシュボード
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {data.view} ・ 基準日: {data.asOf}
            </p>
          </div>
          <ViewSwitcher current={view} />
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi
            label="売上実績"
            value={yen(kgi.uriageActual)}
            sub={`目標 ${yen(kgi.uriageTarget)} / 差分 ${yen(kgi.uriageDiff)}`}
            progress={kgi.uriageProgress}
            accent={uriageAccent}
            icon={TrendingUp}
            hero
          />
          <Kpi
            label="契約数"
            value={num(meeting.keiyakuSu)}
            sub={`目標 ${num(meeting.keiyakuSuTarget)} / 面談 ${num(meeting.menuaiSu)}`}
            progress={contractProgress}
            accent={contractAccent}
            icon={Target}
            hero
          />
          <Kpi
            label="契約単価"
            value={yen(meeting.keiyakuTanka)}
            sub={`入金数 ${num(meeting.nyuukinSu)}件`}
            accent="brand"
            icon={CircleDollarSign}
            hero
          />
          <Kpi
            label="契約率"
            value={pct(meeting.keiyakuRate, 1)}
            sub={`キャンセル率 ${pct(meeting.kyansuRate, 0)}`}
            accent={rateAccent}
            icon={Percent}
            hero
          />
        </section>

        <section>
          <Funnel
            totalMeetings={meeting.totalMeetingsActual}
            totalMeetingsTarget={meeting.totalMeetingsTarget}
            menuaiSu={meeting.menuaiSu}
            menuaiTarget={meeting.menuaiTarget}
            failures={failures.total}
            keiyakuSu={meeting.keiyakuSu}
            keiyakuSuTarget={meeting.keiyakuSuTarget}
            keiyakuRate={meeting.keiyakuRate}
            kyansuRate={meeting.kyansuRate}
            nyuukinSu={meeting.nyuukinSu}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <DisqualifiedCard
              jishaShinpan={failures.jishaShinpan}
              black={failures.black}
              taiouKonnan={failures.taiouKonnan}
              miseinen={failures.miseinen}
              total={failures.total}
              totalMeetings={meeting.totalMeetingsActual}
            />
          </div>
          <CpaCard
            kokokuActual={kgi.kokokuActual}
            kokokuTarget={kgi.kokokuTarget}
            keiyakuSu={meeting.keiyakuSu}
            menuaiSu={meeting.menuaiSu}
          />
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi
            label="人件費"
            value={yen(kgi.jinkenhiActual)}
            sub={`目標 ${yen(kgi.jinkenhiTarget)}`}
            accent="neutral"
            icon={Users}
          />
          <Kpi
            label="外注費"
            value={yen(kgi.gaichuhiActual)}
            sub={`目標 ${yen(kgi.gaichuhiTarget)}`}
            accent="neutral"
            icon={Briefcase}
          />
          <Kpi
            label="広告宣伝費"
            value={yen(kgi.kokokuActual)}
            sub={`目標 ${yen(kgi.kokokuTarget)}`}
            accent="neutral"
            icon={Megaphone}
          />
          <Kpi
            label="営業利益"
            value={yen(kgi.eigyoRiekiActual)}
            sub={`目標 ${yen(kgi.eigyoRiekiTarget)}`}
            accent={eigyoAccent}
            icon={Wallet}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MediaTable title="オーガニック媒体別" rows={organic} />
          <MediaTable title="広告・アフィ媒体別（上位15）" rows={ads} max={15} />
        </section>

        <section>
          <DailyChart data={daily} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SalesTable rows={salespeople} />
          <PlanTable rows={plans} />
        </section>

        <footer className="text-xs text-slate-500 pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between gap-2">
          <div>Data source: 【令和8年度：HERO&apos;ZZ】経営/顧客管理(チームボード)</div>
          <div>Auto-refresh 5min ・ 手動入力: 経営管理シートD列(目標) / ★目標管理C9:C15(コスト目標) / チャネル別流入管理E72(広告費実績)</div>
        </footer>
      </div>
    </main>
  );
}
