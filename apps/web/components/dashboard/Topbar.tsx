"use client";

import { useState } from "react";

export default function Topbar() {
  const [symbol, setSymbol] = useState("");

  function handleSearch() {
    alert(`Searching for ${symbol}`);
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-8 py-4">
      <h2 className="text-2xl font-bold text-white">
        Dashboard
      </h2>

      <div className="flex gap-3">
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="BTC, ETH..."
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