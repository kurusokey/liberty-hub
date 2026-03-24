import { NextResponse } from "next/server";

const SUPA_URL = process.env.SUPABASE_URL ?? "";
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY ?? "";

export const revalidate = 60; // ISR: refresh every 60s

export async function GET() {
  if (!SUPA_URL || !SUPA_KEY) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const resp = await fetch(`${SUPA_URL}/rest/v1/settings?select=key,value`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
      next: { revalidate: 60 },
    });
    if (!resp.ok) throw new Error(`Supabase ${resp.status}`);
    const rows: { key: string; value: string }[] = await resp.json();
    const settings: Record<string, string> = {};
    for (const r of rows) settings[r.key] = r.value;

    // Trades count
    const tradesResp = await fetch(
      `${SUPA_URL}/rest/v1/trades?select=id&limit=1000`,
      { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }, next: { revalidate: 60 } }
    );
    const trades = tradesResp.ok ? await tradesResp.json() : [];

    return NextResponse.json({
      status: settings.bot_status ?? "unknown",
      capital: parseFloat(settings.bot_capital ?? "0"),
      initialCapital: parseFloat(settings.initial_capital_usdt ?? "2000"),
      drawdown: parseFloat(settings.bot_drawdown ?? "0"),
      regime: settings.ai_regime ?? settings.bot_regime ?? "?",
      btcTrend: settings.ai_btc_trend ?? "?",
      fearGreed: parseInt(settings.fear_greed_score ?? "0"),
      totalTrades: trades.length,
      lastCycle: settings.last_cycle_at ?? "",
      dryRun: settings.dry_run === "true",
      priceBtc: parseFloat(settings["price_BTC/USDT"] ?? "0"),
      priceEth: parseFloat(settings["price_ETH/USDT"] ?? "0"),
      priceSol: parseFloat(settings["price_SOL/USDT"] ?? "0"),
      marketSummary: settings.ai_market_summary ?? "",
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
