"use client";

import { useState } from "react";
import { useCoin } from "@/context/CoinContext";

const coinMap: Record<string, string> = {
  btc: "bitcoin",
  eth: "ethereum",
  sol: "solana",
  xrp: "ripple",
  ada: "cardano",
};

export default function Topbar() {
  const [input, setInput] = useState("");

  const { setCoin } = useCoin();

  function handleSearch() {
    const value = input.trim().toLowerCase();

    if (!value) return;

    setCoin(coinMap[value] || value);

    setInput("");
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-8 py-4">
      <h2 className="text-2xl font-bold text-white">
        Dashboard
      </h2>

      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="BTC, ETH, SOL..."
          className="rounded-lg bg-slate-800 px-4 py-2 text-white outline-none"
        />

        <button
          onClick={handleSearch}
          className="rounded-lg bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </header>
  );
}