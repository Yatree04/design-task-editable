import React, { useState } from 'react';
import { Fund, Holding } from '../types';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowUp,
  ExternalLink, 
  Sparkles,
  SendHorizontal,
  ChevronRight,
  Bot
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from 'recharts';
import { AIOptimizerWindow, StrategyIdea } from './AIOptimizerWindow';
import { ResizableSplit } from './ui/ResizableSplit';
import { ResizableCard } from './ui/ResizableCard';

interface OverviewViewProps {
  fund: Fund;
  isSimulating: boolean;
  onNavigateToOptimizer: () => void;
  onNavigateToScenarios: () => void;
  onNavigateToHoldings?: () => void;
  onNavigateToAgentWorkspace?: () => void;
  currency?: 'INR' | 'USD';
  searchQuery?: string;
  onSelectHolding?: (holding: Holding) => void;
  onExecuteAgentCommand?: (cmd: string) => void;
  onExperimentInAgentWorkspace?: (strategy: StrategyIdea) => void;
}

// Sparkline SVG component for the holdings card
const Sparkline: React.FC<{ points: number[]; isPositive: boolean }> = ({ points, isPositive }) => {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 64;
  const height = 18;

  const pathData = points
    .map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const strokeColor = isPositive ? '#16a34a' : '#e11d48';

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const OverviewView: React.FC<OverviewViewProps> = ({
  fund,
  isSimulating,
  onNavigateToOptimizer,
  onNavigateToScenarios,
  onNavigateToHoldings,
  onNavigateToAgentWorkspace,
  currency = 'INR',
  searchQuery = '',
  onSelectHolding,
  onExecuteAgentCommand,
  onExperimentInAgentWorkspace,
}) => {
  // Chart Tabs: [Overview] [P&L] [Sandbox] [AI]
  const [activeChartTab, setActiveChartTab] = useState<'Overview' | 'P&L' | 'Sandbox' | 'AI'>('Overview');
  // Timeframe pills: [1y] [3y] [5y]
  const [activePeriod, setActivePeriod] = useState<'1y' | '3y' | '5y'>('1y');

  // Agent command bar input state
  const [agentInput, setAgentInput] = useState('');

  // Team Updates chat state
  const [teamMessages, setTeamMessages] = useState([
    {
      id: 'msg-1',
      sender: 'Sarah K.',
      avatar: 'SK',
      avatarBg: 'bg-blue-600',
      time: '09:42',
      text: 'Approved AAPL add — increasing to 8.5% weight. Risk confirms within limits.',
      isAi: false,
    },
    {
      id: 'msg-2',
      sender: 'AI Insight',
      avatar: 'AI',
      avatarBg: 'bg-purple-600',
      time: '09:51',
      text: 'Based on current momentum, NVDA rebalance recommended within 48h to stay within mandate.',
      isAi: true,
    },
  ]);
  const [newUpdateText, setNewUpdateText] = useState('');

  // Monthly 10B NAV curve data matching the screenshot
  // Points start ~6B, dip slightly in Mar, and ascend to ~8.5B in Dec
  const chartPoints = [
    { month: 'Jan', val: 6.0 },
    { month: 'Feb', val: 6.2 },
    { month: 'Mar', val: 5.9 },
    { month: 'Apr', val: 6.7 },
    { month: 'May', val: 7.3 },
    { month: 'Jun', val: 7.5 },
    { month: 'Jul', val: 7.4 },
    { month: 'Aug', val: 7.9 },
    { month: 'Sep', val: 8.3 },
    { month: 'Oct', val: 8.1 },
    { month: 'Nov', val: 8.4 },
    { month: 'Dec', val: 8.5 },
  ];

  // Adjust chart data based on active tab for interactive responsiveness
  const displayChartData = React.useMemo(() => {
    if (activeChartTab === 'P&L') {
      return chartPoints.map(p => ({ ...p, val: Number((p.val - 5.0).toFixed(2)) }));
    }
    if (activeChartTab === 'Sandbox') {
      return chartPoints.map((p, idx) => ({ ...p, val: Number((p.val + (idx > 6 ? 0.8 : 0)).toFixed(2)) }));
    }
    if (activeChartTab === 'AI') {
      return chartPoints.map((p, idx) => ({ ...p, val: Number((p.val * (1 + (idx * 0.02))).toFixed(2)) }));
    }
    return chartPoints;
  }, [activeChartTab]);

  // Holdings list exactly matching the screenshot
  const holdingsList = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: '198.42',
      change: '+1.09%',
      isPositive: true,
      sparkline: [30, 31, 29, 34, 33, 38, 41, 45],
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: '412.17',
      change: '+1.43%',
      isPositive: true,
      sparkline: [35, 37, 36, 40, 39, 44, 46, 50],
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      price: '134.76',
      change: '-2.33%',
      isPositive: false,
      sparkline: [48, 46, 47, 43, 40, 37, 34, 30],
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: '185.30',
      change: '+0.91%',
      isPositive: true,
      sparkline: [26, 27, 28, 27, 30, 31, 32, 35],
    },
    {
      symbol: 'GLD',
      name: 'SPDR Gold Trust',
      price: '228.94',
      change: '+0.21%',
      isPositive: true,
      sparkline: [22, 22, 23, 23, 24, 24, 25, 26],
    },
    {
      symbol: 'TLT',
      name: 'iShares 20Y Treasu...',
      price: '88.12',
      change: '-1.06%',
      isPositive: false,
      sparkline: [32, 31, 30, 31, 29, 27, 26, 24],
    },
  ];

  // News updates exactly matching the screenshot
  const newsUpdates = [
    {
      id: 'news-1',
      tag: 'MACRO',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
      time: '2m ago',
      title: 'Fed signals dovish pivot as inflation cools to 2.3% — rate cut probability at 78% for December',
    },
    {
      id: 'news-2',
      tag: 'POSITION',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      time: '14m ago',
      title: 'NVDA earnings beat consensus by $0.18 EPS; guidance raised — AI Agent flagged pre-market momentum shift',
    },
    {
      id: 'news-3',
      tag: 'POSITION',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      time: '14m ago',
      title: 'NVDA earnings beat consensus by $0.18 EPS; guidance raised — AI Agent flagged pre-market momentum shift',
    },
  ];

  const handleSendMessage = () => {
    if (!newUpdateText.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'Yatri Patel',
      avatar: 'YP',
      avatarBg: 'bg-primary',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: newUpdateText.trim(),
      isAi: false,
    };
    setTeamMessages((prev) => [...prev, newMsg]);
    setNewUpdateText('');
  };

  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentInput.trim()) return;
    if (onExecuteAgentCommand) {
      onExecuteAgentCommand(agentInput);
    }
    // Also add an automated AI insight to Team Updates for instant feedback
    const aiResponse = {
      id: `ai-${Date.now()}`,
      sender: 'AI Insight',
      avatar: 'AI',
      avatarBg: 'bg-purple-600',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Command executed: "${agentInput}". Portfolio factor sensitivity and exposure limits verified within compliance constraints.`,
      isAi: true,
    };
    setTeamMessages((prev) => [...prev, aiResponse]);
    setAgentInput('');
  };

  return (
    <div className="space-y-3 sm:space-y-4 max-w-[1600px] mx-auto pb-6">
      {/* =========================================================================
          TOP ROW: 3 RESIZABLE COLUMNS (Overview Chart | Total Gain & Fund Ratio | Holdings)
         ========================================================================= */}
      <ResizableSplit
        direction="horizontal"
        initialSizes={[50, 25, 25]}
        minSizes={[25, 18, 18]}
        storageKey="overview_top_row_split"
        className="gap-3 sm:gap-4 items-stretch"
      >
        {/* ----------------- Column 1: Performance Area Chart (50% default) ----------------- */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs flex flex-col justify-between h-full">
          {/* Chart Header: [Overview] [P&L] [Sandbox] [AI]   and   [1y] [3y] [5y] */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            {/* Left segmented tabs */}
            <div className="flex items-center bg-white rounded-md p-0.5 border border-border text-xs font-medium">
              {(['Overview', 'P&L', 'Sandbox', 'AI'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveChartTab(tab)}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeChartTab === tab
                      ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Right timeframe period buttons */}
            <div className="flex items-center bg-white rounded-md p-0.5 border border-border text-xs font-mono font-medium">
              {(['1y', '3y', '5y'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setActivePeriod(period)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activePeriod === period
                      ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-slate-50'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Graphic Area */}
          <div className="h-[210px] sm:h-[230px] w-full mt-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayChartData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="navGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'monospace' }}
                />
                <YAxis 
                  domain={[0, 10]} 
                  ticks={[0, 3, 5, 8, 10]}
                  tickFormatter={(val) => `${val}B`}
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'monospace' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border p-2 rounded-md shadow-md text-xs font-mono text-popover-foreground">
                        <div className="font-bold text-primary">{d.month} 2025</div>
                        <div>Portfolio NAV: {d.val.toFixed(2)}B</div>
                        <div className="text-emerald-600 font-semibold">+18.0% Cumulative</div>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#navGrowthGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom row of chart card: Viewing: [SK] [DR] [MK] */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60 mt-1">
            <span className="text-xs text-muted-foreground font-sans">Viewing:</span>
            <div className="flex items-center -space-x-1">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-card font-mono">
                SK
              </div>
              <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-card font-mono">
                DR
              </div>
              <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-card font-mono">
                MK
              </div>
            </div>
          </div>
        </div>

        {/* ----------------- Column 2: Total Gain & Fund Ratio Stack (25% default) ----------------- */}
        <div className="flex flex-col gap-3 sm:gap-4 h-full">
          {/* Top Card: TOTAL GAIN */}
          <div className="bg-card border border-border rounded-lg p-4 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono tracking-wider text-muted-foreground font-semibold uppercase">
                TOTAL GAIN
              </div>
              <div className="text-2xl sm:text-[26px] font-bold text-foreground mt-1 tracking-tight font-sans">
                ₹8,100,000,000
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mt-1 font-mono">
                <span>▲</span>
                <span>+18.0%</span>
                <span className="text-muted-foreground font-normal">YTD</span>
              </div>
            </div>

            {/* Metrics: Sharpe, Max DD, Beta */}
            <div className="space-y-1.5 pt-3 border-t border-border mt-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sharpe</span>
                <span className="font-bold text-foreground">2.14</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Max DD</span>
                <span className="font-bold text-rose-600">-4.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Beta</span>
                <span className="font-bold text-foreground">0.72</span>
              </div>
            </div>
          </div>

          {/* Bottom Card: FUND RATIO */}
          <div className="bg-card border border-border rounded-lg p-4 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono tracking-wider text-muted-foreground font-semibold uppercase">
                FUND RATIO
              </div>
              <div className="text-xs text-foreground font-medium mt-1">
                Gross Exposure
              </div>

              {/* Progress bar with Profit 72% | Loss 28% */}
              <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100 border border-border mt-2">
                <div 
                  className="bg-emerald-500 h-full transition-all" 
                  style={{ width: '72%' }}
                  title="Profit: 72%"
                />
                <div 
                  className="bg-rose-500 h-full transition-all" 
                  style={{ width: '28%' }}
                  title="Loss: 28%"
                />
              </div>

              {/* Legend: ● Profit 72%    ● Loss 28% */}
              <div className="flex items-center justify-between text-xs font-mono mt-1.5">
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Profit 72%
                </span>
                <span className="text-rose-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Loss 28%
                </span>
              </div>
            </div>

            {/* Metrics: Net Exp., Leverage, Cash */}
            <div className="space-y-1.5 pt-3 border-t border-border mt-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Net Exp.</span>
                <span className="font-bold text-emerald-600">+142%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Leverage</span>
                <span className="font-bold text-foreground">1.8×</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Cash</span>
                <span className="font-bold text-foreground">8.2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------- Column 3: HOLDINGS List Card (25% default) ----------------- */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border mb-2.5">
              <span className="text-[11px] font-mono tracking-wider text-muted-foreground font-semibold uppercase">
                HOLDINGS
              </span>
              <button 
                onClick={onNavigateToHoldings}
                className="text-xs font-mono text-primary hover:underline flex items-center gap-0.5 font-medium"
              >
                All →
              </button>
            </div>

            {/* 6 Stock rows with mini sparklines */}
            <div className="space-y-2.5">
              {holdingsList.map((stk) => (
                <div
                  key={stk.symbol}
                  onClick={onNavigateToHoldings}
                  className="flex items-center justify-between text-xs hover:bg-slate-50 p-1.5 rounded-md transition-colors cursor-pointer group"
                >
                  {/* Left: Ticker & Company */}
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-foreground font-mono tracking-tight group-hover:text-primary transition-colors">
                      {stk.symbol}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate max-w-[95px]">
                      {stk.name}
                    </div>
                  </div>

                  {/* Middle: Sparkline SVG */}
                  <div className="px-1 hidden sm:block">
                    <Sparkline points={stk.sparkline} isPositive={stk.isPositive} />
                  </div>

                  {/* Right: Price & % Change */}
                  <div className="text-right shrink-0">
                    <div className="font-mono text-foreground font-semibold text-xs">
                      {stk.price}
                    </div>
                    <div className={`font-mono text-[11px] font-medium ${
                      stk.isPositive ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {stk.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ResizableSplit>

      {/* =========================================================================
          AI STRATEGY OPTIMISATION WINDOW (Idea generation from Research & Managing Nodes)
         ========================================================================= */}
      <AIOptimizerWindow onExperimentInAgentWorkspace={onExperimentInAgentWorkspace} />

      {/* =========================================================================
          BOTTOM ROW: 2 RESIZABLE COLUMNS (News & Important Updates | Team Updates)
         ========================================================================= */}
      <ResizableSplit
        direction="horizontal"
        initialSizes={[72, 28]}
        minSizes={[40, 20]}
        storageKey="overview_bottom_row_split"
        className="gap-3 sm:gap-4 items-stretch"
      >
        {/* ----------------- News & Important Updates (72% default) ----------------- */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            {/* Header: News & Important Updates with red badge '5' */}
            <div className="flex items-center gap-2 pb-3 border-b border-border mb-3">
              <h3 className="text-sm font-bold text-foreground tracking-tight">
                News &amp; Important Updates
              </h3>
              <span className="w-5 h-5 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center font-bold text-xs font-mono">
                5
              </span>
            </div>

            {/* List of 3 news update cards */}
            <div className="space-y-3">
              {newsUpdates.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 rounded-lg border border-border bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${item.tagColor}`}>
                      {item.tag}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-foreground font-medium leading-relaxed">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ----------------- Team Updates Chat (28% default) ----------------- */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-xs flex flex-col justify-between h-full">
          <div>
            {/* Header: Team Updates + Live badge */}
            <div className="flex items-center justify-between pb-2.5 border-b border-border mb-3">
              <h3 className="text-sm font-bold text-foreground tracking-tight">
                Team Updates
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>

            {/* Message Thread */}
            <div className="space-y-3 mb-3 max-h-[220px] overflow-y-auto pr-1">
              {teamMessages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  {/* Sender line with avatar */}
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {msg.isAi ? (
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full ${msg.avatarBg} text-white flex items-center justify-center font-bold text-[8px] font-mono shrink-0`}>
                        {msg.avatar}
                      </div>
                    )}
                    <span className={`font-semibold truncate ${msg.isAi ? 'text-blue-700 dark:text-blue-300' : 'text-foreground'}`}>
                      {msg.sender}
                    </span>
                    <span className="text-muted-foreground font-mono text-[10px]">· {msg.time}</span>
                  </div>

                  {/* Message bubble */}
                  <div className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                    msg.isAi 
                      ? 'bg-blue-50/40 border border-blue-400/60 text-foreground' 
                      : 'bg-white border border-border text-foreground'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input: "Add update..." + Up Arrow Button */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center gap-1.5 bg-white border border-border rounded-md px-2.5 py-1.5 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
              <input
                type="text"
                value={newUpdateText}
                onChange={(e) => setNewUpdateText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Add update..."
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newUpdateText.trim()}
                title="Send update"
                className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 disabled:hover:bg-primary transition-colors shrink-0"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </ResizableSplit>
    </div>
  );
};
