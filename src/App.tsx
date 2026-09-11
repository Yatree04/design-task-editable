import React, { useState, useEffect } from 'react';
import { MOCK_FUNDS, MOCK_TRADE_BLOTTER } from './data/mockFunds';
import { Fund, Holding, TradeOrder, ViewTab, WorkspaceModel } from './types';
import { SidePanel } from './components/SidePanel';
import { TopCommandBar } from './components/TopCommandBar';
import { TopTickerStrip } from './components/TopTickerStrip';
import { OverviewView } from './components/OverviewView';
import { HoldingsView } from './components/HoldingsView';
import { StressTestingView } from './components/StressTestingView';
import { AllocationOptimizerView } from './components/AllocationOptimizerView';
import { TradeBlotterModal } from './components/TradeBlotterModal';
import { AgentCommandModal } from './components/AgentCommandModal';
import { WorkspaceViews } from './components/WorkspaceViews';

export const App: React.FC = () => {
  const [funds, setFunds] = useState<Fund[]>(MOCK_FUNDS);
  const [selectedFundId, setSelectedFundId] = useState<string>('des-oculus');
  const [activeTab, setActiveTab] = useState<ViewTab>(() => {
    const saved = localStorage.getItem('deshaw_active_tab');
    return (saved as ViewTab) || 'overview';
  });

  const [importedModel, setImportedModel] = useState<WorkspaceModel | null>(null);

  useEffect(() => {
    localStorage.setItem('deshaw_active_tab', activeTab);
  }, [activeTab]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [orders, setOrders] = useState<TradeOrder[]>(MOCK_TRADE_BLOTTER);
  const [isBlotterOpen, setIsBlotterOpen] = useState<boolean>(false);
  const [isMobileSidePanelOpen, setIsMobileSidePanelOpen] = useState<boolean>(false);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState<boolean>(false);
  const [agentInitialQuery, setAgentInitialQuery] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const handleOpenAgentModal = (initialQuery?: string) => {
    if (initialQuery !== undefined) {
      setAgentInitialQuery(initialQuery);
    }
    setIsAgentModalOpen(true);
  };

  // Auto-collapse navigation sidebar when navigating to workspace or repository so repository sits flush beside the collapsed rail
  useEffect(() => {
    if (activeTab === 'agent-builder' || activeTab === 'repository') {
      setIsSidebarCollapsed(true);
    }
  }, [activeTab]);

  // Global keydown listener for Ctrl key to open Agent Command Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if modal is already open
      if (isAgentModalOpen) return;

      // If user presses the Control key, or Ctrl+K / Cmd+K
      if (e.key === 'Control' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        setIsAgentModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAgentModalOpen]);

  const selectedFund = funds.find((f) => f.id === selectedFundId) || funds[0];

  const handleAddHolding = (newHolding: Holding, order: TradeOrder) => {
    setFunds((prevFunds) =>
      prevFunds.map((f) => {
        if (f.id !== selectedFund.id) return f;
        const updatedHoldings = [newHolding, ...f.holdings];
        const addedValueMillions = newHolding.marketValue / 1000000;
        const newAum = f.aumMillions + (newHolding.side === 'Long' ? addedValueMillions : 0);
        return {
          ...f,
          holdings: updatedHoldings,
          aumMillions: Number(newAum.toFixed(1)),
        };
      })
    );

    setOrders((prev) => [order, ...prev]);
    setIsSimulating(true);
  };

  const handleRemoveHolding = (holdingId: string) => {
    const target = selectedFund.holdings.find((h) => h.id === holdingId);
    if (!target) return;

    setFunds((prevFunds) =>
      prevFunds.map((f) => {
        if (f.id !== selectedFund.id) return f;
        return {
          ...f,
          holdings: f.holdings.filter((h) => h.id !== holdingId),
        };
      })
    );

    const liquidationOrder: TradeOrder = {
      id: `ord-liq-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      fundId: selectedFund.id,
      ticker: target.ticker,
      name: `${target.name} Liquidation`,
      side: target.side === 'Long' ? 'SELL' : 'BUY',
      shares: target.shares,
      targetPrice: target.price,
      status: 'EXECUTED',
      rationale: `Manual liquidation from Holdings & Risk blotter`,
    };

    setOrders((prev) => [liquidationOrder, ...prev]);
  };

  const handleExecuteHedge = (order: TradeOrder) => {
    setOrders((prev) => [order, ...prev]);
    setIsSimulating(true);
  };

  const handleCommitRebalance = (newOrders: TradeOrder[]) => {
    setOrders((prev) => [...newOrders, ...prev]);
    setIsSimulating(true);
  };

  const handleExecuteAllSimulated = () => {
    setOrders((prev) =>
      prev.map((o) => (o.status === 'SIMULATED' ? { ...o, status: 'EXECUTED' } : o))
    );
  };

  const handleClearOrders = () => {
    setOrders([]);
  };

  const isStandardWorkspaceView = [
    'repository',
    'agent-builder',
    'progress-gate',
    'audit-log',
    'reporting'
  ].includes(activeTab);

  const handleExperimentInAgentWorkspace = (strategy: any) => {
    const newModel: WorkspaceModel = {
      id: `model-${Date.now()}`,
      name: strategy.title.length > 28 ? `${strategy.title.slice(0, 26)}...` : strategy.title,
      tag: 'AI Strategy',
      version: 'v1.0-exp',
      description: strategy.description,
      nodes: strategy.suggestedNodes && strategy.suggestedNodes.length > 0 ? strategy.suggestedNodes : [
        {
          id: `node-parent-${Date.now()}`,
          name: `${strategy.title.slice(0, 22)} Parent`,
          type: 'parent',
          role: 'Parent Orchestrator',
          status: 'ACTIVE',
          inputs: 'Macro statements, tick stream, implied vol surface',
          outputLink: 'Execution Sub-Agent (Terminal Node)',
          instructions: strategy.description,
          defaultProperty: 'Highest Sharpe Weighting',
          codeSnippet: `# AI RESEARCH SYNTHESIZED MODEL
class SynthesizedModel(QuantParentAgent):
    def __init__(self):
        super().__init__(name="${strategy.title}")
        self.expected_alpha = "${strategy.offerings?.expectedAlpha || '+3.4%'}"
        
    def execute(self, market_data):
        return self.optimize_sharpe_frontier()`,
          tools: ['Macro Feeder', 'Barra API', 'Execution Gate'],
          latency: '14ms',
          x: 30,
          y: 110
        }
      ],
      targetVol: strategy.parameters?.targetVol || 13,
      maxPosition: strategy.parameters?.maxPosition || 10,
      varLimit: strategy.parameters?.varLimit || 1.15,
      expectedSharpe: parseFloat(strategy.offerings?.sharpeImpact?.split('→')[1]) || 2.18,
      expectedReturn: parseFloat(strategy.offerings?.expectedAlpha?.replace(/[^0-9.]/g, '')) || 16.2,
      color: '#3b82f6',
      originStrategy: strategy.title,
      ideaBenefits: [
        strategy.offerings?.expectedAlpha,
        strategy.offerings?.sharpeImpact,
        strategy.offerings?.varImpact,
        strategy.offerings?.keyEdge,
      ].filter(Boolean),
    };

    setImportedModel(newModel);
    setActiveTab('agent-builder');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-row selection:bg-primary/20 selection:text-primary transition-colors duration-200">
      {/* Left: Collapsible Side Panel matching screenshot */}
      <SidePanel
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        funds={funds}
        selectedFundId={selectedFundId}
        onSelectFund={(id) => setSelectedFundId(id)}
        isOpenMobile={isMobileSidePanelOpen}
        onCloseMobile={() => setIsMobileSidePanelOpen(false)}
        onOpenSettings={() => setIsAgentModalOpen(true)}
        onOpenHelp={() => setIsAgentModalOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Permanent Top Command Bar matching wireframe across all screens */}
        <TopCommandBar
          onToggleMobileSidePanel={() => setIsMobileSidePanelOpen(true)}
          onExportStatus={() => {
            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 2500);
          }}
          onSelectTab={setActiveTab}
          onSearchTicker={(t) => {
            setSearchQuery(t);
            setActiveTab('holdings');
          }}
          onOpenAgentModal={handleOpenAgentModal}
          exportSuccess={exportSuccess}
        />

        {/* Top Ticker Strip matching screenshot */}
        <TopTickerStrip
          onOpenMobileMenu={() => setIsMobileSidePanelOpen(true)}
          onSelectTicker={(t) => {
            setSearchQuery(t);
            setActiveTab('holdings');
          }}
        />

        {/* Main Dashboard Canvas */}
        <main
          className={`flex-1 min-h-0 w-full ${
            activeTab === 'agent-builder' || activeTab === 'repository'
              ? 'p-2 sm:p-2.5 overflow-hidden flex flex-col'
              : 'px-3 sm:px-5 py-3 sm:py-4 overflow-y-auto'
          }`}
        >
          {activeTab === 'overview' && (
            <OverviewView
              fund={selectedFund}
              isSimulating={isSimulating}
              onNavigateToOptimizer={() => setActiveTab('optimizer')}
              onNavigateToScenarios={() => setActiveTab('scenarios')}
              onNavigateToHoldings={() => setActiveTab('holdings')}
              currency={currency}
              searchQuery={searchQuery}
              onSelectHolding={() => setActiveTab('holdings')}
              onExperimentInAgentWorkspace={handleExperimentInAgentWorkspace}
              onExecuteAgentCommand={(cmd) => {
                if (cmd.toLowerCase().includes('holdings')) setActiveTab('holdings');
                else if (cmd.toLowerCase().includes('stress')) setActiveTab('scenarios');
                else if (cmd.toLowerCase().includes('optimi')) setActiveTab('optimizer');
                else setIsAgentModalOpen(true);
              }}
            />
          )}

          {isStandardWorkspaceView && (
            <WorkspaceViews
              activeTab={activeTab}
              onNavigateToOverview={() => setActiveTab('overview')}
              onOpenAgentModal={handleOpenAgentModal}
              onSelectTab={(tab) => setActiveTab(tab)}
              importedModel={importedModel}
              onClearImportedModel={() => setImportedModel(null)}
            />
          )}

          {activeTab === 'holdings' && (
            <HoldingsView
              fund={selectedFund}
              onAddHolding={handleAddHolding}
              onRemoveHolding={handleRemoveHolding}
            />
          )}

          {activeTab === 'scenarios' && (
            <StressTestingView
              fund={selectedFund}
              onExecuteHedge={handleExecuteHedge}
            />
          )}

          {activeTab === 'optimizer' && (
            <AllocationOptimizerView
              funds={funds}
              onCommitRebalance={handleCommitRebalance}
              onExperimentInAgentWorkspace={handleExperimentInAgentWorkspace}
            />
          )}
        </main>
      </div>

      {/* Trade Blotter (OMS) Modal */}
      <TradeBlotterModal
        isOpen={isBlotterOpen}
        onClose={() => setIsBlotterOpen(false)}
        orders={orders}
        onExecuteAllSimulated={handleExecuteAllSimulated}
        onClearOrders={handleClearOrders}
      />

      {/* Agent Command Modal */}
      <AgentCommandModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        initialQuery={agentInitialQuery}
        onExecuteCommand={(cmd) => {
          if (cmd.toLowerCase().includes('holdings')) setActiveTab('holdings');
          if (cmd.toLowerCase().includes('stress')) setActiveTab('scenarios');
          if (cmd.toLowerCase().includes('optimi')) setActiveTab('optimizer');
        }}
      />
    </div>
  );
};

export default App;
