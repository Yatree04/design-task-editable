import React, { useState } from 'react';
import { TradeOrder } from '../types';
import { 
  ClipboardList, 
  X, 
  CheckCheck, 
  Download, 
  Trash2, 
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface TradeBlotterModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: TradeOrder[];
  onExecuteAllSimulated: () => void;
  onClearOrders: () => void;
}

export const TradeBlotterModal: React.FC<TradeBlotterModalProps> = ({
  isOpen,
  onClose,
  orders,
  onExecuteAllSimulated,
  onClearOrders,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ALL') return true;
    return o.status === filterStatus;
  });

  const simulatedCount = orders.filter((o) => o.status === 'SIMULATED').length;

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Timestamp', 'Fund', 'Ticker', 'Side', 'Shares', 'Price', 'Notional', 'Status', 'Rationale'];
    const rows = orders.map((o) => [
      o.id,
      o.timestamp,
      o.fundId,
      o.ticker,
      o.side,
      o.shares,
      o.targetPrice,
      (o.shares * o.targetPrice).toFixed(2),
      o.status,
      `"${o.rationale.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `deshaw-trade-blotter-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <Card className="rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-xl p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-white">
          <div className="flex items-center gap-2.5">
            <ClipboardList className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                D. E. Shaw OMS • Real-Time Trade Blotter
                {simulatedCount > 0 && (
                  <Badge variant="default" className="text-[10px] font-mono py-0.5">
                    {simulatedCount} Simulated Pending Execution
                  </Badge>
                )}
              </h2>
              <p className="text-[11px] text-muted-foreground">Electronic order management &amp; allocation audit trail</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Toolbar */}
        <div className="p-3 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-card text-xs">
          <div className="flex items-center space-x-1 font-mono">
            {(['ALL', 'SIMULATED', 'EXECUTED'] as const).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={`h-7 px-2.5 text-[11px] ${
                  filterStatus === status ? 'font-bold border border-border' : ''
                }`}
              >
                {status} ({orders.filter((o) => status === 'ALL' || o.status === status).length})
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {simulatedCount > 0 && (
              <Button
                size="sm"
                onClick={onExecuteAllSimulated}
                className="h-8 gap-1.5 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Approve &amp; Execute All ({simulatedCount})
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="h-8 gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearOrders}
              className="h-8 gap-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-y-auto flex-1 p-4 bg-background">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[10px] text-muted-foreground border-b border-border uppercase">
              <tr>
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Ticker / Side</th>
                <th className="py-2.5 px-3 text-right">Shares</th>
                <th className="py-2.5 px-3 text-right">Price</th>
                <th className="py-2.5 px-3 text-right">Notional</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 font-sans">Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground font-sans">
                    No orders logged in blotter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-primary font-medium">{ord.id}</td>
                    <td className="py-2.5 px-3 text-muted-foreground text-[11px]">{ord.timestamp}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-foreground mr-2">{ord.ticker}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          ord.side === 'BUY'
                            ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
                        }`}
                      >
                        {ord.side}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-foreground">
                      {ord.shares.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-foreground">
                      ${ord.targetPrice.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-foreground">
                      ${((ord.shares * ord.targetPrice) / 1000000).toFixed(2)}M
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          ord.status === 'EXECUTED'
                            ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30'
                            : 'bg-primary/10 text-primary border border-primary/30'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground font-sans text-[11px] truncate max-w-xs">
                      {ord.rationale}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-white text-xs text-muted-foreground flex items-center justify-between">
          <span>Routing: Direct Market Access (DMA) • FIX 4.4 Engine</span>
          <span className="font-mono text-emerald-700 font-semibold">FIX Session: Connected</span>
        </div>
      </Card>
    </div>
  );
};
