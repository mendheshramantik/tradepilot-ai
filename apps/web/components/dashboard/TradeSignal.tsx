"use client";

import { useEffect, useState } from "react";
import { useCoin } from "@/context/CoinContext";

type MarketData = {
  current_price: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
};

type ChartPoint = {
  time: number;
  price: number;
};

export default function TradeSignal() {
  const { coin } = useCoin();

  const [market, setMarket] = useState<MarketData | null>(null);
  const [support, setSupport] = useState<number | null>(null);
  const [resistance, setResistance] = useState<number | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateSignal() {
      try {
        setLoading(true);

        // Get live market data
        const marketResponse = await fetch(
          `/api/market?coin=${encodeURIComponent(coin)}`
        );

        if (!marketResponse.ok) {
          throw new Error("Failed to fetch market data");
        }

        const marketData = await marketResponse.json();

        setMarket({
          current_price: marketData.current_price,
          price_change_percentage_24h:
            marketData.price_change_percentage_24h,
          high_24h: marketData.high_24h,
          low_24h: marketData.low_24h,
        });

        // Get 7-day chart data
        const chartResponse = await fetch(
          `/api/chart?coin=${encodeURIComponent(coin)}&days=7`
        );

        if (!chartResponse.ok) {
          throw new Error("Failed to fetch chart data");
        }

        const chartData = await chartResponse.json();

        const points: ChartPoint[] = chartData.prices.map(
          ([time, price]: [number, number]) => ({
            time,
            price,
          })
        );

        const prices = points.map((point) => point.price);

        if (prices.length > 0) {
          setSupport(Math.min(...prices));
          setResistance(Math.max(...prices));
        }

        // Get AI analysis
        const aiResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coin,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();

          if (aiData.analysis) {
            setAiAnalysis(aiData.analysis);
          }
        }
      } catch (error) {
        console.error("Trade signal error:", error);
      } finally {
        setLoading(false);
      }
    }

    generateSignal();
  }, [coin]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">
        <h2 className="text-2xl font-bold">
          🤖 Trade Signal
        </h2>

        <p className="mt-4 text-slate-400">
          Analyzing market conditions...
        </p>
      </div>
    );
  }

  if (!market || support === null || resistance === null) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
        Unable to generate trade signal.
      </div>
    );
  }

  const currentPrice = market.current_price;
  const change = market.price_change_percentage_24h;

  /*
   * Basic signal logic:
   *
   * Positive momentum + price near support = BUY
   * Negative momentum + price near resistance = SELL
   * Otherwise = HOLD
   */

  const range = resistance - support;

  const positionInRange =
    range > 0
      ? ((currentPrice - support) / range) * 100
      : 50;

  let signal = "HOLD";
  let signalColor = "text-yellow-400";
  let signalBg = "bg-yellow-400/10";
  let confidence = 60;
  let risk = "Medium";

  if (change > 1 && positionInRange < 45) {
    signal = "BUY";
    signalColor = "text-green-400";
    signalBg = "bg-green-400/10";
    confidence = 78;
    risk = "Medium";
  } else if (change < -1 && positionInRange > 55) {
    signal = "SELL";
    signalColor = "text-red-400";
    signalBg = "bg-red-400/10";
    confidence = 76;
    risk = "Medium-High";
  } else if (positionInRange > 85) {
    signal = "HOLD";
    confidence = 68;
    risk = "High";
  } else if (positionInRange < 15) {
    signal = "BUY";
    signalColor = "text-green-400";
    signalBg = "bg-green-400/10";
    confidence = 72;
    risk = "Medium";
  }

  const stopLoss =
    signal === "BUY"
      ? support * 0.98
      : currentPrice * 0.98;

  const takeProfit =
    signal === "BUY"
      ? resistance
      : currentPrice * 0.97;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            🤖 AI Trade Signal
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Market + technical + AI analysis
          </p>
        </div>

        <div
          className={`rounded-xl px-5 py-3 ${signalBg}`}
        >
          <span
            className={`text-2xl font-bold ${signalColor}`}
          >
            {signal}
          </span>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">
            Confidence
          </p>

          <p className="mt-1 text-2xl font-bold">
            {confidence}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">
            Risk
          </p>

          <p className="mt-1 text-xl font-bold text-yellow-400">
            {risk}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">
            Entry
          </p>

          <p className="mt-1 text-xl font-bold">
            ${currentPrice.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">
            24H Change
          </p>

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
          <p className="text-sm text-slate-400">
            Support
          </p>

          <p className="mt-1 text-xl font-bold text-green-400">
            ${support.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">
            Resistance
          </p>

          <p className="mt-1 text-xl font-bold text-red-400">
            ${resistance.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">
            Stop Loss
          </p>

          <p className="mt-1 text-xl font-bold text-red-400">
            $
            {stopLoss.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">
            Take Profit
          </p>

          <p className="mt-1 text-xl font-bold text-green-400">
            $
            {takeProfit.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* AI Summary */}
      {aiAnalysis && (
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-semibold">
            🧠 AI Market View
          </h3>

          <div className="whitespace-pre-wrap rounded-xl bg-slate-800 p-4 text-sm leading-6 text-slate-300">
            {aiAnalysis}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 rounded-lg bg-slate-800/60 p-4">
        <p className="text-xs leading-5 text-slate-400">
          This signal is experimental and combines market
          momentum with technical price levels and AI analysis.
          It is not financial advice.
        </p>
      </div>
    </div>
  );
}