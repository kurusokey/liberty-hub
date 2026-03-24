import { NextRequest, NextResponse } from "next/server";

export const revalidate = 300; // 5 min cache

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get("ticker") ?? "VWCE.DE";

  try {
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?range=1mo&interval=1d`;
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 300 },
    });
    if (!resp.ok) throw new Error(`Yahoo ${resp.status}`);
    const data = await resp.json();
    const result = data?.chart?.result?.[0];
    if (!result) throw new Error("No data");

    const meta = result.meta;
    const price = meta.regularMarketPrice ?? 0;
    const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change = price - prevClose;
    const changePct = prevClose > 0 ? (change / prevClose) * 100 : 0;

    return NextResponse.json({
      ticker,
      price: Math.round(price * 100) / 100,
      prevClose: Math.round(prevClose * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePct: Math.round(changePct * 100) / 100,
      currency: meta.currency ?? "EUR",
    });
  } catch (e) {
    return NextResponse.json({ error: String(e), ticker }, { status: 502 });
  }
}
