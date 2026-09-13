import { AgentNode, NodeFailure, NodeHealth, WorkspaceModel } from '../types';
import { EscalationItem } from '../components/EscalationCard';

export interface AuditFailureEntry {
  id: string;
  timestamp: string;
  type: 'DEGRADATION' | 'QUARANTINE' | 'BREACH' | 'CONFLICT' | 'AUTO_DEFAULT_EXECUTED' | 'AUTONOMY_RESTORED' | 'REGROUNDED';
  nodeId: string;
  nodeName: string;
  modelName: string;
  trigger: string;
  groundingStatus: string;
  autonomyBefore: string;
  autonomyAfter: string;
  blastRadius: string[];
  escalatedTo: string;
  resolution: string;
  isFailure?: boolean;
}

export interface FeedTelemetryItem {
  id: string;
  name: string;
  identifier: string;
  provider: string;
  status: 'LIVE' | 'DELAYED' | 'DOWN';
  lastTick: string;
  latency: string;
  consumingNodes: { id: string; name: string; modelName: string; isAffected: boolean }[];
}

export interface FailurePolicyConfig {
  onStaleData: 'Step down autonomy' | 'Pause node' | 'Continue with warning';
  onLowConfidence: 'Step down' | 'Hold output' | 'Escalate';
  onAgentConflict: 'Escalate to human' | 'Defer to risk agent' | 'Pause both';
  onNoResponseTimeout: 'Execute safe default' | 'Hold and freeze' | 'Continue at reduced authority';
  confidenceThreshold: number; // e.g. 0.85
  escalationTimeoutMinutes: number; // e.g. 15
}

export const INITIAL_FAILURE_POLICY: FailurePolicyConfig = {
  onStaleData: 'Step down autonomy',
  onLowConfidence: 'Hold output',
  onAgentConflict: 'Escalate to human',
  onNoResponseTimeout: 'Execute safe default',
  confidenceThreshold: 0.88,
  escalationTimeoutMinutes: 15,
};

// 1. Seeded DEGRADED Node: CBOE Vol-Surface Feed
export const SEEDED_DEGRADED_NODE: AgentNode = {
  id: 'node-cboe-vol',
  name: 'CBOE Vol-Surface Feed',
  type: 'data',
  role: 'Implied Volatility Matrix Stream',
  status: 'ACTIVE',
  health: 'DEGRADED',
  confidence: 0.74,
  lastGroundedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  permissionLevel: 'Act with approval',
  description: 'Implied volatility surface and delta/vega sensitivity matrix stream for S&P 500 and Nasdaq-100 option series.',
  failure: {
    kind: 'STALE_FEED',
    detectedAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    source: 'CBOE Direct Optical Vol-Surface BBO Feed (15-min delayed snapshot)',
    detail: 'Vol surface feed aged 14m against 5m SLA threshold. Autonomy stepped down from Autonomous to Act with approval.',
    autonomyBefore: 'Autonomous',
    autonomyAfter: 'Act with approval',
    blastRadius: ['node-2', 'node-4'],
    observed: 'Latest volatility surface snapshot received at 09:04:12 EST (14m old vs 5m refresh SLA). Delta and Vega sensitivities cannot be verified.',
    whyItMatters: 'DE Shaw Oculus volatility-bounded mandate requires sub-5m delta overlays before US equity market open.',
    alreadyDone: 'Stepped down node autonomy from Autonomous to Act with approval. Flagged 2 downstream nodes as unverified.',
    recommendation: 'Re-ground against secondary OPRA consolidated options feed and refresh volatility surface.',
    defaultAction: 'In 08:30, fall back to EOD implied volatility surface and scale down high-gamma positions by 25%.',
    defaultActionCountdownSeconds: 510,
  },
  inputs: 'CBOE S&P 500 & Nasdaq 100 Volatility Surface Options Matrix',
  outputLink: 'Market trend refereall & Terminal Execution Gate',
  instructions: 'Stream realtime implied volatility skew and delta-vega surfaces. If data snapshot ages > 5m, step down autonomy.',
  defaultProperty: 'SLA: < 5m fresh',
  codeSnippet: `# CBOE VOL-SURFACE DATA FEED
class CboeVolSurfaceNode(DataStreamNode):
    def poll_vol_surface(self):
        snapshot = self.cboe_client.get_latest_skew()
        if snapshot.age_seconds > 300:
            self.trigger_health_degraded("STALE_FEED: age > 300s")
            self.step_down_autonomy("Act with approval")
            return self.fallback_eod_surface()
        return snapshot`,
  tools: ['CBOE Optical Direct', 'OPRA Tick Normalizer', 'Black-Scholes Surface Engine'],
  latency: '14.2m (SLA breached)',
  x: 270,
  y: 255,
};

