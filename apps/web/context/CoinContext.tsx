"use client";

import { createContext, useContext, useState } from "react";

type CoinContextType = {
  symbol: string;
  setSymbol: (symbol: string) => void;
};

const CoinContext = createContext<CoinContextType | null>(null);

export function CoinProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [symbol, setSymbol] = useState("bitcoin");

  return (
    <CoinContext.Provider value={{ symbol, setSymbol }}>
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