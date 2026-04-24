import { getRangeWithFormulas, getTabGids } from "./sheets";
import {
  SHEETS,
  tabName,
  toNum,
  toStr,
  MISSING,
  type ViewKey,
  type Sourced,
  classifyCell,
  derived,
  cellRef,
} from "./config";

export type KgiRow = {
  label: string;
  target: Sourced;
  genjiten: Sourced;
  actual: Sourced;
  diff: Sourced;
  progress: Sourced;
  monthProgress: Sourced;
};

export type MeetingKpi = {
  label: string;
  target: Sourced;
  genjiten: Sourced;
  actual: Sourced;
  progress: Sourced;
  monthProgress: Sourced;
};

export type MediaRow = {
  name: string;
  target: Sourced;
  genjiten: Sourced;
  actual: Sourced;
  progress: Sourced;
  monthProgress: Sourced;
};

export type FailureRow = {
  label: string;
  actual: Sourced;
};

export type DailyRow = {
  date: string;
  dow: string;
  target: Sourced;
  reservation: Sourced;
  actualRes: Sourced;
};

export type PlanRow = {
  name: string;
  tanka: Sourced;
  ninzu: Sourced;
  uriage: Sourced;
};

export type ChannelForecastRow = {
  name: string;
  yoyaku: Sourced;
  cancelRate: Sourced;
  cancelSu: Sourced;
  menuaiSu: Sourced;
  keiyakuRate: Sourced;
  keiyakuSu: Sourced;
  kokokuHi: Sourced;
  cpf: Sourced;
  yoyakuCpa: Sourced;
  menuaiCpa: Sourced;
  cpo: Sourced;
};

export type DashboardData = {
  view: ViewKey;
  tab: string;
  gid?: number;
  asOf: string;
  spreadsheetId: string;
  daysElapsed: Sourced;
  monthDays: Sourced;
  mikomiZensu: Sourced;
  jyuchuYoso: Sourced;
  uriage: KgiRow;
  jinkenhi: KgiRow;
  gaichuhi: KgiRow;
  arari: KgiRow;
  kokoku: KgiRow;
  arariMinusKokoku: KgiRow;
  sonotaHiyou: KgiRow;
  shiharaiTesuryo: KgiRow;
  zenshaFutan: KgiRow;
  eigyoRieki: KgiRow;
  totalMeetings: MeetingKpi;
  menuai: MeetingKpi;
  kyansuRate: MeetingKpi;
  keiyakuRate: MeetingKpi;
  keiyakuSu: MeetingKpi;
  keiyakuTanka: MeetingKpi;
  nyuukinSu: MeetingKpi;
  failures: FailureRow[];
  cpa: Sourced;
  cpm: Sourced;
  cpo: Sourced;
  roi: Sourced;
  organicTotal: MediaRow | null;
  adsTotal: MediaRow | null;
  organic: MediaRow[];
  ads: MediaRow[];
  plans: PlanRow[];
  daily: DailyRow[];
  channelForecast: ChannelForecastRow[];
};