// 2. Seeded QUARANTINED Node: Earnings Transcript Sentiment Parser
export const SEEDED_QUARANTINED_NODE: AgentNode = {
  id: 'node-sentiment-parser',
  name: 'Earnings Transcript NLP Parser',
  type: 'subagent',
  role: 'Sub-Agent: Alternative NLP Extractor',
  status: 'ACTIVE',
  health: 'QUARANTINED',
  confidence: 0.62,
  lastGroundedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
  permissionLevel: 'Observe',
  description: 'Extracts qualitative management guidance and capex signals from earnings call transcripts and cross-verifies against SEC EDGAR 10-Q disclosures.',
  failure: {
    kind: 'GROUNDING_FAILED',
    detectedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    source: 'SEC EDGAR 10-Q & Refinitiv Call Transcripts (NVDA Q2)',
    detail: 'Extracted capex growth claim (+42%) could not be grounded in SEC 10-Q filing table. Output quarantined and held from propagation.',
    autonomyBefore: 'Act within limits',
    autonomyAfter: 'Observe',
    blastRadius: ['node-2'],
    observed: 'NLP subagent claimed NVDA datacenter capex accelerating +42% YoY, but exact citation was missing from official SEC 10-Q item 2.',
    whyItMatters: 'Anti-hallucination compliance prevents ungrounded alternative NLP vectors from triggering automated allocation shifts.',
    alreadyDone: 'Held sentiment output vector in quarantine buffer. Prevented alpha propagation to Execution Gate.',
    recommendation: 'Perform human audit of Q2 earnings transcript Section 3 vs EDGAR filing or reject claim.',
    defaultAction: 'In 18:00, discard ungrounded NLP sentiment factor and recalculate momentum without transcript weighting.',
    defaultActionCountdownSeconds: 1080,
  },
  inputs: 'SEC EDGAR Filings, Refinitiv Transcript Audio Streams & Bloomberg News Sentiment',
  outputLink: 'Market trend refereall (Held in Quarantine Buffer)',
  instructions: 'Extract structured qualitative guidance and verify every numerical claim against official regulatory filings.',
  defaultProperty: 'Grounding Verification: STRICT',
  codeSnippet: `# EARNINGS TRANSCRIPT GROUNDING PARSER
class TranscriptParserAgent(NLPFeatureAgent):
    def extract_and_ground_claims(self, transcript_text: str, edgar_filing: EdgarDocument):
        claims = self.llm_extractor.parse_guidance(transcript_text)
        for claim in claims:
            grounded = self.verify_against_document(claim, edgar_filing)
            if not grounded:
                self.quarantine_output(claim, reason="GROUNDING_FAILED")
                raise GroundingException("Cannot match claim to 10-Q source")`,
  tools: ['EDGAR 10-Q Matcher', 'Refinitiv Transcript Stream', 'FactSet Guidance DB'],
  latency: '140ms',
  x: 290,
  y: 45,
};

