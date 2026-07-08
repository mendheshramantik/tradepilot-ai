const news = [
  "Bitcoin breaks above key resistance level.",
  "Ethereum ETF inflows continue to rise.",
  "Solana ecosystem sees growing adoption.",
];

export default function NewsPanel() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-bold text-white">
        📰 Market News
      </h2>

      <ul className="space-y-4 text-slate-300">
        {news.map((item) => (
          <li key={item} className="border-b border-slate-800 pb-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}