"use client";

import { useCoin } from "@/context/CoinContext";

export default function MarketCard() {
  const { coin, coinData, loading } = useCoin();

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-slate-400">Loading market data...</p>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-red-400">
          Unable to load market data.
        </p>
      </div>
    );
  }

  const isPositive = coinData.price_change_percentage_24h >= 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {coinData.symbol.toUpperCase()}/USDT
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {coinData.name}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            isPositive
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {isPositive ? "Bullish 📈" : "Bearish 📉"}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-slate-400">Current Price</p>

          <h3 className="text-3xl font-bold text-green-400">
            ${coinData.current_price.toLocaleString()}
          </h3>
        </div>

        <div>
          <p className="text-slate-400">24h Change</p>

          <h3
            className={`text-2xl font-bold ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {coinData.price_change_percentage_24h.toFixed(2)}%
          </h3>
        </div>

        <div>
          <p className="text-slate-400">24h High</p>

          <h3 className="text-xl font-semibold text-white">
            ${coinData.high_24h.toLocaleString()}
          </h3>
        </div>

        <div>
          <p className="text-slate-400">24h Low</p>

          <h3 className="text-xl font-semibold text-white">
            ${coinData.low_24h.toLocaleString()}
          </h3>
        </div>

        <div>
          <p className="text-slate-400">Market Cap</p>

          <h3 className="text-xl font-semibold text-white">
            ${coinData.market_cap.toLocaleString()}
          </h3>
        </div>

        <div>
          <p className="text-slate-400">24h Volume</p>

          <h3 className="text-xl font-semibold text-white">
            ${coinData.total_volume.toLocaleString()}
          </h3>
        </div>
      </div>
    </div>
  );
}