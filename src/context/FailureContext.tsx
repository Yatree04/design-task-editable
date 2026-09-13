import React, { createContext, useContext, useState, useEffect } from 'react';
import { AgentNode, WorkspaceModel, NodeHealth, PermissionLevel } from '../types';
import { EscalationItem } from '../components/EscalationCard';
import { 
  AuditFailureEntry, 
  INITIAL_AUDIT_FAILURE_ENTRIES, 
  FeedTelemetryItem, 
  INITIAL_TELEMETRY_FEEDS, 
  FailurePolicyConfig, 
  INITIAL_FAILURE_POLICY,
  INITIAL_ESCALATIONS,
  SEEDED_DEGRADED_NODE,
  SEEDED_QUARANTINED_NODE,
  SEEDED_BREACHED_NODE,
  SEEDED_MOMENTUM_AGENT,
  SEEDED_BETA_NEUTRAL_AGENT
} from '../data/failureState';

// Default Healthy Nodes with all new required fields
export const DEFAULT_WORKSPACE_NODES: AgentNode[] = [
  {
    id: 'node-1',
    name: 'Research Judgement agent',
    type: 'parent',
    role: 'Parent Orchestrator',
    status: 'ACTIVE',
    health: 'HEALTHY',
    confidence: 0.94,
    lastGroundedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    permissionLevel: 'Autonomous',
    description: 'Parent qualitative reasoning & macro orchestration model. Aggregates multi-agent market hypotheses and calibrates macro beta overlays.',
    inputs: 'Macro statements, Fed minutes, equity consensus revisions & portfolio VaR limits',
    outputLink: 'Node 2 (Market trend refereall) & Node 3 (Data)',
    instructions: 'Ingest macro events, assess qualitative fundamentals, and orchestrate specialized sub-agents under strict risk bounds (Daily VaR < 1.50%).',
    defaultProperty: 'Highest Sharpe Weighting',
    codeSnippet: `# DE SHAW RESEARCH JUDGEMENT PARENT AGENT
class ResearchJudgementAgent(QuantParentAgent):
    def __init__(self, risk_limit_var=0.015):
        super().__init__(name="Research Judgement agent")
        self.risk_limit_var = risk_limit_var
        
    def orchestrate_rebalance(self, macro_signal: MacroSignal, var_state: float):
        if var_state > self.risk_limit_var:
            hedge_orders = self.delegate_risk_neutralization(macro_signal)
            return self.route_to_terminal_gate(hedge_orders)
        return self.optimize_sharpe_frontier(alpha_target=0.18)`,
    tools: ['Macro News Wire', 'Barra Risk API', 'Fed Wire Index'],
    latency: '18ms',
    x: 35,
    y: 155,
  },
  {
    id: 'node-2',
    name: 'Market trend refereall',
    type: 'subagent',
    role: 'Sub-Agent: Feature Extractor',
    status: 'DEPLOYED',
    health: 'HEALTHY',
    confidence: 0.88,
    lastGroundedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    permissionLevel: 'Autonomous',
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
    x: 290,
    y: 45,
  },
  SEEDED_DEGRADED_NODE, // Node 3 (CBOE Vol-Surface Feed - DEGRADED)
  SEEDED_BREACHED_NODE, // Node 4 (Execution & Risk Overlay Gate - BREACHED)
  SEEDED_QUARANTINED_NODE, // Node 5 (Sentiment Parser - QUARANTINED)
];

