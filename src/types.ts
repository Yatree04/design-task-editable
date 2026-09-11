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
