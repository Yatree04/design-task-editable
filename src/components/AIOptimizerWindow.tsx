import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  TrendingUp, 
  ShieldCheck, 
  SlidersHorizontal, 
  ArrowUpRight, 
  Layers, 
  Zap, 
  CheckCircle2, 
  Plus, 
  Cpu, 
  RefreshCw,
  Search,
  Database,
  LineChart as LineChartIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export interface StrategyIdea {
  id: string;
  title: string;
  sourceNode: string;
  category: 'alpha' | 'arbitrage' | 'risk-overlay' | 'momentum';
  description: string;
  offerings: {
    expectedAlpha: string;
    sharpeImpact: string;
    varImpact: string;
    drawdownProtection: string;
    factorNeutrality: string;
    keyEdge: string;
  };
  suggestedNodes: {
    id: string;
    name: string;
    type: 'parent' | 'subagent' | 'data' | 'tool';
    role: string;
    status: 'ACTIVE' | 'READY' | 'DEPLOYED';
    inputs: string;
    outputLink: string;
    instructions: string;
    defaultProperty: string;
    codeSnippet: string;
    tools: string[];
    latency: string;
    x: number;
    y: number;
  }[];
  parameters: {
    targetVol: number;
    maxPosition: number;
    varLimit: number;
  };
}

