import { NextResponse } from "next/server";

type CacheEntry = {
  data: unknown;
  timestamp: number;
};

const cache = new Map<string, CacheEntry>();

// Normal cache: 60 seconds
const CACHE_DURATION = 60 * 1000;

// Keep stale data available for up to 10 minutes
// if CoinGecko is rate-limiting us.
const STALE_CACHE_DURATION = 10 * 60 * 1000;

// Maximum number of attempts to CoinGecko
const MAX_RETRIES = 3;

// Wait helper
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const coin = searchParams.get("coin") || "bitcoin";
    const days = searchParams.get("days") || "7";

    const cacheKey = `${coin}-${days}`;

    const cached = cache.get(cacheKey);

    // --------------------------------------------------
    // 1. Return fresh cache immediately
    // --------------------------------------------------

    if (
      cached &&
      Date.now() - cached.timestamp < CACHE_DURATION
    ) {
      console.log(`Chart cache hit: ${cacheKey}`);

      return NextResponse.json(cached.data, {
        status: 200,
        headers: {
          "X-Cache": "HIT",
        },
      });
    }

    const url =
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
        coin
      )}/market_chart` +
      `?vs_currency=usd&days=${encodeURIComponent(days)}`;

    // --------------------------------------------------
    // 2. Try CoinGecko with retries
    // --------------------------------------------------

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(
          `CoinGecko chart request: ${coin}, ${days} days, attempt ${attempt}`
        );

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "TradePilot-AI/1.0",
          },
          cache: "no-store",
        });

        // ------------------------------------------------
        // Successful response
        // ------------------------------------------------

        if (response.ok) {
          const data = await response.json();

          // Validate basic CoinGecko response
          if (
            !data ||
            !Array.isArray(data.prices)
          ) {
            throw new Error(
              "Invalid chart data returned by CoinGecko"
            );
          }

          // Save successful response
          cache.set(cacheKey, {
            data,
            timestamp: Date.now(),
          });

          console.log(
            `Chart cache updated: ${cacheKey}`
          );

          return NextResponse.json(data, {
            status: 200,
            headers: {
              "X-Cache": "MISS",
            },
          });
        }

        // ------------------------------------------------
        // Rate limited: 429
        // ------------------------------------------------

        if (response.status === 429) {
          const retryAfterHeader =
            response.headers.get("retry-after");

          let retryAfter = 2000;

          if (retryAfterHeader) {
            const seconds = Number(
              retryAfterHeader
            );

            if (
              Number.isFinite(seconds) &&
              seconds > 0
            ) {
              retryAfter = seconds * 1000;
            }
          } else {
            // Exponential backoff
            retryAfter =
              2000 * Math.pow(2, attempt - 1);
          }

          console.warn(
            `CoinGecko rate limited (429). Attempt ${attempt}/${MAX_RETRIES}. Retrying in ${retryAfter}ms`
          );

          // If we have cached data, prefer returning it
          // instead of making the user wait.
          if (cached) {
            const cacheAge =
              Date.now() - cached.timestamp;

            if (
              cacheAge < STALE_CACHE_DURATION
            ) {
              console.log(
                `Using stale chart cache because CoinGecko returned 429: ${cacheKey}`
              );

              return NextResponse.json(
                cached.data,
                {
                  status: 200,
                  headers: {
                    "X-Cache": "STALE",
                    "X-Rate-Limited": "true",
                  },
                }
              );
            }
          }

          // Don't wait after the final attempt
          if (attempt < MAX_RETRIES) {
            await sleep(retryAfter);
            continue;
          }

          // Final 429
          return NextResponse.json(
            {
              error:
                "CoinGecko rate limit reached. Please try again shortly.",
            },
            {
              status: 429,
              headers: {
                "Retry-After": String(
                  Math.ceil(retryAfter / 1000)
                ),
              },
            }
          );
        }

        // ------------------------------------------------
        // Other CoinGecko errors
        // ------------------------------------------------

        console.error(
          `CoinGecko returned ${response.status}`
        );

        // If old cache exists, use it
        if (cached) {
          const cacheAge =
            Date.now() - cached.timestamp;

          if (cacheAge < STALE_CACHE_DURATION) {
            console.log(
              `Using stale chart cache after CoinGecko error: ${cacheKey}`
            );

            return NextResponse.json(
              cached.data,
              {
                status: 200,
                headers: {
                  "X-Cache": "STALE",
                },
              }
            );
          }
        }

        return NextResponse.json(
          {
            error: `CoinGecko returned ${response.status}`,
          },
          {
            status: response.status,
          }
        );
      } catch (error) {
        console.error(
          `Chart request attempt ${attempt} failed:`,
          error
        );

        // If we have cached data, use it
        if (cached) {
          const cacheAge =
            Date.now() - cached.timestamp;

          if (cacheAge < STALE_CACHE_DURATION) {
            console.log(
              `Using stale chart cache after request error: ${cacheKey}`
            );

            return NextResponse.json(
              cached.data,
              {
                status: 200,
                headers: {
                  "X-Cache": "STALE",
                },
              }
            );
          }
        }

        // Retry network errors
        if (attempt < MAX_RETRIES) {
          const retryDelay =
            1000 * Math.pow(2, attempt - 1);

          await sleep(retryDelay);
          continue;
        }

        throw error;
      }
    }

    // This should normally never be reached
    return NextResponse.json(
      {
        error: "Unable to fetch chart data.",
      },
      {
        status: 500,
      }
    );
  } catch (error) {
    console.error(
      "Chart API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch chart data.",
      },
      {
        status: 500,
      }
    );
  }
}