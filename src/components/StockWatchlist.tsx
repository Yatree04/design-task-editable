import React from 'react';
import { Holding } from '../types';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';

interface StockWatchlistProps {
  holdings: Holding[];
  searchQuery?: string;
  onSelectHolding?: (holding: Holding) => void;
  currency: 'INR' | 'USD';
}

export const StockWatchlist: React.FC<StockWatchlistProps> = ({
  holdings,
  searchQuery = '',
  onSelectHolding,
  currency,
}) => {
  // Filter by search query if any
  const filteredHoldings = holdings.filter((h) =>
    h.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Take the top 6 holdings as drawn in the wireframe
  const displayStocks = filteredHoldings.slice(0, 6);

  const formatPrice = (price: number) => {
    if (currency === 'INR') {
      return `₹${(price * 83.2).toFixed(1)}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatPnL = (pnl: number) => {
    const isPositive = pnl >= 0;
    const millions = Math.abs(pnl) / 1000000;
    if (currency === 'INR') {
      return `${isPositive ? '+' : '-'}₹${(millions * 83.2).toFixed(1)}M`;
    }
    return `${isPositive ? '+' : '-'}$${millions.toFixed(1)}M`;
  };

  return (
    <div className="space-y-2">
      {displayStocks.length === 0 ? (
        <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
          No stocks match your query "{searchQuery}"
        </div>
      ) : (
        displayStocks.map((stock, idx) => {
          const isPositive = stock.unrealizedPnL >= 0;
          return (
            <div
              key={stock.id || idx}
              onClick={() => onSelectHolding && onSelectHolding(stock)}
              className="bg-white hover:bg-slate-50 border border-border rounded-lg p-2.5 transition-all cursor-pointer shadow-2xs group flex items-center justify-between text-xs"
            >
              {/* Column 1: Stock Name / Ticker */}
              <div className="flex items-center gap-2 min-w-[90px]">
                <div className="w-1.5 h-6 rounded-full bg-primary/80 group-hover:bg-primary transition-colors" />
                <div>
                  <span className="font-bold text-foreground block tracking-tight font-mono">
                    {stock.ticker}
                  </span>
                  <span className="text-[10px] text-muted-foreground block truncate max-w-[80px]">
                    {stock.name}
                  </span>
                </div>
              </div>

              {/* Vertical divider */}
              <div className="h-5 w-px bg-border/70 hidden sm:block" />

              {/* Column 2: Price */}
              <div className="text-right px-2">
                <span className="font-mono text-foreground font-semibold block text-[11px]">
                  {formatPrice(stock.price)}
                </span>
                <span className="text-[10px] text-muted-foreground block font-mono">
                  {stock.side}
                </span>
              </div>

              {/* Vertical divider */}
              <div className="h-5 w-px bg-border/70 hidden sm:block" />

              {/* Column 3: Change / Weight */}
              <div className="text-right px-2">
                <div className={`font-mono text-[11px] font-semibold flex items-center justify-end ${
                  isPositive ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {isPositive ? <ArrowUpRight className="w-3 h-3 inline" /> : <ArrowDownRight className="w-3 h-3 inline" />}
                  {stock.unrealizedPnLPct > 0 ? `+${stock.unrealizedPnLPct}%` : `${stock.unrealizedPnLPct}%`}
                </div>
                <span className="text-[10px] text-muted-foreground block font-mono">
                  Wt: {stock.weightPct}%
                </span>
              </div>

              {/* Vertical divider */}
              <div className="h-5 w-px bg-border/70 hidden sm:block" />

              {/* Column 4: Unrealized P&L */}
              <div className="text-right min-w-[70px]">
                <span className={`font-mono text-[11px] font-bold block ${
                  isPositive ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {formatPnL(stock.unrealizedPnL)}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  β: {stock.beta}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
