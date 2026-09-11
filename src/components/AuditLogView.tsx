import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Save, 
  Search, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  ArrowRight, 
  Layers, 
  UserCheck, 
  Clock, 
  HelpCircle, 
  FileText, 
  BarChart2, 
  TrendingUp, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Download,
  Info,
  RefreshCw,
  Sliders,
  Database,
  Code2,
  Workflow,
  CheckCheck,
  ChevronRight,
  Maximize2,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface AuditLogViewProps {
  onNavigateToOverview?: () => void;
  onOpenAgentModal?: (query?: string) => void;
  onSelectTab?: (tab: any) => void;
}

interface HumanIntervention {
  id: string;
  operator: string;
  role: string;
  timestamp: string;
  actionTaken: string;
  reasoning: string;
  parameterDiff: string;
  finalOutcome: string;
  status: 'Validated' | 'Active' | 'Under Review';
}

export interface SubAgentResearchNode {
  id: string;
  name: string;
  subAgentName: string;
  tag: string;
  type: 'Research' | 'Calibration' | 'Factor Neutralization' | 'Compliance' | 'Execution Gate';
  lastExecutionTime: string;
  refreshIntervalSec: number;
  antiHallucinationConfidence: number;
  status: 'Operational' | 'Active' | 'Verifying' | 'Completed';
  latencyMs: number;
  taskSummary: string;
  fullDescription: string;
  checklist: string[];
  functionsUsed: string[];
  datasetsUsed: string[];
  workDoneMetrics: { label: string; value: string }[];
  passedToNode: string;
  payloadSummary: string;
}

interface ModelWorkflowData {
  id: string;
  name: string;
  tag: string;
  subAgentNodes: SubAgentResearchNode[];
  
  // Column 2 Data
  passedToNode: string;
  payloadSummary: string;
  latencyMs: number;
  sandboxSharpe: number;
  sandboxVaR: number;
  sandboxMaxDrawdown: number;
  sandboxWinRate: number;
  chartData: { time: string; alpha: number; benchmark: number; confidence: number }[];
  
  // Q&A History
  qaHistory: { q: string; a: string; time: string }[];
  
  // Column 3 Data
  humanInterventions: HumanIntervention[];
}

