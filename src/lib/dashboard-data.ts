import { getRanges } from "./sheets";
import {
  SHEETS,
  tabName,
  toNum,
  toStr,
  type ViewKey,
  type Sourced,
  sourced,
  derived,
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
};

export type MediaRow = {
  name: string;
  target: Sourced;
  genjiten: Sourced;
  actual: Sourced;
  progress: Sourced;
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

export type DashboardData = {
  view: ViewKey;
  tab: string;
  asOf: string;
  spreadsheetId: string;
  daysElapsed: Sourced;
  monthDays: Sourced;
  uriage: KgiRow;
  jinkenhi: KgiRow;
  gaichuhi: KgiRow;
  arari: KgiRow;
  kokoku: KgiRow;
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
  organic: MediaRow[];
  ads: MediaRow[];
  plans: PlanRow[];
  daily: DailyRow[];
};

function serialToShortDate(serial: number): string {
  if (!isFinite(serial) || serial <= 0) return "";
  const d = new Date(Math.round((serial - 25569) * 86400 * 1000));
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function serialToFullDate(serial: number): string {
  if (!isFinite(serial) || serial <= 0) return "";
  const d = new Date(Math.round((serial - 25569) * 86400 * 1000));
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export async function fetchDashboard(view: ViewKey): Promise<DashboardData> {
  const tab = tabName(view);
  const quoted = `'${tab}'`;

  const ranges = [
    `${quoted}!A1:I100`,
    `${quoted}!A131:AC161`,
    `${quoted}!C85:H97`,
  ];

  const [mainRaw, dailyBlockRaw, plansBlockRaw] = await getRanges(
    SHEETS.sourceId,
    ranges
  );
  const main = (mainRaw ?? []) as (string | number | null)[][];
  const dailyBlock = (dailyBlockRaw ?? []) as (string | number | null)[][];
  const plansBlock = (plansBlockRaw ?? []) as (string | number | null)[][];

  const cell = (r: number, c: number): string | number | null =>
    main[r]?.[c] ?? null;

  const costOffset = view.kind === "発生" ? 3 : 0;
  const meetingOffset = view.kind === "発生" ? 3 : 0;

  const asOf = serialToFullDate(toNum(cell(1, 4)));

  const kgiRow = (
    row: number,
    label: string
  ): KgiRow => ({
    label,
    target: sourced(toNum(cell(row, 3)), tab, row, 3, `${label} 月目標`),
    genjiten: sourced(
      toNum(cell(row, 4)),
      tab,
      row,
      4,
      `${label} 現時点目標`
    ),
    actual: sourced(toNum(cell(row, 5)), tab, row, 5, `${label} 実績`),
    diff: sourced(toNum(cell(row, 6)), tab, row, 6, `${label} 差異`),
    progress: sourced(toNum(cell(row, 7)), tab, row, 7, `${label} 進捗率`),
    monthProgress: sourced(
      toNum(cell(row, 8)),
      tab,
      row,
      8,
      `${label} 月次進捗率`
    ),
  });

  const uriage = kgiRow(5, "売上");
  const jinkenhi = kgiRow(6 + costOffset, "人件費");
  const gaichuhi = kgiRow(7 + costOffset, "外注費");
  const arari = kgiRow(8 + costOffset, "粗利");
  const kokoku = kgiRow(9 + costOffset, "広告宣伝費");
  const sonotaHiyou = kgiRow(
    (view.kind === "発生" ? 14 : 11),
    "その他費用"
  );
  const shiharaiTesuryo = kgiRow(
    (view.kind === "発生" ? 15 : 12),
    "支払手数料"
  );
  const zenshaFutan = kgiRow(
    (view.kind === "発生" ? 16 : 13),
    "全社負担コスト"
  );
  const eigyoRieki = kgiRow(
    (view.kind === "発生" ? 17 : 14),
    "営業利益"
  );

  const meetingKpi = (
    row: number,
    col: number,
    label: string
  ): MeetingKpi => ({
    label,
    target: sourced(toNum(cell(row, 3)), tab, row, 3, `${label} 月目標`),
    genjiten: sourced(toNum(cell(row, 4)), tab, row, 4, `${label} 現時点目標`),
    actual: sourced(toNum(cell(row, col)), tab, row, col, `${label} 実績`),
    progress: sourced(toNum(cell(row, 7)), tab, row, 7, `${label} 進捗率`),
  });

  const totalMeetings = meetingKpi(15 + meetingOffset, 5, "面談実施数");
  const menuai = meetingKpi(76 + meetingOffset, 5, "有効面談数");
  const kyansuRate = meetingKpi(77 + meetingOffset, 5, "キャンセル率");
  const keiyakuRate = meetingKpi(78 + meetingOffset, 5, "契約率");
  const keiyakuSu = meetingKpi(79 + meetingOffset, 5, "契約数");
  const keiyakuTanka = meetingKpi(82 + meetingOffset, 5, "契約単価");
  const nyuukinSu = meetingKpi(83 + meetingOffset, 5, "入金数");

  const failureStart = 72 + meetingOffset;
  const failureLabels = [
    "自社信販落ち",
    "ブラック/生保",
    "対応困難",
    "未成年",
  ];
  const failures: FailureRow[] = failureLabels.map((label, i) => ({
    label,
    actual: sourced(
      toNum(cell(failureStart + i, 5)),
      tab,
      failureStart + i,
      5,
      label
    ),
  }));

  const cpaVal =
    keiyakuSu.actual.value > 0
      ? kokoku.actual.value / keiyakuSu.actual.value
      : 0;
  const cpa = derived(
    cpaVal,
    `${kokoku.label}実績(${kokoku.actual.cell}) ÷ ${keiyakuSu.label}実績(${keiyakuSu.actual.cell})`,
    tab,
    "契約CPA"
  );
  const cpmVal =
    menuai.actual.value > 0 ? kokoku.actual.value / menuai.actual.value : 0;
  const cpm = derived(
    cpmVal,
    `${kokoku.label}実績(${kokoku.actual.cell}) ÷ ${menuai.label}実績(${menuai.actual.cell})`,
    tab,
    "面談CPA"
  );

  const organicStart = 17 + meetingOffset;
  const organicEnd = 30 + meetingOffset;
  const organic: MediaRow[] = [];
  for (let r = organicStart; r <= organicEnd; r++) {
    const name = toStr(cell(r, 2)).replace(/^\s+/, "").replace(/^　+/, "");
    if (!name) continue;
    organic.push({
      name,
      target: sourced(toNum(cell(r, 3)), tab, r, 3, `${name} 月目標`),
      genjiten: sourced(toNum(cell(r, 4)), tab, r, 4, `${name} 現時点目標`),
      actual: sourced(toNum(cell(r, 5)), tab, r, 5, `${name} 実績`),
      progress: sourced(toNum(cell(r, 7)), tab, r, 7, `${name} 進捗率`),
    });
  }

  const adsStart = 32 + meetingOffset;
  const adsEnd = 71 + meetingOffset;
  const ads: MediaRow[] = [];
  for (let r = adsStart; r <= adsEnd; r++) {
    const name = toStr(cell(r, 2)).replace(/^\s+/, "").replace(/^　+/, "");
    if (!name) continue;
    const target = toNum(cell(r, 3));
    const actual = toNum(cell(r, 5));
    if (target === 0 && actual === 0) continue;
    ads.push({
      name,
      target: sourced(target, tab, r, 3, `${name} 月目標`),
      genjiten: sourced(toNum(cell(r, 4)), tab, r, 4, `${name} 現時点目標`),
      actual: sourced(actual, tab, r, 5, `${name} 実績`),
      progress: sourced(toNum(cell(r, 7)), tab, r, 7, `${name} 進捗率`),
    });
  }

  const plans: PlanRow[] = [];
  plansBlock.forEach((row, i) => {
    const rowIdx = 84 + i;
    const name = toStr(row?.[0]);
    const tanka = toNum(row?.[1]);
    const ninzu = toNum(row?.[4]);
    if (!name || name === "合計" || !tanka || ninzu <= 0) return;
    plans.push({
      name,
      tanka: sourced(tanka, tab, rowIdx, 3, `${name} 単価`),
      ninzu: sourced(ninzu, tab, rowIdx, 6, `${name} 人数`),
      uriage: derived(
        tanka * ninzu,
        `単価(${tanka.toLocaleString()}) × 人数(${ninzu})`,
        tab,
        `${name} 売上`
      ),
    });
  });

  const daily: DailyRow[] = [];
  dailyBlock.forEach((r, i) => {
    if (i === 0) return;
    const rowIdx = 130 + i;
    const dateSerial = toNum(r?.[1]);
    if (!dateSerial) return;
    daily.push({
      date: serialToShortDate(dateSerial),
      dow: toStr(r?.[27]),
      target: sourced(toNum(r?.[0]), tab, rowIdx, 0, "予約目標"),
      reservation: sourced(toNum(r?.[3]), tab, rowIdx, 3, "総予約"),
      actualRes: sourced(toNum(r?.[4]), tab, rowIdx, 4, "実予約"),
    });
  });

  const daysElapsed = sourced(toNum(cell(0, 7)), tab, 0, 7, "経過日数");
  const monthDays = sourced(toNum(cell(1, 5)), tab, 1, 5, "今月日数");

  return {
    view,
    tab,
    asOf,
    spreadsheetId: SHEETS.sourceId,
    daysElapsed,
    monthDays,
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
    ads,
    plans,
    daily,
  };
}
