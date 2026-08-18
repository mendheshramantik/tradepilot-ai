import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const coin = searchParams.get("coin") || "bitcoin";

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
        coin
      )}&price_change_percentage=24h`,
      {
        headers: {
          Accept: "application/json",
        },

        // Cache market data for 30 seconds
        next: {
          revalidate: 30,
        },
      }
    );

    if (response.status === 429) {
      console.warn("CoinGecko rate limit reached");

      return NextResponse.json(
        {
          error: "Market data temporarily unavailable",
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    if (!response.ok) {
      throw new Error(
        `CoinGecko returned ${response.status}`
      );
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Coin not found" },
        { status: 404 }
      );
    }

    const coinData = data[0];

    return NextResponse.json({
      id: coinData.id,
      symbol: coinData.symbol,
      name: coinData.name,
      current_price: coinData.current_price,
      price_change_percentage_24h:
        coinData.price_change_percentage_24h,
      high_24h: coinData.high_24h,
      low_24h: coinData.low_24h,
      market_cap: coinData.market_cap,
      total_volume: coinData.total_volume,
    });
  } catch (error) {
    console.error("Market API error:", error);

    return NextResponse.json(
      {
        error: "Unable to fetch market data",
      },
      { status: 500 }
    );
  }
}