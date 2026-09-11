import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  X, 
  RefreshCw,
  Sparkles,
  History,
  Terminal,
  GitMerge,
  ChevronDown,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface AgentCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand?: (cmd: string) => void;
  initialQuery?: string;
}

interface CommandMessage {
  id: string;
  sender: 'user' | 'agent';
  agentType?: 'parent' | 'sub';
  text: string;
  metrics?: { label: string; value: string; positive?: boolean }[];
  actionLabel?: string;
  actionCommand?: string;
}

export const AgentCommandModal: React.FC<AgentCommandModalProps> = ({
  isOpen,
  onClose,
  onExecuteCommand,
  initialQuery = '',
}) => {
  const [inputText, setInputText] = useState<string>(initialQuery);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Top-right dropdown for Version History & details
  const [showVersionHistory, setShowVersionHistory] = useState<boolean>(false);
  const [historyTab, setHistoryTab] = useState<'versions' | 'logs' | 'merge'>('versions');
  const [selectedVersion, setSelectedVersion] = useState<string>('v4.2-Production (Active)');

  const [messages, setMessages] = useState<CommandMessage[]>([
    {
      id: 'init-1',
      sender: 'user',
      text: 'Analyze current portfolio VaR and suggest risk hedges',
    },
    {
      id: 'init-2',
      sender: 'agent',
      agentType: 'parent',
      text: 'Parent Agent evaluated active allocation across equity holdings. Delegated risk analysis to Sub-Agent (Delta Risk Neutralizer). Formulated short index futures overlay to mitigate market beta.',
      metrics: [
        { label: 'Daily VaR (95%)', value: '1.14%', positive: true },
        { label: 'Risk Limit', value: '<1.50%', positive: true },
        { label: 'Gross Leverage', value: '184%', positive: false },
        { label: 'Total Gain', value: 'Rs. 810M (+18%)', positive: true },
      ],
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync initial query when opened
  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        setInputText(initialQuery);
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
    }
  }, [isOpen, initialQuery]);

  // Scroll to bottom of message list on updates
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowVersionHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSendQuery = (queryText: string) => {
    if (!queryText.trim() || isProcessing) return;

    const userQuery = queryText.trim();
    const userMsg: CommandMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userQuery,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    const lower = userQuery.toLowerCase();
    setTimeout(() => {
      let responseText = '';
      let agentMode: 'parent' | 'sub' = 'parent';
      let metrics: { label: string; value: string; positive?: boolean }[] | undefined;

      if (lower.includes('hedge') || lower.includes('beta') || lower.includes('risk') || lower.includes('var')) {
        agentMode = 'sub';
        responseText = 
          'Risk Sub-Agent activated: Simulated short S&P 500 mini futures contract overlay. Portfolio delta reduced by 24%, stabilizing VaR from 1.28% down to 1.14%. Zero margin call risk detected. Allocation orders ready for OMS execution.';
        metrics = [
          { label: 'Delta Hedged', value: '-24% Beta', positive: true },
          { label: 'New VaR', value: '1.14%', positive: true },
          { label: 'Hedging Cost', value: '0.02%', positive: false },
          { label: 'Margin Buffer', value: '99.4%', positive: true },
        ];
      } else if (lower.includes('rebalance') || lower.includes('weight') || lower.includes('optimize') || lower.includes('momentum')) {
        agentMode = 'parent';
        responseText = 
          'Parent Allocation Agent executed Markowitz quadratic optimization. Trimmed overweighted technology exposure (-2.5% NVDA) into cash and defensive industrials (+1.8% UNH, +0.7% JPM). Expected Sharpe updated to 2.74.';
        metrics = [
          { label: 'Turnover', value: '3.2%', positive: false },
          { label: 'Expected Sharpe', value: '2.74', positive: true },
          { label: 'Tracking Error', value: '1.08%', positive: true },
          { label: 'Total Gain', value: 'Rs. 810M (+18%)', positive: true },
        ];
      } else if (lower.includes('gate') || lower.includes('compliance') || lower.includes('audit')) {
        agentMode = 'sub';
        responseText = 
          'Compliance Sub-Agent validated all 4 pre-trade progress gates: SEC Rule 15c3-5, single-name concentration ceiling (<10%), and FIX router health verified with 0.08 ms latency. No audit violations found.';
        metrics = [
          { label: 'Progress Gates', value: '4/4 PASSED', positive: true },
          { label: 'Latency', value: '0.08 ms', positive: true },
          { label: 'Sanctions Check', value: 'CLEARED', positive: true },
        ];
      } else {
        agentMode = 'parent';
        responseText = 
          `Parent Agent processed instruction: "${userQuery}". Evaluated cross-fund covariance matrix, calibrated factor risk models with colocation NY4 feed, and verified capital thresholds.`;
        metrics = [
          { label: 'Execution State', value: 'SUCCESS', positive: true },
          { label: 'Sync Status', value: 'LIVE', positive: true },
          { label: 'Parent DAG Status', value: 'MERGED', positive: true },
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          agentType: agentMode,
          text: responseText,
          metrics,
        },
      ]);
      setIsProcessing(false);

      if (onExecuteCommand) {
        onExecuteCommand(userQuery);
      }
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendQuery(inputText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Dimmed backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Main Command Modal Card matching wireframe image */}
      <Card className="relative w-full max-w-2xl bg-white border-2 border-blue-400/60 rounded-2xl shadow-2xl z-10 flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-150 p-0 gap-0">
        
        {/* =========================================================================
            HEADER BAR: Clean & minimal matching wireframe
            Left: "parent agent called" rounded pill
            Right: Version History dropdown & Circular Close button
           ========================================================================= */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border bg-white gap-2">
          {/* Top Left: "parent agent called" wireframe pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-400/60 bg-white text-blue-700 font-mono text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>parent agent called</span>
          </div>

          {/* Top Right: Version history & Circular Close */}
          <div className="flex items-center gap-2" ref={dropdownRef}>
            {/* Version History Dropdown */}
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                className="h-7 text-[11px] font-mono gap-1 px-2.5 border-border bg-white hover:bg-slate-50 text-foreground shadow-none"
                title="View agent version history"
              >
                <History className="w-3 h-3 text-blue-600" />
                <span>Version History</span>
                <ChevronDown className="w-2.5 h-2.5 text-muted-foreground" />
              </Button>

              {/* Version History & Diagnostics Popover */}
              {showVersionHistory && (
                <div className="absolute right-0 top-full mt-1.5 w-72 bg-white border border-border rounded-xl shadow-xl z-50 p-3 text-xs animate-in fade-in-50">
                  <div className="flex items-center justify-between pb-2 border-b border-border mb-2.5">
                    <span className="font-bold text-foreground font-mono">Agent Environment</span>
                    <Badge variant="outline" className="text-[9px] bg-white text-emerald-700 border-emerald-300">
                      LIVE
                    </Badge>
                  </div>

                  {/* Sub-tabs for detailed inspection */}
                  <div className="flex items-center gap-1 mb-2.5 p-0.5 bg-white border border-border rounded-lg text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setHistoryTab('versions')}
                      className={`flex-1 py-1 rounded-md transition-colors ${historyTab === 'versions' ? 'bg-primary text-primary-foreground font-bold shadow-2xs' : 'text-muted-foreground hover:text-foreground hover:bg-slate-50'}`}
                    >
                      Versions
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryTab('logs')}
                      className={`flex-1 py-1 rounded-md transition-colors ${historyTab === 'logs' ? 'bg-primary text-primary-foreground font-bold shadow-2xs' : 'text-muted-foreground hover:text-foreground hover:bg-slate-50'}`}
                    >
                      Parent Logs
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryTab('merge')}
                      className={`flex-1 py-1 rounded-md transition-colors ${historyTab === 'merge' ? 'bg-primary text-primary-foreground font-bold shadow-2xs' : 'text-muted-foreground hover:text-foreground hover:bg-slate-50'}`}
                    >
                      Merge Props
                    </button>
                  </div>

                  {historyTab === 'versions' && (
                    <div className="space-y-1.5">
                      {[
                        { ver: 'v4.2-Production (Active)', date: 'Today, 18:40', notes: 'Integrated Gemini reasoning + delta hedge overlay', current: true },
                        { ver: 'v4.1-RiskOptimizer', date: 'Yesterday', notes: 'Markowitz quadratic factor covariance matrices', current: false },
                        { ver: 'v4.0-BaselineFIX', date: 'Sep 06', notes: 'Colocation order router & pre-trade gates', current: false },
                      ].map((v) => (
                        <div
                          key={v.ver}
                          onClick={() => {
                            setSelectedVersion(v.ver);
                            setShowVersionHistory(false);
                          }}
                          className={`p-2 rounded-lg cursor-pointer border transition-colors ${
                            v.current
                              ? 'bg-blue-50/70 border-blue-400/60 text-foreground'
                              : 'bg-white border-border hover:bg-slate-50 text-muted-foreground'
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono font-bold text-[11px]">
                            <span>{v.ver}</span>
                            <span className="text-[10px] text-muted-foreground">{v.date}</span>
                          </div>
                          <p className="text-[10px] mt-0.5 leading-snug">{v.notes}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {historyTab === 'logs' && (
                    <div className="space-y-1 text-[10px] font-mono leading-relaxed text-muted-foreground max-h-48 overflow-y-auto p-1 bg-white">
                      <p><span className="text-blue-600">[10:42:01.002]</span> Orchestrator loop initialized.</p>
                      <p><span className="text-blue-600">[10:42:01.034]</span> Subscribed to NY4 pricing feed.</p>
                      <p><span className="text-emerald-600">[10:42:01.120]</span> Dispatched sub-agent DAG task.</p>
                      <p><span className="text-emerald-600">[10:42:01.214]</span> DAG execution branch merged.</p>
                      <p><span className="text-blue-600">[10:42:01.240]</span> 4/4 compliance gates cleared.</p>
                    </div>
                  )}

                  {historyTab === 'merge' && (
                    <div className="space-y-1.5 text-[10px] font-mono max-h-48 overflow-y-auto p-1">
                      <div className="p-1.5 rounded bg-white border border-border">
                        <span className="text-muted-foreground block text-[9px]">Policy:</span>
                        <span className="font-semibold text-foreground">Factor Covariance Union</span>
                      </div>
                      <div className="p-1.5 rounded bg-white border border-border">
                        <span className="text-muted-foreground block text-[9px]">Conflict Rule:</span>
                        <span className="font-semibold text-foreground">Highest Sharpe Weighting</span>
                      </div>
                      <div className="p-1.5 rounded bg-white border border-border">
                        <span className="text-muted-foreground block text-[9px]">Gate Constraint:</span>
                        <span className="font-semibold text-emerald-600">Daily VaR &lt; 1.50%</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Circular Close Button matching wireframe ○ */}
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full border border-border bg-white flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-slate-50 transition-colors"
              aria-label="Close"
              title="Close frame"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            MODAL BODY: Clean wireframe layout
            Right: "prompt" blue bubble
            Below: "Agent response" large rounded container
           ========================================================================= */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 min-h-[300px] max-h-[500px] flex-1 bg-white">
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              // Right-aligned blue pill matching wireframe [ prompt ]
              return (
                <div key={msg.id} className="flex flex-col items-end my-2">
                  <div className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-mono rounded-2xl px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium shadow-xs max-w-[85%] text-right">
                    {msg.text}
                  </div>
                </div>
              );
            }

            // Central / Left rounded container matching wireframe [ Agent response ]
            return (
              <div key={msg.id} className="flex flex-col items-start my-2 w-full">
                {/* Large rounded box with clean wireframe border */}
                <div className="w-full rounded-2xl border-2 border-blue-400/50 bg-white p-4 sm:p-5 text-xs sm:text-sm font-mono leading-relaxed transition-all shadow-xs space-y-3">
                  <div className="font-semibold text-blue-600 text-xs font-mono">
                    Agent response
                  </div>

                  <div className="whitespace-pre-line text-foreground">
                    {msg.text}
                  </div>

                  {/* Metrics chips */}
                  {msg.metrics && msg.metrics.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border">
                      {msg.metrics.map((m, i) => (
                        <div key={i} className="p-2 rounded-lg bg-white border border-border text-[11px] shadow-2xs">
                          <span className="text-[10px] text-muted-foreground block">{m.label}</span>
                          <span className={`font-bold font-mono text-xs ${m.positive ? 'text-emerald-700' : 'text-foreground'}`}>
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions row */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Risk Gates Verified</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSendQuery('Rebalance portfolio now')}
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5"
                    >
                      <span>Simulate in OMS</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs font-mono text-blue-600 py-2 px-1">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Parent Agent evaluating portfolio parameters and compiling response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* =========================================================================
            BOTTOM INPUT BAR: Matching wireframe [ Type here             ↗ ]
           ========================================================================= */}
        <div className="p-3 sm:p-4 border-t border-border bg-white">
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <Input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type here"
                className="w-full font-mono text-xs sm:text-sm h-10 pl-3.5 pr-10 bg-white border-2 border-blue-400/50 rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-blue-400 shadow-2xs"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isProcessing}
                className="absolute right-2 p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 disabled:opacity-40 transition-colors"
                title="Submit command"
              >
                <ArrowUpRight className="w-4 h-4 text-blue-600" />
              </button>
            </div>

            <Button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              size="default"
              className="h-10 px-4 shrink-0 font-mono font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>

      </Card>
    </div>
  );
};
