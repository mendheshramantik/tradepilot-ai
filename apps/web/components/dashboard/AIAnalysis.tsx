"use client";

import { useState } from "react";
import { useCoin } from "@/context/CoinContext";

export default function AIAnalysis() {
  const { coin, coinData, loading: marketLoading } = useCoin();

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");

  async function analyze() {
    if (!coinData) {
      setAnalysis("Market data is not available yet.");
      return;
    }

    setLoading(true);
    setAnalysis("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coin,
          name: coinData.name,
          current_price: coinData.current_price,
          price_change_percentage_24h:
            coinData.price_change_percentage_24h,
          high_24h: coinData.high_24h,
          low_24h: coinData.low_24h,
          market_cap: coinData.market_cap,
          total_volume: coinData.total_volume,
        }),
      });

      const data = await response.json();

      if (response.ok && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setAnalysis(
          data.error || "Unable to generate analysis."
        );
      }
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysis("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            🤖 AI Trade Analysis
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            AI analysis based on live market data
          </p>
        </div>

        <button
          onClick={analyze}
          disabled={loading || marketLoading || !coinData}
          className="rounded-lg bg-blue-600 px-5 py-2 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {analysis ? (
        <div className="whitespace-pre-wrap rounded-lg bg-slate-800 p-4 text-slate-300">
          {analysis}
        </div>
      ) : (
        <p className="text-slate-400">
          Search a cryptocurrency and click Analyze.
        </p>
      )}
    </div>
  );
}