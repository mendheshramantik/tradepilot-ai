"use client";

import { useCoin } from "@/context/CoinContext";

const coins = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
  },
];

export default function Watchlist() {
  const { coin, setCoin } = useCoin();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">
      <div className="mb-5">
        <h2 className="text-2xl font-bold">⭐ Watchlist</h2>

        <p className="mt-1 text-sm text-slate-400">
          Select a cryptocurrency
        </p>
      </div>

      <div className="space-y-3">
        {coins.map((item) => {
          const selected = coin === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCoin(item.id)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-800 bg-slate-800 hover:border-slate-700 hover:bg-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{item.symbol}</p>

                  <p className="text-sm text-slate-400">
                    {item.name}
                  </p>
                </div>

                <span
                  className={`text-sm font-semibold ${
                    selected
                      ? "text-blue-400"
                      : "text-slate-500"
                  }`}
                >
                  {selected ? "Selected" : "View"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}