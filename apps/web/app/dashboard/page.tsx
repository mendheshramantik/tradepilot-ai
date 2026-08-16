import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import MarketCard from "@/components/dashboard/MarketCard";
import LiveMarket from "@/components/dashboard/LiveMarket";
import Watchlist from "@/components/dashboard/Watchlist";
import AIAnalysis from "@/components/dashboard/AIAnalysis";
import NewsPanel from "@/components/dashboard/NewsPanel";
import PriceChart from "@/components/dashboard/PriceChart";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Topbar />

        <main className="grid gap-6 p-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <MarketCard />
            <PriceChart />
            <LiveMarket />
            <AIAnalysis />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Watchlist />
            <NewsPanel />
          </div>
        </main>
      </div>
    </div>
  );
}