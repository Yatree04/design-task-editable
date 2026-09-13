export type AssetClass = 
  | 'Equities' 
  | 'Fixed Income' 
  | 'Quantitative Derivatives' 
  | 'Commodities' 
  | 'FX & Currencies' 
  | 'Cash & Short-Term';

export interface Holding {
  id: string;
  ticker: string;
  name: string;
  assetClass: AssetClass;
  sector: string;
  side: 'Long' | 'Short';
  shares: number;
  price: number;
  marketValue: number;
  weightPct: number;
  unrealizedPnL: number;
  unrealizedPnLPct: number;
  beta: number;
  varContribution: number;
}

export interface MonthlyReturn {
  year: number;
  month: string;
  fundReturn: number;
  benchmarkReturn: number;
}

export interface FactorExposure {
  factor: string;
  exposure: number; // e.g. -1.0 to +1.0
  contribution: number;
}

export interface ScenarioResult {
  scenarioId: string;
  name: string;
  description: string;
  pnlImpactM: number;
  navImpactPct: number;
  varChangePct: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  sectorBreakdown: { sector: string; impactPct: number }[];
}

export interface Fund {
  id: string;
  name: string;
  strategy: string;
  inceptionYear: number;
  aumMillions: number;
  nav: number;
  ytdReturnPct: number;
  oneYearReturnPct: number;
  threeYearAnnualizedPct: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdownPct: number;
  var95Pct: number;
  betaToSP500: number;
  volatilityPct: number;
  grossExposurePct: number;
  netExposurePct: number;
  longShortRatio: number;
  assetAllocations: { asset: AssetClass; pct: number }[];
  factorExposures: FactorExposure[];
  historicalPerformance: {
    date: string;
    fundNav: number;
    fundReturnPct: number;
    benchmarkReturnPct: number;
  }[];
  monthlyReturns: MonthlyReturn[];
  holdings: Holding[];
  scenarios: ScenarioResult[];
}

export interface TradeOrder {
  id: string;
  timestamp: string;
  fundId: string;
  ticker: string;
  name: string;
  side: 'BUY' | 'SELL';
  shares: number;
  targetPrice: number;
  status: 'EXECUTED' | 'PENDING' | 'SIMULATED';
  rationale: string;
}

export type ViewTab = 
  | 'overview' 
  | 'repository' 
  | 'agent-builder' 
  | 'progress-gate' 
  | 'audit-log' 
  | 'reporting' 
  | 'holdings' 
  | 'scenarios' 
  | 'optimizer' 
  | 'blotter';

export type NodeHealth = 'HEALTHY' | 'DEGRADED' | 'QUARANTINED' | 'BREACHED';

export type FailureKind =
  | 'STALE_FEED'          // data snapshot aged past its refresh cycle
  | 'GROUNDING_FAILED'    // a claim could not be verified against source
  | 'LOW_CONFIDENCE'      // model confidence below the node's threshold
  | 'LATENCY_BREACH'      // tool or feed exceeded its latency budget
  | 'TOOL_ERROR'          // an upstream API or code node threw
  | 'LIMIT_BREACH'        // VaR / concentration / drawdown limit crossed
  | 'AGENT_CONFLICT';     // two subagents produced contradictory outputs

export interface NodeFailure {
  kind: FailureKind;
  detectedAt: string;          // ISO timestamp
  source: string;              // e.g. 'Equinix NY4 Tick L2 Stream'
  detail: string;              // one human-readable sentence
  autonomyBefore: string;      // e.g. 'Autonomous'
  autonomyAfter: string;       // e.g. 'Act with approval'
  blastRadius: string[];       // ids of downstream nodes now on unverified input
  observed?: string;
  whyItMatters?: string;
  alreadyDone?: string;
  recommendation?: string;
  defaultAction?: string;
  defaultActionCountdownSeconds?: number;
  conflictDetails?: {
    agentA: { name: string; action: string; confidence: number; evidence: string };
    agentB: { name: string; action: string; confidence: number; evidence: string };
    position: string;
  };
}

export type PermissionLevel = 'Observe' | 'Propose' | 'Act with approval' | 'Act within limits' | 'Autonomous';

export interface AgentNode {
  id: string;
  name: string;
  type: 'parent' | 'subagent' | 'data' | 'tool';
  role: string;
  status: 'ACTIVE' | 'READY' | 'DEPLOYED' | 'TESTING';
  health: NodeHealth;
  confidence: number;              // 0–1
  lastGroundedAt: string;          // ISO timestamp
  permissionLevel: PermissionLevel;
  failure?: NodeFailure;
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

export interface WorkspaceModel {
  id: string;
  name: string;
  tag: string;
  version: string;
  description: string;
  nodes: AgentNode[];
  targetVol: number;
  maxPosition: number;
  varLimit: number;
  expectedSharpe: number;
  expectedReturn: number;
  color: string;
  originStrategy?: string;
  ideaBenefits?: string[];
}