// 3. Seeded BREACHED Node: Single-Name Risk Overlay Node
export const SEEDED_BREACHED_NODE: AgentNode = {
  id: 'node-risk-overlay',
  name: 'Execution & Risk Overlay Gate',
  type: 'tool',
  role: 'Terminal Pre-Trade Compliance & Gate',
  status: 'ACTIVE',
  health: 'BREACHED',
  confidence: 0.96,
  lastGroundedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  permissionLevel: 'Observe',
  description: 'Deterministic pre-trade compliance filter enforcing SEC Rule 15c3-5 and prospectus single-asset exposure limits.',
  failure: {
    kind: 'LIMIT_BREACH',
    detectedAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    source: 'Oculus Pre-Trade Mandate Risk Engine (Equinix NY4)',
    detail: 'Single-name concentration for NVDA breached hard mandate cap: 10.6% vs 10.0% limit. Trading authority revoked, position frozen.',
    autonomyBefore: 'Autonomous',
    autonomyAfter: 'Observe',
    blastRadius: ['node-blotter-gate'],
    observed: 'NVDA portfolio weighting reached 10.6% of Fund NAV ($1,060M vs $1,000M cap) following rapid intraday price surge (+4.8%).',
    whyItMatters: 'Mandate Limit: Oculus prospectus strict limit restricts any single equity holding to <= 10.00% of Net Asset Value.',
    alreadyDone: 'Revoked automated order generation authority for NVDA. Frozen position against further buys.',
    recommendation: 'Execute staged TWAP sell order of -50,000 shares ($60M) over 45 minutes to restore 9.8% weight.',
    defaultAction: 'In 12:00, execute automatic safe default: route TWAP sell to reduce NVDA to exactly 10.0% mandate cap.',
    defaultActionCountdownSeconds: 720,
  },
  inputs: 'Portfolio Holdings, Barra Multi-Asset Factor Covariance & SEC 15c3-5 Rules',
  outputLink: 'Institutional OMS / Trade Blotter (Port 9800 - FROZEN)',
  instructions: 'Strictly enforce SEC 15c3-5 market access and DE Shaw fund single-name limits. Revoke authority on breach.',
  defaultProperty: 'Hard Cap: 10.00% Single Name',
  codeSnippet: `# SEC 15c3-5 AND MANDATE BREACH GATE
class RiskOverlayGate(TerminalGate):
    def validate_pre_trade(self, proposed_allocation: Dict[str, float]):
        for ticker, weight in proposed_allocation.items():
            if weight > 0.10: # 10.0% Hard Cap
                self.trip_limit_breach(ticker, weight, limit=0.10)
                self.revoke_trading_authority()
                self.freeze_position(ticker)
                raise LimitBreachException(f"Mandate cap breached on {ticker}: {weight:.2%}")`,
  tools: ['Pre-Trade 15c3-5 Gate', 'FIX 4.4 DMA Engine', 'Real-Time VaR Monitor'],
  latency: '0.06ms',
  x: 480,
  y: 155,
};

// 4. Seeded AGENT CONFLICT Pair: Momentum vs Beta Neutraliser
export const SEEDED_MOMENTUM_AGENT: AgentNode = {
  id: 'node-momentum-agent',
  name: 'Momentum Trend Sub-Agent',
  type: 'subagent',
  role: 'Sub-Agent: High-Frequency Momentum',
  status: 'ACTIVE',
  health: 'DEGRADED',
  confidence: 0.91,
  lastGroundedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  permissionLevel: 'Propose',
  description: 'Extracts short-term intraday momentum trends from order book microstructures and volume-weighted price movements.',
  failure: {
    kind: 'AGENT_CONFLICT',
    detectedAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    source: 'Cross-Agent Arbitration Engine',
    detail: 'Conflict with Beta-Neutralizer: Momentum recommends +25,000 NVDA buy, whereas Beta Neutralizer recommends -30,000 cut.',
    autonomyBefore: 'Act within limits',
    autonomyAfter: 'Propose',
    blastRadius: ['node-risk-overlay'],
    conflictDetails: {
      position: 'NVDA (NVIDIA Corp)',
      agentA: {
        name: 'Momentum Trend Sub-Agent',
        action: 'BUY +25,000 shares ($3.1M)',
        confidence: 0.91,
        evidence: 'Order book queue imbalance +0.34 and 5-min VWAP cross indicates continuation of intraday momentum breakout.'
      },
      agentB: {
        name: 'Beta-Neutral Risk Sub-Agent',
        action: 'SELL -30,000 shares ($3.7M)',
        confidence: 0.89,
        evidence: 'Portfolio beta to S&P 500 rose to 1.18 vs target 1.00; tech sector concentration requires immediate beta trim.'
      }
    }
  },
  inputs: 'NASDAQ ITCH 5.0 Depth & Volume Imbalances',
  outputLink: 'Arbitration Gate & Risk Overlay',
  instructions: 'Exploit short-term intraday momentum trends while submitting proposals to Cross-Agent Arbitration Gate.',
  defaultProperty: 'Momentum Horizon: 15m',
  codeSnippet: `# MOMENTUM SUB-AGENT
class MomentumTrendAgent(SubAgent):
    def generate_order(self, depth: OrderBook):
        if depth.imbalance > 0.30:
            return OrderProposal(action="BUY", qty=25000, ticker="NVDA")`,
  tools: ['ITCH 5.0 Feed', 'VWAP Cross Detector'],
  latency: '1.2ms',
  x: 290,
  y: 350,
};

