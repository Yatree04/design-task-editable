import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Maximize2, Minimize2, ChevronDown, ChevronUp, GripHorizontal, Move } from 'lucide-react';

export interface ResizableCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  defaultHeight?: number | string; // e.g. 350 or 'auto'
  minHeight?: number;
  maxHeight?: number;
  isResizableHeight?: boolean;
  canMaximize?: boolean;
  canCollapse?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export const ResizableCard: React.FC<ResizableCardProps> = ({
  children,
  title,
  subtitle,
  actions,
  defaultHeight,
  minHeight = 120,
  maxHeight = 1200,
  isResizableHeight = false,
  canMaximize = true,
  canCollapse = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  ...rest
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [height, setHeight] = useState<number | undefined>(
    typeof defaultHeight === 'number' ? defaultHeight : undefined
  );
  const [isDraggingHeight, setIsDraggingHeight] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMaximized || isCollapsed) return;

    const currentHeight = cardRef.current?.getBoundingClientRect().height || 300;
    dragStartYRef.current = e.clientY;
    startHeightRef.current = currentHeight;
    setIsDraggingHeight(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDraggingHeight) return;
      const deltaY = e.clientY - dragStartYRef.current;
      const newHeight = Math.min(maxHeight, Math.max(minHeight, startHeightRef.current + deltaY));
      setHeight(Math.round(newHeight));
    },
    [isDraggingHeight, minHeight, maxHeight]
  );

  const handlePointerUp = useCallback(() => {
    setIsDraggingHeight(false);
  }, []);

  useEffect(() => {
    if (isDraggingHeight) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'row-resize';
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDraggingHeight, handlePointerMove, handlePointerUp]);

  return (
    <>
      {/* Maximize overlay backdrop */}
      {isMaximized && (
        <div
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsMaximized(false)}
        >
          <div
            className="w-full max-w-7xl h-[90vh] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden text-foreground animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/20 shrink-0">
              <div>
                {typeof title === 'string' ? (
                  <h3 className="font-semibold text-base text-foreground tracking-tight">{title}</h3>
                ) : (
                  title
                )}
                {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
              </div>
              <div className="flex items-center gap-2">
                {actions}
                <button
                  onClick={() => setIsMaximized(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Exit Fullscreen"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-5">{children}</div>
          </div>
        </div>
      )}

      <div
        ref={cardRef}
        className={`relative bg-card border border-border rounded-lg shadow-xs flex flex-col transition-shadow duration-200 ${
          isDraggingHeight ? 'ring-2 ring-primary/40 shadow-md' : 'hover:shadow-xs'
        } ${className}`}
        style={{
          height: isCollapsed ? 'auto' : height ? `${height}px` : undefined,
          minHeight: isCollapsed ? undefined : minHeight ? `${minHeight}px` : undefined,
        }}
        {...rest}
      >
        {/* Card Header if title or controls present */}
        {(title || actions || canMaximize || canCollapse) && (
          <div
            className={`flex items-center justify-between px-4 py-3 border-b border-border/70 shrink-0 select-none ${headerClassName}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {canCollapse && (
                <button
                  onClick={() => setIsCollapsed((prev) => !prev)}
                  className="p-1 -ml-1 text-muted-foreground hover:text-foreground rounded hover:bg-slate-100 transition-colors"
                  title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
                >
                  {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              )}
              <div className="min-w-0">
                {typeof title === 'string' ? (
                  <h4 className="font-semibold text-sm text-foreground truncate">{title}</h4>
                ) : (
                  title
                )}
                {subtitle && !isCollapsed && (
                  <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {actions}
              {canMaximize && (
                <button
                  onClick={() => setIsMaximized(true)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors"
                  title="Expand to Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Card Body */}
        {!isCollapsed && (
          <div className={`flex-1 overflow-auto p-4 min-h-0 flex flex-col ${bodyClassName}`}>
            {children}
          </div>
        )}

        {/* Bottom Resize Handle */}
        {isResizableHeight && !isCollapsed && (
          <div
            className="w-full h-3 -mt-1 cursor-row-resize flex items-center justify-center group shrink-0 select-none hover:bg-primary/10 rounded-b transition-colors"
            onPointerDown={handlePointerDown}
            title="Drag vertically to resize card height"
          >
            <div className="w-10 h-1 rounded-full bg-border group-hover:bg-primary/70 transition-all" />
          </div>
        )}
      </div>
    </>
  );
};

export default ResizableCard;
