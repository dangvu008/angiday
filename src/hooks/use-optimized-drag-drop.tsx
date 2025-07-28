import { useCallback, useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { throttle, debounce } from 'lodash';

interface DragItem {
  type: string;
  id: string;
  data: any;
}

interface DropResult {
  targetId: string;
  targetType: string;
}

interface UseOptimizedDragDropOptions {
  // Drag options
  dragType: string;
  dragItem: DragItem;
  canDrag?: boolean;
  onDragStart?: (item: DragItem) => void;
  onDragEnd?: (item: DragItem, dropResult?: DropResult) => void;
  
  // Drop options
  acceptTypes: string[];
  canDrop?: (item: DragItem) => boolean;
  onDrop?: (item: DragItem, monitor: any) => void;
  onHover?: (item: DragItem, monitor: any) => void;
  
  // Performance options
  throttleHover?: number;
  debounceCalculations?: number;
  enablePreview?: boolean;
}

export const useOptimizedDragDrop = (options: UseOptimizedDragDropOptions) => {
  const {
    dragType,
    dragItem,
    canDrag = true,
    onDragStart,
    onDragEnd,
    acceptTypes,
    canDrop,
    onDrop,
    onHover,
    throttleHover = 100,
    debounceCalculations = 300,
    enablePreview = true
  } = options;

  // Refs for performance optimization
  const dragPreviewRef = useRef<HTMLDivElement>(null);
  const lastHoverTime = useRef<number>(0);
  const calculationCache = useRef<Map<string, any>>(new Map());

  // Throttled hover handler to improve performance during drag
  const throttledHover = useMemo(
    () => throttle((item: DragItem, monitor: any) => {
      const now = Date.now();
      if (now - lastHoverTime.current < throttleHover) return;
      
      lastHoverTime.current = now;
      onHover?.(item, monitor);
    }, throttleHover),
    [onHover, throttleHover]
  );

  // Debounced calculation handler
  const debouncedCalculation = useMemo(
    () => debounce((key: string, calculation: () => any) => {
      if (!calculationCache.current.has(key)) {
        const result = calculation();
        calculationCache.current.set(key, result);
        return result;
      }
      return calculationCache.current.get(key);
    }, debounceCalculations),
    [debounceCalculations]
  );

  // Optimized drag hook
  const [{ isDragging, dragPreview }, drag, preview] = useDrag({
    type: dragType,
    item: dragItem,
    canDrag,
    begin: useCallback((monitor) => {
      onDragStart?.(dragItem);
      return dragItem;
    }, [dragItem, onDragStart]),
    end: useCallback((item, monitor) => {
      const dropResult = monitor.getDropResult() as DropResult;
      onDragEnd?.(item, dropResult);
      
      // Clear calculation cache after drag ends
      calculationCache.current.clear();
    }, [onDragEnd]),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      dragPreview: monitor.getItem()
    })
  });

  // Optimized drop hook
  const [{ isOver, canDropHere }, drop] = useDrop({
    accept: acceptTypes,
    canDrop: useCallback((item: DragItem, monitor) => {
      return canDrop ? canDrop(item) : true;
    }, [canDrop]),
    hover: useCallback((item: DragItem, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
      throttledHover(item, monitor);
    }, [throttledHover]),
    drop: useCallback((item: DragItem, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
      onDrop?.(item, monitor);
    }, [onDrop]),
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDropHere: monitor.canDrop()
    })
  });

  // Memoized drag preview component
  const DragPreview = useMemo(() => {
    if (!enablePreview || !isDragging) return null;
    
    return (
      <div
        ref={dragPreviewRef}
        className="fixed pointer-events-none z-50 opacity-80 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: '50%',
          top: '50%'
        }}
      >
        <div className="bg-white shadow-lg rounded-lg p-2 border-2 border-orange-500">
          <div className="text-sm font-medium">{dragItem.data?.name || 'Dragging...'}</div>
        </div>
      </div>
    );
  }, [enablePreview, isDragging, dragItem]);

  // Performance monitoring
  const performanceMetrics = useMemo(() => ({
    cacheSize: calculationCache.current.size,
    isDragging,
    isOver,
    canDropHere
  }), [isDragging, isOver, canDropHere]);

  // Utility functions
  const clearCache = useCallback(() => {
    calculationCache.current.clear();
  }, []);

  const getCachedCalculation = useCallback((key: string, calculation: () => any) => {
    if (calculationCache.current.has(key)) {
      return calculationCache.current.get(key);
    }
    const result = calculation();
    calculationCache.current.set(key, result);
    return result;
  }, []);

  // Optimized refs combining
  const dragRef = useCallback((node: HTMLElement | null) => {
    drag(node);
    if (enablePreview) {
      preview(node);
    }
  }, [drag, preview, enablePreview]);

  const dropRef = useCallback((node: HTMLElement | null) => {
    drop(node);
  }, [drop]);

  const combinedRef = useCallback((node: HTMLElement | null) => {
    dragRef(node);
    dropRef(node);
  }, [dragRef, dropRef]);

  return {
    // Drag state
    isDragging,
    dragPreview,
    
    // Drop state
    isOver,
    canDropHere,
    
    // Refs
    dragRef,
    dropRef,
    combinedRef,
    
    // Components
    DragPreview,
    
    // Utilities
    clearCache,
    getCachedCalculation,
    debouncedCalculation,
    
    // Performance metrics
    performanceMetrics
  };
};

// Hook for optimizing large lists with drag & drop
export const useVirtualizedDragDrop = (
  items: any[],
  itemHeight: number,
  containerHeight: number,
  options: UseOptimizedDragDropOptions
) => {
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(0 / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    return { startIndex, endIndex };
  }, [items.length, itemHeight, containerHeight]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex);
  }, [items, visibleRange]);

  const dragDropHook = useOptimizedDragDrop(options);

  return {
    ...dragDropHook,
    visibleItems,
    visibleRange,
    totalHeight: items.length * itemHeight
  };
};

// Performance monitoring hook
export const useDragDropPerformance = () => {
  const metricsRef = useRef({
    dragStartTime: 0,
    dropEndTime: 0,
    hoverCount: 0,
    calculationCount: 0
  });

  const startDragTracking = useCallback(() => {
    metricsRef.current.dragStartTime = performance.now();
    metricsRef.current.hoverCount = 0;
  }, []);

  const endDragTracking = useCallback(() => {
    metricsRef.current.dropEndTime = performance.now();
    const duration = metricsRef.current.dropEndTime - metricsRef.current.dragStartTime;
    
    console.log('Drag & Drop Performance:', {
      duration: `${duration.toFixed(2)}ms`,
      hoverCount: metricsRef.current.hoverCount,
      calculationCount: metricsRef.current.calculationCount
    });
  }, []);

  const trackHover = useCallback(() => {
    metricsRef.current.hoverCount++;
  }, []);

  const trackCalculation = useCallback(() => {
    metricsRef.current.calculationCount++;
  }, []);

  return {
    startDragTracking,
    endDragTracking,
    trackHover,
    trackCalculation,
    metrics: metricsRef.current
  };
};
