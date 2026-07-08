const features = [
  {
    title: "AI Market Analysis",
    description:
      "Get instant AI-powered market insights with trend, support, resistance, and sentiment.",
    icon: "📈",
  },
  {
    title: "News Intelligence",
    description:
      "Summarized global financial news that actually matters for your trades.",
    icon: "📰",
  },
  {
    title: "Risk Management",
    description:
      "Calculate position size and risk before entering every trade.",
    icon: "🛡️",
  },
  {
    title: "Trading Journal",
    description:
      "Track every trade and let AI identify your strengths and weaknesses.",
    icon: "📒",
  },
  {
    title: "Watchlist",
    description:
      "Monitor your favorite markets from one beautiful dashboard.",
    icon: "⭐",
  },
  {
    title: "Portfolio Insights",
    description:
      "Understand your portfolio performance with AI-generated reports.",
    icon: "💼",
  },
];

export default function Features() {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-5xl font-bold">
          Everything a Trader Needs
        </h2>

        <p className="mt-6 text-center text-slate-400">
          Built for modern traders using AI.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-8 hover:border-blue-500 transition"
            >
              <div className="text-5xl">{feature.icon}</div>

              <h3 className="mt-6 text-2xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-4 text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}