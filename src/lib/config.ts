export const SHEETS = {
  sourceId:
    process.env.SOURCE_SPREADSHEET_ID ?? "14mPCHuitBOKYjNhISKwcK2KaVJfZcEjC0GDdrpzCNow",
  inputId:
    process.env.INPUT_SPREADSHEET_ID ?? "1Expj4pqdJPcWKEhmh7zTULCTpPqv69xcoqtitlRGrsk",
} as const;

export type MonthKey = "4月" | "3月" | "2月" | "1月";
export type KindKey = "契約" | "発生";
export type DayKey = "本日" | "昨日" | null;

export type ViewKey =
  | { month: "4月"; kind: "契約"; day: "本日" }
  | { month: "4月"; kind: "契約"; day: "昨日" }
  | { month: "4月"; kind: "発生"; day: "本日" }
  | { month: "4月"; kind: "発生"; day: "昨日" }
  | { month: "3月"; kind: "契約"; day: null }
  | { month: "3月"; kind: "発生"; day: null }
  | { month: "2月"; kind: "契約"; day: null }
  | { month: "1月"; kind: "契約"; day: null };

export const VIEWS: ViewKey[] = [
  { month: "4月", kind: "契約", day: "本日" },
  { month: "4月", kind: "契約", day: "昨日" },
  { month: "4月", kind: "発生", day: "本日" },
  { month: "4月", kind: "発生", day: "昨日" },
  { month: "3月", kind: "契約", day: null },
  { month: "3月", kind: "発生", day: null },
  { month: "2月", kind: "契約", day: null },
  { month: "1月", kind: "契約", day: null },
];

export function encodeView(v: ViewKey): string {
  return v.day ? `${v.month}-${v.kind}-${v.day}` : `${v.month}-${v.kind}`;
}

export function decodeView(s: string | undefined): ViewKey {
  if (!s) return VIEWS[0];
  const found = VIEWS.find((v) => encodeView(v) === s);
  return found ?? VIEWS[0];
}

export function viewLabel(v: ViewKey): string {
  return v.day ? `${v.month} / ${v.kind} / ${v.day}` : `${v.month} / ${v.kind}`;
}

export function tabName(v: ViewKey): string {
  if (v.month === "4月") return `経営管理シート(${v.month}/${v.kind})${v.day}`;
  if (v.month === "1月" && v.kind === "契約") {
    return `経営管理シート(1月/契約)昨日 （新目標）`;
  }
  return `経営管理シート(${v.month}/${v.kind})`;
}

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
  if (!isFinite(n)) return "-";
  if (n === 0) return "¥0";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
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

export function num1(n: number): string {
  if (!isFinite(n)) return "-";
  return n.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

export type Sourced = {
  value: number;
  tab: string;
  cell: string;
  label?: string;
  formula?: string;
};

export function colLetter(col: number): string {
  let s = "";
  let c = col;
  while (c >= 0) {
    s = String.fromCharCode(65 + (c % 26)) + s;
    c = Math.floor(c / 26) - 1;
  }
  return s;
}

export function cellRef(row: number, col: number): string {
  return `${colLetter(col)}${row + 1}`;
}

export function sourced(
  value: number,
  tab: string,
  row: number,
  col: number,
  label?: string,
  formula?: string
): Sourced {
  return { value, tab, cell: cellRef(row, col), label, formula };
}

export function derived(
  value: number,
  formula: string,
  tab: string,
  label?: string
): Sourced {
  return { value, tab, cell: "—", formula, label };
}

export function sheetCellUrl(
  spreadsheetId: string,
  tab: string,
  cell: string
): string {
  if (cell === "—") {
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0&range=${encodeURIComponent(
      tab
    )}`;
  }
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?range=${encodeURIComponent(
    `'${tab}'!${cell}`
  )}`;
}