export const INSTITUTIONAL_STRATEGY_IDEAS: StrategyIdea[] = [
  {
    id: 'strat-skew-arb',
    title: 'Cross-Asset Volatility Skew Arbitrage',
    sourceNode: 'Research Judgement Node (Parent Orchestrator)',
    category: 'arbitrage',
    description: 'Exploits structural mispricings between S&P index options implied volatility skew and realized single-stock semiconductor dispersion during corporate earnings cycles.',
    offerings: {
      expectedAlpha: '+3.4% Net Alpha',
      sharpeImpact: '1.84 → 2.18 (+0.34)',
      varImpact: '-14 bps Daily VaR (Risk Reduced)',
      drawdownProtection: '-1.8% Shock Cushion',
      factorNeutrality: 'Beta Neutral (<0.04), Sector & Market-Cap Balanced',
      keyEdge: 'Captures post-earnings announcement implied volatility compression without directional underlying exposure.'
    },
    parameters: {
      targetVol: 12,
      maxPosition: 8,
      varLimit: 1.10
    },
    suggestedNodes: [
      {
        id: 'node-skew-parent',
        name: 'Skew Dispersion Parent Agent',
        type: 'parent',
        role: 'Parent Volatility Orchestrator',
        status: 'ACTIVE',
        inputs: 'Implied Volatility Surface, Earnings Calendar, Single-Stock Realized Vol',
        outputLink: 'Delta Neutral Execution Sub-Agent',
        instructions: 'Monitor ATM vs OTM implied volatility ratios across mega-cap tech stocks and orchestrate delta-neutral straddle dispersion overlays.',
        defaultProperty: 'Highest Sharpe Weighting',
        codeSnippet: `# SKEW DISPERSION ORCHESTRATOR
class SkewDispersionAgent(QuantParentAgent):
    def compute_dispersion(self, iv_surface, rv_basket):
        skew_spread = iv_surface.get_skew_ratio() - rv_basket.realized_vol
        if skew_spread > 0.15:
            return self.issue_dispersion_hedge(skew_spread)
        return None`,
        tools: ['IV Surface Feeder', 'Earnings NLP Calendar', 'Option Greek Calculator'],
        latency: '14ms',
        x: 30,
        y: 110
      },
      {
        id: 'node-skew-sub',
        name: 'Delta-Neutral Execution Gate',
        type: 'subagent',
        role: 'Sub-Agent: Delta Hedger',
        status: 'READY',
        inputs: 'Proposed option dispersion pairs',
        outputLink: 'FIX 4.4 Trade Blotter (DMA)',
        instructions: 'Continuously rebalance underlying equity positions to maintain portfolio delta within ±0.02.',
        defaultProperty: 'Strict Delta Capped',
        codeSnippet: `# DELTA HEDGE ROUTER
class DeltaHedgeSubAgent(PreTradeGate):
    def neutralize_delta(self, portfolio_delta):
        if abs(portfolio_delta) > 0.02:
            return self.route_futures_hedge(-portfolio_delta)`,
        tools: ['FIX 4.4 Engine', 'Live Delta Monitor'],
        latency: '4ms',
        x: 220,
        y: 60
      },
      {
        id: 'node-skew-data',
        name: 'Option Greek & Vol Surface Store',
        type: 'data',
        role: 'Quantitative Feature Store',
        status: 'ACTIVE',
        inputs: 'Live OPRA options tick feed, CBOE implied volatility matrix',
        outputLink: 'Skew Dispersion Parent Agent',
        instructions: 'Stream sub-millisecond Black-Scholes surfaces and local volatility grids for S&P 500 components.',
        defaultProperty: 'Conservative 15c3-5 Check',
        codeSnippet: `# VOLATILITY SURFACE DATA STORE
class VolSurfaceDataLayer(DataNode):
    def get_surface(self, symbol):
        return self.cboe_buffer.fetch_local_vol(symbol)`,
        tools: ['OPRA Feed', 'CBOE Engine'],
        latency: '6ms',
        x: 200,
        y: 200
      }
    ]
  },
  {
    id: 'strat-capex-momentum',
    title: 'Hyperscaler Capex Lead-Lag Momentum',
    sourceNode: 'Market Trend Referral Sub-Agent + Barra Matrix',
    category: 'momentum',
    description: 'Quantifies the empirical 45-day lead-lag window between Big Tech cloud infrastructure capital commitments and downstream semiconductor equipment supplier quarterly revenue surprises.',
    offerings: {
      expectedAlpha: '+4.1% Systematic Alpha',
      sharpeImpact: '1.84 → 2.24 (+0.40)',
      varImpact: '-8 bps Daily VaR',
      drawdownProtection: '-1.2% Shock Buffer',
      factorNeutrality: 'Supply-chain long/short paired neutrality',
      keyEdge: 'Exploits institutional information delays in component supply-chain pass-through.'
    },
    parameters: {
      targetVol: 14,
      maxPosition: 12,
      varLimit: 1.20
    },
    suggestedNodes: [
      {
        id: 'node-capex-parent',
        name: 'Supply-Chain Lead-Lag Orchestrator',
        type: 'parent',
        role: 'Parent Momentum Orchestrator',
        status: 'ACTIVE',
        inputs: 'Cloud 10-Q Capex Statements, Tier-1 Semiconductor PO commitments',
        outputLink: 'Lead-Lag Pair Extractor',
        instructions: 'Evaluate hyperscaler Capex run-rates and generate paired long/short allocations between equipment manufacturers and cloud customers.',
        defaultProperty: 'Highest Sharpe Weighting',
        codeSnippet: `# CAPEX LEAD-LAG ORCHESTRATOR
class CapexLeadLagAgent(QuantParentAgent):
    def evaluate_capex_lead(self, hyperscaler_filings):
        capex_growth = self.nlp_parser.extract_guidance(hyperscaler_filings)
        return self.rank_supplier_sensitivities(capex_growth)`,
        tools: ['SEC 10-Q Parser', 'Capex Tracking Engine', 'Supply Chain Graph'],
        latency: '22ms',
        x: 30,
        y: 110
      },
      {
        id: 'node-capex-sub',
        name: 'Lead-Lag Pair Extractor',
        type: 'subagent',
        role: 'Sub-Agent: Feature Extractor',
        status: 'READY',
        inputs: 'Capex signals and relative price momentum vectors',
        outputLink: 'Execution Gate Sub-Agent',
        instructions: 'Construct beta-neutral pairs trading baskets between ASML, Applied Materials, and hyperscaler buyers.',
        defaultProperty: 'Factor Neutral Union',
        codeSnippet: `# PAIR EXTRACTOR
class PairMomentumExtractor(FeatureExtractor):
    def construct_pairs(self, signal_vector):
        return self.optimize_cointegration(signal_vector)`,
        tools: ['Cointegration Engine', 'Barra Risk API'],
        latency: '8ms',
        x: 220,
        y: 50
      },
      {
        id: 'node-capex-data',
        name: 'Barra Factor Covariance & Cointegration Store',
        type: 'data',
        role: 'Feature Store',
        status: 'ACTIVE',
        inputs: 'Historical 10-year supply chain shipments, earnings transcript timestamps',
        outputLink: 'Supply-Chain Lead-Lag Orchestrator',
        instructions: 'Deliver cointegration residuals and stationarity tests for pairs trading execution.',
        defaultProperty: 'Strict Delta Capped',
        codeSnippet: `# COINTEGRATION STORE
class CointegrationStore(DataNode):
    def get_residuals(self, pair_basket):
        return self.ny4_colo.calculate_adf_test(pair_basket)`,
        tools: ['Barra Matrix', 'Polars Analytics'],
        latency: '5ms',
        x: 200,
        y: 200
      }
    ]
  },
  {
    id: 'strat-l2-imbalance',
    title: 'High-Frequency L2 Order Imbalance Scalper',
    sourceNode: 'NY4 DMA Execution Sub-Agent',
    category: 'alpha',
    description: 'Microsecond tick queue imbalance engine capturing transient liquidity provider spreads ahead of systematic block order sweeps at Equinix NY4 colocation.',
    offerings: {
      expectedAlpha: '+2.9% High-Turnover Alpha',
      sharpeImpact: '1.84 → 2.31 (+0.47)',
      varImpact: 'Zero overnight holding risk (100% intraday flat)',
      drawdownProtection: 'Daily stop-loss strictly capped at -0.3%',
      factorNeutrality: 'Pure microstructure alpha, zero macro factor correlation',
      keyEdge: 'Sub-millisecond direct market access queue priority on NASDAQ / NYSE orderbooks.'
    },
    parameters: {
      targetVol: 9,
      maxPosition: 6,
      varLimit: 0.95
    },
    suggestedNodes: [
      {
        id: 'node-hft-parent',
        name: 'L2 Microstructure Scalper Parent',
        type: 'parent',
        role: 'Parent Tick Orchestrator',
        status: 'ACTIVE',
        inputs: 'ITCH 5.0 L3 Order Stream, Real-Time Book Pressure, Cancellations',
        outputLink: 'Ultra-Low Latency DMA Router',
        instructions: 'Detect bid-ask queue exhaustion and execute pre-emptive passive liquidity sweeps.',
        defaultProperty: 'Conservative 15c3-5 Check',
        codeSnippet: `# L2 MICROSTRUCTURE SCALPER
class L2ScalperAgent(QuantParentAgent):
    def on_book_update(self, l2_depth):
        imbalance = (l2_depth.bids - l2_depth.asks) / (l2_depth.bids + l2_depth.asks)
        if abs(imbalance) > 0.40:
            return self.post_passive_limit(imbalance)`,
        tools: ['ITCH 5.0 Processor', 'FPGA Tick Sizer', 'Direct Feed NY4'],
        latency: '0.04ms',
        x: 30,
        y: 110
      }
    ]
  },
  {
    id: 'strat-decrowding-overlay',
    title: 'Multi-Factor Covariance De-Crowding Overlay',
    sourceNode: 'Quantitative Data Layer + Managing Node',
    category: 'risk-overlay',
    description: 'Dynamic eigenvalue decomposition of the cross-asset correlation matrix that detects crowded systematic factor exposures (Momentum, Quality, Low-Vol) and automatically injects neutralizing hedge tickets.',
    offerings: {
      expectedAlpha: '+2.2% Sharpe-Stabilized Alpha',
      sharpeImpact: '1.84 → 2.12 (+0.28)',
      varImpact: '-28 bps Daily VaR (Major Risk Cushion)',
      drawdownProtection: 'Eliminates factor crash contagion in sudden rotations',
      factorNeutrality: 'True orthogonal multi-factor union',
      keyEdge: 'Prevents sudden liquidation spirals by de-correlating portfolio sub-strategies before factor breaks occur.'
    },
    parameters: {
      targetVol: 10,
      maxPosition: 10,
      varLimit: 1.00
    },
    suggestedNodes: [
      {
        id: 'node-crowd-parent',
        name: 'Factor De-Crowding Orchestrator',
        type: 'parent',
        role: 'Parent Risk Neutralizer',
        status: 'ACTIVE',
        inputs: 'Cross-Asset Barra Factor Betas, Real-Time Prime Broker Crowding Scores',
        outputLink: 'Execution Gate Sub-Agent',
        instructions: 'Decompose active risk into orthogonal eigenvectors. If dominant eigenvalue exceeds 45% variance explained, deploy factor neutralization hedges.',
        defaultProperty: 'Factor Neutral Union',
        codeSnippet: `# DE-CROWDING RISK ORCHESTRATOR
class FactorDeCrowdingAgent(QuantParentAgent):
    def evaluate_crowding(self, active_betas, cov_matrix):
        eigenvalues, _ = np.linalg.eigh(cov_matrix)
        variance_ratio = max(eigenvalues) / sum(eigenvalues)
        if variance_ratio > 0.45:
            return self.neutralize_dominant_factor(active_betas)`,
        tools: ['Eigenvalue Decomposer', 'Prime Broker Crowding API', 'Barra Matrix'],
        latency: '16ms',
        x: 30,
        y: 110
      }
    ]
  }
];