export const INITIAL_MODELS_WITH_FAILURES: WorkspaceModel[] = [
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
    nodes: DEFAULT_WORKSPACE_NODES,
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
        health: 'HEALTHY',
        confidence: 0.95,
        lastGroundedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        permissionLevel: 'Autonomous',
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
      SEEDED_MOMENTUM_AGENT,
      SEEDED_BETA_NEUTRAL_AGENT,
    ],
  },
  {
    id: 'model-3',
    name: 'Global Macro Overlay',
    tag: 'Macro Overlay',
    version: 'v2.1',
    description: 'Multi-asset global macro hedging overlay tracking central bank rate differentials, sovereign CDS spreads, and energy supply shocks.',
    targetVol: 16,
    maxPosition: 12,
    varLimit: 1.45,
    expectedSharpe: 1.72,
    expectedReturn: 12.4,
    color: '#8b5cf6', // Purple
    nodes: [
      {
        id: 'node-macro-parent',
        name: 'Global Macro Sovereign Agent',
        type: 'parent',
        role: 'Parent Orchestrator',
        status: 'ACTIVE',
        health: 'HEALTHY',
        confidence: 0.92,
        lastGroundedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        permissionLevel: 'Autonomous',
        description: 'Macro regime shift detector forecasting yield curve steepeners.',
        inputs: 'Sovereign Debt Issuance, CPI Prints & FX Swaps',
        outputLink: 'Global Execution Gate',
        instructions: 'Evaluate global yield differentials and structure rates collar hedges.',
        defaultProperty: 'Regime Aware',
        codeSnippet: `# GLOBAL MACRO SOVEREIGN AGENT
class SovereignMacroAgent(ParentAgent):
    def evaluate_rates(self):
        return RatesCollarStrategy()`,
        tools: ['BIS Central Bank DB', 'Bloomberg BVAL Rates'],
        latency: '22ms',
        x: 35,
        y: 140,
      },
      {
        id: 'node-fx-hedge',
        name: 'EUR/USD FX Collar Overlay',
        type: 'tool',
        role: 'Terminal Execution Gate',
        status: 'READY',
        health: 'HEALTHY',
        confidence: 0.97,
        lastGroundedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        permissionLevel: 'Act within limits',
        description: 'Auto-hedges EUR currency risk across global asset allocations.',
        inputs: 'FX Spot Rates, Cross-Currency Basis Swaps',
        outputLink: 'EBS FX DMA',
        instructions: 'Maintain currency risk variance < 0.25% of fund NAV.',
        defaultProperty: 'Hard Limit: EUR 50M',
        codeSnippet: `# FX COLLAR OVERLAY
class FXCollarOverlay(TerminalGate):
    def route_hedge(self):
        pass`,
        tools: ['EBS Direct DMA', 'FX Spot Router'],
        latency: '0.12ms',
        x: 380,
        y: 140,
      }
    ],
  },
];

interface FailureContextType {
  models: WorkspaceModel[];
  setModels: React.Dispatch<React.SetStateAction<WorkspaceModel[]>>;
  activeModelId: string;
  setActiveModelId: (id: string) => void;
  activeModel: WorkspaceModel;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  selectedNode: AgentNode;
  escalations: EscalationItem[];
  pendingEscalations: EscalationItem[];
  auditEntries: AuditFailureEntry[];
  telemetryFeeds: FeedTelemetryItem[];
  failurePolicy: FailurePolicyConfig;
  updateFailurePolicy: (policy: Partial<FailurePolicyConfig>) => void;
  regroundNode: (nodeId: string) => void;
  restoreAutonomy: (nodeId: string) => void;
  pauseNode: (nodeId: string) => void;
  handToHuman: (nodeId: string) => void;
  triggerLiveDegradationDemo: () => void;
  triggerDegradationDemo: () => void;
  resetDemo: () => void;
  handleEscalationAction: (actionName: string, escalationId: string, notes?: string) => void;
  healthCounts: {
    healthy: number;
    degraded: number;
    quarantined: number;
    breached: number;
    total: number;
  };
  isDemoRunning: boolean;
  isDegradationDemoRunning: boolean;
  demoNotification: string | null;
}

const FailureContext = createContext<FailureContextType | undefined>(undefined);