export const SEEDED_BETA_NEUTRAL_AGENT: AgentNode = {
  id: 'node-beta-neutral-agent',
  name: 'Beta-Neutral Risk Sub-Agent',
  type: 'subagent',
  role: 'Sub-Agent: Barra Beta Neutralizer',
  status: 'ACTIVE',
  health: 'DEGRADED',
  confidence: 0.89,
  lastGroundedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  permissionLevel: 'Propose',
  description: 'Enforces cross-sectional beta neutrality across Barra equity risk factors by hedging high-beta single stock exposures.',
  failure: {
    kind: 'AGENT_CONFLICT',
    detectedAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    source: 'Cross-Agent Arbitration Engine',
    detail: 'Conflict with Momentum Sub-Agent: Contradictory recommendation on NVDA position held pending human PM decision.',
    autonomyBefore: 'Act within limits',
    autonomyAfter: 'Propose',
    blastRadius: ['node-risk-overlay'],
    conflictDetails: {
      position: 'NVDA (NVIDIA Corp)',
      agentA: {
        name: 'Momentum Trend Sub-Agent',
        action: 'BUY +25,000 shares ($3.1M)',
        confidence: 0.91,
        evidence: 'Order book queue imbalance +0.34 indicates breakout continuation.'
      },
      agentB: {
        name: 'Beta-Neutral Risk Sub-Agent',
        action: 'SELL -30,000 shares ($3.7M)',
        confidence: 0.89,
        evidence: 'Portfolio beta at 1.18 breaches neutral target 1.00; trim NVDA to hedge market risk.'
      }
    }
  },
  inputs: 'Barra Factor Sensitivities & Index Futures Delta',
  outputLink: 'Arbitration Gate & Risk Overlay',
  instructions: 'Maintain strictly beta-neutral portfolio exposures across all major macroeconomic regimes.',
  defaultProperty: 'Beta Target: 1.00 +/- 0.02',
  codeSnippet: `# BETA NEUTRAL RISK AGENT
class BetaNeutralRiskAgent(SubAgent):
    def hedge_portfolio(self, current_beta: float):
        if current_beta > 1.05:
            return OrderProposal(action="SELL", qty=30000, ticker="NVDA")`,
  tools: ['Barra Multi-Asset Engine', 'Delta Hedger'],
  latency: '2.4ms',
  x: 480,
  y: 350,
};

