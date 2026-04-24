import { google, sheets_v4 } from "googleapis";

let cachedClient: sheets_v4.Sheets | null = null;

export function getSheetsClient(): sheets_v4.Sheets {
  if (cachedClient) return cachedClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL と GOOGLE_PRIVATE_KEY を .env に設定してください"
    );
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  cachedClient = google.sheets({ version: "v4", auth });
  return cachedClient;
}

export async function getRange(
  spreadsheetId: string,
  range: string
): Promise<(string | number | null)[][]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
    valueRenderOption: "UNFORMATTED_VALUE",
  });
  return (res.data.values ?? []) as (string | number | null)[][];
}

export async function getRanges(
  spreadsheetId: string,
  ranges: string[]
): Promise<(string | number | null)[][][]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges,
    valueRenderOption: "UNFORMATTED_VALUE",
  });
  return (res.data.valueRanges ?? []).map(
    (vr) => (vr.values ?? []) as (string | number | null)[][]
  );
}
