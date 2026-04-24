export const SHEETS = {
  sourceId: process.env.SOURCE_SPREADSHEET_ID ?? "14mPCHuitBOKYjNhISKwcK2KaVJfZcEjC0GDdrpzCNow",
  inputId: process.env.INPUT_SPREADSHEET_ID ?? "1Expj4pqdJPcWKEhmh7zTULCTpPqv69xcoqtitlRGrsk",
} as const;

export const TABS = {
  keiei: {
    "契約本日": "経営管理シート(4月/契約)本日",
    "契約昨日": "経営管理シート(4月/契約)昨日",
    "発生本日": "経営管理シート(4月/発生)本日",
    "発生昨日": "経営管理シート(4月/発生)昨日",
  },
  customers: "②【顧客管理シート】",
  targets: "★目標管理",
  channels: "チャネル別流入管理",
} as const;

export type ViewKey = keyof typeof TABS.keiei;
export const VIEWS: ViewKey[] = ["契約本日", "契約昨日", "発生本日", "発生昨日"];

export function toNum(v: unknown): number {
  if (v === null || v === undefined || v === "") return 0;
  if (typeof v === "number") return v;
  const s = String(v).replace(/[¥,\s%]/g, "");
  const n = parseFloat(s);
  return isFinite(n) ? n : 0;
}

export function toStr(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

export function yen(n: number): string {
  if (!isFinite(n) || n === 0) return "¥0";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${sign}¥${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `${sign}¥${(abs / 10_000).toFixed(1)}万`;
  return `${sign}¥${Math.round(abs).toLocaleString()}`;
}

export function pct(n: number, digits = 0): string {
  if (!isFinite(n)) return "-";
  return `${(n * 100).toFixed(digits)}%`;
}

export function num(n: number): string {
  if (!isFinite(n)) return "-";
  return Math.round(n).toLocaleString();
}
