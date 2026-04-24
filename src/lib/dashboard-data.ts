import { getRanges } from "./sheets";
import { SHEETS, TABS, toNum, toStr, type ViewKey } from "./config";

export type DashboardData = {
  view: ViewKey;
  asOf: string;
  kgi: {
    uriageTarget: number;
    uriageGenjitenTarget: number;
    uriageActual: number;
    uriageDiff: number;
    uriageProgress: number;
    monthlyProgress: number;
    jinkenhiTarget: number;
    jinkenhiActual: number;
    gaichuhiTarget: number;
    gaichuhiActual: number;
    arariTarget: number;
    arariActual: number;
    kokokuTarget: number;
    kokokuActual: number;
    sonotaHiyou: number;
    shiharaiTesuryo: number;
    zenshaFutan: number;
    eigyoRiekiTarget: number;
    eigyoRiekiActual: number;
  };
  meeting: {
    menuaiSu: number;
    menuaiTarget: number;
    menuaiGenjiten: number;
    kyansuRate: number;
    keiyakuRate: number;
    keiyakuSu: number;
    keiyakuSuTarget: number;
    keiyakuTanka: number;
    nyuukinSu: number;
  };
  organic: { name: string; target: number; genjiten: number; actual: number; progress: number }[];
  ads: { name: string; target: number; genjiten: number; actual: number; progress: number }[];
  plans: { name: string; tanka: number; ninzu: number; uriage: number }[];
  daily: { date: string; dow: string; target: number; reservation: number; actualRes: number }[];
  salespeople: { name: string; menuai: number; keiyaku: number; rate: number }[];
};

export async function fetchDashboard(view: ViewKey): Promise<DashboardData> {
  const tab = TABS.keiei[view];
  const quoted = `'${tab}'`;

  const ranges = [
    `${quoted}!A1:I100`,
    `${quoted}!A100:I135`,
    `${quoted}!A131:I161`,
    `${quoted}!AH131:AR161`,
    `${quoted}!C85:H97`,
  ];

  const [main, mediaBreakdown, dailyCore, salespeople, plansBlock] = await getRanges(
    SHEETS.sourceId,
    ranges
  );

  const row = (r: number) => main[r] ?? [];
  const cell = (r: number, c: number) => (main[r]?.[c] ?? "") as string | number;

  const asOf = toStr(cell(0, 4));

  const kgi = {
    uriageTarget: toNum(cell(5, 3)),
    uriageGenjitenTarget: toNum(cell(5, 4)),
    uriageActual: toNum(cell(5, 5)),
    uriageDiff: toNum(cell(5, 6)),
    uriageProgress: toNum(cell(5, 7)),
    monthlyProgress: toNum(cell(5, 8)),
    jinkenhiTarget: toNum(cell(6, 3)),
    jinkenhiActual: toNum(cell(6, 5)),
    gaichuhiTarget: toNum(cell(7, 3)),
    gaichuhiActual: toNum(cell(7, 5)),
    arariTarget: toNum(cell(8, 3)),
    arariActual: toNum(cell(8, 5)),
    kokokuTarget: toNum(cell(9, 3)),
    kokokuActual: toNum(cell(9, 5)),
    sonotaHiyou: toNum(cell(11, 5)),
    shiharaiTesuryo: toNum(cell(12, 5)),
    zenshaFutan: toNum(cell(13, 5)),
    eigyoRiekiTarget: toNum(cell(14, 3)),
    eigyoRiekiActual: toNum(cell(14, 5)),
  };

  const meeting = {
    menuaiSu: toNum(cell(75, 5)),
    menuaiTarget: toNum(cell(75, 3)),
    menuaiGenjiten: toNum(cell(75, 4)),
    kyansuRate: toNum(cell(76, 5)),
    keiyakuRate: toNum(cell(77, 5)),
    keiyakuSu: toNum(cell(78, 5)),
    keiyakuSuTarget: toNum(cell(78, 3)),
    keiyakuTanka: toNum(cell(81, 5)),
    nyuukinSu: toNum(cell(82, 5)),
  };

  const organic: DashboardData["organic"] = [];
  for (let r = 16; r <= 30; r++) {
    const name = toStr(cell(r, 2)).replace(/^\s+/, "").replace(/^　+/, "");
    if (!name) continue;
    organic.push({
      name,
      target: toNum(cell(r, 3)),
      genjiten: toNum(cell(r, 4)),
      actual: toNum(cell(r, 5)),
      progress: toNum(cell(r, 7)),
    });
  }

  const ads: DashboardData["ads"] = [];
  for (let r = 31; r <= 72; r++) {
    const name = toStr(cell(r, 2)).replace(/^\s+/, "").replace(/^　+/, "");
    if (!name) continue;
    const target = toNum(cell(r, 3));
    const actual = toNum(cell(r, 5));
    if (target === 0 && actual === 0) continue;
    ads.push({
      name,
      target,
      genjiten: toNum(cell(r, 4)),
      actual,
      progress: toNum(cell(r, 7)),
    });
  }

  const plans: DashboardData["plans"] = [];
  (plansBlock ?? []).forEach((row) => {
    const name = toStr(row[0]);
    const tanka = toNum(row[1]);
    const ninzu = toNum(row[4]);
    if (!name || name === "合計" || !tanka) return;
    plans.push({ name, tanka, ninzu, uriage: tanka * ninzu });
  });

  const daily: DashboardData["daily"] = [];
  (dailyCore ?? []).forEach((r) => {
    const dateCell = r[1];
    const dateStr = toStr(dateCell);
    if (!dateStr) return;
    daily.push({
      date: dateStr,
      dow: toStr(r[18] ?? r[7]),
      target: toNum(r[2]),
      reservation: toNum(r[3]),
      actualRes: toNum(r[4]),
    });
  });

  const salesNames = ["菅野", "島﨑", "奥田", "榎本", "板東", "久保", "吉田", "金野", "荷福", "澤本"];
  const salesStub: DashboardData["salespeople"] = salesNames.map((name) => ({
    name,
    menuai: 0,
    keiyaku: 0,
    rate: 0,
  }));

  return {
    view,
    asOf,
    kgi,
    meeting,
    organic,
    ads,
    plans,
    daily,
    salespeople: salesStub,
  };
}
