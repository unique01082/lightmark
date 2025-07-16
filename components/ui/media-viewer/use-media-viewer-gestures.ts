import { useThrottleFn } from 'ahooks';
import { useRef, useState } from 'react';
import type { DragState, ImageSize, PanState } from './types';

interface UseMediaViewerGesturesProps {
  zoom: number;
  pan: PanState;
  setPan: (pan: PanState) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setIsTransitioning: (isTransitioning: boolean) => void;
  imageNaturalSize: ImageSize;
  imageDisplaySize: ImageSize;
  onIndexChange?: (index: number) => void;
  currentIndex?: number;
  totalImages?: number;
  onRotate?: () => void;
}

interface TouchState {
  touches: Array<{ x: number; y: number; id: number }>;
  initialDistance: number;
  initialAngle: number;
  initialZoom: number;
  initialPan: PanState;
}

export function useMediaViewerGestures({
  zoom,
  pan,
  setPan,
  setZoom,
  setIsTransitioning,
  imageNaturalSize,
  imageDisplaySize,
  onIndexChange,
  currentIndex = 0,
  totalImages = 0,
  onRotate,
}: UseMediaViewerGesturesProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<DragState>({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);
  const [swipeStart, setSwipeStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [isSwipeMode, setIsSwipeMode] = useState(false);
  const touchState = useRef<TouchState>({
    touches: [],
    initialDistance: 0,
    initialAngle: 0,
    initialZoom: 1,
    initialPan: { x: 0, y: 0 },
  });

  const calculateDistance = (
    touch1: { x: number; y: number },
    touch2: { x: number; y: number },
  ) => {
    return Math.sqrt(Math.pow(touch2.x - touch1.x, 2) + Math.pow(touch2.y - touch1.y, 2));
  };

  const calculateAngle = (touch1: { x: number; y: number }, touch2: { x: number; y: number }) => {
    return (Math.atan2(touch2.y - touch1.y, touch2.x - touch1.x) * 180) / Math.PI;
  };

  const getCenter = (touches: Array<{ x: number; y: number }>) => {
    const x = touches.reduce((sum, touch) => sum + touch.x, 0) / touches.length;
    const y = touches.reduce((sum, touch) => sum + touch.y, 0) / touches.length;
    return { x, y };
  };

  // Enhanced mouse wheel with momentum scrolling
  const { run: handleWheel } = useThrottleFn(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      const newZoom = Math.max(0.25, Math.min(5, zoom + delta));
      setZoom(newZoom);
    },
    { wait: 16 },
  );

  // Throttled mouse move handler for smooth panning
  const { run: handleMouseMove } = useThrottleFn(
    (e: React.MouseEvent) => {
      if (isDragging && zoom > 1) {
        setPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    { wait: 16 },
  );

  // Enhanced touch move handler with pinch-to-zoom and swipe
  const { run: handleTouchMove } = useThrottleFn(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touches = Array.from(e.touches).map((touch) => ({
        x: touch.clientX,
        y: touch.clientY,
        id: touch.identifier,
      }));

      if (touches.length === 1 && isDragging && zoom > 1 && !isSwipeMode) {
        // Single touch panning
        const touch = touches[0];
        setPan({
          x: touch.x - dragStart.x,
          y: touch.y - dragStart.y,
        });
      } else if (touches.length === 2) {
        // Multi-touch pinch-to-zoom
        const touch1 = touches[0];
        const touch2 = touches[1];

        const currentDistance = calculateDistance(touch1, touch2);
        const center = getCenter(touches);

        if (touchState.current.initialDistance > 0) {
          // Pinch-to-zoom
          const scaleChange = currentDistance / touchState.current.initialDistance;
          const newZoom = Math.max(0.25, Math.min(5, touchState.current.initialZoom * scaleChange));
          setZoom(newZoom);

          // Pan adjustment to keep zoom center
          const panDelta = {
            x: center.x - touchState.current.initialPan.x,
            y: center.y - touchState.current.initialPan.y,
          };
          setPan(panDelta);
        }
      } else if (touches.length === 1 && isSwipeMode) {
        // Handle swipe navigation
        const touch = touches[0];
        const deltaX = touch.x - (swipeStart?.x || 0);
        const deltaY = touch.y - (swipeStart?.y || 0);

        const swipeThreshold = 100;
        if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
          const now = Date.now();
          const timeDiff = now - (swipeStart?.time || 0);

          if (timeDiff < 500) {
            if (deltaX > 0 && currentIndex > 0) {
              onIndexChange?.(currentIndex - 1);
            } else if (deltaX < 0 && currentIndex < totalImages - 1) {
              onIndexChange?.(currentIndex + 1);
            }
            setIsSwipeMode(false);
            setSwipeStart(null);
          }
        }
      }

      touchState.current.touches = touches;
    },
    { wait: 16 },
  );

  const handleDoubleClick = () => {
    setIsTransitioning(true);
    if (zoom === 1) {
      setZoom(2);
    } else {
      setZoom(1);
    }
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    const touches = Array.from(e.touches).map((touch) => ({
      x: touch.clientX,
      y: touch.clientY,
      id: touch.identifier,
    }));

    if (touches.length === 1) {
      const touch = touches[0];

      if (tapLength < 500 && tapLength > 0) {
        // Double tap
        setIsTransitioning(true);
        if (zoom === 1) {
          setZoom(2);
        } else {
          setZoom(1);
        }
        setPan({ x: 0, y: 0 });
        setTimeout(() => setIsTransitioning(false), 200);
      } else if (zoom > 1) {
        // Start drag
        setIsTransitioning(false);
        setIsDragging(true);
        setDragStart({ x: touch.x - pan.x, y: touch.y - pan.y });
      } else {
        // Prepare for swipe
        setIsSwipeMode(true);
        setSwipeStart({ x: touch.x, y: touch.y, time: currentTime });
      }
    } else if (touches.length === 2) {
      // Multi-touch start
      setIsTransitioning(false);
      setIsDragging(false);
      setIsSwipeMode(false);

      const touch1 = touches[0];
      const touch2 = touches[1];
      const initialDistance = calculateDistance(touch1, touch2);
      const center = getCenter(touches);

      touchState.current = {
        touches,
        initialDistance,
        initialAngle: 0,
        initialZoom: zoom,
        initialPan: center,
      };
    }

    setLastTap(currentTime);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsTransitioning(false);
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const remainingTouches = e.touches.length;

    if (remainingTouches === 0) {
      setIsDragging(false);
      setIsSwipeMode(false);
      setSwipeStart(null);
      touchState.current = {
        touches: [],
        initialDistance: 0,
        initialAngle: 0,
        initialZoom: 1,
        initialPan: { x: 0, y: 0 },
      };
    } else if (remainingTouches === 1) {
      const touch = e.touches[0];
      setIsDragging(zoom > 1);
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const getGestureState = () => {
    return {
      isDragging,
      isSwipeMode,
      isPinching: touchState.current.touches.length === 2,
      isDoubleTapZooming: zoom !== 1 && lastTap > 0,
      swipeDirection: swipeStart
        ? touchState.current.touches.length > 0
          ? touchState.current.touches[0].x - swipeStart.x > 0
            ? 'right'
            : 'left'
          : null
        : null,
    };
  };

  return {
    isDragging,
    isSwipeMode,
    handleWheel,
    handleMouseMove,
    handleTouchMove,
    handleDoubleClick,
    handleTouchStart,
    handleMouseDown,
    handleMouseUp,
    handleTouchEnd,
    getGestureState,
  };
}