function serialToShortDate(serial: number): string {
  if (!isFinite(serial) || serial <= 0) return "";
  const d = new Date(Math.round((serial - 25569) * 86400 * 1000));
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function serialToFullDate(serial: number): string {
  if (!isFinite(serial) || serial <= 0) return "";
  const d = new Date(Math.round((serial - 25569) * 86400 * 1000));
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export async function fetchDashboard(view: ViewKey): Promise<DashboardData> {
  const tab = tabName(view);
  const quoted = `'${tab}'`;

  const [{ values: main, formulas }, tabGids] = await Promise.all([
    getRangeWithFormulas(SHEETS.sourceId, `${quoted}!A1:AC200`),
    getTabGids(SHEETS.sourceId),
  ]);

  const gid = tabGids.get(tab);

  const cell = (r: number, c: number): string | number | null =>
    main[r]?.[c] ?? null;
  const rawFormula = (r: number, c: number): string | number | null =>
    formulas[r]?.[c] ?? null;

  const src = (
    value: number,
    row: number,
    col: number,
    label?: string
  ): Sourced => {
    const rf = rawFormula(row, col);
    const kind = classifyCell(rf, value);
    const formulaStr =
      typeof rf === "string" && rf.startsWith("=")
        ? rf
        : undefined;
    return {
      value,
      tab,
      gid,
      cell: cellRef(row, col),
      label,
      formula: formulaStr,
      kind,
    };
  };

  const rowByLabel = new Map<string, number>();
  main.forEach((row, i) => {
    const label = toStr(row?.[2]);
    if (label && !rowByLabel.has(label)) rowByLabel.set(label, i);
  });

  const findRow = (...aliases: string[]): number => {
    for (const a of aliases) {
      const idx = rowByLabel.get(a);
      if (idx !== undefined) return idx;
    }
    return -1;
  };

  const emptySourced = (label: string): Sourced => ({
    value: NaN,
    tab,
    gid,
    cell: MISSING,
    label,
  });

  const emptyKgiRow = (label: string): KgiRow => ({
    label,
    target: emptySourced(`${label} 月目標`),
    genjiten: emptySourced(`${label} 現時点目標`),
    actual: emptySourced(`${label} 実績`),
    diff: emptySourced(`${label} 差異`),
    progress: emptySourced(`${label} 進捗率`),
    monthProgress: emptySourced(`${label} 月次進捗率`),
  });

  const emptyMeetingKpi = (label: string): MeetingKpi => ({
    label,
    target: emptySourced(`${label} 月目標`),
    genjiten: emptySourced(`${label} 現時点目標`),
    actual: emptySourced(`${label} 実績`),
    progress: emptySourced(`${label} 進捗率`),
    monthProgress: emptySourced(`${label} 月次進捗率`),
  });

  const kgiRowAt = (row: number, label: string): KgiRow => {
    if (row < 0) return emptyKgiRow(label);
    return {
      label,
      target: src(toNum(cell(row, 3)), row, 3, `${label} 月目標`),
      genjiten: src(toNum(cell(row, 4)), row, 4, `${label} 現時点目標`),
      actual: src(toNum(cell(row, 5)), row, 5, `${label} 実績`),
      diff: src(toNum(cell(row, 6)), row, 6, `${label} 差異`),
      progress: src(toNum(cell(row, 7)), row, 7, `${label} 進捗率`),
      monthProgress: src(toNum(cell(row, 8)), row, 8, `${label} 月次進捗率`),
    };
  };

  const meetingKpiAt = (row: number, label: string): MeetingKpi => {
    if (row < 0) return emptyMeetingKpi(label);
    return {
      label,
      target: src(toNum(cell(row, 3)), row, 3, `${label} 月目標`),
      genjiten: src(toNum(cell(row, 4)), row, 4, `${label} 現時点目標`),
      actual: src(toNum(cell(row, 5)), row, 5, `${label} 実績`),
      progress: src(toNum(cell(row, 7)), row, 7, `${label} 進捗率`),
      monthProgress: src(toNum(cell(row, 8)), row, 8, `${label} 月次進捗率`),
    };
  };

  const mediaRowAt = (row: number, name: string): MediaRow => ({
    name,
    target: src(toNum(cell(row, 3)), row, 3, `${name} 月目標`),
    genjiten: src(toNum(cell(row, 4)), row, 4, `${name} 現時点目標`),
    actual: src(toNum(cell(row, 5)), row, 5, `${name} 実績`),
    progress: src(toNum(cell(row, 7)), row, 7, `${name} 進捗率`),
    monthProgress: src(toNum(cell(row, 8)), row, 8, `${name} 月次進捗率`),
  });

  const kgiByLabel = (label: string, ...aliases: string[]): KgiRow =>
    kgiRowAt(findRow(label, ...aliases), label);

  const meetingByLabel = (label: string, ...aliases: string[]): MeetingKpi =>
    meetingKpiAt(findRow(label, ...aliases), label);

  // ── KGI (cost structure) ──
  const uriage = kgiByLabel("売上");
  const jinkenhi = kgiByLabel("人件費");
  const gaichuhi = kgiByLabel("外注費");
  const arari = kgiByLabel("粗利");
  const kokoku = kgiByLabel("広告宣伝費");
  const arariMinusKokoku = kgiByLabel("粗利 - 広告宣伝費", "粗利-広告宣伝費");
  const sonotaHiyou = kgiByLabel("その他費用");
  const shiharaiTesuryo = kgiByLabel("支払手数料");
  const zenshaFutan = kgiByLabel("全社負担コスト");
  const eigyoRieki = kgiByLabel("営業利益");

  // ── Meeting KPIs ──
  const totalMeetings = meetingByLabel("面談実施数", "当日面談予約数");
  const menuai = meetingByLabel("面談数", "着座数");
  const kyansuRate = meetingByLabel("キャンセル率");
  const keiyakuRate = meetingByLabel("契約率");
  const keiyakuSu = meetingByLabel("契約数");
  const keiyakuTanka = meetingByLabel("契約単価");
  const nyuukinSu = meetingByLabel("入金数");

  // ── Failures (rows where col B === "ー") ──
  const failures: FailureRow[] = [];
  main.forEach((row, i) => {
    if (toStr(row?.[1]) !== "ー") return;
    const label = toStr(row?.[2]);
    if (!label) return;
    failures.push({
      label,
      actual: src(toNum(row?.[5]), i, 5, label),
    });
  });

  // ── Organic & Ads ──
  const organicStart = findRow("オーガニック");
  const adsStart = findRow("広告・アフィ");
  const firstFailureRow = main.findIndex((r) => toStr(r?.[1]) === "ー");

  const readMediaRange = (from: number, to: number): MediaRow[] => {
    const out: MediaRow[] = [];
    for (let r = from; r < to; r++) {
      const name = toStr(main[r]?.[2])
        .replace(/^\s+/, "")
        .replace(/^　+/, "");
      if (!name) continue;
      out.push(mediaRowAt(r, name));
    }
    return out;
  };

  const organic: MediaRow[] =
    organicStart >= 0 && adsStart > organicStart
      ? readMediaRange(organicStart + 1, adsStart)
      : [];

  const ads: MediaRow[] =
    adsStart >= 0 && firstFailureRow > adsStart
      ? readMediaRange(adsStart + 1, firstFailureRow).filter(
          (m) =>
            (isFinite(m.target.value) && m.target.value !== 0) ||
            (isFinite(m.actual.value) && m.actual.value !== 0)
        )
      : [];

  const organicTotal: MediaRow | null =
    organicStart >= 0 ? mediaRowAt(organicStart, "オーガニック 合計") : null;

  const adsTotal: MediaRow | null =
    adsStart >= 0 ? mediaRowAt(adsStart, "広告・アフィ 合計") : null;

  // ── CPA / CPM (derived) ──
  const cpaVal =
    isFinite(keiyakuSu.actual.value) &&
    keiyakuSu.actual.value > 0 &&
    isFinite(kokoku.actual.value)
      ? kokoku.actual.value / keiyakuSu.actual.value
      : NaN;
  const cpa = derived(
    cpaVal,
    `${kokoku.label}実績(${kokoku.actual.cell}) ÷ ${keiyakuSu.label}実績(${keiyakuSu.actual.cell})`,
    tab,
    "契約CPA",
    gid
  );
  const cpmVal =
    isFinite(menuai.actual.value) &&
    menuai.actual.value > 0 &&
    isFinite(kokoku.actual.value)
      ? kokoku.actual.value / menuai.actual.value
      : NaN;
  const cpm = derived(
    cpmVal,
    `${kokoku.label}実績(${kokoku.actual.cell}) ÷ ${menuai.label}実績(${menuai.actual.cell})`,
    tab,
    "面談CPA",
    gid
  );

  // ── Plans block ──
  const plansHeaderRow = main.findIndex((r) => toStr(r?.[3]) === "金額");
  const plans: PlanRow[] = [];
  if (plansHeaderRow >= 0) {
    for (let r = plansHeaderRow + 1; r < main.length; r++) {
      const name = toStr(main[r]?.[2]);
      if (!name) break;
      if (name === "合計") break;
      const tanka = toNum(main[r]?.[3]);
      const ninzu = toNum(main[r]?.[6]);
      if (!isFinite(tanka) || !isFinite(ninzu) || ninzu <= 0) continue;
      plans.push({
        name,
        tanka: src(tanka, r, 3, `${name} 単価`),
        ninzu: src(ninzu, r, 6, `${name} 人数`),
        uriage: derived(
          tanka * ninzu,
          `単価(${tanka.toLocaleString()}) × 人数(${ninzu})`,
          tab,
          `${name} 売上`,
          gid
        ),
      });
    }
  }

  // ── Daily block ──
  const dailyHeaderRow = main.findIndex(
    (r) => toStr(r?.[1]) === "予約可能枠"
  );
  const daily: DailyRow[] = [];
  if (dailyHeaderRow >= 0) {
    for (let r = dailyHeaderRow + 1; r < main.length; r++) {
      const row = main[r];
      const dateSerial = toNum(row?.[1]);
      if (
        !isFinite(dateSerial) ||
        dateSerial < 40000 ||
        dateSerial > 80000
      )
        break;
      daily.push({
        date: serialToShortDate(dateSerial),
        dow: toStr(row?.[22]),
        target: src(toNum(row?.[0]), r, 0, "予約目標"),
        reservation: src(toNum(row?.[3]), r, 3, "総予約"),
        actualRes: src(toNum(row?.[4]), r, 4, "実予約"),
      });
    }
  }

  const findHeaderValue = (
    label: string
  ): { row: number; col: number; value: number } | null => {
    for (let r = 0; r < Math.min(5, main.length); r++) {
      const row = main[r];
      if (!row) continue;
      for (let c = 0; c < row.length; c++) {
        if (toStr(row[c]) !== label) continue;
        const forward = row
          .slice(c + 1)
          .findIndex((v) => isFinite(toNum(v)));
        if (forward >= 0) {
          const col = c + 1 + forward;
          return { row: r, col, value: toNum(row[col]) };
        }
        if (c > 0 && isFinite(toNum(row[c - 1]))) {
          return { row: r, col: c - 1, value: toNum(row[c - 1]) };
        }
      }
    }
    return null;
  };

  const elapsedHit = findHeaderValue("経過日数");
  const monthDaysHit = findHeaderValue("今月日数");
  const daysElapsed = elapsedHit
    ? src(elapsedHit.value, elapsedHit.row, elapsedHit.col, "経過日数")
    : src(NaN, 0, 5, "経過日数");
  const monthDays = monthDaysHit
    ? src(monthDaysHit.value, monthDaysHit.row, monthDaysHit.col, "今月日数")
    : src(NaN, 1, 5, "今月日数");

  let asOf = "";
  for (let r = 0; r < Math.min(4, main.length); r++) {
    for (let c = 0; c < (main[r]?.length ?? 0); c++) {
      const n = toNum(main[r]?.[c]);
      if (isFinite(n) && n > 40000 && n < 80000) {
        asOf = serialToFullDate(n);
        break;
      }
    }
    if (asOf) break;
  }

  // ── Top-of-sheet KPIs (見込全数 / 受注予想) ──
  const findLabelCell = (label: string) => {
    for (let r = 0; r < Math.min(6, main.length); r++) {
      const row = main[r];
      if (!row) continue;
      for (let c = 0; c < row.length; c++) {
        if (toStr(row[c]) === label) {
          const right = row
            .slice(c + 1)
            .findIndex((v) => isFinite(toNum(v)));
          if (right >= 0) {
            const col = c + 1 + right;
            return { row: r, col };
          }
        }
      }
    }
    return null;
  };

  const mikomiHit = findLabelCell("見込全数");
  const jyuchuHit = findLabelCell("受注予想");
  const mikomiZensu = mikomiHit
    ? src(toNum(cell(mikomiHit.row, mikomiHit.col)), mikomiHit.row, mikomiHit.col, "見込全数")
    : src(NaN, 0, 10, "見込全数");
  const jyuchuYoso = jyuchuHit
    ? src(toNum(cell(jyuchuHit.row, jyuchuHit.col)), jyuchuHit.row, jyuchuHit.col, "受注予想")
    : src(NaN, 1, 10, "受注予想");

  // ── CPO / ROI (sheet-provided) ──
  // CPO: row 7 col 18 (S8). ROI: row 10 col 18 (S11). Detect by label scan.
  const findMetricByLabel = (
    label: string,
    valueOffset = 4
  ): { row: number; col: number } | null => {
    for (let r = 0; r < main.length; r++) {
      const row = main[r];
      if (!row) continue;
      for (let c = 0; c < row.length; c++) {
        const s = toStr(row[c]);
        if (s === label || s.startsWith(label)) {
          const col = c + valueOffset;
          if (isFinite(toNum(row[col]))) return { row: r, col };
        }
      }
    }
    return null;
  };

  const cpoHit = findMetricByLabel("全体広告費÷契約数");
  const roiHit = findMetricByLabel("ROI");

  const cpo: Sourced = cpoHit
    ? src(toNum(cell(cpoHit.row, cpoHit.col)), cpoHit.row, cpoHit.col, "契約CPO")
    : isFinite(keiyakuSu.actual.value) && keiyakuSu.actual.value > 0
    ? derived(
        kokoku.actual.value / keiyakuSu.actual.value,
        `広告費 ÷ 契約数`,
        tab,
        "契約CPO",
        gid
      )
    : derived(NaN, "広告費 ÷ 契約数", tab, "契約CPO", gid);

  const roi: Sourced = roiHit
    ? src(toNum(cell(roiHit.row, roiHit.col)), roiHit.row, roiHit.col, "ROI")
    : isFinite(kokoku.actual.value) && kokoku.actual.value > 0
    ? derived(
        (uriage.actual.value - kokoku.actual.value) / kokoku.actual.value,
        "(売上 − 広告費) ÷ 広告費",
        tab,
        "ROI",
        gid
      )
    : derived(NaN, "(売上 − 広告費) ÷ 広告費", tab, "ROI", gid);

  // ── 媒体別予約予測表 (rows ~61-82) ──
  const forecastHeaderRow = main.findIndex(
    (r) => toStr(r?.[3]) === "予約数" && toStr(r?.[7]) === "契約率"
  );
  const channelForecast: ChannelForecastRow[] = [];
  if (forecastHeaderRow >= 0) {
    for (let r = forecastHeaderRow + 1; r < main.length; r++) {
      const row = main[r];
      if (!row) continue;
      const name = toStr(row[2]);
      if (!name) {
        if (channelForecast.length > 0) break;
        continue;
      }
      if (name === "合計/Blended" || name === "広告以外" || name === "広告") break;
      channelForecast.push({
        name,
        yoyaku: src(toNum(row[3]), r, 3, `${name} 予約数`),
        cancelSu: src(toNum(row[4]), r, 4, `${name} キャンセル数`),
        cancelRate: src(toNum(row[5]), r, 5, `${name} キャンセル率`),
        menuaiSu: src(toNum(row[6]), r, 6, `${name} 面談数`),
        keiyakuRate: src(toNum(row[7]), r, 7, `${name} 契約率`),
        keiyakuSu: src(toNum(row[9]), r, 9, `${name} 契約数`),
        kokokuHi: src(toNum(row[10]), r, 10, `${name} 広告費`),
        cpf: src(toNum(row[11]), r, 11, `${name} CPF`),
        yoyakuCpa: src(toNum(row[12]), r, 12, `${name} 予約CPA`),
        menuaiCpa: src(toNum(row[14]), r, 14, `${name} 面談CPA`),
        cpo: src(toNum(row[15]), r, 15, `${name} CPO`),
      });
    }
  }

  return {
    view,
    tab,
    gid,
    asOf,
    spreadsheetId: SHEETS.sourceId,
    daysElapsed,
    monthDays,
    mikomiZensu,
    jyuchuYoso,
    uriage,
    jinkenhi,
    gaichuhi,
    arari,
    kokoku,
    arariMinusKokoku,
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
    cpo,
    roi,
    organicTotal,
    adsTotal,
    organic,
    ads,
    plans,
    daily,
    channelForecast,
  };
}
