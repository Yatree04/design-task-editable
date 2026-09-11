import React, { useState, useEffect } from 'react';
import { ViewTab, WorkspaceModel } from '../types';
import { 
  Bot, 
  GitBranch, 
  Code2, 
  Grid3X3, 
  ChevronDown, 
  ChevronUp,
  Play, 
  Sparkles, 
  Check, 
  FileText, 
  Database, 
  ShieldCheck, 
  Layers, 
  Share2, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Settings2, 
  TrendingUp, 
  Send,
  Sliders,
  AlertCircle,
  Cpu,
  RefreshCw,
  RotateCw,
  ExternalLink,
  Columns3,
  SlidersHorizontal,
  X,
  ArrowUpRight,
  TestTube,
  ArrowLeftRight,
  GitMerge,
  Copy,
  Zap,
  Tag,
  Maximize2,
  Minimize2,
  FolderTree,
  Lightbulb,
  BookOpen,
  Library,
  GripHorizontal,
  Move,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AgentBacktestSandbox } from './AgentBacktestSandbox';

export type CanvasViewMode = 'matrix' | 'Node' | 'code';
export type RepoFilter = 'all' | 'codebases' | 'subagents' | 'templates' | 'data';
export type RightPanelTab = 'agent' | 'instructions' | 'code' | 'sandbox';
export type BottomDrawerTab = 'all' | 'skills' | 'code' | 'inputs' | 'risk' | 'firm_ideas' | 'research_papers';

export interface AgentNode {
  id: string;
  name: string;
  type: 'parent' | 'subagent' | 'data' | 'tool';
  role: string;
  status: 'ACTIVE' | 'READY' | 'DEPLOYED' | 'TESTING';
  inputs: string;
  description: string;
  outputLink: string;
  instructions: string;
  defaultProperty: string;
  codeSnippet: string;
  tools: string[];
  latency: string;
  x: number;
  y: number;
}

export interface ResourceItem {
  id: string;
  category: 'skills' | 'code' | 'inputs' | 'risk' | 'firm_ideas' | 'research_papers';
  name: string;
  subtitle: string;
  badge: string;
  type: 'subagent' | 'data' | 'tool' | 'parent';
  description: string;
  defaultProperty: string;
  tools: string[];
  latency: string;
  codeSnippet: string;
  isHot?: boolean;
}

const DEFAULT_CORE_NODES: AgentNode[] = [
  {
    id: 'node-1',
    name: 'Research Judgement agent',
    type: 'parent',
    role: 'Parent Orchestrator',
    status: 'ACTIVE',
    description: 'Parent qualitative reasoning & macro orchestration model. Aggregates multi-agent market hypotheses and calibrates macro beta overlays.',
    inputs: 'Macro statements, Fed minutes, equity consensus revisions & portfolio VaR limits',
    outputLink: 'Node 2 (Market trend refereall) & Node 3 (Data)',
    instructions: 'Ingest macro events, assess qualitative fundamentals, and orchestrate specialized sub-agents to calibrate portfolio hedges under strict risk bounds (Daily VaR < 1.50%).',
    defaultProperty: 'Highest Sharpe Weighting',
    codeSnippet: `# DE SHAW RESEARCH JUDGEMENT PARENT AGENT
class ResearchJudgementAgent(QuantParentAgent):
    def __init__(self, risk_limit_var=0.015):
        super().__init__(name="Research Judgement agent")
        self.risk_limit_var = risk_limit_var
        self.sub_agents = ["market_trend_ref", "factor_covariance_matrix"]
        
    def orchestrate_rebalance(self, macro_signal: MacroSignal, var_state: float):
        if var_state > self.risk_limit_var:
            hedge_orders = self.delegate_risk_neutralization(macro_signal)
            return self.route_to_terminal_gate(hedge_orders)
        return self.optimize_sharpe_frontier(alpha_target=0.18)`,
    tools: ['Macro News Wire', 'Earnings Transcript Parser', 'Barra Risk API'],
    latency: '18ms',
    x: 30,
    y: 110,
  },
  {
    id: 'node-2',
    name: 'Market trend refereall',
    type: 'subagent',
    role: 'Sub-Agent: Feature Extractor',
    status: 'DEPLOYED',
    description: 'Monitors hyperscaler capital expenditures, AI semiconductor supply chains, and sovereign bond curve dynamics.',
    inputs: 'Live yield spreads, hyperscaler Capex reports & commodities futures',
    outputLink: 'Execution Sub-Agent (Terminal Node)',
    instructions: 'Monitor real-time sector momentum rotations and identify cross-asset lead-lag relationships across global technology and energy supply chains.',
    defaultProperty: 'Factor Neutral Union',
    codeSnippet: `# MARKET TREND REFERRAL SUB-AGENT
class MarketTrendReferralSubAgent(FeatureExtractor):
    def extract_momentum_factors(self, tick_stream: TickStream):
        spread_lead = self.calculate_yield_spread_beta(tick_stream)
        capex_momentum = self.evaluate_hyperscaler_spend()
        return FactorVector(lead_lag=spread_lead, momentum=capex_momentum)`,
    tools: ['L3 Market Depth Feeder', 'Real-Time Momentum Engine', 'Sentiment Classifier'],
    latency: '12ms',
    x: 220,
    y: 25,
  },
  {
    id: 'node-3',
    name: 'Data & Factor Matrix',
    type: 'data',
    role: 'Quantitative Feature Store',
    status: 'ACTIVE',
    description: 'Ultra-low latency colocation feature store aggregating Barra risk factor exposures, covariance matrices, and cross-asset beta parameters.',
    inputs: 'Barra Factor Covariance, Bloomberg BVAL & Equinix NY4 raw L2 orderbook feeds',
    outputLink: 'Market trend refereall & Terminal Gate',
    instructions: 'Continuously refresh rolling 30-day covariance matrices and stream orthogonalized factor alphas to downstream decision nodes.',
    defaultProperty: 'Conservative 15c3-5 Check',
    codeSnippet: `# FACTOR COVARIANCE FEATURE STORE
class DataFactorMatrixNode(DataNode):
    def compute_orthogonal_alphas(self, raw_ticks: MarketDepth):
        cleaned_cov = self.eigen_factor_cleaner(raw_ticks)
        return self.barra_engine.orthogonalize(cleaned_cov)`,
    tools: ['Equinix NY4 Direct Feed', 'Barra Multiple-Horizon Risk Model', 'KDB+ Tick Store'],
    latency: '4ms',
    x: 200,
    y: 195,
  },
  {
    id: 'node-4',
    name: 'Execution Sub-Agent',
    type: 'tool',
    role: 'Terminal Execution Gate',
    status: 'READY',
    description: 'Pre-trade compliance checker and smart order router executing algorithmic fills via FIX 4.4.',
    inputs: 'Target allocation delta vectors from Research Judgement agent and feature sub-agents',
    outputLink: 'Institutional OMS / Trade Blotter (FIX 4.4 Port 9800)',
    instructions: 'Validate order sizes against SEC 15c3-5 market access rules, cap single-name concentration at 10%, and route via TWAP/VWAP algorithms.',
    defaultProperty: 'Strict 10% Capped',
    codeSnippet: `# SEC 15c3-5 COMPLIANT EXECUTION GATE
class ExecutionSubAgentGate(TerminalGate):
    def route_blotter_order(self, target_order: OrderRequest):
        if self.compliance_check_15c3_5(target_order):
            return self.fix_router.dispatch_twap(target_order)
        raise RiskBreachException("SEC 15c3-5 Gate Triggered")`,
    tools: ['FIX 4.4 Direct DMA', 'Pre-Trade Risk Validator', 'TWAP/VWAP Algorithmic Slicer'],
    latency: '0.08ms',
    x: 390,
    y: 110,
  }
];

