export default function Hero() {
  return (
    <section className="min-h-[90vh] bg-slate-950 text-white flex items-center">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">

        <div>
          <span className="inline-block rounded-full bg-blue-600/20 px-4 py-2 text-blue-400 text-sm">
            🚀 AI Trading Copilot
          </span>

          <h1 className="mt-8 text-6xl font-extrabold leading-tight">
            Trade Smarter.
            <br />
            Not Harder.
          </h1>

          <p className="mt-6 text-lg text-slate-400">
            AI-powered market analysis, technical insights,
            news summaries and risk management in one platform.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700">
              Start Free
            </button>

            <button className="rounded-xl border border-slate-700 px-6 py-3 hover:border-blue-500">
              Live Demo
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold mb-6">
            AI Market Analysis
          </h2>

          <div className="space-y-4">

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-slate-400">Trend</p>
              <h3 className="text-green-400 text-xl font-bold">
                Bullish ↑
              </h3>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-slate-400">Support</p>
              <h3>$108,500</h3>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-slate-400">Resistance</p>
              <h3>$112,000</h3>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-slate-400">Risk</p>
              <h3 className="text-yellow-400">
                Medium
              </h3>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}