const INITIAL_WORKFLOWS: Record<string, ModelWorkflowData> = {
  'model-1': {
    id: 'model-1',
    name: 'Model 1 (Production Core)',
    tag: 'Core Execution',
    subAgentNodes: [
      {
        id: 'node-m1-1',
        name: 'Node 1: Research & Discovery',
        subAgentName: 'Research Judgement & Skew Arbitrage Sub-Agent',
        tag: 'Research',
        type: 'Research',
        lastExecutionTime: '10:52:18 UTC',
        refreshIntervalSec: 45,
        antiHallucinationConfidence: 99.8,
        status: 'Completed',
        latencyMs: 1.18,
        taskSummary: 'Completed multi-asset volatility surface calibration, dynamic factor neutralization, and pre-trade compliance checks across 500 universe equities.',
        fullDescription: 'This sub-agent continuously parses implied vs realized volatility surfaces across S&P 500 equities. It isolates systematic variance premia by decomposing ATM vs 25-delta OTM skew curves, verifies non-arbitrage bounds, and feeds clean residual alpha signals downstream.',
        checklist: [
          'Implied Volatility term-structure skew decomposed (ATM vs 25-delta OTM)',
          'Covariance condition number bounded (<14.2) to prevent matrix inversion drift',
          'Anti-hallucination semantic grounding check against live NY4 L2 tick stream: PASSED',
          'Verified zero lookahead bias with immutable timestamp validation'
        ],
        functionsUsed: [
          'scipy.optimize.minimize(sharpe_frontier)',
          'black_scholes_surface_calibration(iv_ticks)',
          'barra_gem3_factor_orthogonalization()',
          'sec_15c3_pretrade_gate()'
        ],
        datasetsUsed: [
          'CBOE_IV_TERM_STRUCTURE_REALTIME',
          'BARRA_US9_FACTOR_COVARIANCE',
          'OPRA_OPTIONS_L3_TICKSTREAM',
          'NY4_CROSS_CONNECT_L2_ORDERBOOK'
        ],
        workDoneMetrics: [
          { label: 'Universe Screened', value: '500 Equities' },
          { label: 'Skew Divergence', value: '2.4σ Detected' },
          { label: 'Grounding Status', value: '99.8% Grounded' }
        ],
        passedToNode: 'Variance Swap Execution Gate (Terminal Node 4)',
        payloadSummary: 'Generated optimal order blotter: +45,000 Delta-Hedged Calls (SPY) / Short 12,000 Puts (QQQ). Net Delta: 0.00, Gamma: +1.42.'
      },
      {
        id: 'node-m1-2',
        name: 'Node 2: Vol Surface Calibration',
        subAgentName: 'Cross-Asset Volatility Fitting Sub-Agent',
        tag: 'Calibration',
        type: 'Calibration',
        lastExecutionTime: '10:51:50 UTC',
        refreshIntervalSec: 40,
        antiHallucinationConfidence: 99.9,
        status: 'Active',
        latencyMs: 0.85,
        taskSummary: 'Fitted SABR and Dupire local volatility surfaces across 1,200 strike/expiry pairs with cubic spline regularizations.',
        fullDescription: 'Calibrates stochastic volatility parameters (alpha, beta, rho, nu) across index option tenors from 1-day to 180-days. Eliminates butterfly and calendar spread arbitrage violations through convex quadratic programming.',
        checklist: [
          'Dupire local volatility forward PDE solved using Crank-Nicolson method',
          'No-arbitrage calendar spread constraints strictly enforced across all tenors',
          'SABR backbone calibrated against live OPRA feed within 0.04% root-mean-square error'
        ],
        functionsUsed: [
          'sabr_calibration_levenberg_marquardt()',
          'dupire_local_vol_surface_pde()',
          'cubic_spline_convex_hull_fit()'
        ],
        datasetsUsed: [
          'OPRA_L3_OPTIONS_CHAIN',
          'CBOE_VIX_FUTURES_TERM_STRUCTURE',
          'BLOOMBERG_IV_HISTORICAL'
        ],
        workDoneMetrics: [
          { label: 'Pairs Calibrated', value: '1,200 Strikes' },
          { label: 'RMSE Error', value: '0.038%' },
          { label: 'Arbitrage Breaches', value: '0 Violations' }
        ],
        passedToNode: 'Barra Factor Neutralizer',
        payloadSummary: 'Calibrated implied vol surface grid passed to covariance optimizer with zero boundary violations.'
      },
      {
        id: 'node-m1-3',
        name: 'Node 3: Factor Neutralization',
        subAgentName: 'Barra GEM3 Risk & Covariance Sub-Agent',
        tag: 'Factor Neutralization',
        type: 'Factor Neutralization',
        lastExecutionTime: '10:51:10 UTC',
        refreshIntervalSec: 50,
        antiHallucinationConfidence: 99.7,
        status: 'Completed',
        latencyMs: 1.42,
        taskSummary: 'Orthogonalized cross-asset portfolio beta to neutral levels against 68 macro and style factors (Momentum, Value, Growth, Size).',
        fullDescription: 'Applies singular value decomposition and eigenvalue clipping to Barra GEM3 factor matrices. Rebalances holdings to maintain strict factor neutral status within ±0.02 beta tolerance.',
        checklist: [
          'Style factor exposures neutralized to ±0.02 std dev boundary',
          'Sector concentration bounded to maximum 12.5% per GICS Level 1 industry',
          'Eigenvalue shrinkage applied to mitigate sample covariance noise'
        ],
        functionsUsed: [
          'eigenvalue_shrinkage_ledoit_wolf()',
          'quadratic_programming_qp_solve()',
          'factor_residual_extractor()'
        ],
        datasetsUsed: [
          'BARRA_US9_MACRO_FACTORS',
          'MSCI_GLOBAL_RISK_MODEL',
          'FACTSET_EARNINGS_CONSENSUS'
        ],
        workDoneMetrics: [
          { label: 'Factors Neutralized', value: '68 Factors' },
          { label: 'Beta Residual', value: '0.008' },
          { label: 'Tracking Error', value: '0.62%' }
        ],
        passedToNode: 'Terminal SEC Compliance Gate',
        payloadSummary: 'Delivered orthogonal factor weight matrix ensuring zero unhedged factor tilt.'
      },
      {
        id: 'node-m1-4',
        name: 'Node 4: Pre-Trade SEC Gate',
        subAgentName: 'SEC 15c3-5 Market Access & Router Sub-Agent',
        tag: 'Compliance',
        type: 'Compliance',
        lastExecutionTime: '10:50:40 UTC',
        refreshIntervalSec: 30,
        antiHallucinationConfidence: 100.0,
        status: 'Completed',
        latencyMs: 0.12,
        taskSummary: 'Enforced real-time credit checks, erroneous order price collars, and single-order gross notional caps on 57,000 contracts.',
        fullDescription: 'Deterministic pre-trade risk filter embedded directly inside FPGA/Kernel-bypass colocation stack. Guarantees that no order leaves the gateway without passing SEC Rule 15c3-5 pre-trade market access thresholds.',
        checklist: [
          'Gross and net capital exposure caps verified under $100M trading limit',
          'Price collar boundaries enforced within ±1.5% of National Best Bid/Offer (NBBO)',
          'Zero credit limit or fat-finger breaches recorded across all execution blotters'
        ],
        functionsUsed: [
          'sec_15c3_pretrade_gate()',
          'nbbo_price_collar_checker()',
          'capital_threshold_verdict()'
        ],
        datasetsUsed: [
          'SEC_RULE_15C3_5_POLICIES',
          'DIRECT_EXCHANGE_SIP_TAPE',
          'FIRM_CAPITAL_ALLOCATION_LEDGER'
        ],
        workDoneMetrics: [
          { label: 'SEC Gate Latency', value: '<0.08 ms' },
          { label: 'Collar Checks', value: '100% Passed' },
          { label: 'Gate Decision', value: 'APPROVED' }
        ],
        passedToNode: 'Terminal FIX Gate Router',
        payloadSummary: 'Cleared all 57,000 option contracts for live market routing via direct FIX sessions.'
      }
    ],
    passedToNode: 'Variance Swap Execution Gate (Terminal Node 4)',
    payloadSummary: 'Generated optimal order blotter: +45,000 Delta-Hedged Calls (SPY) / Short 12,000 Puts (QQQ). Net Delta: 0.00, Gamma: +1.42.',
    latencyMs: 1.18,
    sandboxSharpe: 2.84,
    sandboxVaR: 1.14,
    sandboxMaxDrawdown: -3.8,
    sandboxWinRate: 71.4,
    chartData: [
      { time: '09:30', alpha: 0.0, benchmark: 0.0, confidence: 99.9 },
      { time: '10:00', alpha: 0.8, benchmark: 0.2, confidence: 99.8 },
      { time: '10:30', alpha: 1.9, benchmark: 0.5, confidence: 99.7 },
      { time: '11:00', alpha: 2.7, benchmark: 0.6, confidence: 99.9 },
      { time: '11:30', alpha: 3.4, benchmark: 0.8, confidence: 99.8 },
      { time: '12:00', alpha: 4.1, benchmark: 1.1, confidence: 99.8 },
    ],
    qaHistory: [
      {
        q: 'Why did the sub-agent increase allocation to mega-cap semiconductor puts?',
        a: 'The model identified a 2.4-sigma divergence in 30-day implied skew relative to realized correlation, requiring an asymmetric downside hedge before earnings announcements.',
        time: '10:48:12 UTC'
      },
      {
        q: 'How does the regular refresh cycle prevent hallucinations here?',
        a: 'Every 45 seconds, the node flushes its intermediate scratchpad memory and re-evaluates all factor loadings directly against the immutable SEC tick stream to prevent speculative drift.',
        time: '10:50:05 UTC'
      }
    ],
    humanInterventions: [
      {
        id: 'hi-1',
        operator: 'Alexander Vance',
        role: 'Portfolio Manager',
        timestamp: '10:35:40 UTC',
        actionTaken: 'Overrode single-stock position ceiling for NVDA to 8.5% (down from default 10.0%).',
        reasoning: 'Supply-chain lead times indicated elevated short-term volatility; human risk committee requested tighter concentration cap.',
        parameterDiff: 'max_position: 10.0% → 8.5%',
        finalOutcome: 'Protected portfolio from midday sector pullback; preserved +$2.4M in alpha with zero SEC limit breaches.',
        status: 'Validated'
      },
      {
        id: 'hi-2',
        operator: 'Dr. Elena Rostova',
        role: 'Lead Quantitative Researcher',
        timestamp: '09:42:15 UTC',
        actionTaken: 'Adjusted volatility lookback window from 30 days to 10 days.',
        reasoning: 'Macro regime shift triggered by Federal Reserve rate commentary required higher responsiveness to short-term gamma shocks.',
        parameterDiff: 'vol_lookback_days: 30 → 10',
        finalOutcome: 'Reduced tracking error by 18 bps during morning market open.',
        status: 'Active'
      }
    ]
  },
  'model-3': {
    id: 'model-3',
    name: 'Model 3 (Macro Rebalance)',
    tag: 'Macro Overlay',
    subAgentNodes: [
      {
        id: 'node-m3-1',
        name: 'Node 1: Macro Trend Evaluator',
        subAgentName: 'Macro Trend & Yield Curve Sub-Agent',
        tag: 'Macro Research',
        type: 'Research',
        lastExecutionTime: '10:45:00 UTC',
        refreshIntervalSec: 60,
        antiHallucinationConfidence: 99.4,
        status: 'Completed',
        latencyMs: 3.42,
        taskSummary: 'Evaluated UST 2s10s yield curve slope, real rate spreads, and cross-currency basis swaps to determine top-down beta exposure adjustments.',
        fullDescription: 'Aggregates global macroeconomic indicators, central bank forward rate guidance, and bond market slope dynamics to compute multi-asset asset class tilts across sovereign bonds, currencies, and index futures.',
        checklist: [
          'Treasury yield curve inversion spread quantified (-32 bps)',
          'Cross-currency basis swap basis tightened across EUR/USD and USD/JPY',
          'Fed Funds target rate expectations mapped to forward OIS pricing',
          'Factuality check verified against Bloomberg & NY Fed SOFR feeds: PASSED'
        ],
        functionsUsed: [
          'curve_bootstrap_zero_rates(sofr_swaps)',
          'macro_regime_markov_switching()',
          'duration_hedged_portfolio_reweight()'
        ],
        datasetsUsed: [
          'NY_FED_SOFR_RATES',
          'UST_TREASURY_BENCHMARK_CURVE',
          'BIS_CROSS_CURRENCY_BASIS'
        ],
        workDoneMetrics: [
          { label: '2s10s Spread', value: '-32 bps' },
          { label: 'Duration Tilt', value: '+0.4 yrs' },
          { label: 'Macro Regime', value: 'Late Cycle' }
        ],
        passedToNode: 'Portfolio Multi-Asset Allocation Engine',
        payloadSummary: 'Recommended slight duration extension (+0.4 years) and defensive shift towards consumer staples (+2.5% weighting).'
      },
      {
        id: 'node-m3-2',
        name: 'Node 2: Cross-Currency Basis Arbitrage',
        subAgentName: 'FX Swaps & Basis Sub-Agent',
        tag: 'FX Research',
        type: 'Research',
        lastExecutionTime: '10:44:20 UTC',
        refreshIntervalSec: 55,
        antiHallucinationConfidence: 99.6,
        status: 'Completed',
        latencyMs: 1.95,
        taskSummary: 'Analyzed covered interest parity divergences in 3-month USD/JPY and EUR/USD basis swap markets.',
        fullDescription: 'Detects funding cost dislocations in cross-currency markets to optimize offshore collateral funding rates and reduce gross borrowing friction for international equity holdings.',
        checklist: [
          'Covered Interest Parity (CIP) deviations bounded',
          'Foreign exchange implied rate curve bootstrapped',
          'Collateral funding cost minimized across Tokyo and London books'
        ],
        functionsUsed: [
          'fx_basis_spread_optimizer()',
          'cip_arbitrage_gate()',
          'cross_currency_bootstrap()'
        ],
        datasetsUsed: [
          'BIS_FX_SWAP_RATES',
          'CME_FX_FUTURES',
          'TOKYO_TFX_SWAP_PRINTS'
        ],
        workDoneMetrics: [
          { label: 'Funding Saved', value: '+14 bps' },
          { label: 'Pairs Scanned', value: '8 Majors' },
          { label: 'CIP Residual', value: '1.2 bps' }
        ],
        passedToNode: 'Global Treasury Liquidity Desk',
        payloadSummary: 'Shifted $40M overnight USD liquidity via JPY basis swap to capture 14 bps rate premium.'
      }
    ],
    passedToNode: 'Portfolio Multi-Asset Allocation Engine',
    payloadSummary: 'Recommended slight duration extension (+0.4 years) and defensive shift towards consumer staples (+2.5% weighting).',
    latencyMs: 3.42,
    sandboxSharpe: 2.15,
    sandboxVaR: 1.28,
    sandboxMaxDrawdown: -4.6,
    sandboxWinRate: 64.2,
    chartData: [
      { time: '09:30', alpha: 0.0, benchmark: 0.0, confidence: 99.5 },
      { time: '10:00', alpha: 0.4, benchmark: 0.2, confidence: 99.4 },
      { time: '10:30', alpha: 1.1, benchmark: 0.5, confidence: 99.3 },
      { time: '11:00', alpha: 1.8, benchmark: 0.6, confidence: 99.4 },
      { time: '11:30', alpha: 2.2, benchmark: 0.8, confidence: 99.4 },
      { time: '12:00', alpha: 2.8, benchmark: 1.1, confidence: 99.5 },
    ],
    qaHistory: [
      {
        q: 'What is the confidence level for the 2s10s steepening signal?',
        a: 'Confidence is 88.6% based on historical FOMC rate-cut cycle transition probabilities and CFTC speculative positioning data.',
        time: '10:46:20 UTC'
      }
    ],
    humanInterventions: [
      {
        id: 'hi-3',
        operator: 'Marcus Sterling',
        role: 'Chief Investment Officer',
        timestamp: '10:15:00 UTC',
        actionTaken: 'Approved macro beta scale down from 1.00 to 0.85.',
        reasoning: 'Geopolitical energy headline risk warranting conservative gross exposure ahead of inventory release.',
        parameterDiff: 'macro_beta_target: 1.00 → 0.85',
        finalOutcome: 'Reduced portfolio volatility by 1.8% annualized with negligible alpha sacrifice.',
        status: 'Validated'
      }
    ]
  },
  'model-custom': {
    id: 'model-custom',
    name: 'Model 1 / Volatility Skew Arb',
    tag: 'AI Synthesized',
    subAgentNodes: [
      {
        id: 'node-mc-1',
        name: 'Node 1: High-Frequency L2 Imbalance',
        subAgentName: 'L2 Microstructure & Orderbook Imbalance Sub-Agent',
        tag: 'HFT Research',
        type: 'Research',
        lastExecutionTime: '10:50:45 UTC',
        refreshIntervalSec: 30,
        antiHallucinationConfidence: 99.9,
        status: 'Active',
        latencyMs: 0.84,
        taskSummary: 'Synthesized strategy testing automated harvesting of CBOE options skew anomalies with 15ms high-frequency order cancellation gates.',
        fullDescription: 'Monitors instantaneous limit order book depth, cancel-to-fill ratios, and toxic flow indicators to identify temporary quote mispricings in index option series before market makers adjust spreads.',
        checklist: [
          'High-frequency cancellation gate calibrated to prevent adverse selection',
          'Delta neutralizer verified zero factor breach in 10,000 Monte Carlo paths',
          'Real-time memory refresh configured at 30-second TTL to avoid hallucinated arbitrage signals',
          'Grounded in L2 tick timestamps and order book depth: PASSED'
        ],
        functionsUsed: [
          'l2_order_imbalance_ratio()',
          'dynamic_delta_neutralizer()',
          'synthetic_variance_swap_pricer()'
        ],
        datasetsUsed: [
          'CBOE_LIVE_OPRA_FEED',
          'DIRECT_EXCHANGE_FIX_FEED',
          'BARRA_COVARIANCE_STREAM'
        ],
        workDoneMetrics: [
          { label: 'Cancel Latency', value: '15 ms' },
          { label: 'Pairs Traded', value: '120 Spreads' },
          { label: 'Adverse Selection', value: '0.00 bps' }
        ],
        passedToNode: 'Terminal FIX Gate Router',
        payloadSummary: 'Executed 120 spread pairs with zero slippage across NYSE Arca and Nasdaq options exchanges.'
      },
      {
        id: 'node-mc-2',
        name: 'Node 2: Variance Swap Synthetic Pricing',
        subAgentName: 'Synthetic Variance Swap & Gamma Scalping Sub-Agent',
        tag: 'Gamma Arb',
        type: 'Calibration',
        lastExecutionTime: '10:50:15 UTC',
        refreshIntervalSec: 30,
        antiHallucinationConfidence: 99.9,
        status: 'Completed',
        latencyMs: 0.62,
        taskSummary: 'Replicated continuous log contract payouts using 1/K^2 weighted strip of out-of-the-money puts and calls.',
        fullDescription: 'Constructs pure variance swap exposure with zero jump risk by dynamically re-hedging option delta across intraday realized volatility spikes.',
        checklist: [
          'Log contract strike integration converges across 24 strike increments',
          'Gamma scalping intraday threshold set to $2,500 PnL triggers',
          'Vega risk fully matched against SPX benchmark volatility index'
        ],
        functionsUsed: [
          'log_contract_strike_integral()',
          'intraday_gamma_scalper()',
          'vega_risk_rebalancer()'
        ],
        datasetsUsed: [
          'SPX_MINUTELY_OPTION_SURFACE',
          'CBOE_VOLATILITY_INDEX_TICK',
          'NASDAQ_ITCH_ORDERBOOK'
        ],
        workDoneMetrics: [
          { label: 'Gamma Scalps', value: '38 Cycles' },
          { label: 'Vega Matched', value: '100.0%' },
          { label: 'Simulated Sharpe', value: '3.12' }
        ],
        passedToNode: 'Terminal FIX Gate Router',
        payloadSummary: 'Synthesized 100% variance swap coverage with zero residual delta exposure.'
      }
    ],
    passedToNode: 'Terminal FIX Gate Router',
    payloadSummary: 'Executed 120 spread pairs with zero slippage across NYSE Arca and Nasdaq options exchanges.',
    latencyMs: 0.84,
    sandboxSharpe: 3.12,
    sandboxVaR: 0.98,
    sandboxMaxDrawdown: -2.4,
    sandboxWinRate: 78.5,
    chartData: [
      { time: '09:30', alpha: 0.0, benchmark: 0.0, confidence: 99.9 },
      { time: '10:00', alpha: 1.2, benchmark: 0.2, confidence: 99.9 },
      { time: '10:30', alpha: 2.8, benchmark: 0.5, confidence: 99.8 },
      { time: '11:00', alpha: 3.9, benchmark: 0.6, confidence: 99.9 },
      { time: '11:30', alpha: 4.8, benchmark: 0.8, confidence: 99.9 },
      { time: '12:00', alpha: 5.6, benchmark: 1.1, confidence: 99.9 },
    ],
    qaHistory: [
      {
        q: 'How does this model eliminate hallucinated market depth?',
        a: 'Every 30 seconds, it cross-checks quote sizes against executed trade prints on the SIP tape, automatically blacklisting non-executable phantom liquidity.',
        time: '10:51:10 UTC'
      }
    ],
    humanInterventions: [
      {
        id: 'hi-4',
        operator: 'Alexander Vance',
        role: 'Portfolio Manager',
        timestamp: '10:40:22 UTC',
        actionTaken: 'Enabled automated sandbox promotion with $50M capital allocation gate.',
        reasoning: 'Backtest Sharpe 3.12 and Sortino 4.10 exceeded stage-3 compliance hurdle rates.',
        parameterDiff: 'sandbox_status: DRAFT → STAGED_EXECUTION',
        finalOutcome: 'Model promoted to pre-market simulated execution queue with 0 risk threshold breaches.',
        status: 'Active'
      }
    ]
  }
};

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  onNavigateToOverview,
  onOpenAgentModal,
  onSelectTab
}) => {
  const [selectedModelKey, setSelectedModelKey] = useState<string>('model-1');
  const [activeViewMode, setActiveViewMode] = useState<'flow' | 'sandbox'>('flow');
  const [workflows, setWorkflows] = useState<Record<string, ModelWorkflowData>>(INITIAL_WORKFLOWS);
  
  // Selected Node ID for Deep Description & Inspection (When clicked, shows full description)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Refresh countdown timer
  const [countdown, setCountdown] = useState<number>(38);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshNotification, setRefreshNotification] = useState<string | null>(null);

  // User Notes & Save Notes State
  const [notes, setNotes] = useState<string>(
    'AUDIT NOTES - ALL AGENT WORKFLOWS VALIDATED.\n• Anti-hallucination refresh verified every 30-45s across research & execution nodes.\n• Model 1 demonstrated zero factor drift; human override on NVDA successfully protected alpha.\n• Compliance status: All SEC 15c3-5 and portfolio VaR gates PASSED.'
  );
  const [isSaveNotesOpen, setIsSaveNotesOpen] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Interactive Question State for Column 2
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [isAnswering, setIsAnswering] = useState<boolean>(false);

  // Bottom Audit Prompt Bar State
  const [auditQuery, setAuditQuery] = useState<string>('');
  const [auditResults, setAuditResults] = useState<{ query: string; response: string; timestamp: string; verified: boolean } | null>(null);
  const [isSearchingAudit, setIsSearchingAudit] = useState<boolean>(false);

  // New Human Intervention Form State
  const [isAddInterventionOpen, setIsAddInterventionOpen] = useState<boolean>(false);
  const [newAction, setNewAction] = useState<string>('');
  const [newReasoning, setNewReasoning] = useState<string>('');
  const [newParameterDiff, setNewParameterDiff] = useState<string>('');

  // Expand Detailed Graphs state
  const [isGraphExpanded, setIsGraphExpanded] = useState<boolean>(true);

  // Selected Intervention ID for details in Column 3
  const [selectedInterventionId, setSelectedInterventionId] = useState<string | null>(null);

  const currentWorkflow = workflows[selectedModelKey] || workflows['model-1'];
  const activeSelectedNode = currentWorkflow.subAgentNodes.find(n => n.id === selectedNodeId) || null;

  // Regular countdown ticker for anti-hallucination refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerAutoRefresh(false);
          return 45;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedModelKey]);

  // Trigger anti-hallucination ground truth refresh
  const triggerAutoRefresh = (manual = true) => {
    setIsRefreshing(true);
    const msg = manual 
      ? `Manual Ground-Truth Refresh triggered: Re-synchronizing node scratchpad memory with live L2 order book & SEC logs...`
      : `Regular Anti-Hallucination Refresh cycle executed: Cleared stale context memory. Confidence grounded at 99.8%.`;
    setRefreshNotification(msg);

    setTimeout(() => {
      setIsRefreshing(false);
      setCountdown(45);
      setTimeout(() => {
        setRefreshNotification(null);
      }, 4000);
    }, 900);
  };

  // Handle Save Notes
  const handleSaveNotes = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('idle');
        setIsSaveNotesOpen(false);
      }, 1500);
    }, 700);
  };

  // Handle Ask Question in Column 2
  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim()) return;

    setIsAnswering(true);
    const q = currentQuestion;
    setCurrentQuestion('');

    setTimeout(() => {
      const answers: Record<string, string> = {
        default: `Based on the latest grounded execution trace (${currentWorkflow.subAgentNodes[0]?.lastExecutionTime || '10:52:18 UTC'}): The sub-agent evaluated all constraints with ${currentWorkflow.subAgentNodes[0]?.antiHallucinationConfidence || 99.8}% factual grounding. No hallucination or state drift was detected in the payload passed to ${currentWorkflow.passedToNode}.`
      };

      const matchedAnswer = q.toLowerCase().includes('why')
        ? `The model's neural factor weight optimizer detected an asymmetric risk-reward window on the volatility surface, prompting an automated rebalance of 45,000 delta-hedged spreads.`
        : q.toLowerCase().includes('hallucinat') || q.toLowerCase().includes('refresh')
        ? `The regular refresh mechanism invalidates intermediate token cache every 30-45s, querying direct exchange feeds to guarantee factual compliance.`
        : answers.default;

      setWorkflows(prev => ({
        ...prev,
        [selectedModelKey]: {
          ...prev[selectedModelKey],
          qaHistory: [
            ...prev[selectedModelKey].qaHistory,
            {
              q,
              a: matchedAnswer,
              time: new Date().toISOString().slice(11, 19) + ' UTC'
            }
          ]
        }
      }));
      setIsAnswering(false);
    }, 750);
  };

  // Handle Bottom Prompt Bar Audit Query
  const handleRunAuditPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!auditQuery.trim()) return;

    setIsSearchingAudit(true);
    const queryText = auditQuery;

    setTimeout(() => {
      setIsSearchingAudit(false);
      const totalFns = currentWorkflow.subAgentNodes.reduce((acc, n) => acc + n.functionsUsed.length, 0);
      setAuditResults({
        query: queryText,
        timestamp: new Date().toISOString().slice(11, 19) + ' UTC',
        verified: true,
        response: `✓ AUDIT REPORT GENERATED FOR: "${queryText}"\n` +
          `• Analyzed Model: ${currentWorkflow.name} (${currentWorkflow.tag})\n` +
          `• Active Sub-Agents: ${currentWorkflow.subAgentNodes.length} research nodes verified.\n` +
          `• Grounding Check: Zero memory hallucinations detected across ${totalFns} sub-agent function executions.\n` +
          `• Regular Refresh History: 14 anti-hallucination refreshes executed in the last 15 minutes.\n` +
          `• Human Interventions: ${currentWorkflow.humanInterventions.length} logged oversight actions verified by compliance officer.\n` +
          `• Final Model Outcome: Sharpe ${currentWorkflow.sandboxSharpe}, 95% VaR ${currentWorkflow.sandboxVaR}%, Win Rate ${currentWorkflow.sandboxWinRate}%. All trades cleared SEC Rule 15c3-5.`
      });
    }, 850);
  };

  // Handle Add New Human Intervention
  const handleAddIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction.trim() || !newReasoning.trim()) return;

    const newEntry: HumanIntervention = {
      id: `hi-${Date.now()}`,
      operator: 'Alexander Vance',
      role: 'Portfolio Manager',
      timestamp: new Date().toISOString().slice(11, 19) + ' UTC',
      actionTaken: newAction,
      reasoning: newReasoning,
      parameterDiff: newParameterDiff || 'custom_override: APPLIED',
      finalOutcome: 'Logged into immutable semantic audit memory; sub-agent acknowledged human guidance.',
      status: 'Validated'
    };

    setWorkflows(prev => ({
      ...prev,
      [selectedModelKey]: {
        ...prev[selectedModelKey],
        humanInterventions: [newEntry, ...prev[selectedModelKey].humanInterventions]
      }
    }));

    setNewAction('');
    setNewReasoning('');
    setNewParameterDiff('');
    setIsAddInterventionOpen(false);
  };

  return (
    <div className="h-full flex-1 flex flex-col min-h-0 overflow-hidden space-y-2 select-none bg-slate-50/50 p-2 sm:p-3">
      
      {/* =========================================================================
          TOP COMMAND & HEADER BAR MATCHING SKETCH
          - /agent bar
          - Model Tabs: [Model 1 ✓] [Model 3] [Model 1] [sandbox view]
          - Save notes button
         ========================================================================= */}
      <div className="bg-white border border-border rounded-xl p-2.5 sm:p-3 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 shrink-0">
        
        {/* Left: /agent bar */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full flex items-center bg-slate-50 hover:bg-white border border-border focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-400/30 rounded-lg transition-all">
            <span className="pl-3 pr-1 text-blue-600 font-mono text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            </span>
            <input
              type="text"
              value={auditQuery}
              onChange={(e) => setAuditQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunAuditPrompt()}
              placeholder="/agent bar - audit semantic history..."
              className="w-full py-1.5 pl-1 pr-8 text-xs font-mono text-foreground placeholder:text-muted-foreground bg-transparent focus:outline-hidden"
            />
            <button
              type="button"
              onClick={() => handleRunAuditPrompt()}
              className="absolute right-2 p-1 rounded text-blue-600 hover:bg-blue-50"
              title="Run audit search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Model Selector Tabs matching wireframe sketch */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            type="button"
            onClick={() => {
              setSelectedModelKey('model-1');
              setSelectedNodeId(null);
              setActiveViewMode('flow');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border shrink-0 flex items-center gap-1 ${
              selectedModelKey === 'model-1' && activeViewMode === 'flow'
                ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-2xs'
                : 'bg-white text-foreground hover:bg-slate-50 border-border'
            }`}
          >
            <span>Model 1</span>
            {selectedModelKey === 'model-1' && <Check className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedModelKey('model-3');
              setSelectedNodeId(null);
              setActiveViewMode('flow');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border shrink-0 flex items-center gap-1 ${
              selectedModelKey === 'model-3' && activeViewMode === 'flow'
                ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-2xs'
                : 'bg-white text-foreground hover:bg-slate-50 border-border'
            }`}
          >
            <span>Model 3</span>
            {selectedModelKey === 'model-3' && <Check className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedModelKey('model-custom');
              setSelectedNodeId(null);
              setActiveViewMode('flow');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border shrink-0 flex items-center gap-1 ${
              selectedModelKey === 'model-custom' && activeViewMode === 'flow'
                ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-2xs'
                : 'bg-white text-foreground hover:bg-slate-50 border-border'
            }`}
          >
            <span>Model 1 (Vol Skew)</span>
            {selectedModelKey === 'model-custom' && <Check className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              if (onSelectTab) {
                onSelectTab('agent-builder');
              } else {
                setActiveViewMode(activeViewMode === 'sandbox' ? 'flow' : 'sandbox');
              }
            }}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border shrink-0 flex items-center gap-1 ${
              activeViewMode === 'sandbox'
                ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-2xs'
                : 'bg-white text-emerald-700 hover:bg-emerald-50/50 border-emerald-300'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>sandbox view</span>
          </button>
        </div>

        {/* Right: Save notes button */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsSaveNotesOpen(true)}
            className="h-8 px-3 text-xs font-mono font-semibold bg-white hover:bg-slate-50 border-border text-foreground rounded-lg gap-1.5 shadow-2xs"
          >
            <Save className="w-3.5 h-3.5 text-blue-600" />
            <span>Save notes</span>
          </Button>
        </div>

      </div>

      {/* Anti-Hallucination Refresh Banner & Notification */}
      {refreshNotification && (
        <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-mono flex items-center justify-between gap-2 shrink-0 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
            <span>{refreshNotification}</span>
          </div>
          <Badge className="bg-emerald-600 text-white text-[10px] font-mono font-bold">
            GROUNDED
          </Badge>
        </div>
      )}

      {/* =========================================================================
          MAIN 3-COLUMN WORKFLOW AUDIT CANVAS MATCHING SKETCH
          Col 1: Model, task and backtesting (Filled with functions, sub-agents doing research & work done. Full description comes only when clicked!)
          Col 2: Model outputanalysis , risk analysis and monitoring (Payload lineage + sandbox insights/graphs + questions)
          Col 3: symentic language memeory of human intervention (Human intervention, action taken, reasoning, changes done)
         ========================================================================= */}
      <div className="flex-1 min-h-0 border border-border rounded-2xl bg-white shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        
        {/* =========================================================================
            COLUMN 1: Model, task and backtesting (lg:col-span-4)
            FILLED WITH FUNCTIONS AND SUB-AGENTS DOING RESEARCH & WORK DONE.
            CLICKING ANY NODE EXPANDS ITS DEEP DESCRIPTION & VERIFICATION CHECKLIST!
           ========================================================================= */}
        <div className="lg:col-span-4 border-r border-border p-3 sm:p-3.5 flex flex-col justify-between bg-slate-50/40 overflow-y-auto min-h-0">
          <div className="space-y-2.5">
            
            {/* Column Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-border/70">
              <div>
                <h2 className="text-xs font-bold font-mono text-foreground tracking-tight flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Model, task and backtesting
                </h2>
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  {selectedNodeId ? '1 node selected (click to toggle description)' : 'Click any node below to inspect full description & checklist'}
                </p>
              </div>
              <Badge variant="outline" className="bg-white text-[10px] font-mono text-blue-700 border-blue-200">
                {currentWorkflow.subAgentNodes.length} Nodes Running
              </Badge>
            </div>

            {/* If a node is selected, show an active filter bar to view all or collapse */}
            {selectedNodeId && (
              <div className="flex items-center justify-between bg-blue-50/80 border border-blue-200 px-2.5 py-1.5 rounded-lg text-xs font-mono text-blue-900 animate-in fade-in">
                <span className="text-[11px] font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Inspecting Node Description</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(null)}
                  className="text-[10px] font-bold text-blue-700 hover:text-blue-950 underline flex items-center gap-0.5"
                >
                  <span>Show all nodes</span>
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* List of Sub-Agents & Research Nodes with executed functions and work done */}
            <div className="space-y-2.5">
              {currentWorkflow.subAgentNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                    className={`rounded-xl border-2 transition-all cursor-pointer p-3 space-y-2.5 shadow-2xs ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-400/30' 
                        : 'border-emerald-300/80 bg-white hover:bg-emerald-50/40 hover:border-emerald-400'
                    }`}
                  >
                    {/* Node Header: Sub-Agent Title + Status + Anti-Hallucination Countdown & Click Hint */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          <Cpu className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs font-mono text-emerald-950 flex items-center gap-1.5 flex-wrap">
                            <span className="truncate">{node.name}</span>
                            <Badge variant="outline" className="bg-white/90 text-[9px] font-mono text-emerald-800 border-emerald-300 py-0 px-1">
                              {node.tag}
                            </Badge>
                          </div>
                          <div className="text-[11px] font-mono text-emerald-800/90 font-medium truncate">
                            {node.subAgentName}
                          </div>
                          <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-0.5 text-emerald-700">
                              <Clock className="w-3 h-3" />
                              {node.lastExecutionTime}
                            </span>
                            <span>•</span>
                            <span>Lat: <strong>{node.latencyMs}ms</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Anti-Hallucination refresh badge & click indicator */}
                      <div className="flex flex-col items-end shrink-0">
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 text-[9px] font-mono font-bold">
                          <RotateCw className="w-2.5 h-2.5 text-emerald-700" />
                          <span>{node.refreshIntervalSec}s TTL</span>
                        </span>
                        <span className="text-[9px] font-mono text-emerald-700 font-semibold mt-1 flex items-center gap-0.5">
                          {isSelected ? 'Click to collapse' : 'Click for description'}
                          {isSelected ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                      </div>
                    </div>

                    {/* Work Done & Research Highlights Pills */}
                    <div className="grid grid-cols-3 gap-1.5 bg-slate-50/80 p-1.5 rounded-lg border border-border/60">
                      {node.workDoneMetrics.map((m, mIdx) => (
                        <div key={mIdx} className="bg-white p-1 rounded border border-slate-200/80 text-center">
                          <span className="text-[8px] font-mono uppercase text-muted-foreground block truncate">{m.label}</span>
                          <span className="text-[10px] font-mono font-bold text-foreground block truncate">{m.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Active Quantitative Functions Executed by this Sub-Agent */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono font-bold text-emerald-950 uppercase flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Code2 className="w-3 h-3 text-emerald-700" />
                          <span>Executed Functions &amp; Algorithms:</span>
                        </span>
                        <span className="text-[9px] text-emerald-700 font-normal">{node.functionsUsed.length} active</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {node.functionsUsed.map((fn, fIdx) => (
                          <span key={fIdx} className="px-1.5 py-0.5 bg-white border border-emerald-200 text-emerald-950 rounded text-[9.5px] font-mono font-medium">
                            {fn}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Data Streams Used */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono font-bold text-emerald-950 uppercase flex items-center gap-1">
                        <Database className="w-3 h-3 text-emerald-700" />
                        <span>Data Streams Used:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {node.datasetsUsed.map((ds, dsIdx) => (
                          <span key={dsIdx} className="px-1.5 py-0.5 bg-emerald-100/70 text-emerald-900 border border-emerald-300 rounded text-[9.5px] font-mono font-semibold">
                            {ds}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* =============================================================
                        EXPANDED DEEP DESCRIPTION & CHECKLIST (REVEALED ONLY ON CLICK)
                       ============================================================= */}
                    {isSelected && (
                      <div className="pt-2 border-t border-emerald-300/80 space-y-2.5 animate-in fade-in duration-200">
                        
                        {/* Anti-Hallucination Grounding Status */}
                        <div className="bg-white/90 border border-emerald-300 rounded-lg p-2 text-[11px] font-mono text-emerald-900 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Anti-Hallucination Grounding:</span>
                          </div>
                          <strong className="text-emerald-700 font-bold">{node.antiHallucinationConfidence}% Verified</strong>
                        </div>

                        {/* Full Deep Description Paragraph */}
                        <div className="space-y-1 bg-white p-2.5 rounded-lg border border-emerald-200">
                          <div className="text-[10px] font-mono font-bold text-emerald-900 uppercase flex items-center gap-1">
                            <FileText className="w-3 h-3 text-emerald-700" />
                            <span>Full Task &amp; Strategy Description:</span>
                          </div>
                          <p className="text-xs text-emerald-950 leading-relaxed font-sans">
                            {node.fullDescription}
                          </p>
                          <div className="text-[11px] text-emerald-800 font-sans pt-1 border-t border-emerald-100">
                            <strong>Work Done Summary:</strong> {node.taskSummary}
                          </div>
                        </div>

                        {/* Step-by-Step Verification Checklist */}
                        <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-emerald-200">
                          <div className="text-[10px] font-mono font-bold text-emerald-900 uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verification Checklist:</span>
                          </div>
                          {node.checklist.map((item, cIdx) => (
                            <div key={cIdx} className="flex items-start gap-1.5 text-[11px] font-mono text-emerald-900">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>

                        {/* Payload Handoff Lineage */}
                        <div className="bg-emerald-100/50 p-2 rounded-lg border border-emerald-300 text-[11px] font-mono text-emerald-950 space-y-0.5">
                          <div className="text-emerald-900 font-bold uppercase text-[9px]">Target Node Routing:</div>
                          <div className="font-semibold text-emerald-950">{node.passedToNode}</div>
                          <p className="text-[10.5px] font-sans text-emerald-800">{node.payloadSummary}</p>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* =========================================================================
            COLUMN 2: Model outputanalysis , risk analysis and monitoring (lg:col-span-4)
           ========================================================================= */}
        <div className="lg:col-span-4 border-r border-border p-3 sm:p-3.5 flex flex-col justify-between bg-slate-50/40 overflow-y-auto min-h-0">
          <div className="space-y-2.5">
            {/* Column Header matching sketch */}
            <div className="flex items-center justify-between pb-1.5 border-b border-border/70">
              <div>
                <h2 className="text-xs font-bold font-mono text-foreground tracking-tight flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Model outputanalysis , risk analysis and monitoring
                </h2>
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  Payload lineage, risk sandbox &amp; node probes
                </p>
              </div>
              <Badge variant="outline" className="bg-white text-[10px] font-mono text-emerald-700 border-emerald-200">
                Sharpe {currentWorkflow.sandboxSharpe}
              </Badge>
            </div>

            {/* Output Analysis Node Card (Green card matching sketch) */}
            <div className="rounded-xl border-2 border-emerald-300 bg-white p-3 shadow-2xs space-y-2.5">
              
              {/* Text regarding what was there passed to which node */}
              <div className="space-y-1">
                <div className="text-[11px] font-bold font-mono text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Payload Lineage &amp; Routing</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-emerald-200 text-xs font-mono text-emerald-950 space-y-1">
                  <div className="text-emerald-800 text-[10px] uppercase font-bold">
                    Target Node:
                  </div>
                  <div className="font-bold text-emerald-950">
                    {activeSelectedNode ? activeSelectedNode.passedToNode : currentWorkflow.passedToNode}
                  </div>
                  <div className="text-emerald-800 text-[10px] pt-1 border-t border-emerald-200/80">
                    Payload Details:
                  </div>
                  <p className="text-[11px] text-emerald-900 font-sans leading-relaxed">
                    {activeSelectedNode ? activeSelectedNode.payloadSummary : currentWorkflow.payloadSummary}
                  </p>
                  <div className="text-[10px] text-emerald-700 pt-0.5">
                    Execution Latency: <strong>{activeSelectedNode ? activeSelectedNode.latencyMs : currentWorkflow.latencyMs} ms</strong>
                  </div>
                </div>
              </div>

              {/* Sandbox and insights, on detailed examination can provide detailed graphs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold font-mono text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sandbox &amp; Risk Insights</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsGraphExpanded(!isGraphExpanded)}
                    className="text-[10px] font-mono text-emerald-800 hover:text-emerald-950 underline flex items-center gap-0.5"
                  >
                    <span>{isGraphExpanded ? 'Hide graph' : 'Examine graphs'}</span>
                    {isGraphExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="bg-slate-50 p-2 rounded-lg border border-emerald-200">
                    <span className="text-[9px] font-mono text-emerald-700 uppercase block">Expected Sharpe</span>
                    <span className="text-sm font-bold font-mono text-emerald-950">{currentWorkflow.sandboxSharpe}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-emerald-200">
                    <span className="text-[9px] font-mono text-emerald-700 uppercase block">Simulated VaR 95%</span>
                    <span className="text-sm font-bold font-mono text-emerald-950">{currentWorkflow.sandboxVaR}%</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-emerald-200">
                    <span className="text-[9px] font-mono text-emerald-700 uppercase block">Max Drawdown</span>
                    <span className="text-sm font-bold font-mono text-emerald-950">{currentWorkflow.sandboxMaxDrawdown}%</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-emerald-200">
                    <span className="text-[9px] font-mono text-emerald-700 uppercase block">Win Probability</span>
                    <span className="text-sm font-bold font-mono text-emerald-950">{currentWorkflow.sandboxWinRate}%</span>
                  </div>
                </div>

                {/* Detailed Examination Graph */}
                {isGraphExpanded && (
                  <div className="bg-slate-50 p-2 rounded-lg border border-emerald-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-emerald-900 px-1">
                      <span>Cumulative Signal Alpha</span>
                      <span className="text-emerald-700 font-bold">+5.6% Outperformance</span>
                    </div>
                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={currentWorkflow.chartData}>
                          <defs>
                            <linearGradient id="auditAlphaGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke="#64748b" />
                          <YAxis tick={{ fontSize: 9 }} stroke="#64748b" domain={[0, 6]} />
                          <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                          <Area type="monotone" dataKey="alpha" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#auditAlphaGrad)" name="Alpha %" />
                          <Line type="monotone" dataKey="benchmark" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Benchmark %" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider Line matching sketch */}
              <div className="border-t border-emerald-300/80 my-1" />

              {/* Can be asked questions as well..... (Interactive Q&A probe) */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold font-mono text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Can be asked questions as well.....</span>
                </div>

                {/* Q&A Stream */}
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {currentWorkflow.qaHistory.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-emerald-200 text-xs font-mono space-y-1">
                      <div className="font-bold text-emerald-950 flex items-center justify-between">
                        <span>Q: {item.q}</span>
                        <span className="text-[9px] text-emerald-700">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-emerald-900 font-sans leading-relaxed">
                        A: {item.a}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Question Input Form */}
                <form onSubmit={handleAskQuestion} className="flex items-center gap-1.5 pt-1">
                  <Input
                    type="text"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    placeholder="Ask question to this node..."
                    className="h-7 text-xs font-mono bg-white border-emerald-300 text-emerald-950 placeholder:text-emerald-700/60 focus-visible:ring-emerald-400"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isAnswering || !currentQuestion.trim()}
                    className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono rounded-lg shrink-0"
                  >
                    {isAnswering ? <RotateCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  </Button>
                </form>

              </div>

            </div>
          </div>
        </div>

        {/* =========================================================================
            COLUMN 3: symentic language memeory of human intervention (lg:col-span-4)
           ========================================================================= */}
        <div className="lg:col-span-4 p-3 sm:p-3.5 flex flex-col justify-between bg-slate-50/40 overflow-y-auto min-h-0">
          <div className="space-y-2.5">
            {/* Column Header matching sketch */}
            <div className="flex items-center justify-between pb-1.5 border-b border-border/70">
              <div>
                <h2 className="text-xs font-bold font-mono text-foreground tracking-tight flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  symentic language memeory of human intervention
                </h2>
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  Operator overrides, reasoning &amp; parameter diffs
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddInterventionOpen(true)}
                className="h-6 text-[10px] font-mono px-2 py-0 border-border text-foreground hover:bg-white bg-white/80 rounded-md gap-1 shadow-2xs"
              >
                <Plus className="w-3 h-3 text-purple-600" />
                <span>Log intervention</span>
              </Button>
            </div>

            {/* Human Intervention Node Card (Styled green card matching sketch) */}
            <div className="rounded-xl border-2 border-emerald-300 bg-white p-3 shadow-2xs space-y-2.5">
              
              <div className="text-[11px] font-bold font-mono text-emerald-950 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Human intervention, action taken &amp; reasoning</span>
                </span>
                <span className="text-[9px] text-muted-foreground font-mono">
                  {currentWorkflow.humanInterventions.length} Overrides
                </span>
              </div>

              {/* List of Human Interventions with Semantic Memory Rationale and Changes Done */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {currentWorkflow.humanInterventions.map((item) => {
                  const isExpanded = selectedInterventionId === item.id;

                  return (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedInterventionId(isExpanded ? null : item.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-2xs space-y-1.5 text-xs font-mono ${
                        isExpanded ? 'bg-purple-50/70 border-purple-300' : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                      }`}
                    >
                      {/* Header with Operator + Time + Status */}
                      <div className="flex items-center justify-between border-b border-border/60 pb-1">
                        <div>
                          <span className="font-bold text-foreground block">{item.operator}</span>
                          <span className="text-[10px] text-muted-foreground font-sans">{item.role}</span>
                        </div>
                        <div className="text-right flex items-center gap-1.5">
                          <Badge className="bg-emerald-600 text-white text-[9px] font-mono py-0">
                            {item.status}
                          </Badge>
                          <span className="text-[9px] text-muted-foreground">{item.timestamp}</span>
                        </div>
                      </div>

                      {/* Action Taken */}
                      <div className="space-y-0.5">
                        <span className="text-[9.5px] font-bold uppercase text-slate-700 block">Action Taken:</span>
                        <p className="text-[11px] font-sans text-foreground font-medium">
                          {item.actionTaken}
                        </p>
                      </div>

                      {/* Click to expand full reasoning & parameter changes */}
                      {isExpanded ? (
                        <div className="space-y-1.5 pt-1 border-t border-purple-200/80 animate-in fade-in">
                          {/* Semantic Reasoning */}
                          <div className="bg-white p-2 rounded-lg border border-purple-200">
                            <span className="text-[9px] font-bold uppercase text-purple-900 block">Human Reasoning:</span>
                            <p className="text-[11px] font-sans text-purple-950 italic leading-relaxed">
                              "{item.reasoning}"
                            </p>
                          </div>

                          {/* Parameter changes & final outcome */}
                          <div className="space-y-1 text-[11px]">
                            <div className="flex items-center justify-between text-slate-900">
                              <span className="text-[10px] font-bold">Parameter Diff:</span>
                              <code className="bg-purple-100 px-1.5 py-0.5 rounded text-[10px] font-mono text-purple-950">
                                {item.parameterDiff}
                              </code>
                            </div>
                            <div className="space-y-0.5 pt-0.5">
                              <span className="text-[9.5px] font-bold uppercase text-slate-700 block">Final Outcome &amp; Impact:</span>
                              <p className="text-[11px] font-sans text-foreground">
                                {item.finalOutcome}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[9px] text-purple-700 font-mono font-semibold pt-0.5 flex items-center justify-between">
                          <span>Diff: {item.parameterDiff}</span>
                          <span className="underline">Click for reasoning ↓</span>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* =========================================================================
          BOTTOM AUDIT PROMPT BAR MATCHING SKETCH
          "prompt bar to understand and audit previous workflows that were done..."
         ========================================================================= */}
      <div className="bg-white border border-border rounded-xl p-2.5 sm:p-3 shadow-2xs space-y-2 shrink-0">
        <form onSubmit={handleRunAuditPrompt} className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center bg-slate-50 hover:bg-white border border-border focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-400/30 rounded-xl transition-all">
            <span className="pl-3.5 pr-1.5 text-blue-600 font-mono text-xs font-semibold flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-blue-600" />
            </span>
            <input
              type="text"
              value={auditQuery}
              onChange={(e) => setAuditQuery(e.target.value)}
              placeholder="prompt bar to understand and audit previous workflows that were done..."
              className="w-full py-2 pl-1 pr-10 text-xs sm:text-sm font-mono text-foreground placeholder:text-muted-foreground/80 bg-transparent focus:outline-hidden"
            />
          </div>
          <Button
            type="submit"
            disabled={isSearchingAudit || !auditQuery.trim()}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono rounded-xl font-bold gap-1.5 shadow-xs shrink-0"
          >
            {isSearchingAudit ? <RotateCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Audit Workflows</span>
          </Button>
        </form>

        {/* Quick prompt suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-muted-foreground pt-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500">Quick Audit Checks:</span>
          {[
            'Audit all human overrides on Model 1',
            'When did sub-agents last refresh against hallucinations?',
            'Verify SEC 15c3-5 pre-trade execution logs',
            'Compare final outcomes of Model 1 vs Model 3'
          ].map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setAuditQuery(suggestion);
                setTimeout(() => {
                  setAuditResults({
                    query: suggestion,
                    timestamp: new Date().toISOString().slice(11, 19) + ' UTC',
                    verified: true,
                    response: `✓ AUDIT REPORT: "${suggestion}"\n• Evaluated 1,480 telemetry events for ${currentWorkflow.name}.\n• Verified zero memory drift with anti-hallucination TTL = 45s across ${currentWorkflow.subAgentNodes.length} active nodes.\n• All sub-agent outputs routed through compliance gates with zero human-policy violations.`
                  });
                }, 400);
              }}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Audit Search Output Card */}
        {auditResults && (
          <div className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-slate-400 text-[11px]">
              <span className="text-emerald-400 font-bold"># AUDIT MEMORY RESPONSE ({auditResults.timestamp})</span>
              <button
                type="button"
                onClick={() => setAuditResults(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-slate-200">
              {auditResults.response}
            </pre>
          </div>
        )}

      </div>

      {/* =========================================================================
          SAVE NOTES MODAL / DRAWER
         ========================================================================= */}
      {isSaveNotesOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-border rounded-2xl shadow-2xl w-full max-w-lg p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <Save className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-foreground">Save &amp; Export Audit Notes</h3>
                  <p className="text-xs text-muted-foreground font-sans">Persistent operator notes for compliance &amp; investment committee</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSaveNotesOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-foreground">
                Operator Notes &amp; Rationale:
              </label>
              <textarea
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border text-xs font-mono text-foreground bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const blob = new Blob([notes], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `deshaw-audit-notes-${Date.now()}.txt`;
                  a.click();
                }}
                className="h-8 text-xs font-mono gap-1 text-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export TXT</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSaveNotesOpen(false)}
                  className="h-8 text-xs font-mono"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveNotes}
                  disabled={saveStatus === 'saving'}
                  className="h-8 text-xs font-mono bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved!' : 'Save Notes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          LOG NEW HUMAN INTERVENTION MODAL
         ========================================================================= */}
      {isAddInterventionOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-border rounded-2xl shadow-2xl w-full max-w-md p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-foreground">Log Human Intervention</h3>
                  <p className="text-xs text-muted-foreground font-sans">Annotate model override into semantic memory</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddInterventionOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddIntervention} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-foreground">
                  Action Taken:
                </label>
                <Input
                  type="text"
                  required
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="e.g., Overrode max allocation on AAPL to 7.0%"
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-foreground">
                  Human Reasoning &amp; Context:
                </label>
                <textarea
                  rows={3}
                  required
                  value={newReasoning}
                  onChange={(e) => setNewReasoning(e.target.value)}
                  placeholder="Explain why human judgment intervened (macro risk, liquidity constraint, etc.)..."
                  className="w-full p-2 rounded-lg border border-border text-xs font-mono text-foreground bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-foreground">
                  Parameter Diff (Optional):
                </label>
                <Input
                  type="text"
                  value={newParameterDiff}
                  onChange={(e) => setNewParameterDiff(e.target.value)}
                  placeholder="e.g., target_vol: 14% → 11%"
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddInterventionOpen(false)}
                  className="h-8 text-xs font-mono"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 text-xs font-mono bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Save Intervention
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
