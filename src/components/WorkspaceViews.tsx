import React from 'react';
import { ViewTab, WorkspaceModel } from '../types';
import { 
  Database, 
  Bot, 
  GitBranch, 
  FileText, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Download,
  Play,
  Settings2,
  ShieldCheck
} from 'lucide-react';
import { AgentWorkspaceView } from './AgentWorkspaceView';
import { DataRepositoryView } from './DataRepositoryView';
import { AuditLogView } from './AuditLogView';

interface WorkspaceViewsProps {
  activeTab: ViewTab;
  onNavigateToOverview: () => void;
  onOpenAgentModal: (query?: string) => void;
  onSelectTab?: (tab: ViewTab) => void;
  importedModel?: WorkspaceModel | null;
  onClearImportedModel?: () => void;
}

export const WorkspaceViews: React.FC<WorkspaceViewsProps> = ({
  activeTab,
  onNavigateToOverview,
  onOpenAgentModal,
  onSelectTab,
  importedModel,
  onClearImportedModel,
}) => {
  if (activeTab === 'repository') {
    return (
      <DataRepositoryView
        onNavigateToOverview={onNavigateToOverview}
        onOpenAgentModal={onOpenAgentModal}
        onSelectTab={onSelectTab}
      />
    );
  }

  if (activeTab === 'agent-builder') {
    return (
      <AgentWorkspaceView 
        activeTab={activeTab} 
        importedModel={importedModel}
        onClearImportedModel={onClearImportedModel}
      />
    );
  }

  if (activeTab === 'progress-gate') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight font-mono">Progress Gate</h2>
            <p className="text-xs text-muted-foreground">Pre-trade regulatory compliance gates and risk approval checkpoints.</p>
          </div>
          <button onClick={onNavigateToOverview} className="text-xs font-mono text-primary hover:underline">
            ← Back to Overview
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          {[
            { gate: 'Gate 1: Portfolio VaR Limit (<1.50%)', status: 'PASSED', val: '1.14% Current' },
            { gate: 'Gate 2: Single-Name Concentration (<10%)', status: 'PASSED', val: '8.4% Max (NVDA)' },
            { gate: 'Gate 3: FIX Order Router Pre-Trade Check', status: 'VERIFIED', val: '0.08 ms latency' },
            { gate: 'Gate 4: SEC Rule 15c3-5 Market Access', status: 'APPROVED', val: 'DMA Validated' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border bg-white">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium text-foreground">{item.gate}</span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'audit-log') {
    return (
      <AuditLogView
        onNavigateToOverview={onNavigateToOverview}
        onOpenAgentModal={onOpenAgentModal}
        onSelectTab={onSelectTab}
      />
    );
  }

  if (activeTab === 'reporting') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight font-mono">Reporting</h2>
            <p className="text-xs text-muted-foreground">Investor factsheets, factor attributions, and daily performance statements.</p>
          </div>
          <button onClick={onNavigateToOverview} className="text-xs font-mono text-primary hover:underline">
            ← Back to Overview
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="font-bold text-xs text-foreground">Monthly Institutional Factsheet</div>
            <p className="text-xs text-muted-foreground">Audited returns, Sharpe 2.68, Sortino 3.42, gross exposure 184%.</p>
            <button className="px-3 py-1.5 rounded bg-white hover:bg-slate-50 border border-border text-xs font-mono flex items-center gap-1.5 text-foreground">
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Download PDF Factsheet</span>
            </button>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="font-bold text-xs text-foreground">Risk Attribution Breakdown</div>
            <p className="text-xs text-muted-foreground">Barra multi-factor decomposition: Momentum (+14.2%), Quality (+6.8%).</p>
            <button className="px-3 py-1.5 rounded bg-white hover:bg-slate-50 border border-border text-xs font-mono flex items-center gap-1.5 text-foreground">
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Export CSV Factor Attributions</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
