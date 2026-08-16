"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useCoin } from "@/context/CoinContext";

type ChartPoint = {
  time: number;
  price: number;
};

export default function PriceChart() {
  const { coin } = useCoin();

  const [data, setData] = useState<ChartPoint[]>([]);
  const [days, setDays] = useState("7");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChart() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/chart?coin=${encodeURIComponent(coin)}&days=${days}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }

        const result = await response.json();

        const formattedData = result.prices.map(
          ([time, price]: [number, number]) => ({
            time,
            price,
          })
        );

        setData(formattedData);
      } catch (error) {
        console.error("Chart error:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchChart();
  }, [coin, days]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            📈 Price Chart
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {coin.toUpperCase()} price history
          </p>
        </div>

        <div className="flex gap-2">
          {[
            { label: "1D", value: "1" },
            { label: "7D", value: "7" },
            { label: "30D", value: "30" },
            { label: "90D", value: "90" },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setDays(range.value)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                days === range.value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-[350px] items-center justify-center">
          <p className="text-slate-400">
            Loading chart...
          </p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[350px] items-center justify-center">
          <p className="text-red-400">
            Unable to load chart data.
          </p>
        </div>
      ) : (
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
              />

              <XAxis
                dataKey="time"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString()
                }
                stroke="#94a3b8"
                minTickGap={40}
              />

              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(value) =>
                  `$${value.toLocaleString()}`
                }
                stroke="#94a3b8"
                width={90}
              />

              <Tooltip
                labelFormatter={(value) =>
                  new Date(Number(value)).toLocaleString()
                }
                formatter={(value) => [
                  `$${Number(value).toLocaleString()}`,
                  "Price",
                ]}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />

              <Line
                type="monotone"
                dataKey="price"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}