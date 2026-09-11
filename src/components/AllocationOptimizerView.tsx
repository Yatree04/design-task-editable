import React, { useState, useMemo } from 'react';
import { Fund, TradeOrder } from '../types';
import { 
  SlidersHorizontal, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  ArrowRight,
  CheckCircle2,
  PieChart as PieIcon,
  Diamond,
  Search,
  Sliders,
  Database,
  BarChart2,
  Clock,
  UserCheck,
  Zap,
  Lock,
  Check,
  AlertTriangle,
  Send,
  Terminal,
  FileText,
  LineChart as LineChartIcon,
  ChevronRight,
  ExternalLink,
  Cpu,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from 'recharts';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { StrategyIdea } from './AIOptimizerWindow';
import { ResizableSplit } from './ui/ResizableSplit';

interface AllocationOptimizerViewProps {
  funds: Fund[];
  onCommitRebalance: (orders: TradeOrder[]) => void;
  onExperimentInAgentWorkspace?: (strategy: StrategyIdea) => void;
  onOpenAgentModal?: (query?: string) => void;
}

export const AllocationOptimizerView: React.FC<AllocationOptimizerViewProps> = ({
  funds,
  onCommitRebalance,
  onExperimentInAgentWorkspace,
  onOpenAgentModal
}) => {
  // Navigation Sub-Tabs matching wireframe: [Data and analysis] | [Portfolio stimulation Model 1] | [Portfolio stimulation Model 2]
  const [activeSubTab, setActiveSubTab] = useState<'data-analysis' | 'sim-model-1' | 'sim-model-2'>('data-analysis');

  // Timeframe / Metric pills in right panel
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');

  // Bottom prompt bar state
  const [promptBarText, setPromptBarText] = useState<string>('');
  const [promptResult, setPromptResult] = useState<string | null>(null);
  const [isPromptRunning, setIsPromptRunning] = useState<boolean>(false);

  // Trade Execution & Risk Restrictions Modal (Image 3)
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState<boolean>(false);
  const [executionTimeParam, setExecutionTimeParam] = useState<string>('TWAP 09:30 - 16:00 EST / 45-min interval');
  const [humanSupervisor, setHumanSupervisor] = useState<string>('Alexander Vance (PM) & Dr. Elena Rostova');
  const [gatewayParam, setGatewayParam] = useState<string>('NY4 FIX 4.4 Ultra-Low Latency DMA');
  
  // Autonomy, Human, Gateway toggles
  const [autonomyMode, setAutonomyMode] = useState<'Autonomous' | 'Semi-Autonomous' | 'Rule-Based'>('Autonomous');
  const [humanApprovalRequired, setHumanApprovalRequired] = useState<boolean>(true);
  const [gatewayProtocol, setGatewayProtocol] = useState<'DMA FIX' | 'Smart Router' | 'Dark Pool'>('DMA FIX');

  // Risk Management Restrictions Inputs
  const [maxRiskIndex, setMaxRiskIndex] = useState<string>('1.25% 1-Day VaR 95%');
  const [maxSectorExposure, setMaxSectorExposure] = useState<string>('15.0% Share of NAV');
  const [maxSingleAssetExposure, setMaxSingleAssetExposure] = useState<string>('5.0% Single Equity NAV');
  const [maxDrawdownLimit, setMaxDrawdownLimit] = useState<string>('3.50% Hard Stop Loss');

  // Notification status
  const [publishSuccessNotice, setPublishSuccessNotice] = useState<string | null>(null);

  // Interactive 9-Grid Card Selection State (Image 2)
  const [selectedGridCard, setSelectedGridCard] = useState<string | null>('card-1');

  // Chart data for Data & Analysis (Image 1)
  const dataAnalysisChartData = [
    { time: 'Week 1', nav: 100.0, benchmark: 100.0, confidence: 99.8 },
    { time: 'Week 2', nav: 102.4, benchmark: 101.1, confidence: 99.7 },
    { time: 'Week 3', nav: 105.1, benchmark: 102.0, confidence: 99.8 },
    { time: 'Week 4', nav: 107.8, benchmark: 102.8, confidence: 99.9 },
    { time: 'Week 5', nav: 111.2, benchmark: 103.5, confidence: 99.8 },
    { time: 'Week 6', nav: 114.6, benchmark: 104.2, confidence: 99.9 },
    { time: 'Week 7', nav: 118.0, benchmark: 105.0, confidence: 99.8 },
    { time: 'Week 8', nav: 122.5, benchmark: 106.1, confidence: 99.9 },
  ];

  // Chart data for Model 1 Simulation (Image 2)
  const model1SimChartData = [
    { time: '09:30', baseModel: 100.0, simulatedModel: 99.4, upperBand: 100.5, lowerBand: 98.5 },
    { time: '10:30', baseModel: 101.8, simulatedModel: 103.2, upperBand: 104.2, lowerBand: 102.0 },
    { time: '11:30', baseModel: 103.1, simulatedModel: 106.5, upperBand: 107.8, lowerBand: 105.1 },
    { time: '12:30', baseModel: 104.5, simulatedModel: 109.8, upperBand: 111.0, lowerBand: 108.4 },
    { time: '13:30', baseModel: 105.8, simulatedModel: 114.2, upperBand: 115.6, lowerBand: 112.8 },
    { time: '14:30', baseModel: 107.2, simulatedModel: 118.9, upperBand: 120.4, lowerBand: 117.2 },
    { time: '15:30', baseModel: 108.4, simulatedModel: 124.1, upperBand: 125.8, lowerBand: 122.5 },
    { time: '16:00', baseModel: 109.2, simulatedModel: 128.5, upperBand: 130.2, lowerBand: 126.8 },
  ];

  // Chart data for Model 2 Simulation (Image 2)
  const model2SimChartData = [
    { time: '09:30', baseModel: 100.0, simulatedModel: 98.8, upperBand: 100.2, lowerBand: 97.5 },
    { time: '10:30', baseModel: 101.8, simulatedModel: 104.5, upperBand: 106.0, lowerBand: 103.0 },
    { time: '11:30', baseModel: 103.1, simulatedModel: 108.2, upperBand: 110.1, lowerBand: 106.4 },
    { time: '12:30', baseModel: 104.5, simulatedModel: 112.4, upperBand: 114.2, lowerBand: 110.5 },
    { time: '13:30', baseModel: 105.8, simulatedModel: 117.9, upperBand: 120.0, lowerBand: 115.8 },
    { time: '14:30', baseModel: 107.2, simulatedModel: 122.5, upperBand: 124.8, lowerBand: 120.2 },
    { time: '15:30', baseModel: 108.4, simulatedModel: 127.8, upperBand: 130.0, lowerBand: 125.4 },
    { time: '16:00', baseModel: 109.2, simulatedModel: 132.4, upperBand: 134.8, lowerBand: 130.0 },
  ];

  // 9 Interactive Factor & Asset Cards (Image 2)
  const factorAndAssetCards = [
    {
      id: 'card-1',
      title: 'Factors and stalks',
      category: 'Alpha Factors',
      metric: 'Momentum +1.84σ',
      subtext: '42 Long / 18 Short equities',
      status: 'OPTIMAL',
      details: 'Dynamic cross-sectional momentum ranking across S&P 500 with Barra factor orthogonalization.'
    },
    {
      id: 'card-2',
      title: 'assets etc',
      category: 'Asset Allocation',
      metric: '58% Eq / 24% Opt / 18% UST',
      subtext: 'Multi-asset overlay',
      status: 'BALANCED',
      details: 'Delta hedged equity portfolio with sovereign bond roll-down carry and volatility skew protection.'
    },
    {
      id: 'card-3',
      title: 'Sector Weights',
      category: 'GICS Constraints',
      metric: 'Tech 28.5% | Fin 22.0%',
      subtext: 'Max sector cap: 15.0%',
      status: 'COMPLIANT',
      details: 'Strict sector bounds enforced to prevent over-concentration in semiconductor hardware.'
    },
    {
      id: 'card-4',
      title: 'Volatility Skew',
      category: 'Options Convexity',
      metric: '25Δ Skew: 2.4σ Arb',
      subtext: 'Variance premia harvest',
      status: 'ACTIVE',
      details: 'ATM vs 25-delta OTM implied volatility surface arbitrage capturing systematic retail premium.'
    },
    {
      id: 'card-5',
      title: 'Beta Neutralization',
      category: 'Risk Hedge',
      metric: 'Market Beta: 0.008',
      subtext: 'Target: 0.00 ± 0.02',
      status: 'NEUTRALIZED',
      details: 'S&P 500 E-mini future overlays continuously neutralizing systemic equity market direction.'
    },
    {
      id: 'card-6',
      title: 'Liquidity Depth',
      category: 'Market Access',
      metric: 'ADV Cap: <2.10%',
      subtext: 'Est. Slippage: 0.18 bps',
      status: 'HIGH DEPTH',
      details: 'Order slicing algorithm guarantees orders do not exceed 2.5% of trailing 30-day average daily volume.'
    },
    {
      id: 'card-7',
      title: 'Carry & Yield',
      category: 'Fixed Income / FX',
      metric: '+14.2 bps Net Carry',
      subtext: 'USD/JPY Cross-currency basis',
      status: 'HARVESTING',
      details: 'Captures offshore funding disparity via 3-month currency basis swaps into SOFR collateral.'
    },
    {
      id: 'card-8',
      title: 'Tail Risk Bounds',
      category: 'VaR & Stress',
      metric: '95% VaR: 1.14%',
      subtext: 'Max Drawdown: -3.80%',
      status: 'SECURE',
      details: 'OTM put spread collar ladder guarantees capital preservation under catastrophic tail-risk shocks.'
    },
    {
      id: 'card-9',
      title: 'Execution Gateway',
      category: 'FIX Protocol',
      metric: 'DMA Route: 0.08 ms',
      subtext: 'SEC 15c3-5 Approved',
      status: 'ONLINE',
      details: 'Low-latency direct market access with pre-trade price collar & capital threshold enforcement.'
    }
  ];

  // Handle bottom prompt submission
  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptBarText.trim()) return;

    setIsPromptRunning(true);
    const query = promptBarText;

    setTimeout(() => {
      setIsPromptRunning(false);
      setPromptResult(
        `✓ PORTFOLIO FIT AUDIT COMPLETE FOR "${query}":\n` +
        `• Active Allocation: 58.0% Equities / 24.0% Options Variance / 18.0% UST Yield.\n` +
        `• Stress Test Verification: Passed SEC 15c3-5 and 95% VaR bounds (1.14% vs 1.25% limit).\n` +
        `• Recommended Action: Deploy portfolio fit hypothesis with 15.0% max sector ceiling and automated TWAP routing.`
      );
    }, 700);
  };

  // Handle Publish Limits & Trade (Image 3)
  const handlePublishLimitsAndTrade = (e: React.FormEvent) => {
    e.preventDefault();

    // Create simulated execution orders
    const newOrders: TradeOrder[] = [
      {
        id: `ord-lim-${Date.now()}-1`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        fundId: 'des-oculus',
        ticker: 'SPY',
        name: 'SPDR S&P 500 ETF (Delta Hedge)',
        side: 'BUY',
        shares: 45000,
        targetPrice: 585.20,
        status: 'EXECUTED',
        rationale: `Published limits: Autonomy [${autonomyMode}], VaR Cap [${maxRiskIndex}], Approved by [${humanSupervisor}]`
      },
      {
        id: `ord-lim-${Date.now()}-2`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        fundId: 'des-oculus',
        ticker: 'NVDA',
        name: 'NVIDIA Corp (Risk Rebalance)',
        side: 'SELL',
        shares: 12000,
        targetPrice: 128.40,
        status: 'EXECUTED',
        rationale: `Sector restriction compliance: Capped tech exposure under ${maxSectorExposure}`
      }
    ];

    onCommitRebalance(newOrders);
    setIsExecutionModalOpen(false);
    setPublishSuccessNotice(`✓ Trading limits published & ${newOrders.length} compliance orders dispatched via ${gatewayParam}!`);

    setTimeout(() => {
      setPublishSuccessNotice(null);
    }, 5000);
  };

  return (
    <div className="h-full flex-1 flex flex-col min-h-0 overflow-hidden space-y-2.5 select-none bg-slate-50/50 p-2 sm:p-3">
      
      {/* =========================================================================
          TOP COMMAND & HEADER BAR
          - Left: /agent bar
          - Center: Sub-tabs
          - Right: Restrictions & Trade Limits
         ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 sm:p-3 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 shrink-0">
        
        {/* Left: /agent bar */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full flex items-center bg-white border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 rounded-lg transition-all shadow-2xs">
            <span className="pl-3 pr-1 text-blue-600 font-mono text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            </span>
            <input
              type="text"
              value={promptBarText}
              onChange={(e) => setPromptBarText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePromptSubmit(e)}
              placeholder="Search or execute quant command..."
              className="w-full py-1.5 pl-1 pr-8 text-xs font-mono text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handlePromptSubmit}
              className="absolute right-2 p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
              title="Execute /agent search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center/Right: Sub-tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            type="button"
            onClick={() => setActiveSubTab('data-analysis')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'data-analysis'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200/80'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span className={activeSubTab === 'data-analysis' ? 'text-white' : 'text-slate-900'}>Data and analysis</span>
            {activeSubTab === 'data-analysis' && <Check className="w-3 h-3 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('sim-model-1')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'sim-model-1'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200/80'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span className={activeSubTab === 'sim-model-1' ? 'text-white' : 'text-slate-900'}>Portfolio simulation Model 1</span>
            {activeSubTab === 'sim-model-1' && <Check className="w-3 h-3 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('sim-model-2')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'sim-model-2'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200/80'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className={activeSubTab === 'sim-model-2' ? 'text-white' : 'text-slate-900'}>Portfolio simulation Model 2</span>
            {activeSubTab === 'sim-model-2' && <Check className="w-3 h-3 ml-0.5" />}
          </button>
        </div>

        {/* Right Action: Restrictions & Deploy Button */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            size="sm"
            onClick={() => setIsExecutionModalOpen(true)}
            className="h-8.5 px-3.5 text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg gap-1.5 shadow-xs transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Restrictions &amp; Limits</span>
          </Button>
        </div>

      </div>

      {/* Success Notification Banner */}
      {publishSuccessNotice && (
        <div className="px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-mono flex items-center justify-between gap-2 shrink-0 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{publishSuccessNotice}</span>
          </div>
          <Badge className="bg-emerald-600 text-white text-[10px] font-mono">
            PUBLISHED &amp; ROUTED
          </Badge>
        </div>
      )}

      {/* Current Context Tag without redundant explanatory sentence */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-white border border-slate-200/80 rounded-lg text-xs font-mono font-semibold text-slate-900 shadow-2xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Current Portfolio &amp; Market Dynamics</span>
          </span>
        </div>
      </div>

      {/* =========================================================================
          MAIN 2-COLUMN VIEWPORT (Resizable Split)
          Left: 3 Stacked Metric Cards
          Right: Dynamic Canvas (Data & Analysis OR Portfolio Simulation 3x3 Grid)
         ========================================================================= */}
      <div className="flex-1 min-h-0 border border-slate-200/80 rounded-2xl bg-white shadow-xs overflow-hidden flex flex-col relative">
        <ResizableSplit
          direction="horizontal"
          initialSizes={[33, 67]}
          minSizes={[22, 35]}
          storageKey="allocation_optimizer_view_split"
          className="h-full"
        >
          {/* =========================================================================
              LEFT COLUMN: 3 Stacked Cards
             ========================================================================= */}
          <div className="border-r border-slate-200/80 p-3 sm:p-3.5 flex flex-col justify-between bg-slate-50/50 overflow-y-auto min-h-0 space-y-3 h-full">
          
          {/* Card 1: Market stats or Portfolio monitoring */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="font-mono text-xs font-bold text-slate-900 tracking-tight">
                  {activeSubTab === 'data-analysis' ? 'Market stats (Index & Rates)' : 'Portfolio monitoring (Live)'}
                </span>
              </div>
              <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-[10px] font-mono font-medium">
                {activeSubTab === 'data-analysis' ? 'S&P 500: 5,852.4' : 'Sharpe 2.84'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60 shadow-2xs">
                <span className="text-[9px] uppercase text-slate-500 block">1-Year Return</span>
                <span className="text-sm font-bold text-emerald-600">+22.4%</span>
                <span className="text-[9px] text-emerald-700 block">+4.2% vs BM</span>
              </div>
              <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60 shadow-2xs">
                <span className="text-[9px] uppercase text-slate-500 block">95% Daily VaR</span>
                <span className="text-sm font-bold text-slate-800">1.14%</span>
                <span className="text-[9px] text-slate-500 block">&lt;1.25% Cap</span>
              </div>
              <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60 shadow-2xs">
                <span className="text-[9px] uppercase text-slate-500 block">Net Beta Tilt</span>
                <span className="text-sm font-bold text-slate-800">0.008</span>
                <span className="text-[9px] text-blue-600 block">Neutral</span>
              </div>
              <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60 shadow-2xs">
                <span className="text-[9px] uppercase text-slate-500 block">VIX Implied Vol</span>
                <span className="text-sm font-bold text-slate-800">14.82</span>
                <span className="text-[9px] text-slate-500 block">Skew 2.4σ</span>
              </div>
            </div>
          </div>

          {/* Card 2: Factor Loadings */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="font-mono text-xs font-bold text-slate-900 tracking-tight">
                  Market stats (Factor Loadings)
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Barra GEM3</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              {[
                { factor: 'Momentum Factor', score: '+1.84σ', color: 'text-emerald-600', fill: '85%' },
                { factor: 'Volatility Skew Premia', score: '+2.40σ', color: 'text-emerald-600', fill: '92%' },
                { factor: 'Value vs Growth Spread', score: '-0.38σ', color: 'text-rose-600', fill: '40%' },
                { factor: 'Quality & Balance Sheet', score: '+1.12σ', color: 'text-emerald-600', fill: '68%' },
              ].map((f, idx) => (
                <div key={idx} className="bg-slate-50/80 p-2 rounded-lg border border-slate-200/50 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-700 font-medium">{f.factor}</span>
                    <span className={`font-bold ${f.color}`}>{f.score}</span>
                  </div>
                  <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: f.fill }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Asset Allocation & Liquidity */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="font-mono text-xs font-bold text-slate-900 tracking-tight">
                  Market stats (Liquidity &amp; Asset Split)
                </span>
              </div>
              <span className="text-[10px] font-mono text-blue-700 font-semibold">100% Allocated</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60 shadow-2xs">
                  <span className="text-[9px] uppercase text-slate-500 block">Equities</span>
                  <span className="text-xs font-bold text-slate-900">58.0%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60 shadow-2xs">
                  <span className="text-[9px] uppercase text-slate-500 block">Options/Var</span>
                  <span className="text-xs font-bold text-slate-900">24.0%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60 shadow-2xs">
                  <span className="text-[9px] uppercase text-slate-500 block">UST / Cash</span>
                  <span className="text-xs font-bold text-slate-900">18.0%</span>
                </div>
              </div>

              <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-200/50 shadow-2xs text-[10.5px] text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span>ADV Liquidity Utilization:</span>
                  <strong className="text-slate-900 font-mono">2.1% (Cap &lt;2.5%)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Slippage Model Impact:</span>
                  <strong className="text-slate-800 font-mono">0.18 bps</strong>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* =========================================================================
            RIGHT AREA - VIEW 1: DATA AND ANALYSIS
           ========================================================================= */}
        {activeSubTab === 'data-analysis' && (
          <div className="p-3 sm:p-4 flex flex-col justify-between overflow-y-auto min-h-0 space-y-3 h-full">
            
            {/* Top Timeframe Filters */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-1.5">
                {(['1D', '1W', '1M', '1Y'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTimeframe(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      selectedTimeframe === t
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                  Portfolio Trajectory
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-slate-400 inline-block" />
                  S&amp;P 500 Baseline
                </span>
              </div>
            </div>

            {/* Main Interactive Growth / Trajectory Line Chart */}
            <div className="h-56 sm:h-64 w-full bg-slate-50/40 p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataAnalysisChartData}>
                  <defs>
                    <linearGradient id="dataAnalysisGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fontFamily: 'monospace' }} stroke="#64748b" />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'monospace' }} stroke="#64748b" domain={[95, 130]} />
                  <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'monospace', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
                  <Area 
                    type="monotone" 
                    dataKey="nav" 
                    stroke="#2563eb" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#dataAnalysisGrad)" 
                    name="Simulated Portfolio NAV" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="benchmark" 
                    stroke="#64748b" 
                    strokeWidth={1.75} 
                    strokeDasharray="4 4" 
                    dot={false} 
                    name="Benchmark Index" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* AI Suggestion Box */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-mono text-xs font-bold">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Forecast &amp; Model Intelligence</span>
              </div>

              <div className="space-y-2.5 font-sans text-xs text-slate-700 bg-slate-50/60 p-3.5 rounded-lg border border-slate-200/60">
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-slate-900 font-medium">Volatility Regimes:</strong> Factor surface projects a 78% probability of volatility compression into upcoming macro rate decision. Implied skew is modeled to flatten by 1.8 vol points across mega-cap tech index options.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-slate-900 font-medium">Model 1 Performance:</strong> Cumulative alpha (<span className="text-emerald-600 font-semibold font-mono">+22.5%</span>) outpaces passive benchmark by <span className="text-emerald-600 font-semibold font-mono">+16.4%</span> with factor beta neutrality (0.008) and lower maximum drawdown (<span className="text-rose-600 font-semibold font-mono">-3.8%</span> vs <span className="text-rose-600 font-semibold font-mono">-8.2%</span>).
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-slate-900 font-medium">Sector Exposure:</strong> Semiconductor exposure sits at 13.8% against the 15.0% mandate ceiling. Pre-trade collar hedge staged to protect unrealized gamma before earnings.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            RIGHT AREA - VIEW 2 & 3: PORTFOLIO SIMULATION MODEL 1 & MODEL 2
           ========================================================================= */}
        {(activeSubTab === 'sim-model-1' || activeSubTab === 'sim-model-2') && (
          <div className="p-3 sm:p-4 flex flex-col justify-between overflow-y-auto min-h-0 space-y-3 h-full">
            
            {/* Top Metric Cards with soft shadows */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-1.5">
                {[
                  { label: 'Expected Sharpe', val: activeSubTab === 'sim-model-1' ? '2.84' : '3.12', color: 'text-slate-900' },
                  { label: 'Simulated 95% VaR', val: activeSubTab === 'sim-model-1' ? '1.14%' : '0.98%', color: 'text-slate-900' },
                  { label: 'Alpha Outperformance', val: activeSubTab === 'sim-model-1' ? '+5.6%' : '+7.2%', color: 'text-emerald-600 font-bold' },
                  { label: 'Max Drawdown', val: activeSubTab === 'sim-model-1' ? '-3.8%' : '-2.4%', color: 'text-rose-600 font-bold' },
                ].map((p, pIdx) => (
                  <div key={pIdx} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/70 shadow-2xs text-center">
                    <span className="text-[8px] font-mono uppercase text-slate-500 block">{p.label}</span>
                    <span className={`text-[11px] font-mono ${p.color} block`}>{p.val}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-0.5 bg-slate-800 inline-block" />
                  Base Model
                </span>
                <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
                  <span className="w-2.5 h-0.5 bg-blue-600 inline-block" />
                  {activeSubTab === 'sim-model-1' ? 'Model 1 Simulation' : 'Model 2 Simulation'}
                </span>
              </div>
            </div>

            {/* Dual Comparison Chart (Base vs Blue Simulation Line) */}
            <div className="h-44 sm:h-52 w-full bg-slate-50/40 p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeSubTab === 'sim-model-1' ? model1SimChartData : model2SimChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fontFamily: 'monospace' }} stroke="#64748b" />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'monospace' }} stroke="#64748b" domain={[95, 136]} />
                  <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'monospace', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
                  <Line 
                    type="monotone" 
                    dataKey="baseModel" 
                    stroke="#1e293b" 
                    strokeWidth={2} 
                    dot={false} 
                    name="Base Portfolio Model" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="simulatedModel" 
                    stroke="#2563eb" 
                    strokeWidth={2.5} 
                    dot={{ r: 3, fill: '#2563eb' }} 
                    name="Simulated Model Trajectory" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 3x3 Grid of 9 Factors & Asset Allocation Cards */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-800 font-semibold px-0.5">
                <span>Factors &amp; Hypothesis Matrix</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {factorAndAssetCards.map((card) => {
                  const isSelected = selectedGridCard === card.id;

                  return (
                    <div
                      key={card.id}
                      onClick={() => setSelectedGridCard(card.id)}
                      className={`p-3 rounded-xl transition-all cursor-pointer shadow-xs space-y-1.5 ${
                        isSelected
                          ? 'border-2 border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-sm'
                          : 'border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs font-mono text-slate-900 truncate">
                          {card.title}
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-mono font-medium rounded-md">
                          {card.status}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono font-bold text-slate-800 truncate">
                        {card.metric}
                      </div>

                      <div className="text-[10px] font-sans text-slate-500 line-clamp-1">
                        {card.subtext}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Row: Deploy Action */}
            <div className="pt-2 flex items-center justify-end">
              <Button
                type="button"
                onClick={() => setIsExecutionModalOpen(true)}
                className="h-9.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-mono text-xs font-semibold gap-2 shadow-xs transition-all hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Deploy Portfolio Fit &amp; Hypothesis</span>
              </Button>
            </div>

          </div>
        )}

        </ResizableSplit>
      </div>

      {/* =========================================================================
          BOTTOM PROMPT BAR
         ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 sm:p-3 shadow-xs space-y-2 shrink-0">
        <form onSubmit={handlePromptSubmit} className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center bg-white border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 rounded-xl transition-all shadow-2xs">
            <span className="pl-3.5 pr-1.5 text-blue-600 font-mono text-xs font-semibold flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-blue-600" />
            </span>
            <input
              type="text"
              value={promptBarText}
              onChange={(e) => setPromptBarText(e.target.value)}
              placeholder="Enter portfolio analysis query or command..."
              className="w-full py-2 pl-1 pr-10 text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
            />
          </div>
          <Button
            type="submit"
            disabled={isPromptRunning || !promptBarText.trim()}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono rounded-xl font-semibold gap-1.5 shadow-xs shrink-0"
          >
            {isPromptRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Analyze</span>
          </Button>
        </form>

        {/* Prompt Output Card */}
        {promptResult && (
          <div className="p-3.5 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs space-y-2 shadow-md animate-in fade-in">
            <div className="flex items-center justify-between pb-1 text-slate-400 text-[11px]">
              <span className="text-blue-400 font-bold"># PORTFOLIO FIT INTELLIGENCE RESPONSE</span>
              <button
                type="button"
                onClick={() => setPromptResult(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-slate-200">
              {promptResult}
            </pre>
          </div>
        )}
      </div>

      {/* =========================================================================
          TRADE EXECUTION & RISK RESTRICTIONS MODAL
         ========================================================================= */}
      {isExecutionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-xl w-full max-w-xl p-6 space-y-5 animate-in zoom-in-95 font-mono">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-mono tracking-tight text-slate-900">
                  Trade Execution
                </h3>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-mono font-semibold text-slate-700">
                  SEC 15c3-5 / FIX 4.4 DMA
                </span>
              </div>
            </div>

            <form onSubmit={handlePublishLimitsAndTrade} className="space-y-4">
              
              {/* Section 1: Execution Parameters */}
              <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70 shadow-2xs">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Execution Parameters
                </div>

                {/* Row 1: Time / TWAP execution window + [Autonomy] Button */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={executionTimeParam}
                      onChange={(e) => setExecutionTimeParam(e.target.value)}
                      placeholder="TWAP 09:30 - 16:00 EST / 45-min interval"
                      className="h-9.5 text-xs font-mono bg-white border-slate-200 rounded-lg text-slate-900 focus-visible:ring-blue-500"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAutonomyMode(autonomyMode === 'Autonomous' ? 'Semi-Autonomous' : 'Autonomous')}
                    className={`h-9.5 px-3.5 rounded-lg text-xs font-mono font-semibold shrink-0 border-slate-200 ${
                      autonomyMode === 'Autonomous'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Autonomy ({autonomyMode})
                  </Button>
                </div>

                {/* Row 2: Human Operator Sign-off + [Human] Button */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={humanSupervisor}
                      onChange={(e) => setHumanSupervisor(e.target.value)}
                      placeholder="Alexander Vance (PM) & Risk Officer"
                      className="h-9.5 text-xs font-mono bg-white border-slate-200 rounded-lg text-slate-900 focus-visible:ring-blue-500"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setHumanApprovalRequired(!humanApprovalRequired)}
                    className={`h-9.5 px-3.5 rounded-lg text-xs font-mono font-semibold shrink-0 border-slate-200 ${
                      humanApprovalRequired
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Human ({humanApprovalRequired ? 'Dual Sign-off' : 'Auto'})
                  </Button>
                </div>

                {/* Row 3: Gateway FIX route + [Gateway] Button */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={gatewayParam}
                      onChange={(e) => setGatewayParam(e.target.value)}
                      placeholder="NY4 FIX 4.4 Ultra-Low Latency DMA"
                      className="h-9.5 text-xs font-mono bg-white border-slate-200 rounded-lg text-slate-900 focus-visible:ring-blue-500"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setGatewayProtocol(gatewayProtocol === 'DMA FIX' ? 'Smart Router' : 'DMA FIX')}
                    className="h-9.5 px-3.5 rounded-lg text-xs font-mono font-semibold shrink-0 bg-slate-900 text-white hover:bg-slate-800 border-slate-200"
                  >
                    Gateway ({gatewayProtocol})
                  </Button>
                </div>
              </div>

              {/* Section 2: Risk Management Restrictions */}
              <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70 shadow-2xs">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Risk Management Limits
                </div>

                {/* Maximum risk index */}
                <div className="flex items-center justify-between gap-4">
                  <label className="text-xs font-mono font-medium text-slate-700 flex-1">
                    Maximum risk index
                  </label>
                  <div className="w-48 sm:w-56">
                    <Input
                      type="text"
                      value={maxRiskIndex}
                      onChange={(e) => setMaxRiskIndex(e.target.value)}
                      placeholder="1.25% 1-Day VaR 95%"
                      className="h-9 text-xs font-mono bg-white border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                {/* Max sector exposure */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs font-mono font-medium text-slate-700">
                      Max sector exposure
                    </div>
                  </div>
                  <div className="w-48 sm:w-56">
                    <Input
                      type="text"
                      value={maxSectorExposure}
                      onChange={(e) => setMaxSectorExposure(e.target.value)}
                      placeholder="15.0% Share of NAV"
                      className="h-9 text-xs font-mono bg-white border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                {/* Max single asset exposure */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs font-mono font-medium text-slate-700">
                      Max single asset exposure
                    </div>
                  </div>
                  <div className="w-48 sm:w-56">
                    <Input
                      type="text"
                      value={maxSingleAssetExposure}
                      onChange={(e) => setMaxSingleAssetExposure(e.target.value)}
                      placeholder="5.0% Single Asset NAV"
                      className="h-9 text-xs font-mono bg-white border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExecutionModalOpen(false)}
                  className="h-9.5 px-4 text-xs font-mono border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9.5 px-6 text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-all"
                >
                  Publish Limits &amp; Trade
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
