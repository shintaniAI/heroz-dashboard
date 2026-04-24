import { decodeView, yen, num, pct, numOr0, viewLabel } from "@/lib/config";
import { fetchDashboard } from "@/lib/dashboard-data";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import { Kpi } from "@/components/Kpi";
import { KgiRowCard } from "@/components/KgiRow";
import { Funnel } from "@/components/Funnel";
import { DisqualifiedCard } from "@/components/DisqualifiedCard";
import { CpaCard } from "@/components/CpaCard";
import { MediaTable } from "@/components/MediaTable";
import { DailyChart } from "@/components/DailyChart";
import { DailyTable } from "@/components/DailyTable";
import { PlanTable } from "@/components/PlanTable";

export const dynamic = "force-dynamic";
export const revalidate = 300;

function ErrorScreen({ message }: { message: string }) {
  const hasEmail = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const hasKey = !!process.env.GOOGLE_PRIVATE_KEY;
  const emailSample =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.slice(0, 20) ?? "(未設定)";

  return (
    <main className="min-h-screen bg-canvas text-ink p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="display-serif text-3xl text-ink">
          HEROZZ 経営ダッシュボード
        </h1>
        <div className="panel p-6 border border-bad/40 space-y-4">
          <div className="label text-bad">Sheets API Error</div>
          <pre className="text-sm bg-canvas border border-line rounded p-3 overflow-x-auto text-bad num">
            {message}
          </pre>
          <div className="text-sm text-ink-3 space-y-2">
            <div className="label text-ink-4">環境変数</div>
            <ul className="list-disc pl-6 text-xs space-y-1 num">
              <li>
                GOOGLE_SERVICE_ACCOUNT_EMAIL:{" "}
                {hasEmail ? `設定済 (${emailSample}...)` : "未設定"}
              </li>
              <li>GOOGLE_PRIVATE_KEY: {hasKey ? "設定済" : "未設定"}</li>
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
  const view = decodeView(sp.view);

  let data;
  try {
    data = await fetchDashboard(view);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return <ErrorScreen message={message} />;
  }

  const {
    spreadsheetId,
    asOf,
    uriage,
    jinkenhi,
    gaichuhi,
    arari,
    kokoku,
    sonotaHiyou,
    shiharaiTesuryo,
    zenshaFutan,
    eigyoRieki,
    totalMeetings,
    menuai,
    kyansuRate,
    keiyakuRate,
    keiyakuSu,
    keiyakuTanka,
    nyuukinSu,
    failures,
    cpa,
    cpm,
    organic,
    organicTotal,
    ads,
    adsTotal,
    plans,
    daily,
    daysElapsed,
    monthDays,
  } = data;

  const failuresSum = failures.reduce((s, f) => s + numOr0(f.actual.value), 0);
  const failuresLabel = `計 ${num(failuresSum)}件`;

  const contractProgress = keiyakuSu.progress.value;
  const contractAccent =
    isFinite(contractProgress) && contractProgress >= 0.9
      ? "ok"
      : isFinite(contractProgress) && contractProgress >= 0.6
      ? "warn"
      : "bad";

  const monthProgress =
    isFinite(monthDays.value) &&
    monthDays.value > 0 &&
    isFinite(daysElapsed.value)
      ? daysElapsed.value / monthDays.value
      : NaN;

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="w-full px-2 sm:px-3 py-4 space-y-4">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-line">
          <div>
            <div className="label text-ink-4 text-[10px]">
              HEROZZ · Executive Console
            </div>
            <h1 className="display-serif text-xl sm:text-2xl text-ink mt-1 tracking-tight3">
              経営ダッシュボード
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10.5px] text-ink-4 num">
              <span>{viewLabel(view)}</span>
              <span className="text-ink-muted">·</span>
              <span>As of {asOf}</span>
              <span className="text-ink-muted">·</span>
              <span>
                月次進捗 {pct(monthProgress, 0)} ({num(daysElapsed.value)}/
                {num(monthDays.value)}日)
              </span>
            </div>
          </div>
          <ViewSwitcher current={view} />
        </header>

        <section>
          <div className="label text-ink-3 mb-2 text-[10px]">Hero KGI</div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-2">
              <KgiRowCard row={uriage} spreadsheetId={spreadsheetId} hero />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Kpi
                label="契約数 進捗率"
                src={keiyakuSu.actual}
                value={num(keiyakuSu.actual.value)}
                sub="月目標"
                subSrc={keiyakuSu.target}
                subValue={num(keiyakuSu.target.value)}
                progress={contractProgress}
                progressNote="実÷月"
                accent={contractAccent}
                spreadsheetId={spreadsheetId}
              />
              <Kpi
                label="契約率 (契約÷面談)"
                src={keiyakuRate.actual}
                value={pct(keiyakuRate.actual.value, 1)}
                sub="キャンセル率"
                subSrc={kyansuRate.actual}
                subValue={pct(kyansuRate.actual.value, 0)}
                accent="neutral"
                spreadsheetId={spreadsheetId}
              />
              <Kpi
                label="契約単価"
                src={keiyakuTanka.actual}
                value={yen(keiyakuTanka.actual.value)}
                accent="accent"
                spreadsheetId={spreadsheetId}
              />
              <Kpi
                label="入金数"
                src={nyuukinSu.actual}
                value={num(nyuukinSu.actual.value)}
                sub="契約数"
                subSrc={keiyakuSu.actual}
                subValue={num(keiyakuSu.actual.value)}
                accent="neutral"
                spreadsheetId={spreadsheetId}
              />
            </div>
          </div>
        </section>

        <section>
          <Funnel
            totalMeetings={totalMeetings}
            menuai={menuai}
            kyansuRate={kyansuRate}
            keiyakuRate={keiyakuRate}
            keiyakuSu={keiyakuSu}
            nyuukinSu={nyuukinSu}
            failuresSum={failuresSum}
            failuresLabel={failuresLabel}
            spreadsheetId={spreadsheetId}
          />
        </section>

        <section>
          <div className="label text-ink-3 mb-2 text-[10px]">
            Conversion Losses & Unit Economics
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-2">
              <DisqualifiedCard
                items={failures}
                totalMeetings={totalMeetings.actual.value}
                spreadsheetId={spreadsheetId}
              />
            </div>
            <CpaCard
              cpa={cpa}
              cpm={cpm}
              kokoku={kokoku}
              keiyakuSu={keiyakuSu}
              menuai={menuai}
              spreadsheetId={spreadsheetId}
            />
          </div>
        </section>

        <section>
          <div className="label text-ink-3 mb-2 text-[10px]">
            Cost Structure & PL
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
            <KgiRowCard row={jinkenhi} spreadsheetId={spreadsheetId} />
            <KgiRowCard row={gaichuhi} spreadsheetId={spreadsheetId} />
            <KgiRowCard row={arari} spreadsheetId={spreadsheetId} />
            <KgiRowCard row={kokoku} spreadsheetId={spreadsheetId} />
            <KgiRowCard row={sonotaHiyou} spreadsheetId={spreadsheetId} />
            <KgiRowCard row={shiharaiTesuryo} spreadsheetId={spreadsheetId} />
            <KgiRowCard row={zenshaFutan} spreadsheetId={spreadsheetId} />
            <div className="col-span-2 md:col-span-3 xl:col-span-4">
              <KgiRowCard row={eigyoRieki} spreadsheetId={spreadsheetId} hero />
            </div>
          </div>
        </section>

        <section>
          <div className="label text-ink-3 mb-2 text-[10px]">
            Channel Performance
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
            <MediaTable
              title="オーガニック媒体別"
              rows={organic}
              total={organicTotal}
              spreadsheetId={spreadsheetId}
              max={30}
            />
            <MediaTable
              title="広告・アフィ媒体別"
              rows={ads}
              total={adsTotal}
              spreadsheetId={spreadsheetId}
              max={30}
            />
          </div>
        </section>

        {daily.length > 0 && (
          <section>
            <div className="label text-ink-3 mb-2 text-[10px]">Daily</div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
              <DailyTable rows={daily} spreadsheetId={spreadsheetId} />
              <DailyChart data={daily} />
            </div>
          </section>
        )}

        {plans.length > 0 && (
          <section>
            <div className="label text-ink-3 mb-2 text-[10px]">Product Mix</div>
            <PlanTable rows={plans} spreadsheetId={spreadsheetId} />
          </section>
        )}

        <footer className="pt-3 mt-3 border-t border-line space-y-1 text-[10px] text-ink-muted">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div>
              Source: 【令和8年度：HERO&apos;ZZ】経営/顧客管理 ·
              Auto-refresh 5min
            </div>
            <div>全ての数値はクリックで参照元セル・計算式を表示</div>
          </div>
          <div className="num">
            Tab: {data.tab}
          </div>
        </footer>
      </div>
    </main>
  );
}