const INITIAL_WORKSPACE_MODELS: WorkspaceModel[] = [
  {
    id: 'model-1',
    name: 'Production Core',
    tag: 'Core Orchestrator',
    version: 'v1.0',
    description: 'Primary production multi-agent architecture with Research Judgement parent node, trend referral sub-agent, and SEC 15c3-5 execution gate.',
    targetVol: 14,
    maxPosition: 10,
    varLimit: 1.25,
    expectedSharpe: 1.84,
    expectedReturn: 13.8,
    color: '#2563eb', // Blue
    nodes: DEFAULT_CORE_NODES,
  },
  {
    id: 'model-2',
    name: 'Delta-Neutral Alpha',
    tag: 'Stat-Arb Overlay',
    version: 'v1.2',
    description: 'High-frequency statistical arbitrage model with tighter VaR limit (1.05%), L2 orderbook imbalance extractor, and dynamic delta-neutral hedging.',
    targetVol: 11,
    maxPosition: 8,
    varLimit: 1.05,
    expectedSharpe: 2.15,
    expectedReturn: 15.6,
    color: '#10b981', // Emerald
    nodes: [
      {
        id: 'node-stat-parent',
        name: 'Stat-Arb Parent Orchestrator',
        type: 'parent',
        role: 'Parent Orchestrator',
        status: 'ACTIVE',
        description: 'Orchestrates high-frequency statistical arbitrage and cointegration mean-reversion trades.',
        inputs: 'Implied Volatility Surface, Order Imbalances & Cointegration Baskets',
        outputLink: 'Delta-Neutral Execution Gate',
        instructions: 'Monitor co-integrated equity pairs and route high-turnover arbitrage sweeps under strict delta-neutral constraints.',
        defaultProperty: 'Highest Sharpe Weighting',
        codeSnippet: `# STATISTICAL ARBITRAGE PARENT
class StatArbParentAgent(QuantParentAgent):
    def evaluate_spreads(self, z_scores):
        if abs(z_scores.current) > 2.2:
            return self.execute_pair_mean_reversion(z_scores)`,
        tools: ['Cointegration Engine', 'Barra Risk API', 'Z-Score Monitor'],
        latency: '8ms',
        x: 30,
        y: 110,
      },
      {
        id: 'node-stat-sub',
        name: 'L2 Order Imbalance Extractor',
        type: 'subagent',
        role: 'Sub-Agent: Feature Extractor',
        status: 'READY',
        description: 'Extracts microsecond queue depth imbalances and calculates real-time VPIN order flow toxicity.',
        inputs: 'NASDAQ ITCH 5.0 Depth Feed',
        outputLink: 'Stat-Arb Parent Orchestrator',
        instructions: 'Extract microsecond queue depth imbalances and compute real-time VPIN toxicity scores.',
        defaultProperty: 'Factor Neutral Union',
        codeSnippet: `# L2 DEPTH FEATURE EXTRACTOR
class L2DepthExtractor(FeatureExtractor):
    def compute_vpin(self, tick_feed):
        return self.toxicity_engine.calculate_volume_sync(tick_feed)`,
        tools: ['ITCH 5.0 Processor', 'FPGA Tick Sizer'],
        latency: '0.04ms',
        x: 220,
        y: 25,
      },
      {
        id: 'node-stat-data',
        name: 'Tick & Microstructure Store',
        type: 'data',
        role: 'Quantitative Feature Store',
        status: 'ACTIVE',
        description: 'High-speed 50-nanosecond tick colocation buffer at Equinix NY4.',
        inputs: 'Equinix NY4 raw L2/L3 colocation feed',
        outputLink: 'L2 Order Imbalance Extractor',
        instructions: 'Maintain 50-nanosecond tick buffers and trade-at-settlement historical snapshots.',
        defaultProperty: 'Conservative 15c3-5 Check',
        codeSnippet: `# TICK FEATURE STORE
class TickFeatureStore(DataNode):
    def get_order_book(self, symbol):
        return self.ny4_colo.snapshot(symbol)`,
        tools: ['NY4 Colocation Direct', 'KDB+/q Tick'],
        latency: '0.08ms',
        x: 200,
        y: 195,
      },
      {
        id: 'node-stat-gate',
        name: 'Delta-Neutral Execution DMA Gate',
        type: 'tool',
        role: 'Terminal Execution Gate',
        status: 'READY',
        description: 'Enforces pre-trade portfolio delta limits and executes paired DMA sweeps.',
        inputs: 'Calculated arbitrage legs and hedge ratios',
        outputLink: 'Direct Market Access (FIX 4.4)',
        instructions: 'Enforce pre-trade portfolio delta < ±0.02 and route paired limit orders simultaneously.',
        defaultProperty: 'Strict Delta Capped',
        codeSnippet: `# DELTA-NEUTRAL EXECUTION GATE
class DeltaNeutralGate(TerminalGate):
    def execute_paired_sweep(self, long_leg, short_leg):
        if self.verify_delta_neutrality(long_leg, short_leg):
            return self.route_dual_dma(long_leg, short_leg)`,
        tools: ['FIX 4.4 Engine', 'Pre-Trade SEC 15c3-5 Gate'],
        latency: '0.04ms',
        x: 390,
        y: 110,
      }
    ]
  },
  {
    id: 'model-3',
    name: 'Macro Rebalance Overlay',
    tag: 'Macro Overlay',
    version: 'v2.0',
    description: 'Rates shock hedge with Barra covariance multi-factor neutralization and cross-asset sovereign yield curve tracking.',
    targetVol: 16,
    maxPosition: 14,
    varLimit: 1.40,
    expectedSharpe: 1.95,
    expectedReturn: 14.2,
    color: '#8b5cf6', // Purple
    nodes: [
      {
        id: 'node-macro-parent',
        name: 'Yield Curve Macro Orchestrator',
        type: 'parent',
        role: 'Parent Orchestrator',
        status: 'ACTIVE',
        description: 'Models sovereign yield curve dynamics and macro factor shifts.',
        inputs: 'US 2Y/10Y curve, ECB minutes, breakeven inflation rates',
        outputLink: 'Barra Factor Covariance Sub-Agent',
        instructions: 'Model term structure twists and apply duration hedges across macro portfolios.',
        defaultProperty: 'Highest Sharpe Weighting',
        codeSnippet: `# MACRO YIELD CURVE ORCHESTRATOR
class MacroCurveOrchestrator(QuantParentAgent):
    def model_term_structure(self, yield_curve):
        steepener_signal = yield_curve.ten_year - yield_curve.two_year
        return self.rebalance_duration_exposure(steepener_signal)`,
        tools: ['Fed Funds Live', 'Bloomberg BVAL Feeder', 'Barra Multi-Factor'],
        latency: '24ms',
        x: 30,
        y: 110,
      },
      {
        id: 'node-macro-sub',
        name: 'Barra Factor Covariance Sub-Agent',
        type: 'subagent',
        role: 'Sub-Agent: Risk Neutralizer',
        status: 'DEPLOYED',
        description: 'Barra multi-factor risk model decomposes active risk and neutralizes style tilts.',
        inputs: 'Cross-asset factor risk model covariance matrix',
        outputLink: 'Terminal Gate',
        instructions: 'Decompose active risk and neutralize style factor tilt extremes.',
        defaultProperty: 'Factor Neutral Union',
        codeSnippet: `# FACTOR COVARIANCE NEUTRALIZER
class FactorCovarianceNeutralizer(FeatureExtractor):
    def compute_active_betas(self, factor_matrix):
        return self.barra_api.decompose_risk(factor_matrix)`,
        tools: ['Barra Risk Model', 'Eigenvalue Decomposer'],
        latency: '15ms',
        x: 220,
        y: 25,
      },
      {
        id: 'node-macro-gate',
        name: 'Cross-Asset Futures DMA Router',
        type: 'tool',
        role: 'Terminal Execution Gate',
        status: 'READY',
        description: 'Direct DMA execution router for treasury futures and duration hedge baskets.',
        inputs: 'Treasury futures and ETF hedging baskets',
        outputLink: 'CME Globex Gateway',
        instructions: 'Route interest rate futures hedges to execute macro duration adjustments.',
        defaultProperty: 'Conservative 15c3-5 Check',
        codeSnippet: `# CME FUTURES GATE
class CMEFuturesGate(TerminalGate):
    def route_hedge(self, duration_contracts):
        return self.globex_router.send_order(duration_contracts)`,
        tools: ['CME Globex API', 'SEC 15c3-5 Pre-Trade Check'],
        latency: '2ms',
        x: 390,
        y: 110,
      }
    ]
  }
];

