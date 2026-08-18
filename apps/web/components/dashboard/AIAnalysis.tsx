"use client";

import { useState } from "react";
import { useCoin } from "@/context/CoinContext";

export default function AIAnalysis() {
  const { coin } = useCoin();

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");

  async function analyze() {
    setLoading(true);
    setAnalysis("");

    try {
      // Get current market data first
      const marketResponse = await fetch(
        `/api/market?coin=${encodeURIComponent(coin)}`
      );

      if (!marketResponse.ok) {
        throw new Error("Failed to fetch market data");
      }

      const market = await marketResponse.json();

      // Send market data to Gemini API
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coin: market.symbol,
          name: market.name,
          current_price: market.current_price,
          price_change_percentage_24h:
            market.price_change_percentage_24h,
          high_24h: market.high_24h,
          low_24h: market.low_24h,
          market_cap: market.market_cap,
          total_volume: market.total_volume,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to generate analysis"
        );
      }

      setAnalysis(
        data.analysis || "Unable to generate analysis."
      );
    } catch (error) {
      console.error("AI analysis error:", error);
      setAnalysis("Unable to generate AI analysis.");
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
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 hover:bg-blue-700 disabled:opacity-50"
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
          Click Analyze to generate AI market analysis.
        </p>
      )}
    </div>
  );
}