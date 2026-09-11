import React, { useState, useMemo } from 'react';
import { Fund, Holding, AssetClass, TradeOrder } from '../types';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Layers, 
  DollarSign, 
  CheckCircle,
  X,
  Sparkles
} from 'lucide-react';
import { Badge } from './ui/badge';

interface HoldingsViewProps {
  fund: Fund;
  onAddHolding: (newHolding: Holding, order: TradeOrder) => void;
  onRemoveHolding: (holdingId: string) => void;
}

export const HoldingsView: React.FC<HoldingsViewProps> = ({
  fund,
  onAddHolding,
  onRemoveHolding,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('ALL');
  const [selectedSide, setSelectedSide] = useState<'ALL' | 'Long' | 'Short'>('ALL');
  const [sortField, setSortField] = useState<keyof Holding>('weightPct');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for adding a position
  const [newTicker, setNewTicker] = useState('');
  const [newName, setNewName] = useState('');
  const [newAssetClass, setNewAssetClass] = useState<AssetClass>('Equities');
  const [newSector, setNewSector] = useState('Information Technology');
  const [newSide, setNewSide] = useState<'Long' | 'Short'>('Long');
  const [newShares, setNewShares] = useState<number>(100000);
  const [newPrice, setNewPrice] = useState<number>(150);

  const filteredHoldings = useMemo(() => {
    return fund.holdings
      .filter((h) => {
        const matchesSearch =
          h.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.sector.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesAsset = selectedAssetClass === 'ALL' || h.assetClass === selectedAssetClass;
        const matchesSide = selectedSide === 'ALL' || h.side === selectedSide;
        return matchesSearch && matchesAsset && matchesSide;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [fund.holdings, searchQuery, selectedAssetClass, selectedSide, sortField, sortAsc]);

  const handleSort = (field: keyof Holding) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const totalLongValue = fund.holdings
    .filter((h) => h.side === 'Long')
    .reduce((sum, h) => sum + h.marketValue, 0);

  const totalShortValue = fund.holdings
    .filter((h) => h.side === 'Short')
    .reduce((sum, h) => sum + h.marketValue, 0);

  const handleAddPositionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker || newShares <= 0 || newPrice <= 0) return;

    const marketValue = newShares * newPrice;
    const totalFundValue = fund.aumMillions * 1000000;
    const weightPct = Number(((marketValue / totalFundValue) * 100).toFixed(2));

    const newH: Holding = {
      id: `h-dyn-${Date.now()}`,
      ticker: newTicker.toUpperCase().trim(),
      name: newName || `${newTicker.toUpperCase()} Position`,
      assetClass: newAssetClass,
      sector: newSector,
      side: newSide,
      shares: newShares,
      price: newPrice,
      marketValue,
      weightPct,
      unrealizedPnL: 0,
      unrealizedPnLPct: 0,
      beta: 1.0,
      varContribution: Number((weightPct * 0.05).toFixed(2)),
    };

    const newOrder: TradeOrder = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      fundId: fund.id,
      ticker: newTicker.toUpperCase().trim(),
      name: newH.name,
      side: newSide === 'Long' ? 'BUY' : 'SELL',
      shares: newShares,
      targetPrice: newPrice,
      status: 'SIMULATED',
      rationale: `Direct portfolio allocation test initiated by PM`,
    };

    onAddHolding(newH, newOrder);
    setIsModalOpen(false);
    // Reset
    setNewTicker('');
    setNewName('');
    setNewShares(100000);
    setNewPrice(150);
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Exposure Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card p-3.5 rounded-lg border border-border shadow-xs transition-colors">
          <span className="text-[11px] text-muted-foreground font-medium">Total Long Exposure</span>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-lg font-bold text-emerald-500">
              ${(totalLongValue / 1000000).toFixed(1)}M
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            {fund.holdings.filter((h) => h.side === 'Long').length} Active Long Positions
          </span>
        </div>

        <div className="bg-card p-3.5 rounded-lg border border-border shadow-xs transition-colors">
          <span className="text-[11px] text-muted-foreground font-medium">Total Short Exposure</span>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-lg font-bold text-rose-500">
              ${(totalShortValue / 1000000).toFixed(1)}M
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            {fund.holdings.filter((h) => h.side === 'Short').length} Active Short Hedges
          </span>
        </div>

        <div className="bg-card p-3.5 rounded-lg border border-border shadow-xs transition-colors">
          <span className="text-[11px] text-muted-foreground font-medium">Net Market Delta</span>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-lg font-bold text-primary">
              ${((totalLongValue - totalShortValue) / 1000000).toFixed(1)}M
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">Net Beta Exposure: {fund.netExposurePct}%</span>
        </div>

        <div className="bg-card p-3.5 rounded-lg border border-border shadow-xs transition-colors">
          <span className="text-[11px] text-muted-foreground font-medium">Long / Short Ratio</span>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-lg font-bold text-foreground">
              {totalShortValue > 0 ? (totalLongValue / totalShortValue).toFixed(2) : 'N/A'}x
            </span>
          </div>
          <span className="text-[11px] text-emerald-500 font-mono">Risk Neutrality Guard OK</span>
        </div>
      </div>

      {/* AI Holdings Screening Insight */}
      <div className="relative overflow-hidden bg-card border border-primary/30 rounded-lg p-3.5 shadow-xs ring-1 ring-primary/15 transition-all">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/70 to-transparent" />
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-foreground">AI Factor & Liquidity Screening</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px] font-mono px-1.5 py-0 font-bold">
                AI INSIGHT
              </Badge>
              <span className="text-[10px] font-mono text-muted-foreground ml-auto">
                Model: Cross-Asset Statistical Arbitrage Engine
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              All active holdings in {fund.name} comply with pre-trade risk thresholds. Net beta is hedged to {fund.netExposurePct}% with Long/Short ratio maintained at {totalShortValue > 0 ? (totalLongValue / totalShortValue).toFixed(2) : '1.00'}x to dampen systemic market drawdown risks.
            </p>
          </div>
        </div>
      </div>

      {/* Table Controls & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-lg border border-border shadow-xs transition-colors">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ticker, name, or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border border-border rounded-md pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-64 shadow-xs"
            />
          </div>

          {/* Asset Class Filter */}
          <select
            value={selectedAssetClass}
            onChange={(e) => setSelectedAssetClass(e.target.value)}
            className="bg-background border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring shadow-xs"
          >
            <option value="ALL">All Asset Classes</option>
            <option value="Equities">Equities</option>
            <option value="Fixed Income">Fixed Income</option>
            <option value="Quantitative Derivatives">Quantitative Derivatives</option>
            <option value="Commodities">Commodities</option>
            <option value="FX & Currencies">FX & Currencies</option>
          </select>

          {/* Side Filter */}
          <div className="flex items-center space-x-1 bg-white p-0.5 rounded-md border border-border text-xs">
            {(['ALL', 'Long', 'Short'] as const).map((side) => (
              <button
                key={side}
                onClick={() => setSelectedSide(side)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition ${
                  selectedSide === side
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {side}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add / Simulate Position
        </button>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden shadow-xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white text-muted-foreground border-b border-border font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('ticker')}>
                  <div className="flex items-center gap-1">
                    Ticker / Name
                    <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('side')}>
                  Side
                </th>
                <th className="py-3 px-3">Asset Class / Sector</th>
                <th className="py-3 px-3 text-right cursor-pointer" onClick={() => handleSort('shares')}>
                  Shares / Notional
                </th>
                <th className="py-3 px-3 text-right cursor-pointer" onClick={() => handleSort('price')}>
                  Price (USD)
                </th>
                <th className="py-3 px-3 text-right cursor-pointer" onClick={() => handleSort('marketValue')}>
                  Market Value
                </th>
                <th className="py-3 px-3 text-right cursor-pointer" onClick={() => handleSort('weightPct')}>
                  Weight %
                </th>
                <th className="py-3 px-3 text-right cursor-pointer" onClick={() => handleSort('unrealizedPnL')}>
                  Unrealized P&amp;L
                </th>
                <th className="py-3 px-3 text-right cursor-pointer" onClick={() => handleSort('beta')}>
                  Beta
                </th>
                <th className="py-3 px-3 text-right cursor-pointer" onClick={() => handleSort('varContribution')}>
                  VaR Contrib
                </th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground font-mono">
              {filteredHoldings.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-muted-foreground">
                    No holdings found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredHoldings.map((h) => {
                  const isPositive = h.unrealizedPnL >= 0;
                  return (
                    <tr key={h.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-foreground flex items-center gap-2">
                          <span className="text-primary font-semibold">{h.ticker}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-sans truncate block max-w-xs">
                          {h.name}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            h.side === 'Long'
                              ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-700 border border-rose-500/30'
                          }`}
                        >
                          {h.side}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-foreground font-sans block">{h.assetClass}</span>
                        <span className="text-[10px] text-muted-foreground font-sans">{h.sector}</span>
                      </td>

                      <td className="py-3 px-3 text-right text-muted-foreground">
                        {h.shares.toLocaleString()}
                      </td>

                      <td className="py-3 px-3 text-right text-foreground font-semibold">
                        ${h.price < 2 ? h.price.toFixed(4) : h.price.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-foreground">
                        ${(h.marketValue / 1000000).toFixed(2)}M
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="font-semibold text-primary">{h.weightPct.toFixed(2)}%</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className={`block font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {isPositive ? `+$${(h.unrealizedPnL / 1000000).toFixed(2)}M` : `-$${(Math.abs(h.unrealizedPnL) / 1000000).toFixed(2)}M`}
                        </span>
                        <span className={`text-[10px] block ${isPositive ? 'text-emerald-500/80' : 'text-rose-500/80'}`}>
                          {isPositive ? `+${h.unrealizedPnLPct}%` : `${h.unrealizedPnLPct}%`}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right text-muted-foreground">
                        {h.beta.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className={`font-mono text-[11px] ${h.varContribution > 0.15 ? 'text-primary' : 'text-muted-foreground'}`}>
                          {h.varContribution > 0 ? `+${h.varContribution}%` : `${h.varContribution}%`}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onRemoveHolding(h.id)}
                          title="Liquidate / Remove simulated position"
                          className="px-2 py-1 rounded bg-white hover:bg-destructive/20 text-muted-foreground hover:text-destructive text-[11px] transition border border-border"
                        >
                          Liquidate
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Adding / Simulating Position */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl transition-colors">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Simulate New Holding / Position</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPositionSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-mono mb-1">Ticker Symbol</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AMD, US02Y, Brent"
                    value={newTicker}
                    onChange={(e) => setNewTicker(e.target.value)}
                    className="w-full bg-background border border-border rounded px-3 py-1.5 text-foreground uppercase font-mono focus:outline-none focus:border-primary shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-mono mb-1">Position Side</label>
                  <select
                    value={newSide}
                    onChange={(e) => setNewSide(e.target.value as 'Long' | 'Short')}
                    className="w-full bg-background border border-border rounded px-3 py-1.5 text-foreground focus:outline-none focus:border-primary shadow-xs"
                  >
                    <option value="Long">Long (Alpha / Carry)</option>
                    <option value="Short">Short (Hedge / Arbitrage)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-mono mb-1">Security / Instrument Name</label>
                <input
                  type="text"
                  placeholder="e.g. Advanced Micro Devices Quantitative Long"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-background border border-border rounded px-3 py-1.5 text-foreground focus:outline-none focus:border-primary shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-mono mb-1">Asset Class</label>
                  <select
                    value={newAssetClass}
                    onChange={(e) => setNewAssetClass(e.target.value as AssetClass)}
                    className="w-full bg-background border border-border rounded px-3 py-1.5 text-foreground focus:outline-none focus:border-primary shadow-xs"
                  >
                    <option value="Equities">Equities</option>
                    <option value="Fixed Income">Fixed Income</option>
                    <option value="Quantitative Derivatives">Quantitative Derivatives</option>
                    <option value="Commodities">Commodities</option>
                    <option value="FX & Currencies">FX & Currencies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-muted-foreground font-mono mb-1">Sector / Sub-Category</label>
                  <input
                    type="text"
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    className="w-full bg-background border border-border rounded px-3 py-1.5 text-foreground focus:outline-none focus:border-primary shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-mono mb-1">Shares / Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newShares}
                    onChange={(e) => setNewShares(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded px-3 py-1.5 text-foreground font-mono focus:outline-none focus:border-primary shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-mono mb-1">Execution Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.001"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded px-3 py-1.5 text-foreground font-mono focus:outline-none focus:border-primary shadow-xs"
                  />
                </div>
              </div>

              <div className="bg-white p-3 rounded-md border border-border text-[11px] text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Simulated Notional Value:</span>
                  <span className="font-mono text-foreground font-semibold">
                    ${((newShares * newPrice) / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Portfolio Weight:</span>
                  <span className="font-mono text-primary font-semibold">
                    {(((newShares * newPrice) / (fund.aumMillions * 1000000)) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs transition"
                >
                  Simulate &amp; Commit Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
