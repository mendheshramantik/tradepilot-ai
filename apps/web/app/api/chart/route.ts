import { NextResponse } from "next/server";

type CacheEntry = {
  data: unknown;
  timestamp: number;
};

const cache = new Map<string, CacheEntry>();

// Keep CoinGecko responses for 60 seconds.
const CACHE_DURATION = 60 * 1000;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const coin = searchParams.get("coin") || "bitcoin";
    const days = searchParams.get("days") || "7";

    const cacheKey = `${coin}-${days}`;

    // Check cache first
    const cached = cache.get(cacheKey);

    if (
      cached &&
      Date.now() - cached.timestamp < CACHE_DURATION
    ) {
      console.log(`Chart cache hit: ${cacheKey}`);

      return NextResponse.json(cached.data);
    }

    const url =
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart` +
      `?vs_currency=usd&days=${days}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },

      // Don't let Next.js serve an old response.
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `CoinGecko returned ${response.status}`
      );

      // If CoinGecko rate-limits us but we have old data,
      // return the old data instead.
      if (cached) {
        console.log(
          `Using stale chart cache: ${cacheKey}`
        );

        return NextResponse.json(cached.data);
      }

      throw new Error(
        `CoinGecko returned ${response.status}`
      );
    }

    const data = await response.json();

    // Save response in memory
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Chart API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch chart data",
      },
      {
        status: 500,
      }
    );
  }
}