import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import MarketCard from "@/components/dashboard/MarketCard";
import Watchlist from "@/components/dashboard/Watchlist";
import NewsPanel from "@/components/dashboard/NewsPanel";
import LiveMarket from "@/components/dashboard/LiveMarket";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="grid gap-6 p-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <MarketCard />
            <LiveMarket />
          </div>

          <Watchlist />

          <div className="lg:col-span-3">
            <NewsPanel />
          </div>
        </main>
      </div>
    </div>
  );
}