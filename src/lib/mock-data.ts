import type { DashboardData } from "./dashboard-data";
import type { ViewKey } from "./config";

export function mockDashboard(view: ViewKey): DashboardData {
  const base = {
    view,
    asOf: "2026/04/24",
    kgi: {
      uriageTarget: 88826159,
      uriageGenjitenTarget: 71432536,
      uriageActual: 34894760,
      uriageDiff: -36537777,
      uriageProgress: 0.49,
      monthlyProgress: 0.39,
      jinkenhiTarget: 16000000,
      jinkenhiActual: 12800000,
      gaichuhiTarget: 4000000,
      gaichuhiActual: 3200000,
      arariTarget: 68826159,
      arariActual: 18894760,
      kokokuTarget: 31924570,
      kokokuActual: 25064218,
      sonotaHiyou: 3200000,
      shiharaiTesuryo: 5329570,
      zenshaFutan: 3360000,
      eigyoRiekiTarget: 22039627,
      eigyoRiekiActual: -18059028,
    },
    meeting: {
      menuaiSu: 440,
      menuaiTarget: 505,
      menuaiGenjiten: 406,
      kyansuRate: 0.55,
      keiyakuRate: 0.219,
      keiyakuSu: 43.4,
      keiyakuSuTarget: 110,
      keiyakuTanka: 804027,
      nyuukinSu: 33,
    },
    organic: [
      { name: "検索", target: 25, genjiten: 20, actual: 23, progress: 1.14 },
      { name: "Instagram", target: 20, genjiten: 16, actual: 13, progress: 0.81 },
      { name: "LINE/メルマガ", target: 0, genjiten: 0, actual: 4, progress: 0 },
      { name: "X", target: 5, genjiten: 4, actual: 1, progress: 0.25 },
      { name: "YouTube", target: 23, genjiten: 18, actual: 21, progress: 1.14 },
      { name: "TikTok", target: 0, genjiten: 0, actual: 0, progress: 0 },
      { name: "サービスページ", target: 0, genjiten: 0, actual: 2, progress: 0 },
    ],
    ads: [
      { name: "広告L(アドマニア)", target: 60, genjiten: 48, actual: 45, progress: 0.93 },
      { name: "広告L(スーア)", target: 60, genjiten: 48, actual: 34, progress: 0.70 },
      { name: "アフィL(ウェブナル)", target: 45, genjiten: 36, actual: 40, progress: 1.11 },
      { name: "自社広告F(meta)", target: 10, genjiten: 8, actual: 20, progress: 2.49 },
      { name: "自社広告L(meta)", target: 232, genjiten: 187, actual: 213, progress: 1.14 },
      { name: "アフィF(A8)", target: 8, genjiten: 6, actual: 6, progress: 0.93 },
      { name: "アフィF(レントラックス)", target: 2, genjiten: 2, actual: 4, progress: 2.49 },
      { name: "自社広告L(Google)", target: 2, genjiten: 2, actual: 2, progress: 1.24 },
      { name: "自社広告L(Yahoo)", target: 10, genjiten: 8, actual: 4, progress: 0.5 },
    ],
    plans: [
      { name: "エキスパート_初月１円", tanka: 804652, ninzu: 43, uriage: 804652 * 43 },
      { name: "エキスパート_10万割引", tanka: 777799, ninzu: 1, uriage: 777799 },
    ],
    daily: Array.from({ length: 24 }, (_, i) => {
      const day = i + 1;
      const dows = ["水", "木", "金", "土", "日", "月", "火"];
      const dow = dows[(day + 2) % 7];
      const target = dow === "火" ? 25.6 : dow === "木" || dow === "金" || dow === "日" ? 20.4 : 13.6;
      return {
        date: `4/${day}`,
        dow,
        target,
        reservation: Math.round(target * (0.8 + Math.random() * 0.4)),
        actualRes: Math.round(target * (0.5 + Math.random() * 0.5)),
      };
    }),
    salespeople: [
      { name: "菅野", menuai: 48, keiyaku: 12, rate: 0.25 },
      { name: "島﨑", menuai: 52, keiyaku: 18, rate: 0.346 },
      { name: "奥田", menuai: 45, keiyaku: 10, rate: 0.222 },
      { name: "榎本", menuai: 44, keiyaku: 11, rate: 0.25 },
      { name: "板東", menuai: 43, keiyaku: 9, rate: 0.209 },
      { name: "久保", menuai: 40, keiyaku: 8, rate: 0.2 },
      { name: "吉田", menuai: 48, keiyaku: 14, rate: 0.292 },
      { name: "金野", menuai: 42, keiyaku: 10, rate: 0.238 },
      { name: "荷福", menuai: 45, keiyaku: 12, rate: 0.267 },
      { name: "澤本", menuai: 33, keiyaku: 8, rate: 0.242 },
    ],
  };

  if (view === "契約昨日") {
    base.asOf = "2026/04/23";
    base.kgi.uriageActual = 33500000;
  }
  if (view === "発生本日") {
    base.asOf = "2026/04/24";
    base.kgi.uriageTarget = 45000000;
    base.kgi.uriageActual = 18500000;
  }
  if (view === "発生昨日") {
    base.asOf = "2026/04/23";
    base.kgi.uriageTarget = 45000000;
    base.kgi.uriageActual = 17800000;
  }

  return base as DashboardData;
}
