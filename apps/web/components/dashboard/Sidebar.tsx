export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-6">
      <h1 className="text-2xl font-bold text-white mb-10">
        TradePilot AI
      </h1>

      <nav className="space-y-4 text-slate-300">
        <a href="#" className="block hover:text-white">
          📊 Dashboard
        </a>

        <a href="#" className="block hover:text-white">
          ⭐ Watchlist
        </a>

        <a href="#" className="block hover:text-white">
          🤖 AI Analysis
        </a>

        <a href="#" className="block hover:text-white">
          📰 News
        </a>

        <a href="#" className="block hover:text-white">
          ⚙ Settings
        </a>
      </nav>
    </aside>
  );
}