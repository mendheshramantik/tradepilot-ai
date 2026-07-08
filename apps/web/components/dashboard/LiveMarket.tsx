import { getMarketData } from "@/lib/api/coingecko";

export default async function LiveMarket() {
  const data = await getMarketData();

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-500 bg-red-500/10 p-6 text-red-400">
        Failed to load market data.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">
      <h2 className="mb-6 text-2xl font-bold text-white">
        📈 Live Market Data
      </h2>

      <div className="space-y-5">

        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-slate-300 font-medium">Bitcoin</span>
          <span className="font-bold text-green-400">
            ${data.bitcoin.usd} ({data.bitcoin.usd_24h_change.toFixed(2)}%)
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-slate-300 font-medium">Ethereum</span>
          <span className="font-bold text-blue-400">
            ${data.ethereum.usd} ({data.ethereum.usd_24h_change.toFixed(2)}%)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-medium">Solana</span>
          <span className="font-bold text-purple-400">
            ${data.solana.usd} ({data.solana.usd_24h_change.toFixed(2)}%)
          </span>
        </div>

      </div>
    </div>
  );
}