"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CoinData = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  market_cap: number;
  total_volume: number;
};

type CoinContextType = {
  coin: string;
  setCoin: (coin: string) => void;
  coinData: CoinData | null;
  loading: boolean;
};

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export function CoinProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [coin, setCoin] = useState("bitcoin");
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoinData() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/market?coin=${encodeURIComponent(coin)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch market data");
        }

        const data = await response.json();

        setCoinData(data);
      } catch (error) {
        console.error("Market data error:", error);
        setCoinData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCoinData();
  }, [coin]);

  return (
    <CoinContext.Provider
      value={{
        coin,
        setCoin,
        coinData,
        loading,
      }}
    >
      {children}
    </CoinContext.Provider>
  );
}

export function useCoin() {
  const context = useContext(CoinContext);

  if (!context) {
    throw new Error("useCoin must be used inside CoinProvider");
  }

  return context;
}