// Seeded Open Escalation Items (Awaiting Decision in Overview & Workspace)
export const INITIAL_ESCALATIONS: EscalationItem[] = [
  {
    id: 'esc-breach-nvda',
    nodeId: 'node-risk-overlay',
    nodeName: 'Execution & Risk Overlay Gate',
    modelName: 'Production Core',
    severity: 'BREACH',
    failureKind: 'LIMIT_BREACH',
    age: '7m ago',
    title: 'Single-Name Concentration Limit Breach (NVDA 10.6% vs 10.0%)',
    observed: {
      source: 'Oculus Pre-Trade Risk Engine (NY4)',
      timestamp: '09:11:45 EST',
      fact: 'NVDA portfolio weight reached 10.6% ($1,060M / $10,000M AUM) following a +4.8% price surge, exceeding the 10.0% hard prospectus cap.'
    },
    whyItMatters: {
      limitOrMandate: 'DE Shaw Oculus Investment Mandate §4.2',
      implication: 'Single equity concentration cap (10.00% NAV) strictly enforced. Autonomous trading authority revoked.'
    },
    alreadyDone: {
      action: 'Revoked automated order generation for NVDA. Frozen position against further buys. Staged TWAP trim.',
      authorityLevel: 'Observe (Revoked from Autonomous)',
      timestamp: '09:11:46 EST'
    },
    recommendation: {
      proposedAction: 'Execute staged TWAP sell order of 50,000 shares ($60M) over 45 mins to restore 9.8% weight.',
      confidence: 0.96,
      rationale: 'Restores compliance with minimal market impact (0.4 bps estimated slippage) while retaining core fundamental thesis.'
    },
    defaultAction: {
      namedAction: 'Reduce NVDA to exactly 10.0% mandate cap via market TWAP and log automatic safe default',
      timeoutSeconds: 720,
      countdown: 720,
      ruleDescription: 'DE Shaw Failure Policy: Unanswered limit breaches execute automatic safe default after 15 minutes.'
    },
    status: 'PENDING_HUMAN'
  },
  {
    id: 'esc-conflict-nvda',
    nodeId: 'node-momentum-agent',
    nodeName: 'Momentum vs Beta-Neutral Subagents',
    modelName: 'Delta-Neutral Alpha',
    severity: 'CONFLICT',
    failureKind: 'AGENT_CONFLICT',
    age: '11m ago',
    title: 'Contradictory Sub-Agent Proposals on NVDA ($1.06B Position)',
    observed: {
      source: 'Cross-Agent Arbitration Engine',
      timestamp: '09:07:30 EST',
      fact: 'Momentum Sub-Agent and Beta-Neutralizer produced contradictory execution proposals (+25k vs -30k shares).'
    },
    whyItMatters: {
      limitOrMandate: 'Quantitative Consistency Mandate',
      implication: 'Autonomous execution held to prevent churn and unwanted portfolio leverage.'
    },
    alreadyDone: {
      action: 'Held both orders in arbitration buffer. Stepped down both agents to "Propose" only.',
      authorityLevel: 'Propose (Held)',
      timestamp: '09:07:32 EST'
    },
    recommendation: {
      proposedAction: 'Arbitrate: Prioritize Beta-Neutralizer (-30,000 shares) to defend fund Sharpe and market neutrality.',
      confidence: 0.89,
      rationale: 'Portfolio beta (1.18) exceeds upper bound (1.05); macro risk defense takes precedence over 15-minute momentum.'
    },
    defaultAction: {
      namedAction: 'Freeze both proposals and hold existing position delta flat',
      timeoutSeconds: 480,
      countdown: 480,
      ruleDescription: 'DE Shaw Failure Policy: Unresolved agent conflicts remain paused without executing either proposal.'
    },
    conflictData: {
      position: 'NVDA ($1,060M / 10.6% NAV)',
      currentValue: '$1,060,000,000',
      agentA: {
        name: 'Momentum Sub-Agent',
        role: 'Trend Extractor',
        recommendation: 'BUY +25,000 shares ($3.1M)',
        confidence: 0.91,
        evidence: 'Level 2 orderbook queue imbalance +0.34 and 5-min VWAP cross indicates ongoing institutional demand sweep.',
        source: 'NASDAQ ITCH 5.0 DMA'
      },
      agentB: {
        name: 'Beta-Neutral Sub-Agent',
        role: 'Barra Neutralizer',
        recommendation: 'SELL -30,000 shares ($3.7M)',
        confidence: 0.89,
        evidence: 'Portfolio beta rose to 1.18 vs 1.00 target; tech sector concentration must be trimmed to satisfy risk model.',
        source: 'Barra Multiple-Horizon Model'
      }
    },
    status: 'PENDING_HUMAN'
  },
  {
    id: 'esc-quarantine-sentiment',
    nodeId: 'node-sentiment-parser',
    nodeName: 'Earnings Transcript NLP Parser',
    modelName: 'Production Core',
    severity: 'QUARANTINED',
    failureKind: 'GROUNDING_FAILED',
    age: '30m ago',
    title: 'Ungrounded NLP Claim Quarantined (NVDA Capex +42%)',
    observed: {
      source: 'SEC EDGAR 10-Q & Transcript Parser',
      timestamp: '08:48:10 EST',
      fact: 'NLP parser claimed NVDA capex +42% YoY, but exact table was absent from official SEC EDGAR 10-Q Item 2.'
    },
    whyItMatters: {
      limitOrMandate: 'Anti-Hallucination Grounding Mandate',
      implication: 'Unverified qualitative vectors cannot be routed into the quantitative feature matrix.'
    },
    alreadyDone: {
      action: 'Quarantined sentiment alpha output. Stepped down node to "Observe". Output held from downstream nodes.',
      authorityLevel: 'Observe (Quarantined)',
      timestamp: '08:48:12 EST'
    },
    recommendation: {
      proposedAction: 'Audit filing Section 3 or discard claim to clear quarantine buffer.',
      confidence: 0.62,
      rationale: 'Secondary Reuters consensus reports +28% capex; +42% was an unverified sell-side quote from Q&A.'
    },
    defaultAction: {
      namedAction: 'Discard ungrounded sentiment factor and recalculate momentum without transcript weighting',
      timeoutSeconds: 1080,
      countdown: 1080,
      ruleDescription: 'DE Shaw Failure Policy: Quarantined claims with failed grounding auto-expire after 30 minutes.'
    },
    status: 'PENDING_HUMAN'
  }
];

