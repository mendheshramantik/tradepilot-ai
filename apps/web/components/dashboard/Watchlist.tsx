const coins = [
  { symbol: "BTC", price: "$109,250", change: "+2.35%" },
  { symbol: "ETH", price: "$3,780", change: "+1.82%" },
  { symbol: "SOL", price: "$182", change: "+4.20%" },
  { symbol: "XRP", price: "$0.72", change: "-0.81%" },
];

export default function Watchlist() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-bold text-white">
        ⭐ Watchlist
      </h2>

      <div className="space-y-4">
        {coins.map((coin) => (
          <div
            key={coin.symbol}
            className="flex items-center justify-between border-b border-slate-800 pb-3"
          >
            <div>
              <h3 className="font-semibold text-white">{coin.symbol}</h3>
              <p className="text-sm text-slate-400">{coin.price}</p>
            </div>

            <span
              className={`font-semibold ${
                coin.change.startsWith("+")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {coin.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}