import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  PauseCircle, 
  UserCheck, 
  HelpCircle, 
  ArrowRight, 
  Scale, 
  Bot, 
  Sparkles, 
  Layers, 
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { NodeFailure } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export interface EscalationItem {
  id: string;
  nodeId: string;
  nodeName: string;
  modelName: string;
  severity: 'BREACH' | 'DEGRADED' | 'QUARANTINED' | 'CONFLICT';
  failureKind: string;
  age: string;
  title: string;
  observed: {
    source: string;
    timestamp: string;
    fact: string;
  };
  whyItMatters: {
    limitOrMandate: string;
    implication: string;
  };
  alreadyDone: {
    action: string;
    authorityLevel: string;
    timestamp: string;
  };
  recommendation: {
    proposedAction: string;
    confidence: number;
    rationale: string;
  };
  defaultAction: {
    namedAction: string;
    timeoutSeconds: number;
    countdown: number;
    ruleDescription: string;
  };
  conflictData?: {
    position: string;
    currentValue: string;
    agentA: {
      name: string;
      role: string;
      recommendation: string;
      confidence: number;
      evidence: string;
      source: string;
    };
    agentB: {
      name: string;
      role: string;
      recommendation: string;
      confidence: number;
      evidence: string;
      source: string;
    };
  };
  status: 'PENDING_HUMAN' | 'APPROVED' | 'OVERRIDDEN' | 'PAUSED' | 'RESOLVED';
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface EscalationCardProps {
  escalation: EscalationItem;
  onActionCommit?: (actionName: string, escalationId: string, notes?: string) => void;
  onNavigateToNode?: (nodeId: string) => void;
  isCompact?: boolean;
  defaultExpanded?: boolean;
}

export const EscalationCard: React.FC<EscalationCardProps> = ({
  escalation,
  onActionCommit,
  onNavigateToNode,
  isCompact = false,
  defaultExpanded = false,
}) => {
  if (!escalation) {
    return null;
  }

  const defaultAction = escalation.defaultAction || {
    namedAction: 'Hold position and execute safe fallback',
    timeoutSeconds: 600,
    countdown: 600,
    ruleDescription: 'Unanswered escalation executes automatic safe default after timeout.',
  };

  const observed = escalation.observed || {
    source: 'Telemetry Monitor',
    timestamp: 'Just now',
    fact: 'Signal anomaly detected.',
  };

  const whyItMatters = escalation.whyItMatters || {
    limitOrMandate: 'Risk Policy',
    implication: 'Requires human oversight.',
  };

  const alreadyDone = escalation.alreadyDone || {
    action: 'Stepped down autonomy to observe.',
    authorityLevel: 'Observe',
    timestamp: 'Just now',
  };

  const recommendation = escalation.recommendation || {
    proposedAction: 'Review and confirm parameters.',
    confidence: 0.9,
    rationale: 'Align with risk mandate.',
  };

  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    defaultAction.countdown || defaultAction.timeoutSeconds || 600
  );
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [isResolved, setIsResolved] = useState<boolean>(escalation.status !== 'PENDING_HUMAN');

  // Live countdown timer
  useEffect(() => {
    if (isResolved || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isResolved, secondsRemaining]);

  const formatCountdown = (secs: number) => {
    const safeSecs = Math.max(0, isNaN(secs) ? 0 : secs);
    const mins = Math.floor(safeSecs / 60);
    const remainder = safeSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const getActionProjectedImpact = (action: string): string => {
    switch (action) {
      case 'Approve':
        return `Execute proposed recommendation (${recommendation.proposedAction}). Conforms to quantitative risk mandate.`;
      case 'Modify':
        return 'Adjust parameters before routing to OMS blotter. Opens parameter tuning drawer.';
      case 'Reject':
        return 'Cancel proposed trade. Returns node to observation state without execution.';
      case 'Override':
        return `Concentration stays at 10.6%. Breaches mandate limit. Requires dual sign-off from Dr. Elena Rostova.`;
      case 'Pause':
        return 'Freeze subagent execution gate. Prevents all downstream fills for 60 minutes.';
      case 'Take control':
        return 'Revoke autonomous trading authority. Transfers manual blotter ticket routing to PM desk.';
      case 'Take A':
        return `Adopt ${escalation.conflictData?.agentA?.name || 'Agent A'} recommendation (${escalation.conflictData?.agentA?.recommendation || 'Proposal A'}).`;
      case 'Take B':
        return `Adopt ${escalation.conflictData?.agentB?.name || 'Agent B'} recommendation (${escalation.conflictData?.agentB?.recommendation || 'Proposal B'}).`;
      case 'Neither, pause both':
        return 'Neutralize delta. Freeze both momentum and risk subagents until manual desk review.';
      default:
        return 'Projected risk impact will be verified by pre-trade gate.';
    }
  };

  const handleExecuteAction = (actionName: string) => {
    const impact = getActionProjectedImpact(actionName);
    setActionFeedback(`Executed: ${actionName} — ${impact}`);
    setIsResolved(true);
    if (onActionCommit) {
      onActionCommit(actionName, escalation.id, impact);
    }
  };

  const isConflict = escalation.severity === 'CONFLICT' && !!escalation.conflictData;

  const severityBadgeClass = 
    escalation.severity === 'BREACH'
      ? 'bg-red-100 text-red-900 border-red-300'
      : escalation.severity === 'DEGRADED'
      ? 'bg-amber-100 text-amber-900 border-amber-300'
      : escalation.severity === 'QUARANTINED'
      ? 'bg-purple-100 text-purple-900 border-purple-300'
      : 'bg-indigo-100 text-indigo-900 border-indigo-300';

  return (
    <div className={`rounded-xl border bg-white shadow-xs font-mono transition-all ${
      escalation.severity === 'BREACH' ? 'border-red-300' :
      escalation.severity === 'DEGRADED' ? 'border-amber-300' :
      escalation.severity === 'QUARANTINED' ? 'border-purple-300' : 'border-indigo-300'
    }`}>
      {/* Header Bar */}
      <div className="p-3 bg-slate-50/90 border-b border-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {escalation.severity === 'BREACH' && <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />}
          {escalation.severity === 'DEGRADED' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
          {escalation.severity === 'QUARANTINED' && <AlertCircle className="w-4 h-4 text-purple-600 shrink-0" />}
          {escalation.severity === 'CONFLICT' && <Scale className="w-4 h-4 text-indigo-600 shrink-0" />}
          
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-foreground">{escalation.title}</span>
              <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${severityBadgeClass}`}>
                {escalation.severity}
              </Badge>
              <span className="text-[9px] text-muted-foreground">· {escalation.age}</span>
            </div>
            <div className="text-[10px] text-muted-foreground flex items-center gap-2">
              <span>Node: <strong className="text-slate-700">{escalation.nodeName}</strong></span>
              <span>•</span>
              <span>Model: <span className="text-blue-600 font-semibold">{escalation.modelName}</span></span>
            </div>
          </div>
        </div>

        {onNavigateToNode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateToNode(escalation.nodeId)}
            className="h-6 text-[10px] text-blue-700 hover:bg-blue-50 px-2 gap-1"
          >
            <span>View on Canvas</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Main 5 Stacked Sections */}
      <div className="p-3 space-y-2.5 text-xs">
        
        {/* If Conflict Variant: Show Side-by-Side Comparison */}
        {isConflict && escalation.conflictData ? (
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-200 text-[11px]">
              <div className="flex items-center justify-between font-bold text-indigo-950 mb-1">
                <span className="flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Sub-Agent Conflict on Position: {escalation.conflictData.position}</span>
                </span>
                <span className="text-[10px] font-mono text-indigo-700">Gross Value: {escalation.conflictData.currentValue}</span>
              </div>
              <p className="text-[10px] text-indigo-900 font-sans">
                The momentum feature extractor and the Barra risk neutralizer produced contradictory allocation vectors. The autonomous system has held execution and requires human arbitration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Agent A Card */}
              <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/40 space-y-1.5">
                <div className="flex items-center justify-between border-b border-blue-200 pb-1">
                  <span className="font-bold text-[11px] text-blue-900">{escalation.conflictData.agentA?.name || 'Agent A'}</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 text-[9px]">
                    Confidence {((escalation.conflictData.agentA?.confidence ?? 0.9) * 100).toFixed(0)}%
                  </Badge>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Recommendation</span>
                  <span className="font-bold text-[11px] text-blue-950">{escalation.conflictData.agentA?.recommendation}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Evidence Relied Upon</span>
                  <p className="text-[10px] font-sans text-slate-700 leading-snug">{escalation.conflictData.agentA?.evidence}</p>
                </div>
                <div className="text-[9px] text-slate-500 font-mono">
                  Source: {escalation.conflictData.agentA?.source}
                </div>
              </div>

              {/* Agent B Card */}
              <div className="p-2.5 rounded-lg border border-purple-200 bg-purple-50/40 space-y-1.5">
                <div className="flex items-center justify-between border-b border-purple-200 pb-1">
                  <span className="font-bold text-[11px] text-purple-900">{escalation.conflictData.agentB?.name || 'Agent B'}</span>
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 text-[9px]">
                    Confidence {((escalation.conflictData.agentB?.confidence ?? 0.9) * 100).toFixed(0)}%
                  </Badge>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Recommendation</span>
                  <span className="font-bold text-[11px] text-purple-950">{escalation.conflictData.agentB?.recommendation}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Evidence Relied Upon</span>
                  <p className="text-[10px] font-sans text-slate-700 leading-snug">{escalation.conflictData.agentB?.evidence}</p>
                </div>
                <div className="text-[9px] text-slate-500 font-mono">
                  Source: {escalation.conflictData.agentB?.source}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Section 1: What I Observed */}
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-800 mb-0.5">
                <span className="flex items-center gap-1 text-slate-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  <span>1. What I observed</span>
                </span>
                <span className="text-[9px] text-slate-500 font-normal">
                  Source: {observed.source} · {observed.timestamp}
                </span>
              </div>
              <p className="text-[11px] font-sans text-slate-700 leading-snug">
                {observed.fact}
              </p>
            </div>

            {/* Section 2: Why it Matters */}
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-800 mb-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                <span>2. Why it matters</span>
              </div>
              <p className="text-[11px] font-sans text-slate-700 leading-snug">
                <strong className="text-slate-900">{whyItMatters.limitOrMandate}:</strong> {whyItMatters.implication}
              </p>
            </div>

            {/* Section 3: What I've Already Done */}
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-800 mb-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  <span>3. What I've already done</span>
                </span>
                <span className="text-[9px] text-indigo-700 font-semibold bg-indigo-50 px-1 rounded">
                  Auth: {alreadyDone.authorityLevel}
                </span>
              </div>
              <p className="text-[11px] font-sans text-slate-700 leading-snug">
                {alreadyDone.action}
              </p>
            </div>

            {/* Section 4: What I Recommend */}
            <div className="p-2 rounded-lg bg-blue-50/50 border border-blue-200">
              <div className="flex items-center justify-between text-[10px] font-bold text-blue-900 mb-0.5">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>4. What I recommend</span>
                </span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 text-[9px]">
                  Confidence {((recommendation.confidence || 0.9) * 100).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-[11px] font-bold text-blue-950">
                {recommendation.proposedAction}
              </p>
              <p className="text-[10px] font-sans text-slate-600 mt-0.5 leading-snug">
                {recommendation.rationale}
              </p>
            </div>
          </>
        )}

        {/* Section 5: If You Do Nothing (Named Default Action with Live Countdown) */}
        <div className={`p-2.5 rounded-lg border ${
          secondsRemaining <= 60 ? 'bg-red-50/70 border-red-300 text-red-950' : 'bg-amber-50/70 border-amber-300 text-amber-950'
        }`}>
          <div className="flex items-center justify-between text-[10px] font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
              <span>5. If you do nothing</span>
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.2 rounded border border-amber-300 text-amber-900">
                T-{formatCountdown(secondsRemaining)}
              </span>
            </div>
          </div>
          <p className="text-[10.5px] font-sans text-slate-800 leading-snug">
            In <strong>{formatCountdown(secondsRemaining)}</strong>, <span className="font-semibold text-slate-900">{defaultAction.namedAction}</span>. {defaultAction.ruleDescription}
          </p>
        </div>

      </div>

      {/* Projected Impact Preview on Action Hover */}
      {hoveredAction && (
        <div className="mx-3 mb-2 p-2 rounded-lg bg-slate-900 text-slate-100 text-[10px] font-mono flex items-start gap-1.5 animate-in fade-in">
          <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sky-300 uppercase tracking-wider block">Projected Impact ({hoveredAction}):</span>
            <span className="text-slate-300 font-sans">{getActionProjectedImpact(hoveredAction)}</span>
          </div>
        </div>
      )}

      {/* Action Execution Feedback if resolved */}
      {actionFeedback && (
        <div className="mx-3 mb-2 p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-[10px] font-mono flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Action Row */}
      <div className="p-2.5 bg-slate-50 border-t border-border flex flex-wrap items-center justify-between gap-1.5">
        {isConflict ? (
          <div className="w-full flex flex-wrap items-center justify-between gap-1">
            <div className="flex items-center gap-1 flex-wrap">
              <Button
                size="sm"
                onClick={() => handleExecuteAction('Take A')}
                onMouseEnter={() => setHoveredAction('Take A')}
                onMouseLeave={() => setHoveredAction(null)}
                className="h-7 text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-mono px-2.5 rounded-md"
              >
                Take A ({escalation.conflictData?.agentA?.name?.slice(0, 10) || 'Agent A'})
              </Button>
              <Button
                size="sm"
                onClick={() => handleExecuteAction('Take B')}
                onMouseEnter={() => setHoveredAction('Take B')}
                onMouseLeave={() => setHoveredAction(null)}
                className="h-7 text-[10px] bg-purple-600 hover:bg-purple-700 text-white font-mono px-2.5 rounded-md"
              >
                Take B ({escalation.conflictData?.agentB?.name?.slice(0, 10) || 'Agent B'})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecuteAction('Neither, pause both')}
                onMouseEnter={() => setHoveredAction('Neither, pause both')}
                onMouseLeave={() => setHoveredAction(null)}
                className="h-7 text-[10px] text-slate-700 bg-white hover:bg-slate-100 font-mono px-2 rounded-md"
              >
                Neither, Pause Both
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExecuteAction('Take control')}
              onMouseEnter={() => setHoveredAction('Take control')}
              onMouseLeave={() => setHoveredAction(null)}
              className="h-7 text-[10px] text-red-700 border-red-300 hover:bg-red-50 font-mono px-2 rounded-md"
            >
              Take Control
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-wrap items-center justify-between gap-1">
            <div className="flex items-center gap-1 flex-wrap">
              <Button
                size="sm"
                onClick={() => handleExecuteAction('Approve')}
                onMouseEnter={() => setHoveredAction('Approve')}
                onMouseLeave={() => setHoveredAction(null)}
                className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-mono px-2.5 rounded-md"
              >
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecuteAction('Modify')}
                onMouseEnter={() => setHoveredAction('Modify')}
                onMouseLeave={() => setHoveredAction(null)}
                className="h-7 text-[10px] text-slate-700 bg-white hover:bg-slate-100 font-mono px-2 rounded-md"
              >
                Modify
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecuteAction('Reject')}
                onMouseEnter={() => setHoveredAction('Reject')}
                onMouseLeave={() => setHoveredAction(null)}
                className="h-7 text-[10px] text-slate-700 bg-white hover:bg-slate-100 font-mono px-2 rounded-md"
              >
                Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecuteAction('Override')}
                onMouseEnter={() => setHoveredAction('Override')}
                onMouseLeave={() => setHoveredAction(null)}
                className="h-7 text-[10px] text-amber-800 border-amber-300 hover:bg-amber-50 font-mono px-2 rounded-md"
              >
                Override
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecuteAction('Pause')}
                onMouseEnter={() => setHoveredAction('Pause')}
                onMouseLeave={() => setHoveredAction(null)}
                className="h-7 text-[10px] text-slate-700 bg-white hover:bg-slate-100 font-mono px-2 rounded-md"
              >
                Pause
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExecuteAction('Take control')}
              onMouseEnter={() => setHoveredAction('Take control')}
              onMouseLeave={() => setHoveredAction(null)}
              className="h-7 text-[10px] text-red-700 border-red-300 hover:bg-red-50 font-mono px-2.5 rounded-md"
            >
              Take Control
            </Button>
          </div>
        )}
      </div>

    </div>
  );
};

