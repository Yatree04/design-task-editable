import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GripVertical, GripHorizontal, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

export interface ResizableSplitProps {
  children: [React.ReactNode, React.ReactNode] | React.ReactNode[];
  direction?: 'horizontal' | 'vertical';
  initialSizes?: number[]; // percentages e.g. [50, 50] or [33.3, 33.3, 33.4]
  minSizes?: number[]; // min percentages e.g. [15, 15] or [200, 200]
  maxSizes?: number[]; // max percentages e.g. [85, 85]
  storageKey?: string; // Optional localStorage key to remember user's resized layout
  className?: string;
  gutterClassName?: string;
  onResize?: (sizes: number[]) => void;
}

export const ResizableSplit: React.FC<ResizableSplitProps> = ({
  children,
  direction = 'horizontal',
  initialSizes,
  minSizes,
  maxSizes,
  storageKey,
  className = '',
  gutterClassName = '',
  onResize,
}) => {
  const childArray = React.Children.toArray(children);
  const count = childArray.length;

  const defaultSizes = React.useMemo(() => {
    if (initialSizes && initialSizes.length === count) return initialSizes;
    const equal = 100 / count;
    return new Array(count).fill(equal);
  }, [initialSizes, count]);

  const [sizes, setSizes] = useState<number[]>(() => {
    if (storageKey) {
      try {
        const saved = localStorage.getItem(`resizable_split_${storageKey}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === count) {
            return parsed;
          }
        }
      } catch {
        // fallback
      }
    }
    return defaultSizes;
  });

  const [isDraggingIndex, setIsDraggingIndex] = useState<number | null>(null);
  const [collapsedIndex, setCollapsedIndex] = useState<number | null>(null);
  const [maximizedIndex, setMaximizedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{
    index: number;
    startPos: number;
    startSizes: number[];
  } | null>(null);

  // Sync to local storage
  useEffect(() => {
    if (storageKey && sizes.length > 0) {
      try {
        localStorage.setItem(`resizable_split_${storageKey}`, JSON.stringify(sizes));
      } catch {
        // ignore
      }
    }
  }, [sizes, storageKey]);

  const handlePointerDown = (index: number, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startPos = direction === 'horizontal' ? e.clientX : e.clientY;
    dragStartRef.current = {
      index,
      startPos,
      startSizes: [...sizes],
    };
    setIsDraggingIndex(index);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragStartRef.current || !containerRef.current) return;

      const { index, startPos, startSizes } = dragStartRef.current;
      const rect = containerRef.current.getBoundingClientRect();
      const totalDimension = direction === 'horizontal' ? rect.width : rect.height;
      if (totalDimension <= 0) return;

      const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
      const deltaPx = currentPos - startPos;
      const deltaPercent = (deltaPx / totalDimension) * 100;

      const newSizes = [...startSizes];
      const minLeft = minSizes?.[index] ?? 10;
      const minRight = minSizes?.[index + 1] ?? 10;
      const maxLeft = maxSizes?.[index] ?? 90;
      const maxRight = maxSizes?.[index + 1] ?? 90;

      let leftSize = startSizes[index] + deltaPercent;
      let rightSize = startSizes[index + 1] - deltaPercent;

      if (leftSize < minLeft) {
        const diff = minLeft - leftSize;
        leftSize = minLeft;
        rightSize -= diff;
      }
      if (rightSize < minRight) {
        const diff = minRight - rightSize;
        rightSize = minRight;
        leftSize -= diff;
      }
      if (leftSize > maxLeft) {
        const diff = leftSize - maxLeft;
        leftSize = maxLeft;
        rightSize += diff;
      }
      if (rightSize > maxRight) {
        const diff = rightSize - maxRight;
        rightSize = maxRight;
        leftSize += diff;
      }

      newSizes[index] = Number(leftSize.toFixed(2));
      newSizes[index + 1] = Number(rightSize.toFixed(2));

      setSizes(newSizes);
      if (onResize) onResize(newSizes);
    },
    [direction, minSizes, maxSizes, onResize]
  );

  const handlePointerUp = useCallback(() => {
    setIsDraggingIndex(null);
    dragStartRef.current = null;
  }, []);

  useEffect(() => {
    if (isDraggingIndex !== null) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDraggingIndex, direction, handlePointerMove, handlePointerUp]);

  const resetSizes = () => {
    setSizes(defaultSizes);
    setCollapsedIndex(null);
    setMaximizedIndex(null);
    if (onResize) onResize(defaultSizes);
  };

  const toggleCollapse = (index: number) => {
    if (collapsedIndex === index) {
      // Uncollapse
      setSizes(defaultSizes);
      setCollapsedIndex(null);
    } else {
      const newSizes = sizes.map((_, i) => (i === index ? 3 : (100 - 3) / (count - 1)));
      setSizes(newSizes);
      setCollapsedIndex(index);
    }
  };

  const toggleMaximize = (index: number) => {
    if (maximizedIndex === index) {
      setSizes(defaultSizes);
      setMaximizedIndex(null);
    } else {
      const newSizes = sizes.map((_, i) => (i === index ? 96 : 4 / (count - 1)));
      setSizes(newSizes);
      setMaximizedIndex(index);
    }
  };

  const isHorizontal = direction === 'horizontal';

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex ${
        isHorizontal ? 'flex-row' : 'flex-col'
      } ${className}`}
    >
      {childArray.map((child, i) => {
        const isMaximized = maximizedIndex === i;
        const isCollapsed = collapsedIndex === i;
        const currentSize = sizes[i] ?? (100 / count);

        return (
          <React.Fragment key={i}>
            {/* Panel Content Division */}
            <div
              className={`relative overflow-auto transition-[flex-basis,width,height] ${
                isDraggingIndex !== null ? 'transition-none pointer-events-none select-none' : 'duration-100 ease-out'
              } flex flex-col min-w-0 min-h-0`}
              style={{
                flexBasis: `${currentSize}%`,
                flexGrow: 0,
                flexShrink: 0,
                [isHorizontal ? 'width' : 'height']: `${currentSize}%`,
              }}
            >
              {child}
            </div>

            {/* Splitter Gutter */}
            {i < count - 1 && (
              <div
                className={`group relative select-none flex items-center justify-center shrink-0 z-20 ${
                  isHorizontal
                    ? 'w-2.5 -mx-0.5 cursor-col-resize hover:w-3.5 hover:-mx-1'
                    : 'h-2.5 -my-0.5 cursor-row-resize hover:h-3.5 hover:-my-1'
                } transition-all duration-150 ${
                  isDraggingIndex === i ? 'bg-primary/30 ring-2 ring-primary/40' : 'bg-transparent hover:bg-primary/20'
                } ${gutterClassName}`}
                onPointerDown={(e) => handlePointerDown(i, e)}
                onDoubleClick={resetSizes}
                title="Drag to resize division. Double-click to reset."
              >
                {/* Visual handle indicator line */}
                <div
                  className={`rounded-full transition-all duration-150 ${
                    isHorizontal
                      ? 'w-[3px] h-8 group-hover:h-12 bg-border group-hover:bg-primary/80 group-hover:w-[4px]'
                      : 'h-[3px] w-8 group-hover:w-12 bg-border group-hover:bg-primary/80 group-hover:h-[4px]'
                  } ${isDraggingIndex === i ? 'bg-primary w-[4px] h-14' : ''}`}
                />

                {/* Subtle Grip Icon */}
                <div className="absolute hidden group-hover:flex items-center justify-center pointer-events-none text-primary/90">
                  {isHorizontal ? (
                    <GripVertical className="w-3.5 h-3.5 bg-background border border-border shadow-xs rounded px-0.5" />
                  ) : (
                    <GripHorizontal className="w-3.5 h-3.5 bg-background border border-border shadow-xs rounded py-0.5" />
                  )}
                </div>

                {/* Quick action buttons popup on hover */}
                <div
                  className={`absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto flex items-center gap-1 bg-popover/95 backdrop-blur-xs border border-border shadow-md rounded-md p-0.5 text-muted-foreground z-30 ${
                    isHorizontal ? 'top-2' : 'left-2'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => toggleCollapse(i)}
                    className="p-1 hover:text-foreground hover:bg-slate-100 rounded text-[10px]"
                    title={collapsedIndex === i ? 'Expand Left Panel' : 'Collapse Left Panel'}
                  >
                    {isHorizontal ? <ChevronLeft className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={resetSizes}
                    className="p-1 hover:text-foreground hover:bg-slate-100 rounded text-[10px]"
                    title="Reset to default division sizes"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={() => toggleCollapse(i + 1)}
                    className="p-1 hover:text-foreground hover:bg-slate-100 rounded text-[10px]"
                    title={collapsedIndex === i + 1 ? 'Expand Right Panel' : 'Collapse Right Panel'}
                  >
                    {isHorizontal ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ResizableSplit;
