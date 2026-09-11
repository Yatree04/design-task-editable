import React from 'react';
import { Fund, ViewTab } from '../types';
import { 
  BarChart3, 
  Layers, 
  ShieldAlert, 
  SlidersHorizontal, 
  ClipboardList, 
  Activity,
  ArrowUpRight,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  funds: Fund[];
  selectedFund: Fund;
  onSelectFund: (fund: Fund) => void;
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  isSimulating: boolean;
  onToggleSimulate: () => void;
  onOpenTradeBlotter: () => void;
  pendingTradesCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  funds,
  selectedFund,
  onSelectFund,
  activeTab,
  onSelectTab,
  isSimulating,
  onToggleSimulate,
  onOpenTradeBlotter,
  pendingTradesCount,
  theme,
  onToggleTheme,
}) => {
  const totalAum = funds.reduce((acc, f) => acc + f.aumMillions, 0);

  return (
    <header className="border-b border-border bg-card/90 backdrop-blur sticky top-0 z-40 transition-colors">
      {/* Top utility row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-muted-foreground uppercase tracking-wider text-[11px]">
              D. E. Shaw Engine • NY4 Colo Node 04
            </span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>Firm AUM:</span>
            <span className="font-mono font-semibold text-foreground">${(totalAum / 1000).toFixed(2)}B</span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>Agg. 1Y Alpha:</span>
            <span className="font-mono font-semibold text-emerald-500 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +19.8%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSimulate}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 border ${
              isSimulating
                ? 'bg-primary/15 text-primary border-primary/50 ring-1 ring-primary/30 font-semibold'
                : 'bg-white text-muted-foreground border-border hover:text-foreground hover:bg-slate-50'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-primary" />
            {isSimulating ? 'SIMULATION MODE (ACTIVE)' : 'LIVE PRODUCTION'}
          </button>

          <button
            onClick={onOpenTradeBlotter}
            className="relative px-2.5 py-1 rounded text-xs font-mono bg-white hover:bg-slate-50 text-foreground border border-border flex items-center gap-1.5 transition"
          >
            <ClipboardList className="w-3.5 h-3.5 text-primary" />
            Trade Blotter
            {pendingTradesCount > 0 && (
              <span className="bg-primary text-primary-foreground font-bold px-1.5 rounded-full text-[10px]">
                {pendingTradesCount}
              </span>
            )}
          </button>

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-1.5 rounded-md bg-white hover:bg-slate-50 text-foreground border border-border transition flex items-center justify-center"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center font-serif text-foreground font-bold text-lg shadow-xs">
              D<span className="text-primary font-serif">S</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-foreground tracking-wide text-base">D. E. SHAW &amp; CO.</span>
                <span className="bg-primary/10 text-primary text-[10px] font-mono px-1.5 py-0.5 rounded border border-primary/20 font-semibold">
                  DECISION TOOL (DT)
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Institutional Quantitative Investment Funds Management</p>
            </div>
          </div>

          {/* Fund Switcher Dropdown */}
          <div className="relative ml-2">
            <label htmlFor="fund-selector" className="sr-only">Select Fund</label>
            <select
              id="fund-selector"
              value={selectedFund.id}
              onChange={(e) => {
                const found = funds.find((f) => f.id === e.target.value);
                if (found) onSelectFund(found);
              }}
              className="bg-white border border-border rounded-md px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring pr-8 cursor-pointer shadow-xs"
            >
              {funds.map((f) => (
                <option key={f.id} value={f.id} className="bg-white text-foreground">
                  {f.name} (AUM: ${(f.aumMillions).toLocaleString()}M)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center space-x-1 border border-border bg-white p-1 rounded-lg">
          <button
            onClick={() => onSelectTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-primary font-semibold shadow-xs border border-border'
                : 'text-muted-foreground hover:text-foreground hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-primary" />
            Fund Overview
          </button>
          
          <button
            onClick={() => onSelectTab('holdings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'holdings'
                ? 'bg-white text-primary font-semibold shadow-xs border border-border'
                : 'text-muted-foreground hover:text-foreground hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-primary" />
            Holdings &amp; Risk
          </button>

          <button
            onClick={() => onSelectTab('scenarios')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'scenarios'
                ? 'bg-white text-primary font-semibold shadow-xs border border-border'
                : 'text-muted-foreground hover:text-foreground hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-primary" />
            Stress Testing
          </button>

          <button
            onClick={() => onSelectTab('optimizer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'optimizer'
                ? 'bg-white text-primary font-semibold shadow-xs border border-border'
                : 'text-muted-foreground hover:text-foreground hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            Capital Allocation (DT)
          </button>
        </nav>
      </div>
    </header>
  );
};
