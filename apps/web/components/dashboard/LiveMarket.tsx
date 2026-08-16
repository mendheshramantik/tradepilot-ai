"use client";

import { useEffect, useState } from "react";
import { useCoin } from "@/context/CoinContext";

type CoinData = {
  name: string;
  image: {
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
  };
};

export default function LiveMarket() {
  const { coin } = useCoin();

  const [data, setData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCoin() {
      setLoading(true);

      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coin}`
        );

        if (!res.ok) {
          setData(null);
          return;
        }

        const json = await res.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    }

    loadCoin();
  }, [coin]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-500 bg-red-500/10 p-6 text-red-400">
        Coin not found.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={data.image.large}
          alt={data.name}
          className="w-12 h-12"
        />

        <h2 className="text-3xl font-bold">
          {data.name}
        </h2>
      </div>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span className="text-slate-400">Price</span>

          <span className="font-bold">
            ${data.market_data.current_price.usd.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">24H Change</span>

          <span
            className={
              data.market_data.price_change_percentage_24h >= 0
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {data.market_data.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Market Cap</span>

          <span>
            $
            {data.market_data.market_cap.usd.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Volume</span>

          <span>
            $
            {data.market_data.total_volume.usd.toLocaleString()}
          </span>
        </div>

      </div>
    </div>
  );
}