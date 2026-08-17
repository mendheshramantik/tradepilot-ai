"use client";

import { useEffect, useState } from "react";
import { useCoin } from "@/context/CoinContext";

type ChartPoint = {
  time: number;
  price: number;
};

export default function SupportResistance() {
  const { coin } = useCoin();

  const [prices, setPrices] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/chart?coin=${encodeURIComponent(coin)}&days=7`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch price data");
        }

        const result = await response.json();

        const formatted = result.prices.map(
          ([time, price]: [number, number]) => ({
            time,
            price,
          })
        );

        setPrices(formatted);
      } catch (error) {
        console.error("Support/resistance error:", error);
        setPrices([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
  }, [coin]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">
        <h2 className="text-2xl font-bold">
          📊 Support & Resistance
        </h2>

        <p className="mt-4 text-slate-400">
          Calculating levels...
        </p>
      </div>
    );
  }

  if (prices.length === 0) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
        Unable to calculate support and resistance.
      </div>
    );
  }

  const priceValues = prices.map((point) => point.price);

  const support = Math.min(...priceValues);
  const resistance = Math.max(...priceValues);

  const currentPrice = priceValues[priceValues.length - 1];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          📊 Support & Resistance
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Based on the last 7 days of price data
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Resistance
              </p>

              <p className="mt-1 text-2xl font-bold text-red-400">
                ${resistance.toLocaleString()}
              </p>
            </div>

            <span className="text-2xl">🔴</span>
          </div>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Current Price
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-400">
                ${currentPrice.toLocaleString()}
              </p>
            </div>

            <span className="text-2xl">📍</span>
          </div>
        </div>

        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Support
              </p>

              <p className="mt-1 text-2xl font-bold text-green-400">
                ${support.toLocaleString()}
              </p>
            </div>

            <span className="text-2xl">🟢</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-slate-800/60 p-4">
        <p className="text-sm text-slate-300">
          The levels above represent the highest and lowest
          prices observed in the selected 7-day period.
        </p>
      </div>
    </div>
  );
}