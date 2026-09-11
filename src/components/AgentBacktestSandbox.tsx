import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Play, 
  RotateCcw, 
  SlidersHorizontal, 
  Sparkles, 
  CheckCircle2, 
  Download,
  Layers,
  Database,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowLeftRight,
  GitMerge,
  Cpu,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  Legend
} from 'recharts';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { WorkspaceModel } from '../types';

export interface BacktestSandboxProps {
  selectedNodeName?: string;
  onDeployModel?: () => void;
  models?: WorkspaceModel[];
  activeModelId?: string;
  onSelectModel?: (id: string) => void;
  onMergeModels?: (modelAId: string, modelBId: string, mergeStrategy: string) => void;
  initialMode?: 'single' | 'compare' | 'merge';
}

export type TimeframePeriod = '1D' | '5D' | '3M' | '1Y' | '3Y' | '5Y' | 'Max';

export const AgentBacktestSandbox: React.FC<BacktestSandboxProps> = ({
  selectedNodeName = 'Research Judgement agent',
  onDeployModel,
  models = [],
  activeModelId,
  onSelectModel,
  onMergeModels,
  initialMode = 'single',
}) => {
  const [sandboxMode, setSandboxMode] = useState<'single' | 'compare' | 'merge'>(initialMode);
  const [activeTimeframe, setActiveTimeframe] = useState<TimeframePeriod>('1Y');
  const [selectedDataset, setSelectedDataset] = useState<string>('us-l2-depth');
  const [dateRange, setDateRange] = useState<string>('09/07/2025 - 10/07/2025');
  const [isParamsOpen, setIsParamsOpen] = useState<boolean>(false);

  // Active Model resolution
  const currentModel = useMemo(() => {
    return models.find(m => m.id === activeModelId) || models[0] || {
      id: 'model-1',
      name: 'Production Core',
      tag: 'Prod v1.0',
      version: 'v1.0',
      description: 'Default quantitative model',
      targetVol: 14,
      maxPosition: 10,
      varLimit: 1.25,
      expectedSharpe: 1.84,
      expectedReturn: 13.8,
      color: '#2563eb'
    };
  }, [models, activeModelId]);

  // Compare & Merge selectors
  const [compareModelAId, setCompareModelAId] = useState<string>(models[0]?.id || 'model-1');
  const [compareModelBId, setCompareModelBId] = useState<string>(models[1]?.id || models[0]?.id || 'model-2');
  const [mergeStrategy, setMergeStrategy] = useState<string>('factor-cov');

  // Adjustable sandbox model parameters
  const [targetVol, setTargetVol] = useState<number>(currentModel.targetVol || 14);
  const [maxPosition, setMaxPosition] = useState<number>(currentModel.maxPosition || 10);
  const [latencyMs, setLatencyMs] = useState<number>(0.08);
  const [varLimit, setVarLimit] = useState<number>(currentModel.varLimit || 1.25);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Available targeted datasets from the Data Repository
  const targetedDatasets = [
    { id: 'us-l2-depth', name: 'US Equity Level 2 Market Depth (Equinix NY4)', latency: '0.04 ms', rows: '1.42B rows' },
    { id: 'factor-cov', name: 'Multi-Asset Factor Covariance Matrix (Barra/Risk)', latency: '0.12 ms', rows: '85K assets' },
    { id: 'nlp-sentiment', name: 'Alternative NLP Real-Time Sentiment & SEC Filings', latency: '1.2 ms', rows: '3.8M articles' },
    { id: 'execution-tca', name: 'Institutional DMA Order Flow & TCA Benchmark', latency: '0.08 ms', rows: '420M fills' },
  ];

  const modelA = useMemo(() => models.find(m => m.id === compareModelAId) || currentModel, [models, compareModelAId, currentModel]);
  const modelB = useMemo(() => models.find(m => m.id === compareModelBId) || models[1] || currentModel, [models, compareModelBId, currentModel]);

  // Dynamic performance data generation that responds to parameters
  const performanceData = useMemo(() => {
    const volMultiplier = targetVol / 14;
    const datasetBias = selectedDataset === 'us-l2-depth' ? 0.6 : selectedDataset === 'factor-cov' ? 0.3 : selectedDataset === 'nlp-sentiment' ? -0.2 : 0.4;
    
    return [
      { day: 'Day 1', returns: Number((13.5 + datasetBias).toFixed(2)), sharpe: Number((1.82).toFixed(2)) },
      { day: 'Day 2', returns: Number((14.8 + datasetBias).toFixed(2)), sharpe: Number((1.84).toFixed(2)) },
      { day: 'Day 3', returns: Number((15.4 + datasetBias * volMultiplier).toFixed(2)), sharpe: Number((1.80).toFixed(2)) },
      { day: 'Day 4', returns: Number((15.2 + datasetBias).toFixed(2)), sharpe: Number((1.81).toFixed(2)) },
      { day: 'Day 5', returns: Number((15.6 + datasetBias * volMultiplier).toFixed(2)), sharpe: Number((1.85).toFixed(2)) },
      { day: 'Day 6', returns: Number((13.1 + datasetBias).toFixed(2)), sharpe: Number((1.83).toFixed(2)) },
      { day: 'Day 7', returns: Number((15.0 + datasetBias).toFixed(2)), sharpe: Number((1.86).toFixed(2)) },
      { day: 'Day 8', returns: Number((15.2 + datasetBias * volMultiplier).toFixed(2)), sharpe: Number((1.88).toFixed(2)) },
      { day: 'Day 9', returns: Number((13.3 + datasetBias).toFixed(2)), sharpe: Number((1.84).toFixed(2)) },
      { day: 'Day 10', returns: Number((14.9 + datasetBias).toFixed(2)), sharpe: Number((1.87).toFixed(2)) },
      { day: 'Day 11', returns: Number((15.5 + datasetBias * volMultiplier).toFixed(2)), sharpe: Number((1.89).toFixed(2)) },
      { day: 'Day 12', returns: Number((13.8 + datasetBias).toFixed(2)), sharpe: Number((1.85).toFixed(2)) },
      { day: 'Day 13', returns: Number((15.1 + datasetBias).toFixed(2)), sharpe: Number((1.88).toFixed(2)) },
      { day: 'Day 14', returns: Number((12.7 + datasetBias).toFixed(2)), sharpe: Number((1.81).toFixed(2)) },
      { day: 'Day 15', returns: Number((13.4 + datasetBias).toFixed(2)), sharpe: Number((1.83).toFixed(2)) },
      { day: 'Day 16', returns: Number((14.6 + datasetBias * volMultiplier).toFixed(2)), sharpe: Number((1.86).toFixed(2)) },
      { day: 'Day 17', returns: Number((14.8 + datasetBias * volMultiplier).toFixed(2)), sharpe: Number((1.87).toFixed(2)) },
      { day: 'Day 18', returns: Number((14.5 + datasetBias).toFixed(2)), sharpe: Number((1.85).toFixed(2)) },
      { day: 'Day 19', returns: Number((11.8 + datasetBias).toFixed(2)), sharpe: Number((1.82).toFixed(2)) },
      { day: 'Day 20', returns: Number((12.8 + datasetBias).toFixed(2)), sharpe: Number((1.84).toFixed(2)) },
      { day: 'Day 21', returns: Number((13.3 + datasetBias * volMultiplier).toFixed(2)), sharpe: Number((1.86).toFixed(2)) },
      { day: 'Day 22', returns: Number((11.9 + datasetBias).toFixed(2)), sharpe: Number((1.80).toFixed(2)) },
      { day: 'Day 23', returns: Number((13.4 + datasetBias * volMultiplier).toFixed(2)), sharpe: Number((1.88).toFixed(2)) },
      { day: 'Day 24', returns: Number((12.7 + datasetBias).toFixed(2)), sharpe: Number((1.84).toFixed(2)) },
      { day: 'Day 25', returns: Number((11.4 + datasetBias).toFixed(2)), sharpe: Number((1.79).toFixed(2)) },
      { day: 'Day 26', returns: Number((13.5 + datasetBias * volMultiplier).toFixed(2)), sharpe: Number((1.88).toFixed(2)) },
      { day: 'Day 27', returns: Number((13.1 + datasetBias).toFixed(2)), sharpe: Number((1.85).toFixed(2)) },
      { day: 'Day 28', returns: Number((14.2 + datasetBias * volMultiplier).toFixed(2)), sharpe: Number((1.86).toFixed(2)) },
      { day: 'Day 29', returns: Number((12.8 + datasetBias).toFixed(2)), sharpe: Number((1.83).toFixed(2)) },
      { day: 'Day 30', returns: Number((14.7 + datasetBias * volMultiplier).toFixed(2)), sharpe: Number((1.87).toFixed(2)) },
    ];
  }, [targetVol, selectedDataset]);

  // Dual-model comparison data
  const compareData = useMemo(() => {
    const biasA = (modelA.expectedReturn || 13.8) - 13.8;
    const biasB = (modelB.expectedReturn || 15.6) - 13.8;
    const sharpeA = modelA.expectedSharpe || 1.84;
    const sharpeB = modelB.expectedSharpe || 2.15;

    return performanceData.map((pt, idx) => ({
      day: pt.day,
      returnsA: Number((pt.returns + biasA).toFixed(2)),
      returnsB: Number((pt.returns * 1.05 + biasB + Math.sin(idx * 0.4) * 0.6).toFixed(2)),
      sharpeA: Number((sharpeA + (pt.sharpe - 1.84) * 0.5).toFixed(2)),
      sharpeB: Number((sharpeB + (pt.sharpe - 1.84) * 0.6).toFixed(2)),
    }));
  }, [performanceData, modelA, modelB]);

  // Frequency distribution histogram
  const distributionData = useMemo(() => {
    return [
      { range: '-2.5%', countA: 2, countB: 1, count: 2 },
      { range: '-1.5%', countA: 5, countB: 3, count: 5 },
      { range: '-0.5%', countA: 14, countB: 9, count: 14 },
      { range: '+0.5%', countA: 28, countB: 24, count: 28 },
      { range: '+1.5%', countA: 38, countB: 42, count: 38 },
      { range: '+2.5%', countA: 21, countB: 31, count: 21 },
      { range: '+3.5%', countA: 9, countB: 16, count: 9 },
      { range: '+4.5%', countA: 3, countB: 6, count: 3 },
    ];
  }, []);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  const handleExecuteMerge = () => {
    if (onMergeModels) {
      onMergeModels(compareModelAId, compareModelBId, mergeStrategy);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pr-0.5 space-y-3 font-sans text-xs bg-white select-none">
      
      {/* Top Banner with Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white border border-border shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-foreground text-xs font-mono">● Model Output</span>
          <span className="text-[11px] font-mono text-muted-foreground">Live · Real-time</span>
        </div>

        {/* Sandbox Modes: Single Output | Compare Models | Merge Models */}
        <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setSandboxMode('single')}
            className={`px-2 py-1 rounded-md text-[11px] font-mono transition-all ${
              sandboxMode === 'single'
                ? 'bg-white text-blue-600 font-bold border border-border shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Single Output
          </button>
          <button
            type="button"
            onClick={() => setSandboxMode('compare')}
            className={`px-2 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1 ${
              sandboxMode === 'compare'
                ? 'bg-white text-blue-600 font-bold border border-border shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span>Compare Models</span>
          </button>
          <button
            type="button"
            onClick={() => setSandboxMode('merge')}
            className={`px-2 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1 ${
              sandboxMode === 'merge'
                ? 'bg-white text-emerald-700 font-bold border border-border shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <GitMerge className="w-3 h-3" />
            <span>Merge Models</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODE 1: SINGLE MODEL OUTPUT (WIREFRAME EXACT)
         ========================================================================= */}
      {sandboxMode === 'single' && (
        <div className="space-y-3">
          {/* Target Dataset Selection Box */}
          <div className="p-2.5 rounded-xl border border-border bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-foreground font-mono flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>Targeted Sandbox Dataset</span>
              </label>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Connected to Repo
              </span>
            </div>

            <select
              value={selectedDataset}
              onChange={(e) => {
                setSelectedDataset(e.target.value);
                handleSimulate();
              }}
              className="w-full bg-white border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {targetedDatasets.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.name} ({ds.rows})
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/60">
              <span>Active Model: <strong className="text-foreground">{currentModel.name}</strong></span>
              <button 
                type="button"
                onClick={() => setIsParamsOpen(!isParamsOpen)}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{isParamsOpen ? 'Hide Parameters' : 'Adjust Model Parameters'}</span>
              </button>
            </div>

            {/* Collapsible Parameter Controls */}
            {isParamsOpen && (
              <div className="p-2.5 mt-1.5 rounded-lg bg-slate-50 border border-border space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-muted-foreground">Target Volatility (%):</span>
                  <span className="font-bold text-foreground">{targetVol}%</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  value={targetVol}
                  onChange={(e) => setTargetVol(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-border rounded-lg cursor-pointer"
                />

                <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                  <span className="text-muted-foreground">Max Single-Stock Position (%):</span>
                  <span className="font-bold text-foreground">{maxPosition}%</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="20"
                  value={maxPosition}
                  onChange={(e) => setMaxPosition(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-border rounded-lg cursor-pointer"
                />

                <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                  <span className="text-muted-foreground">Daily 95% VaR Upper Bound (%):</span>
                  <span className="font-bold text-foreground">{varLimit}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={varLimit}
                  onChange={(e) => setVarLimit(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-border rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Performance Over Time Card */}
          <div className="p-3 rounded-xl border border-border bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground font-mono">Performance Over Time</span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-blue-600 inline-block" />
                  <span className="text-muted-foreground">Returns (%):</span>
                  <strong className="text-blue-700 font-bold">+{performanceData[performanceData.length - 1].returns}%</strong>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-slate-400 inline-block" />
                  <span className="text-muted-foreground">Sharpe:</span>
                  <strong className="text-foreground font-bold">{performanceData[performanceData.length - 1].sharpe}</strong>
                </div>
              </div>
            </div>

            <div className="w-full h-44 pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis domain={[10, 18]} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any, name: any) => [name === 'returns' ? `+${val}%` : val, name === 'returns' ? 'Return' : 'Sharpe']}
                  />
                  <Line type="monotone" dataKey="returns" stroke="#2563eb" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="sharpe" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Returns Distribution Histogram */}
          <div className="p-3 rounded-xl border border-border bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground font-mono">Returns Distribution</span>
              <div className="flex items-center gap-1 text-[10px] font-mono">
                {(['1D', '5D', '3M', '1Y', '3Y', '5Y', 'Max'] as TimeframePeriod[]).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setActiveTimeframe(tf)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all border ${
                      activeTimeframe === tf
                        ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-2xs'
                        : 'bg-white text-muted-foreground border-border hover:bg-slate-50'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-28 pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 8, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis tick={{ fontSize: 8, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any) => [`${val} samples`, 'Frequency']}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-border text-center">
              <div className="p-1.5 rounded-lg bg-slate-50 border border-border">
                <span className="text-[9px] text-muted-foreground block font-mono">Mean Return</span>
                <span className="font-bold text-foreground font-mono text-[11px]">+0.14%/day</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50 border border-border">
                <span className="text-[9px] text-muted-foreground block font-mono">Daily VaR 95%</span>
                <span className="font-bold text-emerald-700 font-mono text-[11px]">{currentModel.varLimit || 1.14}%</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50 border border-border">
                <span className="text-[9px] text-muted-foreground block font-mono">Max Drawdown</span>
                <span className="font-bold text-foreground font-mono text-[11px]">-3.2%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 2: COMPARE TWO MODELS (A vs B)
         ========================================================================= */}
      {sandboxMode === 'compare' && (
        <div className="space-y-3 animate-in fade-in">
          
          {/* Dual Model Selectors */}
          <div className="p-3 rounded-xl border border-border bg-slate-50/50 space-y-2.5">
            <div className="text-xs font-bold text-foreground font-mono flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
                Select Two Models to Compare in Sandbox:
              </span>
              <Badge variant="outline" className="text-[10px] font-mono bg-white border-border">
                Dual Sandbox Overlay
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-blue-700 font-bold block">● Model A (Base):</span>
                <select
                  value={compareModelAId}
                  onChange={(e) => setCompareModelAId(e.target.value)}
                  className="w-full bg-white border border-border rounded-lg px-2 py-1 text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                >
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.version})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-700 font-bold block">● Model B (Challenger):</span>
                <select
                  value={compareModelBId}
                  onChange={(e) => setCompareModelBId(e.target.value)}
                  className="w-full bg-white border border-border rounded-lg px-2 py-1 text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.version})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Targeted Dataset for Comparison */}
            <div className="pt-1.5 border-t border-border flex items-center justify-between text-[11px] font-mono">
              <span className="text-muted-foreground">Test Dataset:</span>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="bg-white border border-border rounded px-2 py-0.5 text-xs font-mono text-foreground"
              >
                {targetedDatasets.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dual-Curve Performance Chart */}
          <div className="p-3 rounded-xl border border-border bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground font-mono">Performance Comparison (Overlay)</span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="text-blue-700 font-bold">● {modelA.name}: +{compareData[compareData.length - 1].returnsA}%</span>
                <span className="text-emerald-700 font-bold">● {modelB.name}: +{compareData[compareData.length - 1].returnsB}%</span>
              </div>
            </div>

            <div className="w-full h-44 pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={compareData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis domain={[10, 20]} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any, name: any) => [
                      `+${val}%`, 
                      name === 'returnsA' ? modelA.name : modelB.name
                    ]}
                  />
                  <Line type="monotone" dataKey="returnsA" stroke="#2563eb" strokeWidth={2} dot={false} name={modelA.name} />
                  <Line type="monotone" dataKey="returnsB" stroke="#10b981" strokeWidth={2} dot={false} name={modelB.name} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side-by-Side Metric Comparison Table */}
          <div className="p-3 rounded-xl border border-border bg-white shadow-2xs space-y-2">
            <span className="text-xs font-bold text-foreground font-mono block">Quantitative Delta Analysis</span>
            
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] font-mono">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="pb-1.5 font-medium">Metric</th>
                    <th className="pb-1.5 font-bold text-blue-700">{modelA.name}</th>
                    <th className="pb-1.5 font-bold text-emerald-700">{modelB.name}</th>
                    <th className="pb-1.5 font-medium text-right">Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-1 text-muted-foreground">Expected 1Y Return</td>
                    <td className="py-1 font-semibold text-foreground">+{modelA.expectedReturn || 13.8}%</td>
                    <td className="py-1 font-bold text-emerald-700">+{modelB.expectedReturn || 15.6}%</td>
                    <td className="py-1 text-right text-emerald-700 font-bold">
                      +{((modelB.expectedReturn || 15.6) - (modelA.expectedReturn || 13.8)).toFixed(1)}% (B)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-muted-foreground">Sharpe Ratio</td>
                    <td className="py-1 font-semibold text-foreground">{modelA.expectedSharpe || 1.84}</td>
                    <td className="py-1 font-bold text-emerald-700">{modelB.expectedSharpe || 2.15}</td>
                    <td className="py-1 text-right text-emerald-700 font-bold">
                      +{((modelB.expectedSharpe || 2.15) - (modelA.expectedSharpe || 1.84)).toFixed(2)} (B)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-muted-foreground">Daily 95% VaR</td>
                    <td className="py-1 font-semibold text-foreground">{modelA.varLimit || 1.25}%</td>
                    <td className="py-1 font-bold text-emerald-700">{modelB.varLimit || 1.05}%</td>
                    <td className="py-1 text-right text-emerald-700 font-bold">
                      {((modelA.varLimit || 1.25) - (modelB.varLimit || 1.05) > 0 ? 'Safer in B' : 'Comparable')}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-muted-foreground">Max Shock Drawdown</td>
                    <td className="py-1 font-semibold text-foreground">-3.2%</td>
                    <td className="py-1 font-bold text-emerald-700">-2.1%</td>
                    <td className="py-1 text-right text-emerald-700 font-bold">+1.1% buffer (B)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">
                Synthesize both strategies into a unified model:
              </span>
              <Button
                type="button"
                size="sm"
                onClick={() => setSandboxMode('merge')}
                className="font-mono text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-3 h-7 gap-1 shadow-2xs"
              >
                <GitMerge className="w-3 h-3" />
                <span>Merge Models</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 3: MERGE TWO MODELS INTO ONE
         ========================================================================= */}
      {sandboxMode === 'merge' && (
        <div className="space-y-3 animate-in fade-in">
          
          <div className="p-3 rounded-xl border border-border bg-emerald-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-foreground font-mono flex items-center gap-1.5">
                <GitMerge className="w-4 h-4 text-emerald-600" />
                <span>Model Merger &amp; Signal Combination Engine</span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono bg-white text-emerald-700 border-emerald-300">
                Barra Covariance Optimized
              </Badge>
            </div>

            <p className="text-[11px] text-muted-foreground font-sans">
              Merge the qualitative parent orchestrator of Model A with specialized feature extractors or risk overlays from Model B into a new unified model.
            </p>

            {/* Model Pair Selection */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-blue-700 font-bold block">Base Model A:</span>
                <select
                  value={compareModelAId}
                  onChange={(e) => setCompareModelAId(e.target.value)}
                  className="w-full bg-white border border-border rounded-lg px-2 py-1 text-xs font-mono text-foreground"
                >
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-700 font-bold block">Feature Model B:</span>
                <select
                  value={compareModelBId}
                  onChange={(e) => setCompareModelBId(e.target.value)}
                  className="w-full bg-white border border-border rounded-lg px-2 py-1 text-xs font-mono text-foreground"
                >
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Merge Strategy Rule */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-foreground font-bold block">Merge Allocation Protocol:</span>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  {
                    id: 'factor-cov',
                    title: 'Factor Covariance Union (Barra Weighted)',
                    desc: 'Weights signals inversely to factor covariance, neutralizing systematic market beta.'
                  },
                  {
                    id: 'sharpe-max',
                    title: 'Alpha-Sharpe Frontier Maximizer',
                    desc: 'Dynamically routes order flow to whichever sub-agent maintains highest rolling 30-day Sharpe.'
                  },
                  {
                    id: 'sec-overlay',
                    title: 'Strict Pre-Trade Risk Overlay (SEC 15c3-5)',
                    desc: 'Overlays Model B’s execution gates directly onto Model A’s Parent Orchestrator.'
                  }
                ].map((strat) => (
                  <div
                    key={strat.id}
                    onClick={() => setMergeStrategy(strat.id)}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                      mergeStrategy === strat.id
                        ? 'bg-white border-emerald-600 ring-1 ring-emerald-500/20 shadow-2xs'
                        : 'bg-white/60 hover:bg-white border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground font-mono">{strat.title}</span>
                      {mergeStrategy === strat.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{strat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Projected Merged Metrics */}
            <div className="p-2.5 rounded-lg bg-white border border-border space-y-2">
              <span className="text-[10px] font-mono font-bold text-foreground block">
                Projected Merged Model Metrics:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-1.5 bg-slate-50 rounded border border-border">
                  <span className="text-[9px] font-mono text-muted-foreground block">Merged Return</span>
                  <span className="text-xs font-bold text-emerald-700 font-mono">+17.4%</span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded border border-border">
                  <span className="text-[9px] font-mono text-muted-foreground block">Merged Sharpe</span>
                  <span className="text-xs font-bold text-blue-700 font-mono">2.28</span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded border border-border">
                  <span className="text-[9px] font-mono text-muted-foreground block">Daily VaR 95%</span>
                  <span className="text-xs font-bold text-foreground font-mono">0.92%</span>
                </div>
              </div>
            </div>

            {/* Merge Action Button */}
            <Button
              type="button"
              onClick={handleExecuteMerge}
              className="w-full font-mono text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-9 shadow-2xs gap-1.5"
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Merge into New Model &amp; Test in Sandbox</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </div>

        </div>
      )}

      {/* Action Footer for Single / Backtest mode */}
      <div className="pt-1 flex items-center justify-between gap-2 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSimulate}
          className="flex-1 font-mono text-xs gap-1.5 h-8 bg-white hover:bg-slate-50 text-foreground border-border"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>Re-run Simulation</span>
        </Button>

        {onDeployModel && (
          <Button
            type="button"
            size="sm"
            onClick={onDeployModel}
            className="flex-1 font-mono text-xs gap-1.5 h-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Deploy Model</span>
          </Button>
        )}
      </div>

    </div>
  );
};