// Seeded Audit Log Failure Entries
export const INITIAL_AUDIT_FAILURE_ENTRIES: AuditFailureEntry[] = [
  {
    id: 'audit-fail-1',
    timestamp: '09:11:45 EST',
    type: 'BREACH',
    nodeId: 'node-risk-overlay',
    nodeName: 'Execution & Risk Overlay Gate',
    modelName: 'Production Core',
    trigger: 'Single-name concentration (10.6%) exceeded 10.0% mandate cap',
    groundingStatus: 'VERIFIED (Oculus Risk Engine)',
    autonomyBefore: 'Autonomous',
    autonomyAfter: 'Observe (Authority Revoked)',
    blastRadius: ['node-blotter-gate'],
    escalatedTo: 'Alexander Vance (PM) & Dr. Elena Rostova',
    resolution: 'Awaiting human decision (T-12:00 to safe default TWAP trim)',
    isFailure: true
  },
  {
    id: 'audit-fail-2',
    timestamp: '09:07:30 EST',
    type: 'CONFLICT',
    nodeId: 'node-momentum-agent',
    nodeName: 'Momentum vs Beta-Neutral Subagents',
    modelName: 'Delta-Neutral Alpha',
    trigger: 'Contradictory proposals on NVDA (+25k buy vs -30k sell)',
    groundingStatus: 'PARTIALLY_GROUNDED (Dual Feeds)',
    autonomyBefore: 'Act within limits',
    autonomyAfter: 'Propose (Arbitration Held)',
    blastRadius: ['node-risk-overlay'],
    escalatedTo: 'Desk PM & Quantitative Risk Team',
    resolution: 'Arbitration card dispatched to Overview Inbox',
    isFailure: true
  },
  {
    id: 'audit-fail-3',
    timestamp: '09:04:12 EST',
    type: 'DEGRADATION',
    nodeId: 'node-cboe-vol',
    nodeName: 'CBOE Vol-Surface Feed',
    modelName: 'Production Core',
    trigger: 'Data snapshot aged 14m against 5m SLA threshold (STALE_FEED)',
    groundingStatus: 'STALE (CBOE Direct BBO Feed)',
    autonomyBefore: 'Autonomous',
    autonomyAfter: 'Act with approval',
    blastRadius: ['node-2', 'node-4'],
    escalatedTo: 'Automated Telemetry & On-Call Desk',
    resolution: 'Autonomy stepped down; 2 downstream nodes marked unverified',
    isFailure: true
  },
  {
    id: 'audit-fail-4',
    timestamp: '08:48:10 EST',
    type: 'QUARANTINE',
    nodeId: 'node-sentiment-parser',
    nodeName: 'Earnings Transcript NLP Parser',
    modelName: 'Production Core',
    trigger: 'Grounding failure on NVDA +42% capex claim vs SEC 10-Q filing',
    groundingStatus: 'FAILED (EDGAR Match Miss)',
    autonomyBefore: 'Act within limits',
    autonomyAfter: 'Observe (Output Quarantined)',
    blastRadius: ['node-2'],
    escalatedTo: 'Compliance & NLP Research Group',
    resolution: 'Output held in quarantine buffer; awaiting human verification',
    isFailure: true
  },
  {
    id: 'audit-fail-5',
    timestamp: '08:15:22 EST',
    type: 'AUTO_DEFAULT_EXECUTED',
    nodeId: 'node-fx-hedge',
    nodeName: 'EUR/USD FX Collar Overlay',
    modelName: 'Global Macro Overlay',
    trigger: 'Unanswered FX hedge escalation timeout (15m elapsed)',
    groundingStatus: 'VERIFIED (BVAL Tick Store)',
    autonomyBefore: 'Act with approval',
    autonomyAfter: 'Act within limits',
    blastRadius: [],
    escalatedTo: 'System Auto-Default Policy',
    resolution: 'Executed automated safe default collar hedge (-€45M at 1.0842)',
    isFailure: false
  },
  {
    id: 'audit-fail-6',
    timestamp: '07:50:00 EST',
    type: 'AUTONOMY_RESTORED',
    nodeId: 'node-rates-curve',
    nodeName: 'SOFR Yield Curve Extractor',
    modelName: 'Production Core',
    trigger: 'Successful re-grounding against Fedwire NY TIC feeds',
    groundingStatus: 'FRESH (< 100ms)',
    autonomyBefore: 'Act with approval',
    autonomyAfter: 'Autonomous',
    blastRadius: [],
    escalatedTo: 'Alexander Vance (PM)',
    resolution: 'Re-grounded successfully. Autonomous trading authority restored.',
    isFailure: false
  }
];

