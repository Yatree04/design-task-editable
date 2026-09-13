import React, { useState, useEffect, useMemo } from 'react';
import { ViewTab, WorkspaceModel, AgentNode, NodeHealth, PermissionLevel, NodeFailure } from '../types';
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
  HelpCircle,
  Activity,
  AlertTriangle,
  Scale,
  PlayCircle,
  ShieldAlert,
  Radio,
  Lock,
  Unlock,
  History,
  CheckCheck
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AgentBacktestSandbox } from './AgentBacktestSandbox';
import { useFailureState } from '../context/FailureContext';
import { EscalationCard, EscalationItem } from './EscalationCard';

export type CanvasViewMode = 'matrix' | 'Node' | 'code' | 'governance';
export type RepoFilter = 'all' | 'codebases' | 'subagents' | 'templates' | 'data';
export type RightPanelTab = 'agent' | 'instructions' | 'code' | 'sandbox' | 'health' | 'escalations';
export type BottomDrawerTab = 'all' | 'skills' | 'code' | 'inputs' | 'risk' | 'firm_ideas' | 'research_papers';

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
  // Use centralized Failure Context for models, failure states, escalations and demo sequence
  const {
    models,
    setModels,
    activeModelId,
    setActiveModelId,
    activeModel,
    selectedNodeId: contextSelectedNodeId,
    setSelectedNodeId: setContextSelectedNodeId,
    selectedNode,
    regroundNode,
    restoreAutonomy,
    pauseNode,
    handToHuman,
    triggerLiveDegradationDemo,
    resetDemo,
    isDemoRunning,
    demoNotification,
    escalations,
    pendingEscalations,
    handleEscalationAction,
    healthCounts,
  } = useFailureState();

  const allNodes = useMemo(() => models.flatMap((m) => m.nodes), [models]);
  const healthyCount = allNodes.filter((n) => !n.health || n.health === 'HEALTHY').length;
  const degradedCount = allNodes.filter((n) => n.health === 'DEGRADED').length;
  const quarantinedCount = allNodes.filter((n) => n.health === 'QUARANTINED').length;
  const breachedCount = allNodes.filter((n) => n.health === 'BREACHED').length;
  const avgConfidence = allNodes.length > 0
    ? (allNodes.reduce((acc, n) => acc + (n.confidence ?? 0.94), 0) / allNodes.length * 100).toFixed(1)
    : '94.2';

  // Conflict arbitration state in Governance tab
  const [arbitrationChoice, setArbitrationChoice] = useState<'split' | 'momentum' | 'beta_neutral' | 'freeze'>('split');
  const [arbitrationCustomNotes, setArbitrationCustomNotes] = useState<string>('');
  const [isArbitrationCommitted, setIsArbitrationCommitted] = useState<boolean>(false);

  const [sandboxInitialMode, setSandboxInitialMode] = useState<'single' | 'compare' | 'merge'>('single');
  const [isNewModelMenuOpen, setIsNewModelMenuOpen] = useState<boolean>(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [arbitrationEscalation, setArbitrationEscalation] = useState<EscalationItem | null>(null);

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
  }, [importedModel, onClearImportedModel, setModels, setActiveModelId]);

  // View mode switcher: matrix / Node / code
  const [viewMode, setViewMode] = useState<CanvasViewMode>('Node');
  
  // Repository filter pills: [ All ] [ Code bases ] [ sub agents ] [ sub agents ]
  const [repoFilter, setRepoFilter] = useState<RepoFilter>('all');

  const selectedNodeId = contextSelectedNodeId || activeModel.nodes[0]?.id || 'node-1';
  const setSelectedNodeId = (id: string) => setContextSelectedNodeId(id);

  // Right Panel Tabs: [ Agent | Instructions | Code | Backtest Sandbox | Health ]
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

  // Anti-hallucination auto-refresh countdown state per node matching screenshot
  const [nodeCountdowns, setNodeCountdowns] = useState<Record<string, number>>({
    'node-1': 28,
    'node-2': 22,
    'node-3': 44,
    'node-4': 10,
  });
  const [refreshingNodeId, setRefreshingNodeId] = useState<string | null>(null);
  const [isAiSuggestionExpanded, setIsAiSuggestionExpanded] = useState<boolean>(false);

  // Agent Custom Builder response & prompt state matching screenshot
  const [builderResponse, setBuilderResponse] = useState<string>('agent response etc etc');
  const [customPromptInput, setCustomPromptInput] = useState<string>('');
  const [isBuildingResponse, setIsBuildingResponse] = useState<boolean>(false);

  const handleSendCustomPrompt = () => {
    if (!customPromptInput.trim()) return;
    const prompt = customPromptInput;
    setCustomPromptInput('');
    setIsBuildingResponse(true);

    setTimeout(() => {
      setBuilderResponse(`Calibrated ${selectedNode?.name || 'Agent'}: Evaluated instruction "${prompt}". Output topology re-weighted (Sharpe frontier +0.14, VaR capped at <1.25%). Downstream execution gates synchronized.`);
      setIsBuildingResponse(false);
    }, 400);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setNodeCountdowns((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (next[k] <= 1) {
            next[k] = k === 'node-1' ? 30 : k === 'node-2' ? 25 : k === 'node-3' ? 45 : 15;
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

  // Dynamic Matrix Factors State
  const [matrixFactors, setMatrixFactors] = useState<Array<{
    id: string;
    name: string;
    category: string;
    alphaBeta: string;
    momentum: string;
    volSensitivity: string;
    corrNY4: string;
    isCustom?: boolean;
  }>>([
    { id: 'm-1', name: 'Research Judgement', category: 'Orchestrator', alphaBeta: '1.00', momentum: '0.42', volSensitivity: '0.12', corrNY4: '0.88' },
    { id: 'm-2', name: 'Market Trend Referral', category: 'Momentum', alphaBeta: '0.42', momentum: '1.00', volSensitivity: '0.68', corrNY4: '0.94' },
    { id: 'm-3', name: 'Data & Factor Store', category: 'Feature Store', alphaBeta: '0.12', momentum: '0.68', volSensitivity: '1.00', corrNY4: '0.99' },
  ]);

  // Active Resource Action Menu dropdown state (by item id)
  const [activeResourceActionMenu, setActiveResourceActionMenu] = useState<string | null>(null);

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

  // Option 1: Add to Node (as a new DAG Node or attached to currently selected node)
  const handleAddResourceToNode = (resource: ResourceItem, mode: 'new' | 'append' = 'new') => {
    if (mode === 'append' && selectedNode) {
      const updatedTools = Array.from(new Set([...selectedNode.tools, ...resource.tools]));
      const updatedInstructions = `${selectedNode.instructions} Includes ${resource.name} (${resource.defaultProperty}).`;
      const updatedDesc = `${selectedNode.description} Integrated with ${resource.name}.`;

      setModels(prev => prev.map(m => {
        if (m.id !== activeModelId) return m;
        return {
          ...m,
          nodes: m.nodes.map(n => n.id === selectedNode.id ? {
            ...n,
            tools: updatedTools,
            instructions: updatedInstructions,
            description: updatedDesc,
          } : n)
        };
      }));

      setViewMode('Node');
      showResourceFeedback(`Attached "${resource.name}" capabilities to "${selectedNode.name}"`);
    } else {
      handleAddResourceToModel(resource);
      setViewMode('Node');
    }
  };

  // Option 2: Add to Matrix (as a Factor vector stream in the Covariance Matrix)
  const handleAddResourceToMatrix = (resource: ResourceItem) => {
    const randomAlpha = (0.2 + Math.random() * 0.7).toFixed(2);
    const randomMom = (0.3 + Math.random() * 0.6).toFixed(2);
    const randomVol = (0.1 + Math.random() * 0.5).toFixed(2);
    const randomCorr = (0.85 + Math.random() * 0.12).toFixed(2);

    const newFactor = {
      id: `factor-${Date.now()}`,
      name: resource.name,
      category: resource.badge || 'Quant Factor',
      alphaBeta: randomAlpha,
      momentum: randomMom,
      volSensitivity: randomVol,
      corrNY4: randomCorr,
      isCustom: true,
    };

    setMatrixFactors(prev => [...prev, newFactor]);

    // Also enrich node-3 (Data & Factor Matrix) if present
    setModels(prev => prev.map(m => {
      if (m.id !== activeModelId) return m;
      return {
        ...m,
        nodes: m.nodes.map(n => {
          if (n.type === 'data' || n.id === 'node-3') {
            return {
              ...n,
              inputs: `${n.inputs}, ${resource.name}`,
              tools: Array.from(new Set([...n.tools, ...resource.tools])),
            };
          }
          return n;
        })
      };
    }));

    setViewMode('matrix');
    showResourceFeedback(`Added "${resource.name}" factor stream to Factor Matrix`);
  };

  // Option 3: Add to Code (injects Python code snippet into active editor)
  const handleAddResourceToCode = (resource: ResourceItem) => {
    const injectedComment = `\n\n# ========================================================\n# INJECTED FROM REPOSITORY: ${resource.name.toUpperCase()}\n# Category: ${resource.badge} | Latency: ${resource.latency}\n# ========================================================\n${resource.codeSnippet}\n`;

    setModels(prev => prev.map(m => {
      if (m.id !== activeModelId) return m;
      return {
        ...m,
        nodes: m.nodes.map(n => {
          if (n.id === selectedNode.id) {
            return {
              ...n,
              codeSnippet: `${n.codeSnippet}${injectedComment}`
            };
          }
          return n;
        })
      };
    }));

    setViewMode('code');
    setRightTab('code');
    showResourceFeedback(`Injected "${resource.name}" Python code into ${selectedNode.name}`);
  };

  // Remove custom matrix factor
  const handleRemoveMatrixFactor = (factorId: string) => {
    setMatrixFactors(prev => prev.filter(f => f.id !== factorId));
    showResourceFeedback('Removed factor from covariance matrix');
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
      health: 'HEALTHY',
      confidence: 0.95,
      lastGroundedAt: new Date().toISOString(),
      permissionLevel: 'Autonomous',
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
          health: 'HEALTHY',
          confidence: 0.95,
          lastGroundedAt: new Date().toISOString(),
          permissionLevel: 'Autonomous',
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
          health: 'HEALTHY',
          confidence: 0.95,
          lastGroundedAt: new Date().toISOString(),
          permissionLevel: 'Autonomous',
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
          health: 'HEALTHY',
          confidence: 0.95,
          lastGroundedAt: new Date().toISOString(),
          permissionLevel: 'Autonomous',
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
            health: 'HEALTHY',
            confidence: 0.95,
            lastGroundedAt: new Date().toISOString(),
            permissionLevel: 'Autonomous',
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
            health: 'HEALTHY',
            confidence: 0.95,
            lastGroundedAt: new Date().toISOString(),
            permissionLevel: 'Autonomous',
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
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-1.5 border-b border-border shrink-0">
        
        {/* Left: View Title & Sandbox/Merge Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-foreground font-mono tracking-tight">
              Agent Workspace
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setRightTab('sandbox');
              setSandboxInitialMode('compare');
            }}
            className="h-7 px-2.5 text-xs font-mono text-blue-700 bg-white hover:bg-blue-50/60 border-blue-300 rounded-lg gap-1 shadow-2xs"
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
            className="h-7 px-2.5 text-xs font-mono text-emerald-700 bg-white hover:bg-emerald-50/60 border-emerald-300 rounded-lg gap-1 shadow-2xs"
            title="Merge two models into a unified strategy in Sandbox"
          >
            <GitMerge className="w-3 h-3 text-emerald-600" />
            <span>Merge Models</span>
          </Button>

          <div className="text-[11px] font-mono text-slate-700 font-semibold px-2 py-0.5 rounded-lg border border-border bg-slate-50 hidden sm:inline-flex">
            Sharpe: {activeModel.expectedSharpe || 1.84} · VaR: {activeModel.varLimit || 1.25}%
          </div>
        </div>

        {/* Right: Model Tabs Section */}
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
              <div className="absolute right-0 mt-1 w-56 bg-white border border-border rounded-xl shadow-lg z-40 p-1 font-mono text-xs animate-in fade-in">
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

      {/* AGENT FLEET HEALTH & GOVERNANCE STRIP */}
      <div className="bg-white border border-border rounded-xl px-3 py-2 shadow-2xs font-mono flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900">Agent Fleet Health:</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              {healthyCount} Healthy
            </span>
            {degradedCount > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-300 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {degradedCount} Degraded
              </span>
            )}
            {quarantinedCount > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-300 font-bold">
                {quarantinedCount} Quarantined
              </span>
            )}
            {breachedCount > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-300 font-bold">
                {breachedCount} Breached
              </span>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground border-l border-slate-200 pl-2.5">
            <span>Avg Confidence:</span>
            <span className="font-bold text-slate-800">{avgConfidence}%</span>
          </div>

          {pendingEscalations.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setViewMode('governance');
                setRightTab('escalations');
              }}
              className="px-2.5 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-[11px] flex items-center gap-1.5 transition-all animate-pulse cursor-pointer shadow-2xs"
            >
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Awaiting Decision ({pendingEscalations.length})</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isDemoRunning ? (
            <button
              type="button"
              onClick={resetDemo}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all font-semibold cursor-pointer"
            >
              Reset State
            </button>
          ) : (
            <button
              type="button"
              onClick={triggerLiveDegradationDemo}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-all font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Simulate data feed stall and automated step-down to human review"
            >
              <Zap className="w-3 h-3 text-amber-600" />
              <span>⚡ Demo Live Degradation</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Panel Layout matching the updated sketch (Canvas + Bottom Tray on Left, Inspector on Right) */}
      <div className="flex-1 min-h-0 border border-border rounded-2xl bg-white shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* =========================================================================
            LEFT / CENTER MAIN AREA (Cols 1-8):
            - Top Bar: [ matrix / Node / code / Governance ] + [ Version 1 ▼ ]
            - Canvas with DAG Nodes & Lower-Left AI Suggestion Reasoning Box
            - Bottom Component Repository Tray: [ Skills & subagents | Code & templates | Input nodes | Risk & compliance ]
           ========================================================================= */}
        <div className="lg:col-span-8 flex flex-col justify-between border-r border-border bg-white p-3 min-h-0 overflow-hidden">
          
          {/* TOP CANVAS HEADER: "matrix / Node / code / Governance" + "Version 1 ▼" */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-border shrink-0">
            
            {/* Mode switch container: [ matrix / Node / code / governance ] */}
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
              <span className="text-muted-foreground mx-1">/</span>
              <button
                type="button"
                onClick={() => setViewMode('governance')}
                className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1.5 ${
                  viewMode === 'governance'
                    ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                    : pendingEscalations.length > 0
                    ? 'text-amber-700 font-bold hover:text-amber-900'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                <ShieldAlert className="w-3 h-3" />
                <span>governance</span>
                {pendingEscalations.length > 0 && (
                  <span className="px-1 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-mono leading-none">
                    {pendingEscalations.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Discreet Demo Live Degradation trigger */}
              <button
                type="button"
                onClick={triggerLiveDegradationDemo}
                disabled={isDemoRunning}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                title="Trigger simulated live data stall & autonomy step-down demo"
              >
                <Zap className={`w-3 h-3 text-amber-600 ${isDemoRunning ? 'animate-bounce' : ''}`} />
                <span>{isDemoRunning ? 'Simulating Degradation...' : '⚡ Demo Live Degradation'}</span>
              </button>

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
                {(() => {
                  const blastRadiusNodeIds = new Set<string>();
                  activeModel.nodes.forEach((n) => {
                    if (n.failure?.blastRadius) {
                      n.failure.blastRadius.forEach((id) => blastRadiusNodeIds.add(id));
                    }
                  });

                  // Check if there is a conflict pair in this model
                  const conflictEscalation = escalations.find(e => e.severity === 'CONFLICT');
                  const momentumNode = activeModel.nodes.find(n => n.id === 'node-momentum');
                  const betaNeutralNode = activeModel.nodes.find(n => n.id === 'node-beta-neutral');

                  return (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 min-w-[680px] min-h-[350px]">
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
                          <path d="M 0 1 L 8 5 L 0 9 z" fill="#0f172a" opacity="0.95" />
                        </marker>
                        <marker
                          id="arrow-amber"
                          viewBox="0 0 10 10"
                          refX="6"
                          refY="5"
                          markerWidth="6"
                          markerHeight="6"
                          orient="auto-start-reverse"
                        >
                          <path d="M 0 1 L 8 5 L 0 9 z" fill="#f59e0b" opacity="0.95" />
                        </marker>
                      </defs>

                      {/* Node 1 (Center-Left) -> Node 2 (Top-Middle) */}
                      <path
                        d="M 185 185 C 225 150, 255 90, 290 75"
                        fill="none"
                        stroke="#0f172a"
                        strokeWidth="1.75"
                        markerEnd="url(#arrow)"
                      />

                      {/* Node 1 (Center-Left) -> Node 3 (Feature Store / Bottom-Middle) */}
                      <path
                        d="M 185 210 C 220 235, 245 265, 270 280"
                        fill="none"
                        stroke={blastRadiusNodeIds.has('node-cboe-vol') ? '#f59e0b' : '#0f172a'}
                        strokeWidth="1.75"
                        strokeDasharray={blastRadiusNodeIds.has('node-cboe-vol') ? '4,4' : undefined}
                        markerEnd={blastRadiusNodeIds.has('node-cboe-vol') ? 'url(#arrow-amber)' : 'url(#arrow)'}
                      />

                      {/* Top-Left Inflow into Node 4 (Execution Sub-Agent) */}
                      <path
                        d="M 410 80 C 440 100, 460 130, 480 165"
                        fill="none"
                        stroke="#0f172a"
                        strokeWidth="1.75"
                        markerEnd="url(#arrow)"
                      />

                      {/* Node 4 Outflow to Top-Right */}
                      <path
                        d="M 610 165 C 630 140, 645 120, 665 100"
                        fill="none"
                        stroke="#0f172a"
                        strokeWidth="1.75"
                        markerEnd="url(#arrow)"
                      />

                      {/* Bottom-Left Inflow into Node 4 */}
                      <path
                        d="M 400 290 C 430 270, 455 240, 480 200"
                        fill="none"
                        stroke={blastRadiusNodeIds.has('node-exec-gate') ? '#f59e0b' : '#0f172a'}
                        strokeWidth="1.75"
                        strokeDasharray={blastRadiusNodeIds.has('node-exec-gate') ? '4,4' : undefined}
                        markerEnd={blastRadiusNodeIds.has('node-exec-gate') ? 'url(#arrow-amber)' : 'url(#arrow)'}
                      />

                      {/* Node 4 Outflow to Bottom-Right */}
                      <path
                        d="M 610 200 C 630 230, 650 260, 675 285"
                        fill="none"
                        stroke="#0f172a"
                        strokeWidth="1.75"
                        markerEnd="url(#arrow)"
                      />

                      {/* Conflict Edge between Momentum Agent and Beta-Neutral Agent */}
                      {momentumNode && betaNeutralNode && (
                        <g className="pointer-events-auto cursor-pointer" onClick={() => conflictEscalation && setArbitrationEscalation(conflictEscalation)}>
                          <path
                            d={`M ${(momentumNode.x || 30) + 70} ${(momentumNode.y || 40) + 60} L ${(betaNeutralNode.x || 30) + 70} ${(betaNeutralNode.y || 230)}`}
                            fill="none"
                            stroke="#dc2626"
                            strokeWidth="2"
                            strokeDasharray="5,4"
                          />
                        </g>
                      )}

                      {/* Additional dynamic connection paths for added nodes */}
                      {activeModel.nodes.length > 4 && activeModel.nodes.slice(4).map((n) => (
                        <path
                          key={n.id}
                          d={`M ${n.x + 60} ${n.y + 40} C ${n.x + 90} ${n.y + 70}, 380 140, 470 120`}
                          fill="none"
                          stroke={blastRadiusNodeIds.has(n.id) ? '#f59e0b' : '#64748b'}
                          strokeWidth="1.25"
                          strokeDasharray="4,4"
                          markerEnd={blastRadiusNodeIds.has(n.id) ? 'url(#arrow-amber)' : 'url(#arrow)'}
                        />
                      ))}
                    </svg>
                  );
                })()}

                {/* Render Core / Model Nodes */}
                {(() => {
                  const blastRadiusNodeIds = new Set<string>();
                  activeModel.nodes.forEach((n) => {
                    if (n.failure?.blastRadius) {
                      n.failure.blastRadius.forEach((id) => blastRadiusNodeIds.add(id));
                    }
                  });

                  return activeModel.nodes.map((node, index) => {
                    const isSelected = selectedNodeId === node.id;
                    const isParent = node.type === 'parent';
                    const isData = node.type === 'data';
                    const isTool = node.type === 'tool';
                    const isDegraded = node.health === 'DEGRADED';
                    const isQuarantined = node.health === 'QUARANTINED';
                    const isBreached = node.health === 'BREACHED';
                    const isFailing = isDegraded || isQuarantined || isBreached;
                    const isDownstreamBlast = !isFailing && blastRadiusNodeIds.has(node.id);
                    
                    // Coordinate fallback
                    const posX = node.x ?? (index === 0 ? 35 : index === 1 ? 290 : index === 2 ? 270 : 480);
                    const posY = node.y ?? (index === 0 ? 155 : index === 1 ? 45 : index === 2 ? 255 : 155);

                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        style={{
                          left: `${posX}px`,
                          top: `${posY}px`,
                        }}
                        className={`absolute min-w-[145px] max-w-[175px] p-2.5 rounded-2xl border transition-all cursor-pointer z-10 flex flex-col justify-between shadow-2xs ${
                          isSelected
                            ? isBreached
                              ? 'bg-red-50/90 border-red-600 ring-2 ring-red-500/50'
                              : isQuarantined
                              ? 'bg-purple-50/90 border-purple-600 ring-2 ring-purple-500/50'
                              : isDegraded
                              ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/50'
                              : isParent
                              ? 'bg-[#eae4ff] border-purple-500 ring-2 ring-purple-400/40'
                              : 'bg-white border-blue-500 ring-2 ring-blue-400/40'
                            : isBreached
                            ? 'bg-red-50/60 hover:bg-red-50 border-red-500 ring-1 ring-red-300'
                            : isQuarantined
                            ? 'bg-purple-50/60 hover:bg-purple-50 border-purple-500 ring-1 ring-purple-300'
                            : isDegraded
                            ? 'bg-amber-50/60 hover:bg-amber-50 border-amber-500 ring-1 ring-amber-300'
                            : isDownstreamBlast
                            ? 'bg-amber-50/30 hover:bg-amber-50/50 border-dashed border-amber-400'
                            : isParent
                            ? 'bg-[#eae4ff] hover:bg-[#eae4ff]/90 border-purple-300'
                            : isData
                            ? 'bg-white hover:bg-slate-50 border-slate-300'
                            : isTool
                            ? 'bg-white hover:bg-slate-50 border-slate-300'
                            : 'bg-white hover:bg-slate-50 border-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-[8.5px] font-mono uppercase tracking-wider font-bold ${
                              isBreached
                                ? 'text-red-700'
                                : isQuarantined
                                ? 'text-purple-700'
                                : isDegraded
                                ? 'text-amber-700'
                                : isParent 
                                ? 'text-purple-700' 
                                : isData 
                                ? 'text-emerald-700' 
                                : isTool
                                ? 'text-amber-700'
                                : 'text-blue-600'
                            }`}>
                              {node.health && node.health !== 'HEALTHY' 
                                ? `[${node.health}]` 
                                : node.type === 'parent' 
                                ? 'parent orchestrator' 
                                : node.type === 'data' 
                                ? 'feature store' 
                                : node.type}
                            </span>

                            {/* Status indicator / Refresh / Re-ground */}
                            {isFailing ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  regroundNode(node.id);
                                }}
                                title="Click to re-ground node data source"
                                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white text-slate-800 border border-slate-300 text-[8px] font-mono font-bold hover:bg-slate-100 shadow-2xs"
                              >
                                <RotateCw className="w-2.5 h-2.5 text-blue-600" />
                                <span>Re-ground</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => handleManualNodeRefresh(e, node.id)}
                                title="Anti-Hallucination Refresh countdown"
                                className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[8px] font-mono font-bold hover:bg-slate-200"
                              >
                                <RotateCw className={`w-2.5 h-2.5 ${refreshingNodeId === node.id ? 'animate-spin text-blue-600' : ''}`} />
                                <span>{nodeCountdowns[node.id] || 28}s</span>
                              </button>
                            )}
                          </div>

                          <span className="text-[10.5px] font-bold text-slate-900 font-mono leading-tight block truncate">
                            {node.name}
                          </span>

                          {/* Failure badge / Downstream warning chip */}
                          {isDownstreamBlast && (
                            <div className="flex items-center gap-1 text-[8px] font-mono text-amber-700 bg-amber-100/70 px-1 py-0.2 rounded border border-amber-200">
                              <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                              <span>unverified input</span>
                            </div>
                          )}

                          {node.failure && (
                            <div className="text-[7.5px] font-mono text-slate-700 bg-black/5 px-1 py-0.5 rounded truncate leading-none">
                              {node.failure.detail}
                            </div>
                          )}
                        </div>

                        <div className="text-[8px] font-mono text-muted-foreground border-t border-black/5 pt-1 flex items-center justify-between mt-1">
                          <span>{node.latency}</span>
                          <span className={`font-semibold truncate max-w-[75px] ${
                            isBreached 
                              ? 'text-red-700' 
                              : isQuarantined 
                              ? 'text-purple-700' 
                              : isDegraded 
                              ? 'text-amber-700' 
                              : 'text-emerald-600'
                          }`}>
                            {node.permissionLevel || (node.defaultProperty ? node.defaultProperty.split(' ')[0] : 'Synced')}
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()}

                {/* Conflict Edge Arbitration Badge floating if conflict exists */}
                {escalations.some(e => e.severity === 'CONFLICT') && (
                  <div className="absolute left-[90px] top-[140px] z-20">
                    <button
                      type="button"
                      onClick={() => {
                        const conflict = escalations.find(e => e.severity === 'CONFLICT');
                        if (conflict) setArbitrationEscalation(conflict);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-900 border border-red-300 font-mono text-[9px] font-bold shadow-2xs hover:bg-red-200 transition-all cursor-pointer"
                      title="Arbitrate contradictory agent instructions"
                    >
                      <Scale className="w-3 h-3 text-red-700" />
                      <span>⚖️ Conflict: NVDA</span>
                    </button>
                  </div>
                )}

                {/* AI Workflow Suggestion (Button when collapsed, detailed panel when expanded) */}
                <div className="absolute right-4 bottom-4 z-20">
                  {!isAiSuggestionExpanded ? (
                    <button
                      type="button"
                      onClick={() => setIsAiSuggestionExpanded(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/95 hover:bg-blue-100 text-blue-900 shadow-2xs font-mono text-[11px] font-bold transition-all cursor-pointer group animate-in fade-in"
                      title="Click to view AI workflow suggestions"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span>AI Workflow Suggestion</span>
                    </button>
                  ) : (
                    <div className="w-[240px] sm:w-[265px] p-3 rounded-2xl border border-blue-200 bg-[#f0f7ff] shadow-md space-y-2 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between text-blue-950 font-mono text-[10.5px] font-bold border-b border-blue-200/80 pb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>AI Workflow Suggestion</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsAiSuggestionExpanded(false)}
                          className="text-[9px] font-mono text-blue-600 hover:text-blue-800 hover:bg-blue-100/70 px-1.5 py-0.5 rounded transition-colors"
                        >
                          Collapse
                        </button>
                      </div>
                      <ul className="text-[9.5px] font-sans text-blue-950 space-y-1.5 leading-snug">
                        <li className="flex items-start gap-1">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>Factor skew indicates vol compression into FOMC; calibrate delta overlays.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>Maintain Barra beta neutrality (&lt;0.01) while scaling tech momentum.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>Pre-trade collar hedge staged to prevent single-sector limit breaches.</span>
                        </li>
                      </ul>
                    </div>
                  )}
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
                  <div className="flex items-center gap-2">
                    <Grid3X3 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-foreground">Cross-Agent Factor Covariance Matrix</span>
                    <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-800 border-emerald-300">
                      {matrixFactors.length} Factors Active
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Barra Multi-Asset Model · Equinix NY4</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse text-[10px]">
                    <thead>
                      <tr className="border-b border-border bg-slate-50">
                        <th className="p-1.5 text-left font-bold text-slate-700">Factor / Stream Name</th>
                        <th className="p-1.5 font-bold text-slate-700">Alpha Beta</th>
                        <th className="p-1.5 font-bold text-slate-700">Momentum</th>
                        <th className="p-1.5 font-bold text-slate-700">Vol Sensitivity</th>
                        <th className="p-1.5 font-bold text-slate-700">Corr (NY4)</th>
                        <th className="p-1.5 font-bold text-slate-700 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {matrixFactors.map((factor) => (
                        <tr key={factor.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-1.5 text-left font-semibold text-foreground flex items-center gap-1.5">
                            <span>{factor.name}</span>
                            {factor.isCustom && (
                              <span className="px-1 py-0.2 rounded text-[8px] bg-blue-100 text-blue-800 font-bold border border-blue-200">
                                Repository
                              </span>
                            )}
                          </td>
                          <td className="p-1.5 text-blue-600 font-bold">{factor.alphaBeta}</td>
                          <td className="p-1.5">{factor.momentum}</td>
                          <td className="p-1.5 text-emerald-700">{factor.volSensitivity}</td>
                          <td className="p-1.5 font-semibold text-slate-800">{factor.corrNY4}</td>
                          <td className="p-1.5 text-right">
                            {factor.isCustom ? (
                              <button
                                type="button"
                                onClick={() => handleRemoveMatrixFactor(factor.id)}
                                className="text-[9px] text-red-500 hover:text-red-700 hover:bg-red-50 px-1 py-0.5 rounded transition-colors"
                                title="Remove factor from covariance matrix"
                              >
                                Remove
                              </button>
                            ) : (
                              <span className="text-[9px] text-muted-foreground">Core</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 border-t border-border/80 flex items-center justify-between text-[9px] text-muted-foreground">
                  <span>Streamed from Barra Multiple-Horizon Risk Model &amp; NY4 Optical Feeds</span>
                  <span className="text-blue-600 font-semibold">Tip: Add more factors directly from the Repository tray below</span>
                </div>
              </div>
            )}

            {/* Governance & Escalation Hub view mode */}
            {viewMode === 'governance' && (
              <div className="w-full flex-1 min-h-[300px] rounded-xl border border-border bg-slate-50/50 p-3 overflow-y-auto font-mono text-xs space-y-4">
                
                {/* Top Governance & Autonomy Summary Header */}
                <div className="p-3 rounded-xl border border-border bg-white shadow-2xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                        <ShieldAlert className="w-4 h-4 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground">Human-in-the-Loop Governance &amp; Escalations Hub</h3>
                        <p className="text-[11px] font-sans text-muted-foreground">
                          Autonomous execution boundaries, pair conflict arbitration, telemetry failure step-downs, and human sign-off gates.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] bg-slate-50 border-border">
                        Model: {activeModel.name} ({activeModel.version})
                      </Badge>
                      <Badge className={`text-[10px] ${pendingEscalations.length > 0 ? 'bg-amber-600 text-white animate-pulse' : 'bg-emerald-600 text-white'}`}>
                        {pendingEscalations.length} Action{pendingEscalations.length === 1 ? '' : 's'} Required
                      </Badge>
                    </div>
                  </div>

                  {/* Autonomy breakdown grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200">
                      <div className="flex items-center justify-between text-[10px] text-emerald-800 font-semibold">
                        <span>Healthy / Grounded</span>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-base font-bold text-emerald-950 mt-0.5">{healthyCount} Nodes</div>
                      <span className="text-[9.5px] text-emerald-700 font-sans">Full Autonomous Execution</span>
                    </div>

                    <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200">
                      <div className="flex items-center justify-between text-[10px] text-amber-800 font-semibold">
                        <span>Degraded Feeds</span>
                        <Activity className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <div className="text-base font-bold text-amber-950 mt-0.5">{degradedCount} Nodes</div>
                      <span className="text-[9.5px] text-amber-700 font-sans">Stepped Down to Human Review</span>
                    </div>

                    <div className="p-2 rounded-lg bg-purple-50/70 border border-purple-200">
                      <div className="flex items-center justify-between text-[10px] text-purple-800 font-semibold">
                        <span>Quarantined / Drift</span>
                        <Lock className="w-3.5 h-3.5 text-purple-600" />
                      </div>
                      <div className="text-base font-bold text-purple-950 mt-0.5">{quarantinedCount} Nodes</div>
                      <span className="text-[9.5px] text-purple-700 font-sans">Signals Isolated (Observe Only)</span>
                    </div>

                    <div className="p-2 rounded-lg bg-rose-50/70 border border-rose-200">
                      <div className="flex items-center justify-between text-[10px] text-rose-800 font-semibold">
                        <span>Circuit Breakers</span>
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      </div>
                      <div className="text-base font-bold text-rose-950 mt-0.5">{breachedCount} Nodes</div>
                      <span className="text-[9.5px] text-rose-700 font-sans">VaR Limit / Emergency Freeze</span>
                    </div>
                  </div>
                </div>

                {/* Section 1: Awaiting Your Decision (Pending Escalations Queue) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      <h4 className="font-bold text-xs text-foreground uppercase tracking-wide">
                        Awaiting Your Decision ({pendingEscalations.length})
                      </h4>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      SEC 15c3-5 Pre-Trade Risk &amp; Autonomous Governance Standard
                    </span>
                  </div>

                  {pendingEscalations.length === 0 ? (
                    <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 text-center space-y-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
                        <Check className="w-4 h-4" />
                      </div>
                      <p className="font-bold text-xs text-emerald-950">
                        All Agent Nodes are Currently Grounded &amp; Compliant
                      </p>
                      <p className="text-[11px] font-sans text-emerald-800 max-w-md mx-auto">
                        No active circuit breaker trips, feed stalls, or conflicting trade signals require human intervention.
                      </p>
                      <button
                        type="button"
                        onClick={triggerLiveDegradationDemo}
                        disabled={isDemoRunning}
                        className="mt-1 px-3 py-1 rounded-lg text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Zap className="w-3 h-3 text-amber-600" />
                        <span>Simulate Live Degradation Incident</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {pendingEscalations.map((item) => (
                        <EscalationCard
                          key={item.id}
                          escalation={item}
                          onActionCommit={handleEscalationAction}
                          onNavigateToNode={(nodeId: string) => {
                            setSelectedNodeId(nodeId);
                            setViewMode('Node');
                            setRightTab('health');
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 2: Pair Conflict Arbitration Deep Dive */}
                <div className="p-3.5 rounded-xl border border-border bg-white shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-xs text-foreground">Cross-Agent Conflict Arbitration Console</h4>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">Arbitration Policy: Sharpe-Risk Pareto Frontier</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Agent A: Momentum */}
                    <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-blue-900">Agent Alpha: Momentum Arb</span>
                        <Badge className="bg-blue-600 text-white text-[9px]">LONG NVDA $14M</Badge>
                      </div>
                      <p className="text-[10.5px] text-blue-950 leading-relaxed font-sans">
                        Detected 15-minute lead-lag tick imbalance following TSMC supply chain revision. Forecasts +120 bps alpha over 4-hour horizon.
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono pt-1">
                        <div className="p-1.5 rounded bg-white border border-blue-200">
                          <span className="text-muted-foreground block text-[9px]">Sharpe Delta</span>
                          <span className="font-bold text-emerald-700">+0.22</span>
                        </div>
                        <div className="p-1.5 rounded bg-white border border-blue-200">
                          <span className="text-muted-foreground block text-[9px]">Confidence</span>
                          <span className="font-bold text-blue-800">89%</span>
                        </div>
                      </div>
                    </div>

                    {/* Agent B: Beta Neutral */}
                    <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-purple-900">Agent Risk: Beta-Neutral Overlay</span>
                        <Badge className="bg-purple-600 text-white text-[9px]">SHORT NVDA $10M</Badge>
                      </div>
                      <p className="text-[10.5px] text-purple-950 leading-relaxed font-sans">
                        Barra multi-factor beta model flags semiconductor sector concentration approaching hard portfolio VaR ceiling (1.25%).
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono pt-1">
                        <div className="p-1.5 rounded bg-white border border-purple-200">
                          <span className="text-muted-foreground block text-[9px]">VaR Impact</span>
                          <span className="font-bold text-purple-700">-0.18% (Safe)</span>
                        </div>
                        <div className="p-1.5 rounded bg-white border border-purple-200">
                          <span className="text-muted-foreground block text-[9px]">Confidence</span>
                          <span className="font-bold text-purple-800">92%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Human Arbitration Controls */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800">Arbitration Decision Choice:</span>
                      {isArbitrationCommitted && (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Decision Committed &amp; OMS Orders Synced
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setArbitrationChoice('split')}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          arbitrationChoice === 'split'
                            ? 'bg-blue-600 text-white border-blue-700 shadow-2xs font-bold'
                            : 'bg-white text-slate-800 border-border hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-[11px]">50/50 Compromise</span>
                        <span className={`block text-[9px] font-sans ${arbitrationChoice === 'split' ? 'text-blue-100' : 'text-muted-foreground'}`}>
                          Long $7M NVDA with partial collar
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setArbitrationChoice('momentum')}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          arbitrationChoice === 'momentum'
                            ? 'bg-blue-600 text-white border-blue-700 shadow-2xs font-bold'
                            : 'bg-white text-slate-800 border-border hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-[11px]">Prioritize Alpha</span>
                        <span className={`block text-[9px] font-sans ${arbitrationChoice === 'momentum' ? 'text-blue-100' : 'text-muted-foreground'}`}>
                          Execute full +$14M momentum signal
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setArbitrationChoice('beta_neutral')}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          arbitrationChoice === 'beta_neutral'
                            ? 'bg-blue-600 text-white border-blue-700 shadow-2xs font-bold'
                            : 'bg-white text-slate-800 border-border hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-[11px]">Prioritize Risk</span>
                        <span className={`block text-[9px] font-sans ${arbitrationChoice === 'beta_neutral' ? 'text-blue-100' : 'text-muted-foreground'}`}>
                          Enforce strict beta neutralization
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setArbitrationChoice('freeze')}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          arbitrationChoice === 'freeze'
                            ? 'bg-rose-600 text-white border-rose-700 shadow-2xs font-bold'
                            : 'bg-white text-slate-800 border-border hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-[11px]">Freeze Both</span>
                        <span className={`block text-[9px] font-sans ${arbitrationChoice === 'freeze' ? 'text-rose-100' : 'text-muted-foreground'}`}>
                          Block NVDA trades until re-anchored
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <input
                        type="text"
                        placeholder="Add optional portfolio manager rationale notes for compliance log..."
                        value={arbitrationCustomNotes}
                        onChange={(e) => setArbitrationCustomNotes(e.target.value)}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-lg border border-border bg-white text-foreground flex-1 mr-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          setIsArbitrationCommitted(true);
                          handleEscalationAction(
                            arbitrationChoice === 'split' ? 'SPLIT_ALLOCATION' : arbitrationChoice === 'momentum' ? 'EXECUTE_ALPHA' : arbitrationChoice === 'beta_neutral' ? 'NEUTRALIZE_RISK' : 'FREEZE_NODES',
                            'esc-pair-conflict-1',
                            arbitrationCustomNotes || `Arbitrated with choice: ${arbitrationChoice}`
                          );
                          setTimeout(() => setIsArbitrationCommitted(false), 3000);
                        }}
                        className="h-7 text-xs font-mono bg-blue-600 hover:bg-blue-700 text-white px-3 shrink-0"
                      >
                        <CheckCheck className="w-3.5 h-3.5 mr-1" />
                        <span>Commit Decision</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Section 3: Active Node Autonomy & Permissions Grid */}
                <div className="p-3.5 rounded-xl border border-border bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-xs text-foreground">Node Autonomy &amp; Permission Registry ({activeModel.name})</h4>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{activeModel.nodes.length} Nodes Registered</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="border-b border-border bg-slate-50 font-semibold text-slate-700">
                          <th className="p-2">Node Name</th>
                          <th className="p-2">Role</th>
                          <th className="p-2">Health</th>
                          <th className="p-2">Confidence</th>
                          <th className="p-2">Permission Level</th>
                          <th className="p-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {activeModel.nodes.map((node) => (
                          <tr key={node.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-2 font-bold text-foreground">
                              <div className="flex items-center gap-1.5">
                                <Bot className="w-3.5 h-3.5 text-blue-600" />
                                <span>{node.name}</span>
                              </div>
                            </td>
                            <td className="p-2 text-muted-foreground">{node.role || node.type}</td>
                            <td className="p-2">
                              <Badge className={`text-[9px] ${
                                node.health === 'BREACHED' ? 'bg-red-600 text-white' :
                                node.health === 'QUARANTINED' ? 'bg-purple-600 text-white' :
                                node.health === 'DEGRADED' ? 'bg-amber-600 text-white' :
                                'bg-emerald-600 text-white'
                              }`}>
                                {node.health || 'HEALTHY'}
                              </Badge>
                            </td>
                            <td className="p-2 font-mono font-bold">
                              {((node.confidence ?? 0.94) * 100).toFixed(0)}%
                            </td>
                            <td className="p-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                node.permissionLevel === 'Observe' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                                node.permissionLevel === 'Propose' || node.permissionLevel === 'Act with approval' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                                'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              }`}>
                                {node.permissionLevel || 'Autonomous'}
                              </span>
                            </td>
                            <td className="p-2 text-right space-x-1">
                              <button
                                type="button"
                                onClick={() => regroundNode(node.id)}
                                className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-semibold transition-all cursor-pointer"
                              >
                                Re-ground
                              </button>
                              <button
                                type="button"
                                onClick={() => restoreAutonomy(node.id)}
                                className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold transition-all cursor-pointer"
                              >
                                Restore
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* =========================================================================
              BOTTOM EXTENDABLE & SCROLLABLE ENTERPRISE RESOURCES & FIRM IDEAS REPOSITORY
              - Collapsed (compact 4-column quick tray) OR Expanded (rich scrollable repository)
              - Categories: All, Skills & Subagents, Code & Templates, Input Nodes, Risk & Compliance, Firm Ideas, Research Papers
              - Drag-and-drop onto canvas OR Add to Node / Matrix / Code
              - Search and filter across institutional repository
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
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>Enterprise Resources &amp; Ideas Repository</span>
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
                      placeholder="Filter repository..."
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
                <span className="text-[9px] text-emerald-700">Live synchronized with active model</span>
              </div>
            )}

            {/* Content Area: Scrollable resource cards grid */}
            <div className="flex-1 min-h-0 p-2 overflow-y-auto overflow-x-hidden font-mono">
              {filteredEnterpriseResources.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground text-xs">
                  <HelpCircle className="w-5 h-5 mb-1 text-slate-400" />
                  <span>No institutional repository items matching "{resourceSearchQuery}"</span>
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

                      {/* Action buttons footer with Add to Node / Matrix / Code options */}
                      <div className="pt-1.5 mt-1 border-t border-black/5 flex items-center justify-between gap-1">
                        <span className="text-[8px] text-slate-500 font-mono">
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
                              className="px-1.5 py-0.5 text-[8.5px] font-bold rounded bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-0.5 shadow-2xs cursor-pointer"
                              title="Create entire model from this idea"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Make Model</span>
                            </button>
                          ) : null}

                          {/* Dedicated Dropdown / Action Menu for Node / Matrix / Code */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveResourceActionMenu(activeResourceActionMenu === item.id ? null : item.id);
                              }}
                              className="px-1.5 py-0.5 text-[8.5px] font-bold rounded bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 flex items-center gap-1 shadow-2xs cursor-pointer"
                              title="Add to Node, Matrix, or Code"
                            >
                              <Plus className="w-2.5 h-2.5 text-blue-600" />
                              <span>Add to...</span>
                              <ChevronDown className="w-2 h-2 text-slate-500" />
                            </button>

                            {activeResourceActionMenu === item.id && (
                              <div 
                                className="absolute right-0 bottom-full mb-1 w-44 bg-white border border-border rounded-xl shadow-lg z-50 p-1 font-mono text-[10px] space-y-0.5 animate-in fade-in"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="px-2 py-1 text-[9px] font-bold text-muted-foreground border-b border-border/80 flex items-center justify-between">
                                  <span>Add to Target:</span>
                                  <button 
                                    type="button" 
                                    onClick={() => setActiveResourceActionMenu(null)}
                                    className="text-slate-400 hover:text-slate-700"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    handleAddResourceToNode(item, 'new');
                                    setActiveResourceActionMenu(null);
                                  }}
                                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-blue-50 text-blue-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Layers className="w-3 h-3 text-blue-600 shrink-0" />
                                  <div>
                                    <span className="font-bold block">DAG Node</span>
                                    <span className="text-[8px] text-muted-foreground block">Add as node in active model</span>
                                  </div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    handleAddResourceToNode(item, 'append');
                                    setActiveResourceActionMenu(null);
                                  }}
                                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-indigo-50 text-indigo-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Bot className="w-3 h-3 text-indigo-600 shrink-0" />
                                  <div>
                                    <span className="font-bold block">Attach to Selected Node</span>
                                    <span className="text-[8px] text-muted-foreground block">Attach to {selectedNode.name.slice(0, 14)}...</span>
                                  </div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    handleAddResourceToMatrix(item);
                                    setActiveResourceActionMenu(null);
                                  }}
                                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-emerald-50 text-emerald-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Grid3X3 className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <div>
                                    <span className="font-bold block">Factor Matrix</span>
                                    <span className="text-[8px] text-muted-foreground block">Stream into covariance matrix</span>
                                  </div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    handleAddResourceToCode(item);
                                    setActiveResourceActionMenu(null);
                                  }}
                                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-amber-50 text-amber-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Code2 className="w-3 h-3 text-amber-600 shrink-0" />
                                  <div>
                                    <span className="font-bold block">Python Code</span>
                                    <span className="text-[8px] text-muted-foreground block">Insert snippet into code editor</span>
                                  </div>
                                </button>
                              </div>
                            )}
                          </div>

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
                <span>Tip: Drag any item onto canvas, or use "Add to..." to wire into Node, Matrix, or Code</span>
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
            
            {/* Top Tabs matching sketch: [ Agent | Instructions | Code | Health ] + Sandbox */}
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
                <button
                  type="button"
                  onClick={() => setRightTab('health')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    rightTab === 'health'
                      ? selectedNode.health && selectedNode.health !== 'HEALTHY'
                        ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300 shadow-2xs'
                        : 'bg-blue-100 text-blue-900 font-bold border border-blue-300 shadow-2xs'
                      : selectedNode.health && selectedNode.health !== 'HEALTHY'
                      ? 'text-amber-700 hover:text-amber-900 font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  <span>Health</span>
                  {selectedNode.health && selectedNode.health !== 'HEALTHY' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setRightTab('escalations')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    rightTab === 'escalations'
                      ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300 shadow-2xs'
                      : pendingEscalations.length > 0
                      ? 'text-amber-700 hover:text-amber-900 font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ShieldAlert className="w-3 h-3 text-amber-600" />
                  <span>Decisions</span>
                  {pendingEscalations.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-mono leading-none">
                      {pendingEscalations.length}
                    </span>
                  )}
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

            {/* TAB CONTENT: HEALTH (Failure & Degradation Inspector) */}
            {rightTab === 'health' && (
              <div className="flex-1 min-h-0 overflow-y-auto font-mono text-xs space-y-3 pr-0.5">
                
                {/* Health Status Banner */}
                <div className={`p-3 rounded-xl border ${
                  selectedNode.health === 'BREACHED'
                    ? 'bg-red-50 border-red-300 text-red-950'
                    : selectedNode.health === 'QUARANTINED'
                    ? 'bg-purple-50 border-purple-300 text-purple-950'
                    : selectedNode.health === 'DEGRADED'
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}>
                  <div className="flex items-center justify-between pb-1.5 border-b border-black/10">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Health State:</span>
                    </div>
                    <Badge className={`text-[10px] font-bold ${
                      selectedNode.health === 'BREACHED'
                        ? 'bg-red-600 text-white'
                        : selectedNode.health === 'QUARANTINED'
                        ? 'bg-purple-600 text-white'
                        : selectedNode.health === 'DEGRADED'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {selectedNode.health || 'HEALTHY'}
                    </Badge>
                  </div>
                  
                  {selectedNode.failure ? (
                    <div className="mt-2 space-y-1">
                      <div className="text-[11px] font-bold text-slate-900">
                        {selectedNode.failure.kind.replace(/_/g, ' ')}
                      </div>
                      <p className="text-[10.5px] leading-relaxed opacity-90">
                        {selectedNode.failure.detail}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-[10.5px] opacity-90">
                      All live telemetry feeds and internal invariant checks passing. No degradation detected.
                    </p>
                  )}
                </div>

                {/* Confidence & Grounding Metrics */}
                <div className="p-2.5 rounded-xl border border-border bg-white space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground font-semibold">Model Confidence</span>
                    <span className={`font-bold ${
                      (selectedNode.confidence ?? 0.9) < 0.70 ? 'text-amber-600' : 'text-emerald-700'
                    }`}>
                      {((selectedNode.confidence ?? 0.94) * 100).toFixed(0)}% (Floor: 70%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        (selectedNode.confidence ?? 0.9) < 0.70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (selectedNode.confidence ?? 0.94) * 100)}%` }}
                    />
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Last Grounded</span>
                    <span className="font-semibold text-slate-800">
                      {selectedNode.lastGroundedAt 
                        ? `${Math.max(1, Math.floor((Date.now() - new Date(selectedNode.lastGroundedAt).getTime()) / 60000))}m ago` 
                        : 'Just now'}
                    </span>
                  </div>
                </div>

                {/* Autonomy Level & Step-down Reasoning */}
                <div className="p-2.5 rounded-xl border border-border bg-white space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground font-semibold">Autonomy Level</span>
                    <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                      selectedNode.permissionLevel === 'Observe'
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : selectedNode.permissionLevel === 'Propose' || selectedNode.permissionLevel === 'Act with approval'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}>
                      {selectedNode.permissionLevel || 'Autonomous'}
                    </span>
                  </div>

                  {selectedNode.failure?.autonomyBefore && (
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] space-y-1">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Prior Autonomy:</span>
                        <span className="font-semibold text-slate-800">
                          {selectedNode.failure.autonomyBefore}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Current Autonomy:</span>
                        <span className="font-semibold text-amber-800">
                          {selectedNode.failure.autonomyAfter}
                        </span>
                      </div>
                      <div className="pt-1 border-t border-slate-200 text-[9.5px] text-slate-700 leading-tight">
                        <span className="font-semibold">Reason: </span>
                        {selectedNode.failure.detail}
                      </div>
                    </div>
                  )}
                </div>

                {/* Blast Radius / Downstream Nodes */}
                {selectedNode.failure?.blastRadius && selectedNode.failure.blastRadius.length > 0 && (
                  <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-amber-900">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>Downstream Blast Radius:</span>
                    </div>
                    <p className="text-[10px] text-amber-800">
                      Unverified signals propagating to {selectedNode.failure.blastRadius.length} downstream node(s):
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {selectedNode.failure.blastRadius.map((downstreamId) => (
                        <button
                          key={downstreamId}
                          type="button"
                          onClick={() => setSelectedNodeId(downstreamId)}
                          className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-900 text-[9.5px] font-bold hover:bg-amber-100 transition-all flex items-center gap-1"
                        >
                          <span>{downstreamId}</span>
                          <span className="text-[8px] text-amber-600">↗</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Health Actions Grid */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10.5px] font-bold text-slate-800 block">Health Mitigation Actions</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => regroundNode(selectedNode.id)}
                      className="h-8 text-xs font-mono font-bold bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200 gap-1 rounded-xl shadow-2xs"
                    >
                      <RotateCw className="w-3 h-3 text-blue-600" />
                      <span>Re-ground now</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => restoreAutonomy(selectedNode.id)}
                      disabled={selectedNode.health !== 'HEALTHY'}
                      className="h-8 text-xs font-mono font-bold bg-white text-slate-800 hover:bg-slate-50 border-border gap-1 rounded-xl shadow-2xs disabled:opacity-40"
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Restore Autonomy</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => pauseNode(selectedNode.id)}
                      className="h-8 text-xs font-mono font-bold bg-purple-50 text-purple-900 hover:bg-purple-100 border-purple-200 gap-1 rounded-xl shadow-2xs"
                    >
                      <Sliders className="w-3 h-3 text-purple-600" />
                      <span>Pause Node</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handToHuman(selectedNode.id)}
                      className="h-8 text-xs font-mono font-bold bg-amber-50 text-amber-900 hover:bg-amber-100 border-amber-200 gap-1 rounded-xl shadow-2xs"
                    >
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>Hand to Human</span>
                    </Button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: ESCALATIONS / DECISIONS */}
            {rightTab === 'escalations' && (
              <div className="flex-1 min-h-0 overflow-y-auto font-mono text-xs space-y-3 pr-0.5">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Awaiting Decision ({pendingEscalations.length})</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-900 border-amber-300">
                    Human Oversight Gate
                  </Badge>
                </div>

                {pendingEscalations.length === 0 ? (
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 text-center space-y-2 my-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <p className="font-bold text-xs text-emerald-950">No Pending Escalations</p>
                    <p className="text-[10px] font-sans text-emerald-800">
                      All agents are running within safe autonomy thresholds.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingEscalations.map((item) => (
                      <EscalationCard
                        key={item.id}
                        escalation={item}
                        onActionCommit={handleEscalationAction}
                        onNavigateToNode={(nodeId: string) => {
                          setSelectedNodeId(nodeId);
                          setRightTab('health');
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode('governance')}
                    className="w-full h-7 text-xs font-mono text-blue-700 bg-blue-50/50 hover:bg-blue-100 border-blue-200 rounded-lg gap-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Open Full Governance Console</span>
                  </Button>
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

                  {/* Custom Builder Solid Blue Response Box matching screenshot */}
                  <div className="bg-[#2563eb] text-white rounded-xl p-3.5 shadow-sm font-mono text-xs min-h-[95px] flex flex-col justify-between leading-relaxed select-text">
                    <p className="whitespace-pre-wrap">{builderResponse}</p>
                    {isBuildingResponse && (
                      <span className="text-[10px] text-blue-200 animate-pulse pt-1 block">
                        Calibrating agent parameters...
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Prompt Bar with Send Arrow matching screenshot: [                             ➤ ] */}
                <div className="pt-2 shrink-0">
                  <div className="relative flex items-center bg-white border border-border rounded-xl shadow-2xs focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                    <input
                      type="text"
                      value={customPromptInput}
                      onChange={(e) => setCustomPromptInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendCustomPrompt();
                        }
                      }}
                      placeholder=""
                      className="w-full py-2 pl-3 pr-9 text-xs font-mono bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleSendCustomPrompt}
                      disabled={isBuildingResponse}
                      className="absolute right-2 p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Send prompt to Agent Custom Builder"
                    >
                      <Send className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                    </button>
                  </div>
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

      {/* ARBITRATION MODAL FOR CONFLICT ESCALATION */}
      {arbitrationEscalation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-border shadow-2xl p-4 font-mono space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-red-600" />
                <span className="font-bold text-sm text-foreground">Conflict Arbitration: {arbitrationEscalation.conflictData?.position || arbitrationEscalation.nodeName}</span>
              </div>
              <button
                type="button"
                onClick={() => setArbitrationEscalation(null)}
                className="text-muted-foreground hover:text-foreground text-xs p-1"
              >
                ✕
              </button>
            </div>

            <EscalationCard
              escalation={arbitrationEscalation}
              onActionCommit={(actionName: string, escalationId: string, notes?: string) => {
                handleEscalationAction(actionName, escalationId, notes);
                setArbitrationEscalation(null);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};