// Comprehensive Firm Resource & Research Repository Catalog
const ENTERPRISE_RESOURCES: ResourceItem[] = [
  // SKILLS & SUBAGENTS
  {
    id: 'res-skill-1',
    category: 'skills',
    name: 'Momentum Arb Subagent',
    subtitle: 'Cross-Asset Statistical Momentum',
    badge: 'Quant Arb',
    type: 'subagent',
    description: 'High-speed momentum arbitrage subagent tracking 15-minute lead-lag anomalies across global indices.',
    defaultProperty: 'Factor Neutral Union',
    tools: ['Barra Risk API', 'Execution Gateway', 'Tick Momentum Sizer'],
    latency: '10ms',
    codeSnippet: `# MOMENTUM ARB SUBAGENT\nclass MomentumArbSubagent(QuantSubAgent):\n    def evaluate_cross_momentum(self, returns_stream):\n        return self.extract_anomalies(returns_stream)`,
    isHot: true,
  },
  {
    id: 'res-skill-2',
    category: 'skills',
    name: 'Volatility Skew Extractor',
    subtitle: 'Options Term Structure & Smile',
    badge: 'Vol Surface',
    type: 'subagent',
    description: 'Calculates 25-delta risk reversal and butterfly spreads across S&P 500 and EuroStoxx 50 options chains.',
    defaultProperty: 'Highest Sharpe Weighting',
    tools: ['CBOE Live Feed', 'Black-Scholes-Merton Engine'],
    latency: '6ms',
    codeSnippet: `# VOLATILITY SKEW EXTRACTOR\nclass VolSkewExtractor(FeatureExtractor):\n    def extract_skew(self, options_chain):\n        return self.compute_smile_curvature(options_chain)`,
    isHot: true,
  },
  {
    id: 'res-skill-3',
    category: 'skills',
    name: 'Mean Reversion Alpha Engine',
    subtitle: 'Cointegrated Pairs Trading',
    badge: 'Stat Arb',
    type: 'subagent',
    description: 'Dickey-Fuller stationary cointegration engine triggering Bollinger pair reversion sweeps.',
    defaultProperty: 'Factor Neutral Union',
    tools: ['Cointegration Engine', 'Z-Score Monitor'],
    latency: '8ms',
    codeSnippet: `# MEAN REVERSION ALPHA\nclass MeanReversionAlpha(QuantSubAgent):\n    def check_spread(self, pair_z_score):\n        return abs(pair_z_score) > 2.0`,
  },
  {
    id: 'res-skill-4',
    category: 'skills',
    name: 'Earnings NLP Sentiment Parser',
    subtitle: 'Transcript Tone & Guidance Delta',
    badge: 'Alternative Data',
    type: 'subagent',
    description: 'Large language model processing 10-K filings and CEO earnings call audio transcripts for tone shifts.',
    defaultProperty: 'Highest Sharpe Weighting',
    tools: ['SEC EDGAR Feeder', 'Transcript Parser API'],
    latency: '45ms',
    codeSnippet: `# NLP SENTIMENT PARSER\nclass NLPSentimentParser(QuantSubAgent):\n    def score_transcript(self, transcript_text):\n        return self.llm.classify_tone(transcript_text)`,
  },
  {
    id: 'res-skill-5',
    category: 'skills',
    name: 'Commodity Carry & Roll Yield',
    subtitle: 'WTI, Brent & Metals Curve',
    badge: 'Macro Premia',
    type: 'subagent',
    description: 'Extracts backwardation and contango carry roll yields across NYMEX and LME futures curves.',
    defaultProperty: 'Conservative 15c3-5 Check',
    tools: ['CME Globex API', 'Roll Yield Calculator'],
    latency: '14ms',
    codeSnippet: `# COMMODITY CARRY\nclass CommodityCarrySubagent(QuantSubAgent):\n    def calculate_roll(self, futures_curve):\n        return futures_curve.front_month - futures_curve.next_month`,
  },

  // CODE & TEMPLATES
  {
    id: 'res-code-1',
    category: 'code',
    name: 'Python FIX 4.4 Engine',
    subtitle: 'Institutional DMA Gateway',
    badge: 'FIX Engine',
    type: 'tool',
    description: 'Production-ready ultra low latency FIX 4.4 order routing engine with pre-baked session reconnects.',
    defaultProperty: 'Strict Delta Capped',
    tools: ['FIX 4.4 Port 9800', 'DMA Router'],
    latency: '0.08ms',
    codeSnippet: `# FIX 4.4 PROTOCOL ROUTER\nclass FixEngine(FIXGateway):\n    def send_twap(self, order):\n        return self.dispatch_fix_packet(order, session_id="DESHAW_DMA")`,
    isHot: true,
  },
  {
    id: 'res-code-2',
    category: 'code',
    name: 'Barra Multi-Asset Template',
    subtitle: 'Factor Risk Model Pipeline',
    badge: 'Barra Model',
    type: 'data',
    description: 'Standardized Barra risk factor decomposition wrapper isolating style, industry, and specific risk.',
    defaultProperty: 'Factor Neutral Union',
    tools: ['Barra Multi-Factor API'],
    latency: '15ms',
    codeSnippet: `# BARRA MULTI-ASSET WRAPPER\nclass BarraPipeline(RiskModel):\n    def decompose(self, portfolio):\n        return self.barra.compute_betas(portfolio)`,
  },
  {
    id: 'res-code-3',
    category: 'code',
    name: 'L2 Microstructure Parser',
    subtitle: 'Nanosecond ITCH/OUCH Feed',
    badge: 'C++ Bridge',
    type: 'data',
    description: 'C++ shared library wrapper decoding binary NASDAQ ITCH 5.0 order book messages.',
    defaultProperty: 'Conservative 15c3-5 Check',
    tools: ['ITCH 5.0 Feed', 'FPGA Sizer'],
    latency: '0.04ms',
    codeSnippet: `# ITCH 5.0 PARSER\nclass ITCHParser(DataNode):\n    def parse_depth(self, buffer):\n        return cpp_bridge.decode_itch50(buffer)`,
  },
  {
    id: 'res-code-4',
    category: 'code',
    name: 'Almgren-Chriss Optimal Execution',
    subtitle: 'Market Impact & Risk Aversion',
    badge: 'Execution Model',
    type: 'tool',
    description: 'Calculates optimal non-linear execution trajectories balancing temporary market impact vs price risk.',
    defaultProperty: 'Highest Sharpe Weighting',
    tools: ['Execution Gateway', 'Market Impact Calculator'],
    latency: '1.2ms',
    codeSnippet: `# ALMGREN-CHRISS TRAJECTORY\nclass OptimalExecution(TerminalGate):\n    def compute_trajectory(self, order, vol, liquidity):\n        return almgren_chriss_solver(order, vol, liquidity)`,
  },

  // INPUT NODES & DATA
  {
    id: 'res-input-1',
    category: 'inputs',
    name: 'Equinix NY4 Tick L2 Stream',
    subtitle: 'Direct Cross-Connect Colocation',
    badge: 'Colo Direct',
    type: 'data',
    description: 'Sub-microsecond direct optical cross-connect from Equinix NY4 Secaucus data center.',
    defaultProperty: 'Factor Neutral Union',
    tools: ['NY4 Colocation', 'Direct Fiber'],
    latency: '0.02ms',
    codeSnippet: `# NY4 DIRECT FEED\nclass NY4FeedNode(DataNode):\n    def stream(self):\n        return self.optical_receiver.read()`,
    isHot: true,
  },
  {
    id: 'res-input-2',
    category: 'inputs',
    name: 'Barra Risk & Covariance Store',
    subtitle: 'Historical 10-Year Matrices',
    badge: 'KDB+ Tick',
    type: 'data',
    description: 'KDB+/q high-performance timeseries database serving continuous rolling factor covariances.',
    defaultProperty: 'Conservative 15c3-5 Check',
    tools: ['KDB+ /q Store', 'Barra Engine'],
    latency: '2ms',
    codeSnippet: `# KDB COVARIANCE STORE\nclass KDBCovariance(DataNode):\n    def query_matrix(self, dt):\n        return self.q_connection.query(f"select from cov where date={dt}")`,
  },
  {
    id: 'res-input-3',
    category: 'inputs',
    name: 'Fed & Central Bank Rate Trackers',
    subtitle: 'SOFR, Fed Funds & ECB OIS',
    badge: 'Rates Feeder',
    type: 'data',
    description: 'Real-time forward rate agreements (FRA) and overnight index swaps (OIS) curves.',
    defaultProperty: 'Highest Sharpe Weighting',
    tools: ['Bloomberg BVAL', 'CME FedWatch'],
    latency: '12ms',
    codeSnippet: `# RATES TRACKER\nclass CentralBankRateFeed(DataNode):\n    def get_ois_curve(self):\n        return self.bval.fetch_curve("USD_SOFR_OIS")`,
  },

  // RISK & COMPLIANCE
  {
    id: 'res-risk-1',
    category: 'risk',
    name: 'SEC Rule 15c3-5 Pre-Trade Gate',
    subtitle: 'Market Access Hard Limits',
    badge: 'Regulatory Core',
    type: 'tool',
    description: 'SEC Market Access Rule 15c3-5 gate blocking erroneous orders, credit cap breaches, and price collar violations.',
    defaultProperty: 'Strict 10% Capped',
    tools: ['Pre-Trade Risk Validator', 'SEC 15c3-5 Gate'],
    latency: '0.05ms',
    codeSnippet: `# SEC 15c3-5 GATE\nclass SEC15c35Gate(TerminalGate):\n    def validate(self, order):\n        if order.value > self.credit_limit: return False\n        return True`,
    isHot: true,
  },
  {
    id: 'res-risk-2',
    category: 'risk',
    name: 'Delta Neutral Overlay Hedge Guard',
    subtitle: 'Portfolio Beta & Factor Bounds',
    badge: 'Risk Guard',
    type: 'tool',
    description: 'Autonomous risk overlay that synthetically shorts index futures if overall net portfolio beta exceeds ±0.03.',
    defaultProperty: 'Strict Delta Capped',
    tools: ['CME Globex API', 'Beta Neutralizer'],
    latency: '1.8ms',
    codeSnippet: `# DELTA NEUTRAL OVERLAY\nclass DeltaHedgeGuard(TerminalGate):\n    def check_beta(self, current_beta):\n        if abs(current_beta) > 0.03:\n            self.fire_synthetic_hedge()`,
  },

  // FIRM IDEAS & ALPHA HYPOTHESES (D. E. Shaw Internal Ideas)
  {
    id: 'res-idea-1',
    category: 'firm_ideas',
    name: 'Hyperscaler AI Capex Rotation Idea',
    subtitle: 'Semis vs Cloud Providers Spread',
    badge: 'Firm Alpha Idea',
    type: 'parent',
    description: 'Hypothesis: Lead-lag cycle between NVDA/TSM hardware revenue delivery and MSFT/GOOG/AMZN AI monetisation multiples.',
    defaultProperty: 'Highest Sharpe Weighting',
    tools: ['Macro News Wire', 'Barra Multi-Factor API', 'Capex Tracker'],
    latency: '18ms',
    codeSnippet: `# CAPEX ROTATION STRATEGY\nclass AICapexRotation(QuantParentAgent):\n    def analyze_capex_spread(self, hardware_rev, cloud_ebitda):\n        return hardware_rev / cloud_ebitda`,
    isHot: true,
  },
  {
    id: 'res-idea-2',
    category: 'firm_ideas',
    name: 'FOMC Volatility Squeeze Compression',
    subtitle: 'Pre-Meeting Straddle Harvest',
    badge: 'Firm Alpha Idea',
    type: 'parent',
    description: 'Hypothesis: S&P 500 implied volatility spikes 3 days prior to rate announcements, creating consistent short-gamma variance risk premium harvest.',
    defaultProperty: 'Conservative 15c3-5 Check',
    tools: ['CBOE Live Feed', 'Black-Scholes-Merton Engine'],
    latency: '14ms',
    codeSnippet: `# FOMC VOL COMPRESSION\nclass FOMCVolCompression(QuantParentAgent):\n    def harvest_gamma(self, days_to_fomc, iv_skew):\n        if days_to_fomc <= 2 and iv_skew > 1.8:\n            return self.sell_strangle_spread()`,
    isHot: true,
  },
  {
    id: 'res-idea-3',
    category: 'firm_ideas',
    name: 'Cross-Sovereign Yield Curve Steepener',
    subtitle: 'US 2Y/10Y vs German Bunds',
    badge: 'Firm Alpha Idea',
    type: 'parent',
    description: 'Hypothesis: Diverging central bank terminal rates between Fed and ECB create asymmetric curve twist arbitrage.',
    defaultProperty: 'Factor Neutral Union',
    tools: ['Fed Funds Live', 'Bloomberg BVAL Feeder'],
    latency: '22ms',
    codeSnippet: `# CURVE STEEPENER\nclass SovereignCurveArbitrage(QuantParentAgent):\n    def compare_term_structures(self, us_curve, bund_curve):\n        return us_curve.slope - bund_curve.slope`,
  },

  // RESEARCH PAPERS & QUANT LABS
  {
    id: 'res-paper-1',
    category: 'research_papers',
    name: 'Deep Order Flow Imbalance (Cartea & Jaimungal 2024)',
    subtitle: 'Microstructure Probability of Informed Trading',
    badge: 'Research Lab',
    type: 'subagent',
    description: 'Empirical model computing conditional volume-synchronized probability of toxicity (VPIN) in sub-millisecond crypto & equity regimes.',
    defaultProperty: 'Factor Neutral Union',
    tools: ['ITCH 5.0 Feed', 'KDB+ Tick Store'],
    latency: '0.06ms',
    codeSnippet: `# CARTEA-JAIMUNGAL FLOW MODEL\nclass DeepOrderFlowImbalance(QuantSubAgent):\n    def compute_informed_probability(self, vpin_vector):\n        return solve_cartea_informed_flow(vpin_vector)`,
  },
  {
    id: 'res-paper-2',
    category: 'research_papers',
    name: 'Factor Zoo Orthogonalization (Harvey & Liu)',
    subtitle: 't-stat Thresholds & p-Hacking Filter',
    badge: 'Research Lab',
    type: 'data',
    description: 'Implements multiple testing haircut adjustments (Bonferroni & Holm) requiring t-stat > 3.0 for legitimate factor alpha inclusion.',
    defaultProperty: 'Conservative 15c3-5 Check',
    tools: ['Barra Risk Model', 'Eigenvalue Decomposer'],
    latency: '16ms',
    codeSnippet: `# FACTOR ZOO HAIRCUT\nclass FactorHaircutValidator(DataNode):\n    def filter_alphas(self, factor_t_stats):\n        return [f for f in factor_t_stats if f.t_stat >= 3.0]`,
  }
];

