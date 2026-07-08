export default function MarketCard() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-bold text-white">BTC/USDT</h2>

      <div className="mt-6 grid grid-cols-2 gap-6">

        <div>
          <p className="text-slate-400">Current Price</p>
          <h3 className="text-3xl font-bold text-green-400">
            $109,250
          </h3>
        </div>

        <div>
          <p className="text-slate-400">Trend</p>
          <h3 className="text-2xl font-bold text-green-400">
            Bullish 📈
          </h3>
        </div>

        <div>
          <p className="text-slate-400">Support</p>
          <h3 className="text-xl font-semibold">
            $108,500
          </h3>
        </div>

        <div>
          <p className="text-slate-400">Resistance</p>
          <h3 className="text-xl font-semibold">
            $112,000
          </h3>
        </div>

      </div>
    </div>
  );
}