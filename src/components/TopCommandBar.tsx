import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Menu, 
  CheckCircle2, 
  Bot,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { ViewTab } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Card } from './ui/card';

interface TopCommandBarProps {
  onToggleMobileSidePanel: () => void;
  onExportStatus: () => void;
  onSelectTab: (tab: ViewTab) => void;
  onSearchTicker?: (query: string) => void;
  onOpenAgentModal?: (initialQuery?: string) => void;
  exportSuccess: boolean;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  onToggleMobileSidePanel,
  onExportStatus,
  onSelectTab,
  onSearchTicker,
  onOpenAgentModal,
  exportSuccess,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [topInput, setTopInput] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close profile on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTopInput(val);
    if (onOpenAgentModal) {
      onOpenAgentModal(val);
    }
  };

  const handleInputFocus = () => {
    if (onOpenAgentModal) {
      onOpenAgentModal(topInput);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onOpenAgentModal) {
        onOpenAgentModal(topInput);
      }
    }
  };

  return (
    <div className="w-full bg-white border-b border-border px-3 sm:px-4 py-2 flex items-center justify-between gap-3 relative select-none shrink-0 z-20">
      {/* Left side: Mobile hamburger + /agent bar matching wireframe */}
      <div className="flex items-center gap-2 flex-1 max-w-xl">
        {/* Mobile menu toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleMobileSidePanel}
          className="lg:hidden h-8 w-8 shrink-0 bg-white hover:bg-slate-50"
          aria-label="Toggle Side Panel"
        >
          <Menu className="w-4 h-4" />
        </Button>

        {/* /agent bar matching wireframe: [ /agent bar                   ↗ ] */}
        <div className="relative w-full group">
          <div className="relative flex items-center bg-white border border-blue-400/60 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-400/40 rounded-lg shadow-2xs transition-all">
            <span className="pl-3 pr-1 text-blue-600 font-mono text-xs font-semibold select-none flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            </span>

            <input
              type="text"
              value={topInput}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              placeholder="/agent bar"
              className="w-full py-1.5 pl-1 pr-9 text-xs sm:text-sm font-mono text-foreground placeholder:text-muted-foreground/80 bg-transparent focus:outline-hidden"
            />

            {/* Small blue arrow on the right matching wireframe ↗ */}
            <button
              type="button"
              onClick={() => onOpenAgentModal && onOpenAgentModal(topInput)}
              className="absolute right-2 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-600 transition-colors"
              title="Open Agent Command Terminal"
            >
              <ArrowUpRight className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Right side: Live Status export + Profile Avatar Box matching wireframe */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0" ref={containerRef}>
        {/* Live Status export button matching wireframe */}
        <Button
          variant="outline"
          size="sm"
          onClick={onExportStatus}
          className="font-mono text-xs gap-1.5 h-8 border-border bg-white hover:bg-slate-50 text-foreground shadow-2xs"
        >
          {exportSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-emerald-700 font-semibold">Exported!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-blue-600 group-hover:translate-y-0.5 transition-transform" />
              <span>Live Status export</span>
            </>
          )}
        </Button>

        {/* Profile icon in rounded button with inner circle matching wireframe ○ */}
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            title="User Profile & Settings"
            className="h-8 w-8 p-0 rounded-lg border-border bg-white hover:bg-slate-50"
          >
            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
          </Button>

          {isProfileOpen && (
            <Card className="absolute right-0 top-full mt-1.5 w-60 shadow-xl z-50 p-3 text-xs animate-in fade-in-50 bg-white text-foreground border border-border">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-border">
                <Avatar className="h-8 w-8 bg-primary/15 text-primary">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs font-mono">AV</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-foreground leading-tight">Alexander Vance</div>
                  <div className="text-[10px] text-muted-foreground font-mono">Portfolio Manager</div>
                </div>
              </div>
              <div className="py-2 space-y-1.5 text-muted-foreground font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Organization:</span>
                  <span className="text-foreground font-semibold">DE SHAW &amp; CO</span>
                </div>
                <div className="flex justify-between">
                  <span>Environment:</span>
                  <span className="text-emerald-700 font-semibold">Live Production</span>
                </div>
                <div className="flex justify-between">
                  <span>Agent Core:</span>
                  <span className="text-foreground">v4.2-Hybrid</span>
                </div>
                <div className="flex justify-between">
                  <span>Colocation:</span>
                  <span className="text-foreground">NY4 Cross-Connect</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
