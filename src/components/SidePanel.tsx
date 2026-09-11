import React, { useState, useRef, useEffect } from 'react';
import { ViewTab, Fund } from '../types';
import { 
  LayoutGrid, 
  Diamond, 
  Columns3, 
  Disc3, 
  FileText, 
  PieChart, 
  Settings, 
  ChevronUp,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';

interface SidePanelProps {
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  funds?: Fund[];
  selectedFundId?: string;
  onSelectFund?: (fundId: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  activeTab,
  onSelectTab,
  funds = [],
  selectedFundId = 'des-oculus',
  onSelectFund,
  isOpenMobile = false,
  onCloseMobile,
  onOpenSettings,
  onOpenHelp,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [isPortfolioMenuOpen, setIsPortfolioMenuOpen] = useState(false);
  const portfolioMenuRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('deshaw_sidebar_width');
      return saved ? parseInt(saved, 10) : 240;
    } catch {
      return 240;
    }
  });
  const [isDraggingSidebar, setIsDraggingSidebar] = useState<boolean>(false);
  const startDragXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(240);

  // Close portfolio menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (portfolioMenuRef.current && !portfolioMenuRef.current.contains(event.target as Node)) {
        setIsPortfolioMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save width to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('deshaw_sidebar_width', sidebarWidth.toString());
    } catch {
      // ignore
    }
  }, [sidebarWidth]);

  // Handle pointer down for drag resizing sidebar
  const handleSidebarPointerDown = (e: React.PointerEvent) => {
    if (isCollapsed) return;
    e.preventDefault();
    e.stopPropagation();
    startDragXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
    setIsDraggingSidebar(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  useEffect(() => {
    if (!isDraggingSidebar) return;

    const handlePointerMove = (e: PointerEvent) => {
      const deltaX = e.clientX - startDragXRef.current;
      const newWidth = Math.min(460, Math.max(180, startWidthRef.current + deltaX));
      setSidebarWidth(newWidth);
    };

    const handlePointerUp = () => {
      setIsDraggingSidebar(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDraggingSidebar]);

  // Navigation items exactly matching the screenshot:
  // 1. Portfolio Overview
  // 2. Market Fund Manager
  // 3. Data Repository
  // 4. Agent Builder / Workspace
  // 5. Audit Log
  // 6. Reporting
  const navItems: { id: ViewTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'overview',
      label: 'Portfolio Overview',
      icon: LayoutGrid,
    },
    {
      id: 'optimizer',
      label: 'Market Fund Manager',
      icon: Diamond,
    },
    {
      id: 'repository',
      label: 'Data Repository',
      icon: Columns3,
    },
    {
      id: 'agent-builder',
      label: 'Agent Workspace',
      icon: Disc3,
    },
    {
      id: 'audit-log',
      label: 'Audit Log',
      icon: FileText,
    },
    {
      id: 'reporting',
      label: 'Reporting',
      icon: PieChart,
    },
  ];

  const currentFund = funds.find(f => f.id === selectedFundId) || funds[0];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        style={{
          width: isOpenMobile ? undefined : isCollapsed ? '3.5rem' : `${sidebarWidth}px`,
        }}
        className={`fixed lg:static top-0 left-0 bottom-0 z-40 bg-white border-r border-border flex flex-col justify-between transition-[width] duration-150 ease-in-out shrink-0 select-none relative ${
          isOpenMobile 
            ? 'translate-x-0 w-64' 
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col min-h-0">
          {/* Header matching screenshot: [DS] icon + DE SHAW & CO */}
          <div className="h-14 border-b border-border px-4 flex items-center justify-between shrink-0">
            {!isCollapsed ? (
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded bg-foreground text-background flex items-center justify-center font-bold text-xs tracking-tight font-mono shrink-0 shadow-xs">
                  DS
                </div>
                <span className="text-sm font-bold text-foreground tracking-wider uppercase font-mono truncate">
                  DE SHAW &amp; CO
                </span>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <div className="w-7 h-7 rounded bg-foreground text-background flex items-center justify-center font-bold text-xs font-mono shadow-xs">
                  DS
                </div>
              </div>
            )}

            {/* Collapse toggle button on desktop */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className={`hidden lg:flex p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-50 transition-colors ${
                  isCollapsed ? 'hidden' : 'flex'
                }`}
                aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground lg:hidden"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick expand button when collapsed */}
          {isCollapsed && onToggleCollapse && (
            <div className="hidden lg:flex justify-center py-2 border-b border-border/40">
              <button
                onClick={onToggleCollapse}
                title="Expand sidebar"
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-50 transition-colors"
                aria-label="Expand navigation"
              >
                <ChevronRight className="w-4 h-4 text-primary" />
              </button>
            </div>
          )}

          {/* Navigation links matching screenshot exactly */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === 'overview' && activeTab === 'holdings') ||
                (item.id === 'optimizer' && activeTab === 'scenarios');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-md text-xs font-medium transition-all ${
                    isCollapsed 
                      ? 'justify-center h-10 w-10 mx-auto' 
                      : 'gap-3 px-3 py-2.5 text-left'
                  } ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section matching screenshot:
            - Switch portfolio with ^
            - Settings
            - Yatri Patel / Portfolio Manager avatar row
        */}
        <div className={`border-t border-border shrink-0 bg-white ${isCollapsed ? 'p-2 space-y-2' : 'p-3 space-y-2'}`}>
          {!isCollapsed ? (
            <div className="space-y-1.5" ref={portfolioMenuRef}>
              {/* Switch portfolio button */}
              <div className="relative">
                <button
                  onClick={() => setIsPortfolioMenuOpen(!isPortfolioMenuOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-foreground bg-white hover:bg-slate-50 rounded-md border border-border transition-colors"
                >
                  <span className="truncate">Switch portfolio</span>
                  <ChevronUp className={`w-4 h-4 text-muted-foreground transition-transform ${isPortfolioMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Portfolio selector popover */}
                {isPortfolioMenuOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-border rounded-lg shadow-lg p-1.5 z-50 animate-in fade-in-50 space-y-1">
                    <div className="px-2 py-1 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      Available Funds
                    </div>
                    {funds.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          if (onSelectFund) onSelectFund(f.id);
                          setIsPortfolioMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs text-left transition-colors ${
                          f.id === selectedFundId 
                            ? 'bg-primary/10 text-primary font-semibold' 
                            : 'hover:bg-slate-50 text-foreground'
                        }`}
                      >
                        <div className="truncate">
                          <div className="truncate">{f.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">AUM: ${f.aumMillions}M</div>
                        </div>
                        {f.id === selectedFundId && <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-1" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Settings link */}
              <button
                onClick={onOpenSettings}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md transition-colors text-left"
              >
                <span>Settings</span>
              </button>

              {/* User Profile matching screenshot:
                  [YP] Yatri Patel
                  Portfolio Manager
              */}
              <div className="pt-2 border-t border-border flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 font-bold text-xs font-mono">
                  YP
                </div>
                <div className="overflow-hidden min-w-0">
                  <div className="text-xs font-bold text-foreground tracking-tight truncate">
                    Yatri Patel
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    Portfolio Manager
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={onOpenSettings}
                title="Settings"
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-50"
              >
                <Settings className="w-4 h-4" />
              </button>
              <div 
                title="Yatri Patel (Portfolio Manager)"
                className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs font-mono"
              >
                YP
              </div>
            </div>
          )}
        </div>

        {/* Desktop Draggable Sidebar Splitter Handle */}
        {!isCollapsed && (
          <div
            onPointerDown={handleSidebarPointerDown}
            onDoubleClick={() => setSidebarWidth(240)}
            title="Drag to resize sidebar width. Double-click to reset (240px)."
            className={`hidden lg:flex absolute top-0 right-0 w-2 h-full -mr-1 cursor-col-resize z-50 items-center justify-center group ${
              isDraggingSidebar ? 'bg-primary/30' : 'hover:bg-primary/20'
            }`}
          >
            <div
              className={`w-[2px] h-10 rounded-full transition-all duration-150 ${
                isDraggingSidebar ? 'bg-primary h-16 w-[3px]' : 'bg-transparent group-hover:bg-primary/70'
              }`}
            />
          </div>
        )}
      </aside>
    </>
  );
};
