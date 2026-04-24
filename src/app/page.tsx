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
    <main className="min-h-screen bg-bg text-ink p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold tracking-tight2">HEROZZ Executive Console</h1>
        <div className="card p-6 border-bad/40 space-y-4">
          <div className="label-caps text-bad">Sheets API Error</div>
          <pre className="text-sm bg-bg border border-line rounded p-3 overflow-x-auto text-bad num">
            {message}
          </pre>
          <div className="text-sm text-ink-secondary space-y-2">
            <div className="label-caps text-ink-tertiary">環境変数</div>
            <ul className="list-disc pl-6 text-xs space-y-1 num">
              <li>GOOGLE_SERVICE_ACCOUNT_EMAIL: {hasEmail ? `設定済 (${emailSample}...)` : "未設定"}</li>
              <li>GOOGLE_PRIVATE_KEY: {hasKey ? "設定済" : "未設定"}</li>
              <li>view: {view}</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

function toneFromProgress(p: number, bad = 0.6, ok = 0.9): "bad" | "warn" | "ok" {
  if (p >= ok) return "ok";
  if (p >= bad) return "warn";
  return "bad";
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

  const uriageAccent = toneFromProgress(kgi.uriageProgress);
  const contractProgress =
    meeting.keiyakuSuTarget > 0 ? meeting.keiyakuSu / meeting.keiyakuSuTarget : 0;
  const contractAccent = toneFromProgress(contractProgress);
  const rateAccent =
    meeting.keiyakuRate >= 0.3 ? "ok" : meeting.keiyakuRate >= 0.2 ? "warn" : "bad";
  const eigyoAccent = kgi.eigyoRiekiActual >= 0 ? "ok" : "bad";

  return (
    <main className="min-h-screen bg-bg text-ink">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-6 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-line">
          <div>
            <div className="label-caps text-ink-tertiary">HEROZZ / Executive Console</div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight2 text-ink mt-1">
              経営ダッシュボード
            </h1>
            <div className="flex items-center gap-3 mt-2 text-xs text-ink-tertiary num">
              <span>{data.view}</span>
              <span className="text-ink-muted">·</span>
              <span>As of {data.asOf}</span>
              <span className="text-ink-muted">·</span>
              <span>月次進捗 {pct(kgi.monthlyProgress, 0)}</span>
            </div>
          </div>
          <ViewSwitcher current={view} />
        </header>

        <section>
          <div className="label-caps text-ink-secondary mb-3">Headline KPIs</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Kpi
              label="売上実績"
              value={yen(kgi.uriageActual)}
              sub={`目標 ${yen(kgi.uriageTarget)} / 差分 ${yen(kgi.uriageDiff)}`}
              progress={kgi.uriageProgress}
              accent={uriageAccent}
              hero
            />
            <Kpi
              label="契約数"
              value={num(meeting.keiyakuSu)}
              sub={`目標 ${num(meeting.keiyakuSuTarget)} / 面談 ${num(meeting.menuaiSu)}`}
              progress={contractProgress}
              accent={contractAccent}
              hero
            />
            <Kpi
              label="契約単価"
              value={yen(meeting.keiyakuTanka)}
              sub={`入金 ${num(meeting.nyuukinSu)}件`}
              accent="accent"
              hero
            />
            <Kpi
              label="契約率"
              value={pct(meeting.keiyakuRate, 1)}
              sub={`キャンセル率 ${pct(meeting.kyansuRate, 0)}`}
              accent={rateAccent}
              hero
            />
          </div>
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

        <section>
          <div className="label-caps text-ink-secondary mb-3">Conversion Losses & Unit Economics</div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
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
          </div>
        </section>

        <section>
          <div className="label-caps text-ink-secondary mb-3">Cost Structure</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Kpi
              label="人件費"
              value={yen(kgi.jinkenhiActual)}
              sub={`目標 ${yen(kgi.jinkenhiTarget)}`}
              accent="neutral"
            />
            <Kpi
              label="外注費"
              value={yen(kgi.gaichuhiActual)}
              sub={`目標 ${yen(kgi.gaichuhiTarget)}`}
              accent="neutral"
            />
            <Kpi
              label="広告宣伝費"
              value={yen(kgi.kokokuActual)}
              sub={`目標 ${yen(kgi.kokokuTarget)}`}
              accent="neutral"
            />
            <Kpi
              label="営業利益"
              value={yen(kgi.eigyoRiekiActual)}
              sub={`目標 ${yen(kgi.eigyoRiekiTarget)}`}
              accent={eigyoAccent}
            />
          </div>
        </section>

        <section>
          <div className="label-caps text-ink-secondary mb-3">Channel Performance</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <MediaTable title="オーガニック媒体別" rows={organic} />
            <MediaTable title="広告・アフィ媒体別（上位15）" rows={ads} max={15} />
          </div>
        </section>

        <section>
          <DailyChart data={daily} />
        </section>

        <section>
          <div className="label-caps text-ink-secondary mb-3">Team & Product Mix</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <SalesTable rows={salespeople} />
            <PlanTable rows={plans} />
          </div>
        </section>

        <footer className="pt-5 mt-4 border-t border-line space-y-2 text-[11px] text-ink-muted">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div>Source: 【令和8年度：HERO&apos;ZZ】経営/顧客管理 (チームボード) ・ Auto-refresh 5min</div>
            <div>Design v1.0 per DESIGN.md</div>
          </div>
          <div className="num">
            Manual input: 経営管理シートD列 (目標) / ★目標管理C9:C15 (コスト目標) / チャネル別流入管理E72 (広告費実績)
          </div>
        </footer>
      </div>
    </main>
  );
}