interface AIOptimizerWindowProps {
  onExperimentInAgentWorkspace?: (strategy: StrategyIdea) => void;
}

export const AIOptimizerWindow: React.FC<AIOptimizerWindowProps> = ({
  onExperimentInAgentWorkspace,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState<boolean>(false);
  const [strategies, setStrategies] = useState<StrategyIdea[]>(INSTITUTIONAL_STRATEGY_IDEAS);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>(INSTITUTIONAL_STRATEGY_IDEAS[0].id);

  // Filter strategies
  const filteredStrategies = strategies.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  const selectedStrategy = strategies.find(s => s.id === selectedStrategyId) || strategies[0];

  const handleGenerateCustom = () => {
    if (!customPrompt.trim()) return;
    setIsGeneratingCustom(true);

    setTimeout(() => {
      setIsGeneratingCustom(false);
      const newCustomIdea: StrategyIdea = {
        id: `strat-custom-${Date.now()}`,
        title: `Custom Hypothesis: ${customPrompt.slice(0, 42)}...`,
        sourceNode: 'Research Judgement Node (Custom Synthesis)',
        category: 'alpha',
        description: `Synthesized research thesis based on user prompt: "${customPrompt}". Targets persistent risk-adjusted excess returns using multi-agent signal routing.`,
        offerings: {
          expectedAlpha: '+3.8% Targeted Alpha',
          sharpeImpact: '1.84 → 2.21 (+0.37)',
          varImpact: '-16 bps Daily VaR',
          drawdownProtection: '-1.5% Shock Cushion',
          factorNeutrality: 'Strictly Beta Neutral (<0.05)',
          keyEdge: 'Directly tailored to current market conditions with custom factor constraints.'
        },
        parameters: {
          targetVol: 13,
          maxPosition: 10,
          varLimit: 1.15
        },
        suggestedNodes: [
          {
            id: `node-custom-${Date.now()}`,
            name: `${customPrompt.slice(0, 24)} Parent Agent`,
            type: 'parent',
            role: 'Parent Custom Orchestrator',
            status: 'ACTIVE',
            inputs: 'Macro statements, Real-time tick stream, Factor Covariance',
            outputLink: 'Execution Sub-Agent (Terminal Node)',
            instructions: `Execute systematic algorithmic rebalancing for hypothesis: "${customPrompt}".`,
            defaultProperty: 'Highest Sharpe Weighting',
            codeSnippet: `# CUSTOM GENERATED RESEARCH NODE
class CustomResearchNode(QuantParentAgent):
    def __init__(self):
        super().__init__(name="Custom Research Node")
        self.hypothesis = "${customPrompt}"
        
    def evaluate(self, tick_stream):
        return self.optimize_sharpe_frontier()`,
            tools: ['Macro News Wire', 'Barra Risk API', 'Execution Gate'],
            latency: '15ms',
            x: 30,
            y: 110
          }
        ]
      };

      setStrategies(prev => [newCustomIdea, ...prev]);
      setSelectedStrategyId(newCustomIdea.id);
      setCustomPrompt('');
    }, 900);
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-xs space-y-4 select-none">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground font-mono">
              AI Optimisation
            </h3>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'All Ideas' },
            { id: 'arbitrage', label: 'Arbitrage' },
            { id: 'momentum', label: 'Momentum' },
            { id: 'alpha', label: 'Alpha' },
            { id: 'risk-overlay', label: 'Risk Overlay' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-2xs'
                  : 'bg-white text-muted-foreground border-border hover:bg-slate-50 hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid: Left = Strategy Cards List, Right = Detailed "What this idea has to offer" & Experiment Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Strategy Idea Selection List (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {filteredStrategies.map((strat) => {
            const isSelected = strat.id === selectedStrategyId;
            return (
              <div
                key={strat.id}
                onClick={() => setSelectedStrategyId(strat.id)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all shadow-2xs ${
                  isSelected
                    ? 'bg-blue-50/40 border-blue-500 ring-2 ring-blue-400/20'
                    : 'bg-white hover:bg-slate-50 border-border'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-foreground font-mono truncate">
                    {strat.title}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-border text-muted-foreground shrink-0 uppercase">
                    {strat.category}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-blue-700 flex items-center gap-1 mb-1.5">
                  <Bot className="w-3 h-3" />
                  <span className="truncate">{strat.sourceNode}</span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {strat.description}
                </p>
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/60 text-[10px] font-mono">
                  <span className="text-emerald-700 font-semibold">{strat.offerings.expectedAlpha}</span>
                  <span className="text-muted-foreground">Sharpe: {strat.offerings.sharpeImpact}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Proposal "What this idea has to offer" (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50/60 rounded-xl border border-border p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-3">
            {/* Title & Origin */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono text-blue-700 font-semibold flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  <span>Origin: {selectedStrategy.sourceNode}</span>
                </div>
                <h4 className="text-sm font-bold text-foreground font-mono mt-0.5">
                  {selectedStrategy.title}
                </h4>
              </div>
              <Badge variant="outline" className="bg-white font-mono text-xs text-foreground border-border shadow-2xs">
                {selectedStrategy.category.toUpperCase()}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-xs text-foreground/80 leading-relaxed font-sans">
              {selectedStrategy.description}
            </p>

            {/* Strategy Metrics & Constraints container */}
            <div className="bg-white rounded-xl border border-border p-3 space-y-2.5 shadow-2xs">
              <div className="text-xs font-bold text-foreground font-mono flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Strategy Metrics &amp; Risk Constraints</span>
              </div>

              {/* 4 Quantitative Metrics Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-lg bg-slate-50 border border-border">
                  <span className="text-[9px] font-mono text-muted-foreground block">Expected Net Alpha</span>
                  <span className="text-xs font-bold text-emerald-700 font-mono">
                    {selectedStrategy.offerings.expectedAlpha}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-border">
                  <span className="text-[9px] font-mono text-muted-foreground block">Sharpe Uplift</span>
                  <span className="text-xs font-bold text-blue-700 font-mono">
                    {selectedStrategy.offerings.sharpeImpact}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-border">
                  <span className="text-[9px] font-mono text-muted-foreground block">VaR 95% Impact</span>
                  <span className="text-xs font-bold text-foreground font-mono">
                    {selectedStrategy.offerings.varImpact}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-border">
                  <span className="text-[9px] font-mono text-muted-foreground block">Shock Cushion</span>
                  <span className="text-xs font-bold text-purple-700 font-mono">
                    {selectedStrategy.offerings.drawdownProtection}
                  </span>
                </div>
              </div>

              {/* Qualitative Advantage Breakdown */}
              <div className="space-y-1.5 pt-1 text-xs font-mono">
                <div className="flex items-start gap-1.5 text-foreground/90">
                  <span className="text-blue-600 font-bold shrink-0">▸ Factor Neutrality:</span>
                  <span className="text-[11px] text-muted-foreground">{selectedStrategy.offerings.factorNeutrality}</span>
                </div>
                <div className="flex items-start gap-1.5 text-foreground/90">
                  <span className="text-emerald-600 font-bold shrink-0">▸ Core Edge:</span>
                  <span className="text-[11px] text-muted-foreground">{selectedStrategy.offerings.keyEdge}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Callout Button */}
          <div className="pt-2 border-t border-border flex items-center justify-between gap-3">
            <div className="text-[11px] font-mono text-muted-foreground">
              Loads as a new Model Tab with custom DAG nodes in the workspace.
            </div>
            <Button
              type="button"
              onClick={() => {
                if (onExperimentInAgentWorkspace) {
                  onExperimentInAgentWorkspace(selectedStrategy);
                }
              }}
              className="font-mono text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 h-9 gap-1.5 shadow-2xs shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Experiment in Agent Workspace on New Model</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Ideation Box: Prompt the Research Node for a tailored strategy */}
      <div className="p-3 rounded-xl border border-border bg-slate-50/50 flex flex-col sm:flex-row items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-foreground shrink-0">
          <Bot className="w-4 h-4 text-blue-600" />
          <span>Prompt Research Node:</span>
        </div>
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleGenerateCustom();
          }}
          placeholder="e.g. Generate a delta-neutral pairs hedge for European semiconductor fab supply chains..."
          className="flex-1 bg-white border border-border rounded-lg px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-full"
        />
        <Button
          type="button"
          size="sm"
          disabled={isGeneratingCustom || !customPrompt.trim()}
          onClick={handleGenerateCustom}
          className="font-mono text-xs font-semibold bg-white hover:bg-slate-100 text-foreground border border-border h-8 shrink-0 shadow-2xs gap-1"
        >
          <RefreshCw className={`w-3 h-3 ${isGeneratingCustom ? 'animate-spin text-blue-600' : ''}`} />
          <span>{isGeneratingCustom ? 'Synthesizing Idea...' : 'Synthesize Strategy Idea'}</span>
        </Button>
      </div>

    </div>
  );
};