export const FailureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [models, setModels] = useState<WorkspaceModel[]>(INITIAL_MODELS_WITH_FAILURES);
  const [activeModelId, setActiveModelId] = useState<string>('model-1');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-cboe-vol');
  const [escalations, setEscalations] = useState<EscalationItem[]>(INITIAL_ESCALATIONS);
  const [auditEntries, setAuditEntries] = useState<AuditFailureEntry[]>(INITIAL_AUDIT_FAILURE_ENTRIES);
  const [telemetryFeeds, setTelemetryFeeds] = useState<FeedTelemetryItem[]>(INITIAL_TELEMETRY_FEEDS);
  const [failurePolicy, setFailurePolicy] = useState<FailurePolicyConfig>(INITIAL_FAILURE_POLICY);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoNotification, setDemoNotification] = useState<string | null>(null);

  const activeModel = models.find(m => m.id === activeModelId) || models[0];
  const selectedNode = activeModel.nodes.find(n => n.id === selectedNodeId) || activeModel.nodes[0];

  // Calculate health counts across all models
  const healthCounts = React.useMemo(() => {
    let healthy = 0;
    let degraded = 0;
    let quarantined = 0;
    let breached = 0;
    let total = 0;

    models.forEach(model => {
      model.nodes.forEach(node => {
        total += 1;
        if (node.health === 'HEALTHY') healthy += 1;
        else if (node.health === 'DEGRADED') degraded += 1;
        else if (node.health === 'QUARANTINED') quarantined += 1;
        else if (node.health === 'BREACHED') breached += 1;
      });
    });

    return { healthy, degraded, quarantined, breached, total };
  }, [models]);

  const updateFailurePolicy = (updated: Partial<FailurePolicyConfig>) => {
    setFailurePolicy(prev => ({ ...prev, ...updated }));
  };

  // Re-ground a node: restores health to HEALTHY, restores prior autonomy, clears blast radius, logs audit
  const regroundNode = (nodeId: string) => {
    let affectedNodeName = '';
    let priorAutonomy: PermissionLevel = 'Autonomous';

    setModels(prevModels => prevModels.map(model => {
      const hasNode = model.nodes.some(n => n.id === nodeId);
      if (!hasNode) return model;

      return {
        ...model,
        nodes: model.nodes.map(node => {
          if (node.id === nodeId) {
            affectedNodeName = node.name;
            priorAutonomy = (node.failure?.autonomyBefore as PermissionLevel) || 'Autonomous';
            return {
              ...node,
              health: 'HEALTHY' as NodeHealth,
              confidence: 0.96,
              lastGroundedAt: new Date().toISOString(),
              permissionLevel: priorAutonomy,
              failure: undefined
            };
          }
          return node;
        })
      };
    }));

    // If node-cboe-vol, also update feed telemetry to LIVE
    if (nodeId === 'node-cboe-vol' || nodeId === 'node-1') {
      setTelemetryFeeds(prev => prev.map(feed => {
        if (feed.id === 'feed-1') {
          return {
            ...feed,
            status: 'LIVE',
            lastTick: '0.04 ms ago (Re-grounded)',
            latency: '0.04 ms',
            consumingNodes: feed.consumingNodes.map(c => ({ ...c, isAffected: false }))
          };
        }
        return feed;
      }));
    }

    // Add audit entry for recovery
    const newAuditEntry: AuditFailureEntry = {
      id: `audit-recovery-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' EST',
      type: 'AUTONOMY_RESTORED',
      nodeId,
      nodeName: affectedNodeName || nodeId,
      modelName: activeModel.name,
      trigger: 'Manual / Scheduled Re-ground verification completed successfully',
      groundingStatus: 'FRESH (< 100ms)',
      autonomyBefore: 'Act with approval',
      autonomyAfter: priorAutonomy,
      blastRadius: [],
      escalatedTo: 'Alexander Vance (PM)',
      resolution: 'Re-grounded against secondary consolidated ticks. Autonomous trading restored.',
      isFailure: false
    };
    setAuditEntries(prev => [newAuditEntry, ...prev]);

    // Resolve matching escalation if present
    setEscalations(prev => prev.map(esc => {
      if (esc.nodeId === nodeId) {
        return {
          ...esc,
          status: 'RESOLVED',
          resolvedBy: 'Human PM (Re-grounded)',
          resolutionNotes: 'Successfully re-grounded against primary data source.'
        };
      }
      return esc;
    }));

    setDemoNotification(`Re-grounded "${affectedNodeName || nodeId}": Health restored to HEALTHY, autonomy restored to ${priorAutonomy}.`);
    setTimeout(() => setDemoNotification(null), 4000);
  };

  const restoreAutonomy = (nodeId: string) => {
    setModels(prev => prev.map(m => ({
      ...m,
      nodes: m.nodes.map(n => n.id === nodeId ? { ...n, permissionLevel: 'Autonomous' } : n)
    })));
    setDemoNotification(`Autonomy restored to "Autonomous" for selected node.`);
    setTimeout(() => setDemoNotification(null), 3500);
  };

  const pauseNode = (nodeId: string) => {
    setModels(prev => prev.map(m => ({
      ...m,
      nodes: m.nodes.map(n => n.id === nodeId ? { ...n, health: 'QUARANTINED', permissionLevel: 'Observe' } : n)
    })));
    setDemoNotification(`Node paused. Trading authority revoked.`);
    setTimeout(() => setDemoNotification(null), 3500);
  };

  const handToHuman = (nodeId: string) => {
    setModels(prev => prev.map(m => ({
      ...m,
      nodes: m.nodes.map(n => n.id === nodeId ? { ...n, permissionLevel: 'Propose' } : n)
    })));
    setDemoNotification(`Node transferred to human supervisor ("Propose" only).`);
    setTimeout(() => setDemoNotification(null), 3500);
  };

  // 10. Live Walkthrough Demo Trigger:
  // node flips to DEGRADED -> autonomy steps down -> downstream nodes mark unverified -> escalation in inbox -> audit entry written
  const triggerLiveDegradationDemo = () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    setDemoNotification('⚡ Initiating Live Failure & Degradation Demo Sequence...');

    setTimeout(() => {
      // Step 1: Flip node-1 to DEGRADED due to stale feed simulation
      const targetNodeId = 'node-1';
      setModels(prev => prev.map(m => {
        if (m.id !== 'model-1') return m;
        return {
          ...m,
          nodes: m.nodes.map(n => {
            if (n.id === targetNodeId) {
              return {
                ...n,
                health: 'DEGRADED' as NodeHealth,
                confidence: 0.71,
                lastGroundedAt: new Date(Date.now() - 16 * 60 * 1000).toISOString(),
                permissionLevel: 'Act with approval' as PermissionLevel,
                failure: {
                  kind: 'STALE_FEED',
                  detectedAt: new Date().toISOString(),
                  source: 'Bloomberg BVAL Rates Feed (SLA > 5m breach)',
                  detail: 'Rates feed aged 16m against 5m SLA. Autonomy stepped down from Autonomous to Act with approval.',
                  autonomyBefore: 'Autonomous',
                  autonomyAfter: 'Act with approval',
                  blastRadius: ['node-2', 'node-4'],
                  observed: 'Bloomberg BVAL rates feed timestamp aged past 15m. Delta calculations unverified.',
                  whyItMatters: 'DE Shaw Oculus macro mandate requires live interest rate volatility feeds.',
                  alreadyDone: 'Stepped down autonomy to "Act with approval". Marked 2 downstream nodes as unverified.',
                  recommendation: 'Re-ground against secondary CME SOFR tick store.',
                  defaultAction: 'In 10:00, fall back to EOD rates curve and freeze duration expansion.',
                  defaultActionCountdownSeconds: 600
                }
              };
            }
            return n;
          })
        };
      }));

      setSelectedNodeId(targetNodeId);

      // Step 2: Add escalation item to inbox
      const newEscalation: EscalationItem = {
        id: `esc-live-demo-${Date.now()}`,
        nodeId: targetNodeId,
        nodeName: 'Research Judgement agent',
        modelName: 'Production Core',
        severity: 'DEGRADED',
        failureKind: 'STALE_FEED',
        age: 'Just now',
        title: 'Live Degradation: Rates Feed SLA Breached (16m vs 5m)',
        observed: {
          source: 'Bloomberg BVAL Rates Optical DMA',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' EST',
          fact: 'Data snapshot aged 16 minutes without refresh. Autonomy stepped down to Act with approval.'
        },
        whyItMatters: {
          limitOrMandate: 'DE Shaw Quantitative Telemetry Mandate',
          implication: 'Unverified interest rate curves cannot drive autonomous macro beta hedge allocation.'
        },
        alreadyDone: {
          action: 'Stepped down autonomy from Autonomous to Act with approval. Flagged 2 downstream nodes.',
          authorityLevel: 'Act with approval',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' EST'
        },
        recommendation: {
          proposedAction: 'Click "Re-ground now" to restore health and reinstate Autonomous trading.',
          confidence: 0.71,
          rationale: 'Secondary CME SOFR tick store is available with 0.08ms latency.'
        },
        defaultAction: {
          namedAction: 'Fall back to EOD curve and freeze duration hedges',
          timeoutSeconds: 600,
          countdown: 600,
          ruleDescription: 'DE Shaw Failure Policy: Stale feeds step down autonomy and execute safe default after 10m.'
        },
        status: 'PENDING_HUMAN'
      };
      setEscalations(prev => [newEscalation, ...prev]);

      // Step 3: Write audit entry
      const auditItem: AuditFailureEntry = {
        id: `audit-live-demo-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' EST',
        type: 'DEGRADATION',
        nodeId: targetNodeId,
        nodeName: 'Research Judgement agent',
        modelName: 'Production Core',
        trigger: 'Live Walkthrough: Rates Feed SLA Breached (STALE_FEED)',
        groundingStatus: 'STALE (> 15m)',
        autonomyBefore: 'Autonomous',
        autonomyAfter: 'Act with approval',
        blastRadius: ['node-2', 'node-4'],
        escalatedTo: 'Desk PM & Overview Inbox',
        resolution: 'Autonomy stepped down; downstream nodes marked unverified. Awaiting Re-ground.',
        isFailure: true
      };
      setAuditEntries(prev => [auditItem, ...prev]);

      setIsDemoRunning(false);
      setDemoNotification('Live Degradation Active: Node degraded -> Autonomy stepped down -> Escalation in Overview Inbox -> Audit entry logged. Click "Re-ground" on canvas to restore!');
    }, 1200);
  };

  const handleEscalationAction = (actionName: string, escalationId: string, notes?: string) => {
    const targetEsc = escalations.find(e => e.id === escalationId);
    if (!targetEsc) return;

    setEscalations(prev => prev.map(e => {
      if (e.id === escalationId) {
        return {
          ...e,
          status: actionName === 'Override' ? 'OVERRIDDEN' : actionName === 'Pause' ? 'PAUSED' : 'APPROVED',
          resolvedBy: 'Alexander Vance (PM)',
          resolutionNotes: notes || `Executed ${actionName}`
        };
      }
      return e;
    }));

    // Write audit log entry
    const auditItem: AuditFailureEntry = {
      id: `audit-action-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' EST',
      type: actionName === 'Override' ? 'BREACH' : 'AUTONOMY_RESTORED',
      nodeId: targetEsc.nodeId,
      nodeName: targetEsc.nodeName,
      modelName: targetEsc.modelName,
      trigger: `Human Decision: ${actionName} on ${targetEsc.title}`,
      groundingStatus: 'VERIFIED_BY_OPERATOR',
      autonomyBefore: targetEsc.alreadyDone.authorityLevel,
      autonomyAfter: actionName === 'Approve' ? 'Autonomous' : actionName === 'Override' ? 'Act with approval (Override)' : 'Observe',
      blastRadius: [],
      escalatedTo: 'Alexander Vance (PM)',
      resolution: notes || `Executed ${actionName}. Mandate compliance verified.`,
      isFailure: false
    };
    setAuditEntries(prev => [auditItem, ...prev]);
  };

  const resetDemo = () => {
    setModels(INITIAL_MODELS_WITH_FAILURES);
    setEscalations(INITIAL_ESCALATIONS);
    setAuditEntries(INITIAL_AUDIT_FAILURE_ENTRIES);
    setTelemetryFeeds(INITIAL_TELEMETRY_FEEDS);
    setIsDemoRunning(false);
    setDemoNotification(null);
  };

  return (
    <FailureContext.Provider
      value={{
        models,
        setModels,
        activeModelId,
        setActiveModelId,
        activeModel,
        selectedNodeId,
        setSelectedNodeId,
        selectedNode,
        escalations,
        pendingEscalations: escalations.filter(e => e.status === 'PENDING_HUMAN'),
        auditEntries,
        telemetryFeeds,
        failurePolicy,
        updateFailurePolicy,
        regroundNode,
        restoreAutonomy,
        pauseNode,
        handToHuman,
        triggerLiveDegradationDemo,
        triggerDegradationDemo: triggerLiveDegradationDemo,
        resetDemo,
        handleEscalationAction,
        healthCounts,
        isDemoRunning,
        isDegradationDemoRunning: isDemoRunning,
        demoNotification
      }}
    >
      {children}
    </FailureContext.Provider>
  );
};

export const useFailureState = () => {
  const context = useContext(FailureContext);
  if (!context) {
    throw new Error('useFailureState must be used within a FailureProvider');
  }
  return context;
};
