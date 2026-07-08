export default function Navbar() {
  return (
    <nav className="bg-slate-950 border-b border-slate-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-white">
          TradePilot AI
        </h1>

        <div className="hidden md:flex gap-6 text-slate-300">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">About</a>
        </div>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Get Started
        </button>
      </div>
    </nav>
  );
}