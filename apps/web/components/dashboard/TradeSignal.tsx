"use client";

import { useCoin } from "@/context/CoinContext";

export default function TradeSignal() {
  const { coinData, loading } = useCoin();

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">
        <h2 className="text-2xl font-bold">🤖 Trade Signal</h2>
        <p className="mt-4 text-slate-400">
          Loading market data...
        </p>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
        Unable to generate trade signal.
      </div>
    );
  }

  const currentPrice = coinData.current_price;
  const change = coinData.price_change_percentage_24h;

  let signal = "HOLD";
  let signalColor = "text-yellow-400";
  let signalBg = "bg-yellow-400/10";
  let confidence = 60;

  if (change >= 1) {
    signal = "BUY";
    signalColor = "text-green-400";
    signalBg = "bg-green-400/10";
    confidence = Math.min(
      90,
      Math.round(65 + change * 5)
    );
  } else if (change <= -1) {
    signal = "SELL";
    signalColor = "text-red-400";
    signalBg = "bg-red-400/10";
    confidence = Math.min(
      90,
      Math.round(65 + Math.abs(change) * 5)
    );
  }

  const stopLoss =
    signal === "BUY"
      ? coinData.low_24h * 0.98
      : currentPrice * 0.98;

  const takeProfit =
    signal === "BUY"
      ? coinData.high_24h * 1.03
      : currentPrice * 0.97;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            🤖 Trade Signal
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Based on current market momentum
          </p>
        </div>

        <div className={`rounded-xl px-5 py-3 ${signalBg}`}>
          <span className={`text-2xl font-bold ${signalColor}`}>
            {signal}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Confidence</p>
          <p className="mt-1 text-xl font-bold">
            {confidence}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Risk</p>
          <p className="mt-1 text-xl font-bold text-yellow-400">
            Medium
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Entry</p>
          <p className="mt-1 text-xl font-bold">
            ${currentPrice.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">24H Change</p>
          <p
            className={`mt-1 text-xl font-bold ${
              change >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {change.toFixed(2)}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Stop Loss</p>
          <p className="mt-1 text-xl font-bold text-red-400">
            $
            {stopLoss.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Take Profit</p>
          <p className="mt-1 text-xl font-bold text-green-400">
            $
            {takeProfit.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-slate-800/60 p-4">
        <p className="text-sm text-slate-300">
          This is an experimental signal based on short-term
          price momentum. It is not financial advice.
        </p>
      </div>
    </div>
  );
}