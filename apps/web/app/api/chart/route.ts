import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const coin = searchParams.get("coin") || "bitcoin";
    const days = searchParams.get("days") || "7";

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
        coin
      )}/market_chart?vs_currency=usd&days=${encodeURIComponent(days)}`,
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      prices: data.prices,
    });
  } catch (error) {
    console.error("Chart API error:", error);

    return NextResponse.json(
      {
        error: "Unable to fetch chart data",
      },
      {
        status: 500,
      }
    );
  }
}