interface AgentWorkspaceViewProps {
  activeTab: ViewTab;
  importedModel?: WorkspaceModel | null;
  onClearImportedModel?: () => void;
}

export const AgentWorkspaceView: React.FC<AgentWorkspaceViewProps> = ({ 
  activeTab,
  importedModel,
  onClearImportedModel
}) => {
  // Multi-Model Management State
  const [models, setModels] = useState<WorkspaceModel[]>(INITIAL_WORKSPACE_MODELS);
  const [activeModelId, setActiveModelId] = useState<string>('model-1');
  const [sandboxInitialMode, setSandboxInitialMode] = useState<'single' | 'compare' | 'merge'>('single');
  const [isNewModelMenuOpen, setIsNewModelMenuOpen] = useState<boolean>(false);

  // Active Model resolution
  const activeModel = models.find(m => m.id === activeModelId) || models[0];

  // Listen for imported model from AI Optimisation Window
  useEffect(() => {
    if (importedModel) {
      setModels((prev) => {
        const exists = prev.some((m) => m.id === importedModel.id);
        if (exists) return prev;
        return [...prev, importedModel];
      });
      setActiveModelId(importedModel.id);
      setRightTab('sandbox');
      setSandboxInitialMode('single');
      if (onClearImportedModel) {
        onClearImportedModel();
      }
    }
  }, [importedModel, onClearImportedModel]);

  // View mode switcher: matrix / Node / code
  const [viewMode, setViewMode] = useState<CanvasViewMode>('Node');
  
  // Repository filter pills: [ All ] [ Code bases ] [ sub agents ] [ sub agents ]
  const [repoFilter, setRepoFilter] = useState<RepoFilter>('all');

  // Selected node state for Inspector
  const [selectedNodeId, setSelectedNodeId] = useState<string>(activeModel.nodes[0]?.id || 'node-1');

  // Sync selected node with active model
  useEffect(() => {
    if (activeModel && activeModel.nodes.length > 0) {
      if (!activeModel.nodes.some(n => n.id === selectedNodeId)) {
        setSelectedNodeId(activeModel.nodes[0].id);
      }
    }
  }, [activeModel, selectedNodeId]);

  const selectedNode = activeModel.nodes.find(n => n.id === selectedNodeId) || activeModel.nodes[0] || DEFAULT_CORE_NODES[0];

  // Right Panel Tabs: [ Agent | Instructions | Code | Backtest Sandbox ]
  const [rightTab, setRightTab] = useState<RightPanelTab>('agent');

  // Canvas Inspector Editable fields for selected agent
  const [agentNameInput, setAgentNameInput] = useState<string>(selectedNode?.name || '');
  const [agentInputsText, setAgentInputsText] = useState<string>(selectedNode?.inputs || '');
  const [agentDescText, setAgentDescText] = useState<string>(selectedNode?.description || '');
  const [agentOutputLinkText, setAgentOutputLinkText] = useState<string>(selectedNode?.outputLink || '');
  const [agentInstructionsText, setAgentInstructionsText] = useState<string>(selectedNode?.instructions || '');
  const [selectedProperty, setSelectedProperty] = useState<string>(selectedNode?.defaultProperty || 'Highest Sharpe Weighting');

  // Update inspector fields when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setAgentNameInput(selectedNode.name);
      setAgentInputsText(selectedNode.inputs);
      setAgentDescText(selectedNode.description);
      setAgentOutputLinkText(selectedNode.outputLink);
      setAgentInstructionsText(selectedNode.instructions);
      setSelectedProperty(selectedNode.defaultProperty);
    }
  }, [selectedNodeId, activeModelId]);

  // Anti-hallucination auto-refresh countdown state per node
  const [nodeCountdowns, setNodeCountdowns] = useState<Record<string, number>>({
    'node-1': 42,
    'node-2': 36,
    'node-3': 58,
    'node-4': 24,
  });
  const [refreshingNodeId, setRefreshingNodeId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setNodeCountdowns((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (next[k] <= 1) {
            next[k] = k === 'node-1' ? 45 : k === 'node-2' ? 40 : k === 'node-3' ? 60 : 30;
          } else {
            next[k] -= 1;
          }
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualNodeRefresh = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setRefreshingNodeId(nodeId);
    setTimeout(() => {
      setRefreshingNodeId(null);
      setNodeCountdowns((prev) => ({
        ...prev,
        [nodeId]: 45
      }));
    }, 600);
  };

  // Version dropdown
  const [selectedVersion, setSelectedVersion] = useState<string>(activeModel.version || 'Version 1');
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState<boolean>(false);

  // Bottom Model Idea / workspace ideator prompt state
  const [ideaPrompt, setIdeaPrompt] = useState<string>(
    'Add a stop-loss delta hedge when portfolio VaR breaches 1.25%, and incorporate L2 tick order imbalance into the momentum feature extractor.'
  );
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [ideatorOutput, setIdeatorOutput] = useState<string | null>(null);

  // Prompt / Test Modal state
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);
  const [promptQuery, setPromptQuery] = useState<string>('Simulate rate shock of +50bps and verify delta neutral hedge execution');
  const [isPromptRunning, setIsPromptRunning] = useState<boolean>(false);
  const [promptResponse, setPromptResponse] = useState<string | null>(null);

  // Audit modal state
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  // Extensible Bottom Enterprise Resource Drawer State
  const [isBottomPanelExpanded, setIsBottomPanelExpanded] = useState<boolean>(false);
  const [resourceCategory, setResourceCategory] = useState<BottomDrawerTab>('all');
  const [resourceSearchQuery, setResourceSearchQuery] = useState<string>('');
  const [draggedResource, setDraggedResource] = useState<ResourceItem | null>(null);
  const [resourceNotification, setResourceNotification] = useState<string | null>(null);

  // Toast feedback helper
  const showResourceFeedback = (msg: string) => {
    setResourceNotification(msg);
    setTimeout(() => {
      setResourceNotification(null);
    }, 3500);
  };

  // Instantiate resource item as a node in the active model
  const handleAddResourceToModel = (resource: ResourceItem, dropCoords?: { x: number; y: number }) => {
    // If it's a parent idea, instantiate or create a complete strategy branch
    const uniqueId = `node-${resource.category}-${Date.now().toString().slice(-4)}`;
    
    // Calculate intelligent default offset
    const existingCount = activeModel.nodes.length;
    const defaultX = dropCoords ? dropCoords.x : 200 + (existingCount % 4) * 80;
    const defaultY = dropCoords ? dropCoords.y : 60 + ((existingCount * 45) % 180);

    const newNode: AgentNode = {
      id: uniqueId,
      name: resource.name,
      type: resource.type,
      role: resource.subtitle,
      status: 'READY',
      description: resource.description,
      inputs: resource.type === 'data' ? 'Direct Exchange Optical Stream / KDB+' : 'Factor Matrix & Tick Feeds',
      outputLink: resource.type === 'tool' ? 'CME Globex DMA Router' : 'Downstream Execution Gate',
      instructions: `Execute ${resource.name} quantitative logic under ${resource.defaultProperty}.`,
      defaultProperty: resource.defaultProperty,
      codeSnippet: resource.codeSnippet,
      tools: resource.tools,
      latency: resource.latency,
      x: defaultX,
      y: defaultY,
    };

    setModels(prev => prev.map(m => m.id === activeModelId ? { ...m, nodes: [...m.nodes, newNode] } : m));
    setSelectedNodeId(newNode.id);
    showResourceFeedback(`Added "${resource.name}" to ${activeModel.name}`);
  };

  // Create an entirely new model from a firm idea
  const handleCreateModelFromIdea = (resource: ResourceItem) => {
    const newModelId = `model-idea-${Date.now()}`;
    const newModel: WorkspaceModel = {
      id: newModelId,
      name: resource.name.replace(' Idea', ''),
      tag: resource.badge,
      version: 'v1.0-alpha',
      description: resource.description,
      targetVol: 13,
      maxPosition: 8,
      varLimit: 1.15,
      expectedSharpe: 2.15,
      expectedReturn: 15.6,
      color: '#8b5cf6',
      nodes: [
        {
          id: `node-idea-parent-${Date.now()}`,
          name: resource.name,
          type: 'parent',
          role: resource.subtitle,
          status: 'ACTIVE',
          description: resource.description,
          inputs: 'Macro signals, yields, and firm quantitative streams',
          outputLink: 'Execution Sub-Agent & Terminal DMA',
          instructions: `Systematic implementation of ${resource.name}. Balance portfolio Sharpe while bounding tail risk.`,
          defaultProperty: resource.defaultProperty,
          codeSnippet: resource.codeSnippet,
          tools: resource.tools,
          latency: resource.latency,
          x: 30,
          y: 110,
        },
        {
          id: `node-idea-factor-${Date.now() + 1}`,
          name: 'Barra Factor Covariance Stream',
          type: 'data',
          role: 'Quantitative Feature Store',
          status: 'ACTIVE',
          description: 'Historical Barra rolling covariance matrix for factor-neutral hedging.',
          inputs: 'Barra Multi-Horizon Risk Feed',
          outputLink: resource.name,
          instructions: 'Stream orthogonalized factor vectors.',
          defaultProperty: 'Factor Neutral Union',
          codeSnippet: `# FACTOR STREAM\nclass FactorStream(DataNode):\n    pass`,
          tools: ['Barra Risk API'],
          latency: '4ms',
          x: 220,
          y: 25,
        },
        {
          id: `node-idea-gate-${Date.now() + 2}`,
          name: 'SEC 15c3-5 DMA Gate',
          type: 'tool',
          role: 'Terminal Execution Gate',
          status: 'READY',
          description: 'Pre-trade compliance & credit collar gate.',
          inputs: 'Execution orders',
          outputLink: 'DMA Terminal',
          instructions: 'Verify credit limits before routing.',
          defaultProperty: 'Conservative 15c3-5 Check',
          codeSnippet: `# SEC GATE\nclass SECGate(TerminalGate):\n    pass`,
          tools: ['SEC 15c3-5 Gate'],
          latency: '0.05ms',
          x: 390,
          y: 110,
        }
      ]
    };

    setModels(prev => [...prev, newModel]);
    setActiveModelId(newModel.id);
    showResourceFeedback(`Created model "${newModel.name}" from firm idea catalog!`);
  };

  // Filtered enterprise resources
  const filteredEnterpriseResources = ENTERPRISE_RESOURCES.filter(res => {
    const matchesCategory = resourceCategory === 'all' || res.category === resourceCategory;
    const matchesQuery = !resourceSearchQuery || 
      res.name.toLowerCase().includes(resourceSearchQuery.toLowerCase()) ||
      res.subtitle.toLowerCase().includes(resourceSearchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(resourceSearchQuery.toLowerCase()) ||
      res.badge.toLowerCase().includes(resourceSearchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Model creation handler
  const handleCreateNewModel = (type: 'blank' | 'clone' | 'template') => {
    setIsNewModelMenuOpen(false);
    let newModel: WorkspaceModel;

    if (type === 'clone') {
      newModel = {
        ...activeModel,
        id: `model-${Date.now()}`,
        name: `${activeModel.name} (Copy)`,
        version: 'v1.1-copy',
        color: '#6366f1',
      };
    } else if (type === 'template') {
      newModel = {
        id: `model-${Date.now()}`,
        name: 'Volatility Skew Arbitrage',
        tag: 'Vol-Arb Model',
        version: 'v1.0-vol',
        description: 'Cross-strike option skew and variance swap risk-reversal arbitrage model.',
        targetVol: 12,
        maxPosition: 7,
        varLimit: 0.95,
        expectedSharpe: 2.22,
        expectedReturn: 16.4,
        color: '#ec4899',
        nodes: [
          {
            id: `node-vol-parent-${Date.now()}`,
            name: 'Vol Skew Parent Orchestrator',
            type: 'parent',
            role: 'Parent Orchestrator',
            status: 'ACTIVE',
            description: 'Option implied volatility term structure arbitrageur harvesting skew risk premia.',
            inputs: 'CBOE IV Term Structure, S&P 500 options chain',
            outputLink: 'Variance Swap Execution Gate',
            instructions: 'Harvest implied volatility risk premia when ATM/OTM skew widens past 2.0 std dev.',
            defaultProperty: 'Highest Sharpe Weighting',
            codeSnippet: `# VOLATILITY SKEW ARBITRAGE
class VolSkewAgent(QuantParentAgent):
    def evaluate_skew(self, iv_surface):
        return self.calculate_variance_premia(iv_surface)`,
            tools: ['CBOE Direct Feed', 'Black-Scholes-Merton Engine'],
            latency: '6ms',
            x: 30,
            y: 110,
          }
        ]
      };
    } else {
      newModel = {
        id: `model-${Date.now()}`,
        name: `Custom Agent Model #${models.length + 1}`,
        tag: 'Draft Model',
        version: 'v0.1-draft',
        description: 'Blank agent canvas ready to configure DAG nodes and parameters.',
        targetVol: 14,
        maxPosition: 10,
        varLimit: 1.25,
        expectedSharpe: 1.75,
        expectedReturn: 13.0,
        color: '#64748b',
        nodes: [
          {
            id: `node-draft-parent-${Date.now()}`,
            name: 'Primary Decision Orchestrator',
            type: 'parent',
            role: 'Parent Orchestrator',
            status: 'READY',
            description: 'Custom parent decision orchestrator for quantitative strategy execution.',
            inputs: 'Market Data Feeds',
            outputLink: 'Execution Gate',
            instructions: 'Configure agent decision weights and downstream feature nodes.',
            defaultProperty: 'Highest Sharpe Weighting',
            codeSnippet: `# NEW AGENT ORCHESTRATOR\nclass CustomAgent(QuantParentAgent):\n    pass`,
            tools: ['Market Feeder'],
            latency: '10ms',
            x: 30,
            y: 110,
          }
        ]
      };
    }

    setModels(prev => [...prev, newModel]);
    setActiveModelId(newModel.id);
  };

  // Close tab handler
  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (models.length <= 1) return;
    const remaining = models.filter(m => m.id !== id);
    setModels(remaining);
    if (activeModelId === id) {
      setActiveModelId(remaining[0].id);
    }
  };

  // Handle model merge execution from Sandbox
  const handleMergeModels = (modelAId: string, modelBId: string, mergeStrategy: string) => {
    const modA = models.find(m => m.id === modelAId) || activeModel;
    const modB = models.find(m => m.id === modelBId) || models[1] || activeModel;

    const mergedModel: WorkspaceModel = {
      id: `model-merged-${Date.now()}`,
      name: `Merged: ${modA.name.slice(0, 8)} + ${modB.name.slice(0, 8)}`,
      tag: 'Merged Strategy',
      version: 'v1.0-merged',
      description: `Synthesized model combining ${modA.name} and ${modB.name} using ${mergeStrategy} allocation protocol.`,
      targetVol: Math.round(((modA.targetVol || 14) + (modB.targetVol || 14)) / 2 * 0.92),
      maxPosition: Math.max(modA.maxPosition || 10, modB.maxPosition || 10),
      varLimit: Number((Math.min(modA.varLimit || 1.25, modB.varLimit || 1.25) * 0.92).toFixed(2)),
      expectedSharpe: Number((Math.max(modA.expectedSharpe || 1.84, modB.expectedSharpe || 1.84) + 0.18).toFixed(2)),
      expectedReturn: Number((Math.max(modA.expectedReturn || 13.8, modB.expectedReturn || 13.8) + 1.4).toFixed(1)),
      color: '#059669', // Emerald
      nodes: [
        ...modA.nodes.filter(n => n.type === 'parent'),
        ...modB.nodes.filter(n => n.type === 'subagent' || n.type === 'data'),
        ...modA.nodes.filter(n => n.type === 'tool'),
      ]
    };

    setModels(prev => [...prev, mergedModel]);
    setActiveModelId(mergedModel.id);
    setRightTab('sandbox');
    setSandboxInitialMode('single');
  };

  // Handle ideate and synthesize
  const handleSynthesizeIdea = () => {
    setIsSynthesizing(true);
    setIdeatorOutput(null);
    setTimeout(() => {
      setIsSynthesizing(false);
      setIdeatorOutput(
        `✓ Workspace Ideator Applied to ${activeModel.name}:\n` +
        `• Generated sub-agent parameter update: "Delta-Neutral Stop-Loss Overlay (VaR > 1.25%)".\n` +
        `• Connected L2 Order Imbalance feed into Market Trend Referral node.\n` +
        `• Re-calibrated Backtest Sandbox with targeted datasets (Annualized Sharpe +0.18, Max Drawdown reduced by 1.1%).`
      );
      // Auto-switch to sandbox to see model outputs!
      setRightTab('sandbox');
      setSandboxInitialMode('single');
    }, 900);
  };

  // Handle prompt selected agent
  const handleRunAgentPrompt = () => {
    setIsPromptRunning(true);
    setPromptResponse(null);
    setTimeout(() => {
      setIsPromptRunning(false);
      setPromptResponse(
        `[${selectedNode.name} Execution Output]\n` +
        `• Input Processed: "${promptQuery}"\n` +
        `• Status: PASSED all 4 pre-trade compliance gates (SEC 15c3-5, <10% concentration).\n` +
        `• Model Decision: Synthetic short index futures overlay recommended (-15% beta exposure).\n` +
        `• Simulated VaR: Stabilized from 1.34% to 1.14% (within 1.50% firm ceiling).\n` +
        `• Target Route: Direct Market Access (FIX 4.4 Port 9800) ready for blotter staging.`
      );
    }, 800);
  };

  // Repository items matching wireframe
  const repositoryItems = [
    {
      id: 'repo-1',
      title: 'Research Judgement agent',
      category: 'subagents',
      nodeMatch: 'node-1',
      tag: 'Parent Agent',
    },
    {
      id: 'repo-2',
      title: 'Templates',
      category: 'templates',
      nodeMatch: 'node-2',
      tag: 'Quant Template',
    },
    {
      id: 'repo-3',
      title: 'Data',
      category: 'data',
      nodeMatch: 'node-3',
      tag: 'Data Stream',
    },
    {
      id: 'repo-4',
      title: 'Sub agent',
      category: 'subagents',
      nodeMatch: 'node-4',
      tag: 'Execution Sub-Agent',
    },
    {
      id: 'repo-5',
      title: 'Market trend refereall',
      category: 'subagents',
      nodeMatch: 'node-2',
      tag: 'Trend Extractor',
    },
  ];

  const filteredRepoItems = repositoryItems.filter(item => {
    if (repoFilter === 'all') return true;
    if (repoFilter === 'codebases') return item.category === 'codebases' || item.category === 'templates';
    if (repoFilter === 'subagents') return item.category === 'subagents';
    if (repoFilter === 'templates') return item.category === 'templates';
    if (repoFilter === 'data') return item.category === 'data';
    return true;
  });

  return (
    <div className="h-full flex-1 flex flex-col min-h-0 overflow-hidden space-y-2 select-none bg-white">
      
      {/* Top Workspace Header with Multi-Model Tabs and Model Handling Section */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-border shrink-0">
        
        {/* Left: View Title */}
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-bold text-foreground font-mono tracking-tight">
            Agent Workspace
          </span>
          <Badge variant="outline" className="text-[10px] font-mono bg-slate-50 text-slate-700 border-border">
            DAG Architecture
          </Badge>
        </div>

        {/* Center: Model Tabs Section */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-xl py-0.5">
          {models.map((mod) => {
            const isActive = mod.id === activeModelId;
            return (
              <div
                key={mod.id}
                onClick={() => {
                  setActiveModelId(mod.id);
                  if (mod.nodes.length > 0) {
                    setSelectedNodeId(mod.nodes[0].id);
                  }
                }}
                className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono cursor-pointer transition-all border shrink-0 ${
                  isActive
                    ? 'bg-white text-foreground border-blue-500 ring-2 ring-blue-400/20 shadow-2xs font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-muted-foreground border-border'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: mod.color || '#3b82f6' }} 
                />
                <span className="truncate max-w-[140px]">{mod.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-border/60 text-muted-foreground">
                  {mod.version}
                </span>

                {models.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => handleCloseTab(mod.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-500 p-0.5 rounded transition-opacity"
                    title="Close model tab"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* + New Model Button with Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNewModelMenuOpen(!isNewModelMenuOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono text-muted-foreground hover:text-foreground bg-slate-50 hover:bg-slate-100 border border-dashed border-border transition-all shrink-0"
              title="Add or Ideate on New Model"
            >
              <Plus className="w-3 h-3 text-blue-600" />
              <span>New Model</span>
              <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
            </button>

            {isNewModelMenuOpen && (
              <div className="absolute left-0 mt-1 w-56 bg-white border border-border rounded-xl shadow-lg z-40 p-1 font-mono text-xs animate-in fade-in">
                <button
                  type="button"
                  onClick={() => handleCreateNewModel('blank')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-foreground"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <div>
                    <span className="font-semibold block">Blank Model</span>
                    <span className="text-[10px] text-muted-foreground block">Empty canvas to design DAG</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateNewModel('clone')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-foreground"
                >
                  <Copy className="w-3.5 h-3.5 text-emerald-600" />
                  <div>
                    <span className="font-semibold block">Clone Active Model</span>
                    <span className="text-[10px] text-muted-foreground block">Duplicate {activeModel.name}</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateNewModel('template')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-foreground"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                  <div>
                    <span className="font-semibold block">Volatility Skew Arb</span>
                    <span className="text-[10px] text-muted-foreground block">From Research Node idea</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Model Handling Section (Compare & Merge in Sandbox) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setRightTab('sandbox');
              setSandboxInitialMode('compare');
            }}
            className="h-7 px-2.5 text-xs font-mono text-blue-700 bg-blue-50/50 hover:bg-blue-100/60 border-blue-200 rounded-lg gap-1 shadow-2xs"
            title="Compare two models side-by-side in the Sandbox"
          >
            <ArrowLeftRight className="w-3 h-3 text-blue-600" />
            <span>Compare in Sandbox</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setRightTab('sandbox');
              setSandboxInitialMode('merge');
            }}
            className="h-7 px-2.5 text-xs font-mono text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/60 border-emerald-200 rounded-lg gap-1 shadow-2xs"
            title="Merge two models into a unified strategy in Sandbox"
          >
            <GitMerge className="w-3 h-3 text-emerald-600" />
            <span>Merge Models</span>
          </Button>

          <Badge variant="outline" className="text-[10px] font-mono bg-white text-foreground border-border hidden sm:inline-flex">
            Sharpe: {activeModel.expectedSharpe || 1.84} · VaR: {activeModel.varLimit || 1.25}%
          </Badge>
        </div>

      </div>

      {/* AI Strategy Experimentation Notice Banner (When experimenting from Market Fund Manager) */}
      {activeModel.originStrategy && (
        <div className="px-3 py-2 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono shrink-0 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-600 text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="text-blue-900 font-bold block">
                Experimenting with Strategy Idea: {activeModel.originStrategy}
              </span>
              <span className="text-[11px] text-blue-700 font-sans">
                {activeModel.description}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeModel.ideaBenefits?.map((b, idx) => (
              <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white text-blue-800 font-bold border border-blue-200 shadow-2xs">
                {b}
              </span>
            ))}
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setRightTab('sandbox');
                setSandboxInitialMode('single');
              }}
              className="h-6 text-[11px] font-mono bg-blue-600 hover:bg-blue-700 text-white rounded-md px-2.5 gap-1"
            >
              <TestTube className="w-3 h-3" />
              <span>Backtest Live</span>
            </Button>
          </div>
        </div>
      )}

      {/* Main 2-Panel Layout matching the updated sketch (Canvas + Bottom Tray on Left, Inspector on Right) */}
      <div className="flex-1 min-h-0 border border-border rounded-2xl bg-white shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* =========================================================================
            LEFT / CENTER MAIN AREA (Cols 1-8):
            - Top Bar: [ matrix / Node / code ] + [ Version 1 ▼ ]
            - Canvas with DAG Nodes & Lower-Left AI Suggestion Reasoning Box
            - Bottom Component Library Tray: [ Skills & subagents | Code & templates | Input nodes | Risk & compliance ]
           ========================================================================= */}
        <div className="lg:col-span-8 flex flex-col justify-between border-r border-border bg-white p-3 min-h-0 overflow-hidden">
          
          {/* TOP CANVAS HEADER: "matrix / Node / code" + "Version 1 ▼" */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-border shrink-0">
            
            {/* Mode switch container: [ matrix / Node / code ] */}
            <div className="flex items-center px-2 py-0.5 rounded-xl border border-border bg-white font-mono text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('matrix')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  viewMode === 'matrix'
                    ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                matrix
              </button>
              <span className="text-muted-foreground mx-1">/</span>
              <button
                type="button"
                onClick={() => setViewMode('Node')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  viewMode === 'Node'
                    ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                Node
              </button>
              <span className="text-muted-foreground mx-1">/</span>
              <button
                type="button"
                onClick={() => setViewMode('code')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  viewMode === 'code'
                    ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                code
              </button>
            </div>

            {/* Version dropdown: [ Version 1 ▼ ] */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
                className="h-7 text-xs font-mono gap-1 text-foreground px-2.5 bg-white hover:bg-slate-50 border-border rounded-lg shadow-2xs"
              >
                <span>{selectedVersion}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>

              {isVersionDropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white border border-border rounded-xl shadow-lg z-30 p-1 font-mono text-xs animate-in fade-in">
                  {[
                    'Version 1 (Production Core)',
                    'Version 1.1 (Low Latency DMA)',
                    'Version 1.2 (Delta-Neutral Alpha)',
                    'Version 2.0-Alpha (Omni Macro)',
                  ].map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setSelectedVersion(v.split(' (')[0]);
                        setIsVersionDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between ${
                        selectedVersion === v.split(' (')[0] ? 'text-blue-600 font-bold bg-blue-50' : 'text-foreground'
                      }`}
                    >
                      <span>{v}</span>
                      {selectedVersion === v.split(' (')[0] && <Check className="w-3 h-3 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MAIN INTERACTIVE CANVAS AREA */}
          <div 
            className="relative flex-1 min-h-[280px] rounded-xl border border-border bg-white overflow-hidden p-2 select-none flex flex-col justify-between"
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
            }}
            onDrop={(e) => {
              e.preventDefault();
              try {
                const dataStr = e.dataTransfer.getData('text/plain');
                if (dataStr) {
                  const item: ResourceItem = JSON.parse(dataStr);
                  const rect = e.currentTarget.getBoundingClientRect();
                  const dropX = Math.max(20, Math.min(rect.width - 160, e.clientX - rect.left - 70));
                  const dropY = Math.max(20, Math.min(rect.height - 120, e.clientY - rect.top - 40));
                  handleAddResourceToModel(item, { x: dropX, y: dropY });
                }
              } catch (err) {
                console.error('Drop error:', err);
              }
            }}
          >
            
            {/* Interactive Node DAG */}
            {viewMode === 'Node' && (
              <div className="relative w-full h-full flex-1 overflow-auto">
                {/* SVG Connections matching sketch topology */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 min-w-[550px] min-h-[260px]">
                  <defs>
                    <marker
                      id="arrow"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#1e293b" opacity="0.9" />
                    </marker>
                  </defs>

                  {/* Node 1 (Center-Left) -> Node 2 (Top-Middle) */}
                  <path
                    d="M 175 110 C 215 90, 235 60, 275 45"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="1.75"
                    markerEnd="url(#arrow)"
                  />

                  {/* Node 1 (Center-Left) -> Node 3 (Judgement node / Bottom-Middle) */}
                  <path
                    d="M 175 145 C 210 165, 230 180, 265 190"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="1.75"
                    markerEnd="url(#arrow)"
                  />

                  {/* Node 2 (Top-Middle) -> Outflow Arrow */}
                  <path
                    d="M 395 50 C 430 70, 460 95, 490 115"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="1.75"
                    markerEnd="url(#arrow)"
                  />

                  {/* Node 3 (Judgement node) -> Outflow Arrow */}
                  <path
                    d="M 430 190 C 465 170, 495 130, 525 90"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="1.75"
                    markerEnd="url(#arrow)"
                  />

                  {/* Additional dynamic connection paths for added nodes */}
                  {activeModel.nodes.length > 3 && activeModel.nodes.slice(3).map((n, i) => (
                    <path
                      key={n.id}
                      d={`M ${n.x + 60} ${n.y + 40} C ${n.x + 90} ${n.y + 70}, 380 140, 470 120`}
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="1.25"
                      strokeDasharray="4,4"
                      markerEnd="url(#arrow)"
                    />
                  ))}
                </svg>

                {/* Render Core / Model Nodes */}
                {activeModel.nodes.map((node, index) => {
                  const isSelected = selectedNodeId === node.id;
                  const isParent = node.type === 'parent';
                  const isData = node.type === 'data';
                  const isTool = node.type === 'tool';
                  
                  // Coordinate fallback
                  const posX = node.x ?? (index === 0 ? 30 : index === 1 ? 270 : index === 2 ? 255 : 420);
                  const posY = node.y ?? (index === 0 ? 50 : index === 1 ? 10 : index === 2 ? 150 : 25 + (index * 30));

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      style={{
                        left: `${posX}px`,
                        top: `${posY}px`,
                      }}
                      className={`absolute min-w-[135px] max-w-[165px] p-2.5 rounded-2xl border-2 transition-all cursor-pointer z-10 flex flex-col justify-between shadow-2xs ${
                        isSelected
                          ? isParent
                            ? 'bg-[#eae4ff] border-purple-500 ring-2 ring-purple-400/30'
                            : 'bg-white border-blue-500 ring-2 ring-blue-400/30'
                          : isParent
                          ? 'bg-[#eae4ff]/80 hover:bg-[#eae4ff] border-purple-200'
                          : isData
                          ? 'bg-[#f0fdf4] hover:bg-[#dcfce7] border-emerald-200'
                          : isTool
                          ? 'bg-[#f8fafc] hover:bg-slate-100 border-slate-300'
                          : 'bg-white hover:bg-slate-50 border-border'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[8.5px] font-mono uppercase tracking-wider font-bold ${
                            isParent 
                              ? 'text-purple-700' 
                              : isData 
                              ? 'text-emerald-700' 
                              : isTool
                              ? 'text-amber-700'
                              : 'text-blue-600'
                          }`}>
                            {node.type === 'parent' ? 'parent orchestrator' : node.type === 'data' ? 'feature store' : node.type}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleManualNodeRefresh(e, node.id)}
                            title="Anti-Hallucination Refresh countdown"
                            className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[8px] font-mono font-bold hover:bg-slate-200"
                          >
                            <RotateCw className={`w-2.5 h-2.5 ${refreshingNodeId === node.id ? 'animate-spin text-blue-600' : ''}`} />
                            <span>{nodeCountdowns[node.id] || 40}s</span>
                          </button>
                        </div>
                        <span className="text-[10.5px] font-bold text-slate-900 font-mono leading-tight block truncate">
                          {node.name}
                        </span>
                      </div>
                      <div className="text-[8px] font-mono text-muted-foreground border-t border-black/5 pt-1 flex items-center justify-between mt-1">
                        <span>{node.latency}</span>
                        <span className="text-emerald-600 font-semibold truncate max-w-[70px]">
                          {node.defaultProperty ? node.defaultProperty.split(' ')[0] : 'Synced'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* AI Suggestion with Complete Bullet Reasoning Box (Lower-Left of Canvas, matching sketch) */}
                <div className="absolute left-3 bottom-3 w-[210px] sm:w-[230px] p-2.5 rounded-2xl border border-emerald-300 bg-[#eef8f2] shadow-2xs z-20 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-emerald-950 font-mono text-[10px] font-bold border-b border-emerald-200/80 pb-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>AI suggestion with complete bullet reasoning</span>
                  </div>
                  <ul className="text-[9.5px] font-sans text-emerald-950 space-y-1 leading-snug">
                    <li className="flex items-start gap-1">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>Factor skew indicates vol compression into FOMC; calibrate delta overlays.</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>Maintain Barra beta neutrality (&lt;0.01) while scaling tech momentum.</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>Pre-trade collar hedge staged to prevent single-sector limit breaches.</span>
                    </li>
                  </ul>
                </div>

              </div>
            )}

            {/* Code View mode */}
            {viewMode === 'code' && (
              <div className="w-full flex-1 min-h-[260px] rounded-xl border border-border bg-slate-900 text-slate-100 font-mono text-xs p-3 overflow-y-auto space-y-1">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-slate-400 text-[11px]">
                  <span># {selectedNode.name} Implementation ({activeModel.name})</span>
                  <span className="text-emerald-400">Python 3.11 · Compiled</span>
                </div>
                <pre className="pt-2 text-[11px] leading-relaxed overflow-x-auto text-slate-200">
                  {selectedNode.codeSnippet}
                </pre>
              </div>
            )}

            {/* Matrix View mode */}
            {viewMode === 'matrix' && (
              <div className="w-full flex-1 min-h-[260px] rounded-xl border border-border bg-white p-3 overflow-y-auto font-mono text-xs space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <span className="font-bold text-foreground">Cross-Agent Factor Covariance Matrix</span>
                  <span className="text-[10px] text-muted-foreground">Barra Multi-Asset Model</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse text-[10px]">
                    <thead>
                      <tr className="border-b border-border bg-slate-50">
                        <th className="p-1.5 text-left">Agent Node</th>
                        <th className="p-1.5">Alpha Beta</th>
                        <th className="p-1.5">Momentum</th>
                        <th className="p-1.5">Vol Sensitivity</th>
                        <th className="p-1.5">Corr (NY4)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="p-1.5 text-left font-semibold text-foreground">Research Judgement</td>
                        <td className="p-1.5 text-blue-600 font-bold">1.00</td>
                        <td className="p-1.5">0.42</td>
                        <td className="p-1.5 text-emerald-700">0.12</td>
                        <td className="p-1.5">0.88</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 text-left font-semibold text-foreground">Market Trend Referral</td>
                        <td className="p-1.5">0.42</td>
                        <td className="p-1.5 text-blue-600 font-bold">1.00</td>
                        <td className="p-1.5">0.68</td>
                        <td className="p-1.5">0.94</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 text-left font-semibold text-foreground">Data &amp; Factor Store</td>
                        <td className="p-1.5 text-emerald-700">0.12</td>
                        <td className="p-1.5">0.68</td>
                        <td className="p-1.5 text-blue-600 font-bold">1.00</td>
                        <td className="p-1.5">0.99</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              BOTTOM EXTENDABLE & SCROLLABLE ENTERPRISE RESOURCES & FIRM IDEAS PANEL
              - Collapsed (compact 4-column quick tray) OR Expanded (rich scrollable library)
              - Categories: All, Skills & Subagents, Code & Templates, Input Nodes, Risk & Compliance, Firm Ideas, Research Papers
              - Drag-and-drop onto canvas OR 1-click instantiate
              - Search and filter across institutional library
             ========================================================================= */}
          <div 
            id="enterprise-resources-panel"
            className={`mt-2 border border-border rounded-2xl bg-white shadow-2xs transition-all duration-300 flex flex-col shrink-0 overflow-hidden ${
              isBottomPanelExpanded ? 'h-[290px]' : 'max-h-[175px]'
            }`}
            onDragOver={(e) => e.preventDefault()}
          >
            {/* Header bar with extend/collapse toggle, tabs & search */}
            <div className="p-2 border-b border-border bg-slate-50/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
              
              {/* Left: Title + Expand Button */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
                  <Library className="w-3.5 h-3.5 text-blue-600" />
                  <span>Enterprise Resources &amp; Ideas Library</span>
                  <Badge variant="outline" className="text-[9px] font-mono bg-white text-muted-foreground ml-1">
                    {filteredEnterpriseResources.length} items
                  </Badge>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsBottomPanelExpanded(!isBottomPanelExpanded)}
                  className="h-6 px-2 text-[10px] font-mono text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/80 rounded-md gap-1 ml-1"
                >
                  {isBottomPanelExpanded ? (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      <span>Compact Tray</span>
                    </>
                  ) : (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      <span>Extend Panel &amp; Search</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Right: Quick filter tabs & Search input */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {/* Category Pills */}
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'skills', label: 'Skills' },
                    { id: 'code', label: 'Code' },
                    { id: 'inputs', label: 'Inputs' },
                    { id: 'risk', label: 'Risk' },
                    { id: 'firm_ideas', label: '💡 Ideas' },
                    { id: 'research_papers', label: '📄 Papers' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setResourceCategory(cat.id as BottomDrawerTab);
                        if (!isBottomPanelExpanded) setIsBottomPanelExpanded(true);
                      }}
                      className={`px-2 py-0.5 rounded-md transition-all whitespace-nowrap ${
                        resourceCategory === cat.id
                          ? 'bg-blue-600 text-white font-bold shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-200/60 bg-white border border-border/80'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Search input in expanded mode */}
                {isBottomPanelExpanded && (
                  <div className="relative w-40 sm:w-48">
                    <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Filter resources..."
                      value={resourceSearchQuery}
                      onChange={(e) => setResourceSearchQuery(e.target.value)}
                      className="h-6 text-[10px] pl-6 py-0 font-mono bg-white border-border"
                    />
                    {resourceSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setResourceSearchQuery('')}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Notification Toast if an item was added */}
            {resourceNotification && (
              <div className="px-3 py-1 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-[10px] font-mono flex items-center justify-between shrink-0 animate-in fade-in">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                  {resourceNotification}
                </span>
                <span className="text-[9px] text-emerald-700">Drag to re-order on canvas</span>
              </div>
            )}

            {/* Content Area: Scrollable resource cards grid */}
            <div className="flex-1 min-h-0 p-2 overflow-y-auto overflow-x-hidden font-mono">
              {filteredEnterpriseResources.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground text-xs">
                  <HelpCircle className="w-5 h-5 mb-1 text-slate-400" />
                  <span>No institutional resources matching "{resourceSearchQuery}"</span>
                  <button
                    type="button"
                    onClick={() => {
                      setResourceSearchQuery('');
                      setResourceCategory('all');
                    }}
                    className="text-blue-600 underline text-[10px] mt-1"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {filteredEnterpriseResources.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => {
                        setDraggedResource(item);
                        e.dataTransfer.setData('text/plain', JSON.stringify(item));
                      }}
                      onDragEnd={() => setDraggedResource(null)}
                      className={`group relative p-2 rounded-xl border transition-all flex flex-col justify-between cursor-grab active:cursor-grabbing text-left shadow-2xs ${
                        item.category === 'firm_ideas' 
                          ? 'bg-[#f5f0ff] border-purple-300 hover:border-purple-500 hover:shadow-sm' 
                          : item.category === 'research_papers'
                          ? 'bg-[#f0f9ff] border-sky-300 hover:border-sky-500 hover:shadow-sm'
                          : 'bg-[#faece6] border-border hover:border-slate-400 hover:bg-[#faece6]/80'
                      }`}
                    >
                      {/* Top item badge & category */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                            item.category === 'firm_ideas'
                              ? 'bg-purple-200 text-purple-900'
                              : item.category === 'research_papers'
                              ? 'bg-sky-200 text-sky-900'
                              : 'bg-white/80 text-slate-800 border border-border/80'
                          }`}>
                            {item.badge}
                          </span>
                          <span className="text-[8px] text-muted-foreground flex items-center gap-0.5">
                            <GripHorizontal className="w-3 h-3 text-slate-400 group-hover:text-slate-700" />
                            <span>Drag</span>
                          </span>
                        </div>

                        {/* Name & Subtitle */}
                        <div>
                          <span className="text-[10px] font-bold text-slate-900 block leading-tight truncate" title={item.name}>
                            {item.name}
                          </span>
                          <span className="text-[9px] text-slate-600 block truncate">
                            {item.subtitle}
                          </span>
                        </div>

                        {/* Description (visible on extended panel) */}
                        {isBottomPanelExpanded && (
                          <p className="text-[8.5px] font-sans text-slate-700 line-clamp-2 leading-tight pt-0.5 border-t border-black/5">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Action buttons footer */}
                      <div className="pt-1.5 mt-1 border-t border-black/5 flex items-center justify-between gap-1">
                        <span className="text-[8px] text-slate-500">
                          {item.latency}
                        </span>

                        <div className="flex items-center gap-1">
                          {item.category === 'firm_ideas' ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCreateModelFromIdea(item);
                              }}
                              className="px-1.5 py-0.5 text-[8.5px] font-bold rounded bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-0.5 shadow-2xs"
                              title="Create entire model from this idea"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Make Model</span>
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddResourceToModel(item);
                            }}
                            className="px-1.5 py-0.5 text-[8.5px] font-bold rounded bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 flex items-center gap-0.5 shadow-2xs"
                            title="Add node to current model"
                          >
                            <Plus className="w-2.5 h-2.5 text-blue-600" />
                            <span>Add Node</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Drag Guidance Tip */}
            <div className="px-2.5 py-1 bg-slate-100/70 border-t border-border/80 text-[9px] font-mono text-slate-600 flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1">
                <Move className="w-2.5 h-2.5 text-slate-500" />
                <span>Tip: Drag any enterprise resource directly onto the DAG canvas to wire into active model</span>
              </span>
              <span className="text-slate-500 font-semibold">
                Active: {activeModel.name} ({activeModel.nodes.length} nodes)
              </span>
            </div>

          </div>

        </div>

        {/* =========================================================================
            RIGHT COLUMN: AGENT INSPECTOR & CUSTOM BUILDER (from uploaded sketch)
            - Top Tabs: [ Agent | Instructions | Code ]
            - Inputs: Name, Instructions, Default Property ▾
            - Agent Custom Builder header + [ agent audit ] button
            - Custom Builder Cards
            - Bottom bar: [ Prompt the selected agent/subagent ]
           ========================================================================= */}
        <div className="lg:col-span-4 p-3.5 flex flex-col justify-between bg-[#f3f3f3] min-h-0 overflow-hidden">
          <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
            
            {/* Top Tabs matching sketch: [ Agent | Instructions | Code ] */}
            <div className="flex items-center justify-between pb-2 border-b border-border/80 mb-2.5 shrink-0">
              <div className="flex items-center gap-1 font-mono text-xs overflow-x-auto py-0.5">
                <button
                  type="button"
                  onClick={() => setRightTab('agent')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    rightTab === 'agent'
                      ? 'bg-white text-foreground font-bold border border-border shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Agent
                </button>
                <button
                  type="button"
                  onClick={() => setRightTab('instructions')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    rightTab === 'instructions'
                      ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Instructions
                </button>
                <button
                  type="button"
                  onClick={() => setRightTab('code')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    rightTab === 'code'
                      ? 'bg-white text-foreground font-bold border border-border shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Code
                </button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRightTab('sandbox')}
                className={`h-7 px-2 text-xs font-mono rounded-lg gap-1 ${
                  rightTab === 'sandbox' ? 'bg-blue-600 text-white font-bold' : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <TestTube className="w-3 h-3" />
                <span>Sandbox</span>
              </Button>
            </div>

            {/* TAB CONTENT: SANDBOX */}
            {rightTab === 'sandbox' && (
              <div className="flex-1 min-h-0 overflow-y-auto">
                <AgentBacktestSandbox
                  selectedNodeName={selectedNode.name}
                  models={models}
                  activeModelId={activeModelId}
                  onSelectModel={(id) => setActiveModelId(id)}
                  onMergeModels={handleMergeModels}
                  initialMode={sandboxInitialMode}
                  onDeployModel={() => {
                    alert(`Model "${activeModel.name}" (${activeModel.version}) successfully deployed to production OMS.`);
                  }}
                />
              </div>
            )}

            {/* TAB CONTENT: CODE */}
            {rightTab === 'code' && (
              <div className="flex-1 min-h-0 overflow-y-auto font-mono text-xs space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <span className="text-muted-foreground">Source: {selectedNode.name}.py</span>
                  <Badge variant="outline" className="text-[10px] bg-white">Python 3.11</Badge>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 text-slate-100 text-[11px] leading-relaxed overflow-x-auto">
                  <pre>{selectedNode.codeSnippet}</pre>
                </div>
              </div>
            )}

            {/* TAB CONTENT: INSTRUCTIONS */}
            {rightTab === 'instructions' && (
              <div className="flex-1 min-h-0 overflow-y-auto font-mono text-xs space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground block font-bold">System Prompt &amp; Behavioral Guidelines:</label>
                  <textarea
                    value={agentInstructionsText}
                    onChange={(e) => setAgentInstructionsText(e.target.value)}
                    rows={8}
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-border bg-white text-foreground focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground block font-bold">Allocated Quantitative Tools:</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.tools.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-border text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: AGENT (Default view matching sketch) */}
            {rightTab === 'agent' && (
              <div className="flex flex-col flex-1 min-h-0 justify-between space-y-3 overflow-y-auto pr-0.5">
                
                {/* Upper Form Fields matching wireframe sketch */}
                <div className="space-y-2 shrink-0">
                  {/* Name field */}
                  <div>
                    <label className="text-xs font-mono font-medium text-slate-800 block mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={agentNameInput}
                      onChange={(e) => setAgentNameInput(e.target.value)}
                      className="w-full font-mono text-xs font-bold border border-border rounded-xl px-2.5 py-1.5 text-foreground bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>

                  {/* Instructions field */}
                  <div>
                    <label className="text-xs font-mono font-medium text-slate-800 block mb-1">
                      Instructions
                    </label>
                    <textarea
                      value={agentInstructionsText}
                      onChange={(e) => setAgentInstructionsText(e.target.value)}
                      rows={3}
                      className="w-full font-mono text-xs border border-border rounded-2xl p-2.5 text-foreground bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 resize-none shadow-2xs leading-relaxed"
                    />
                  </div>

                  {/* Default property dropdown */}
                  <div>
                    <select
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                      className="w-full font-mono text-xs border border-border rounded-xl px-2.5 py-1.5 text-foreground bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    >
                      <option value="Highest Sharpe Weighting">Default property: Highest Sharpe Weighting</option>
                      <option value="Factor Neutral Union">Default property: Factor Neutral Union</option>
                      <option value="Conservative 15c3-5 Check">Default property: Conservative 15c3-5 Check</option>
                      <option value="Strict Delta Capped">Default property: Strict Delta Capped</option>
                    </select>
                  </div>
                </div>

                {/* Section Header: [ Agent Custom Builder ] + [ agent audit ] button */}
                <div className="pt-2 border-t border-border/80 shrink-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-slate-900">
                      Agent Custom Builder
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAuditModalOpen(true)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-lg border border-border text-slate-800 bg-white hover:bg-slate-50 transition-all flex items-center gap-1 shadow-2xs font-semibold"
                    >
                      <span>agent audit</span>
                    </button>
                  </div>

                  {/* Custom Builder Cards (stacked cards on left + card below as in sketch) */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl border border-border bg-white shadow-2xs space-y-1">
                        <span className="text-[10px] font-bold font-mono text-slate-900 block">Signal Grounding</span>
                        <span className="text-[9px] font-mono text-emerald-700 font-semibold block">99.8% Grounded</span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-border bg-white shadow-2xs space-y-1">
                        <span className="text-[10px] font-bold font-mono text-slate-900 block">DAG Routing</span>
                        <span className="text-[9px] font-mono text-blue-700 font-semibold block">NY4 Colocated</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl border border-border bg-white shadow-2xs flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold font-mono text-slate-900 block">Anti-Hallucination Telemetry</span>
                        <span className="text-[9px] font-mono text-muted-foreground block">OPRA &amp; BVAL live feeds</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-800 border-emerald-300">
                        Active Sync
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Bottom Action / Input: Prompt the selected agent/subagent */}
                <div className="pt-2 shrink-0">
                  <Button
                    type="button"
                    onClick={() => setIsPromptModalOpen(true)}
                    className="w-full font-mono text-xs h-9 bg-white hover:bg-slate-50 text-slate-900 border border-border rounded-xl font-semibold shadow-2xs gap-1.5 justify-center"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    <span>Prompt the selected agent/subagent</span>
                  </Button>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* PROMPT TEST MODAL */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-lg border border-border bg-white shadow-2xl rounded-2xl animate-in zoom-in-95 p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs text-foreground">
                  Prompt Agent: {selectedNode.name} ({activeModel.name})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPromptModalOpen(false)}
                className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">
                Enter quantitative prompt or simulation command:
              </label>
              <textarea
                value={promptQuery}
                onChange={(e) => setPromptQuery(e.target.value)}
                rows={3}
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-border bg-white text-foreground focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {promptResponse && (
              <div className="p-3 rounded-xl bg-slate-50 border border-border text-[11px] leading-relaxed whitespace-pre-line text-foreground">
                {promptResponse}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsPromptModalOpen(false);
                  setRightTab('sandbox');
                  setSandboxInitialMode('single');
                }}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <TestTube className="w-3.5 h-3.5" />
                <span>Open in Backtest Sandbox</span>
              </button>

              <Button
                type="button"
                onClick={handleRunAgentPrompt}
                disabled={isPromptRunning}
                className="font-mono text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 gap-1.5"
              >
                <Send className={`w-3 h-3 ${isPromptRunning ? 'animate-spin' : ''}`} />
                <span>{isPromptRunning ? 'Executing...' : 'Send Prompt'}</span>
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* AGENT AUDIT MODAL */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-lg border border-border bg-white shadow-2xl rounded-2xl animate-in zoom-in-95 p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-foreground">
                  Agent Audit &amp; Safety Compliance Log
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-white border border-border flex items-center justify-between">
                <span className="text-muted-foreground">Target Model / Agent:</span>
                <span className="font-bold text-foreground">{activeModel.name} · {selectedNode.name}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-border flex items-center justify-between">
                <span className="text-muted-foreground">SEC Rule 15c3-5 DMA Gate:</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">
                  PASSED (0.04ms)
                </Badge>
              </div>
              <div className="p-2 rounded-lg bg-white border border-border flex items-center justify-between">
                <span className="text-muted-foreground">Execution Latency SLA (&lt;25ms):</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">
                  {selectedNode.latency} (COMPLIANT)
                </Badge>
              </div>
              <div className="p-2 rounded-lg bg-white border border-border flex items-center justify-between">
                <span className="text-muted-foreground">Pre-Trade VaR Impact Limit:</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">
                  {activeModel.varLimit || 1.14}% / 1.50% MAX
                </Badge>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                size="sm"
                onClick={() => setIsAuditModalOpen(false)}
                className="h-8 text-xs font-mono bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4"
              >
                Close Audit
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};