// Telemetry Data Feeds (Used in DataRepositoryView)
export const INITIAL_TELEMETRY_FEEDS: FeedTelemetryItem[] = [
  {
    id: 'feed-1',
    name: 'CBOE Implied Volatility Surface Options Matrix',
    identifier: 'cboe_vol_surface_direct',
    provider: 'CBOE Direct Optical Link (Equinix NY4)',
    status: 'DELAYED',
    lastTick: '14 minutes ago (SLA: 5m)',
    latency: '14.2m',
    consumingNodes: [
      { id: 'node-cboe-vol', name: 'CBOE Vol-Surface Feed', modelName: 'Production Core', isAffected: true },
      { id: 'node-2', name: 'Market trend refereall', modelName: 'Production Core', isAffected: true },
      { id: 'node-4', name: 'Execution Sub-Agent', modelName: 'Production Core', isAffected: true },
    ]
  },
  {
    id: 'feed-2',
    name: 'NASDAQ TotalView ITCH 5.0 L2 Depth',
    identifier: 'nasdaq_totalview_itch5',
    provider: 'Direct Exchange Cross-Connect',
    status: 'LIVE',
    lastTick: '0.04 ms ago',
    latency: '0.04 ms',
    consumingNodes: [
      { id: 'node-momentum-agent', name: 'Momentum Trend Sub-Agent', modelName: 'Delta-Neutral Alpha', isAffected: false },
      { id: 'node-3', name: 'Data & Factor Matrix', modelName: 'Production Core', isAffected: false }
    ]
  },
  {
    id: 'feed-3',
    name: 'Barra Multiple-Horizon Factor Covariance Engine',
    identifier: 'msci_barra_use4_cov',
    provider: 'MSCI Barra Colocated Server',
    status: 'LIVE',
    lastTick: '1.2 seconds ago',
    latency: '1.2s',
    consumingNodes: [
      { id: 'node-1', name: 'Research Judgement agent', modelName: 'Production Core', isAffected: false },
      { id: 'node-beta-neutral-agent', name: 'Beta-Neutral Risk Sub-Agent', modelName: 'Delta-Neutral Alpha', isAffected: false }
    ]
  },
  {
    id: 'feed-4',
    name: 'SEC EDGAR 10-Q & Refinitiv Audio Transcripts',
    identifier: 'edgar_nlp_filings_live',
    provider: 'SEC EDGAR Live RSS + Refinitiv NLP API',
    status: 'LIVE',
    lastTick: '2.5 seconds ago',
    latency: '2.5s',
    consumingNodes: [
      { id: 'node-sentiment-parser', name: 'Earnings Transcript NLP Parser', modelName: 'Production Core', isAffected: true }
    ]
  },
  {
    id: 'feed-5',
    name: 'CME Globex Micro E-mini S&P Futures DMA',
    identifier: 'cme_globex_order_router',
    provider: 'CME Aurora Direct 10G Optical',
    status: 'LIVE',
    lastTick: '0.08 ms ago',
    latency: '0.08 ms',
    consumingNodes: [
      { id: 'node-risk-overlay', name: 'Execution & Risk Overlay Gate', modelName: 'Production Core', isAffected: true }
    ]
  }
];
