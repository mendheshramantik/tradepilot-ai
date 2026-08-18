"use client";

import { useCoin } from "@/context/CoinContext";

export default function LiveMarket() {
  const { coin, coinData, loading } = useCoin();

  console.log("LiveMarket selected coin:", coin);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">
        Loading market data...
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
        Unable to load market data.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold">
          {coinData.symbol.toUpperCase().slice(0, 3)}
        </div>

        <div>
          <h2 className="text-3xl font-bold">
            {coinData.name}
          </h2>

          <p className="text-sm text-slate-400">
            {coinData.symbol.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-slate-400">Price</span>

          <span className="font-bold">
            ${coinData.current_price.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">24H Change</span>

          <span
            className={
              coinData.price_change_percentage_24h >= 0
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {coinData.price_change_percentage_24h >= 0
              ? "+"
              : ""}
            {coinData.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">24H High</span>

          <span>
            ${coinData.high_24h.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">24H Low</span>

          <span>
            ${coinData.low_24h.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Market Cap</span>

          <span>
            ${coinData.market_cap.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Volume</span>

          <span>
            ${coinData.total_volume.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}