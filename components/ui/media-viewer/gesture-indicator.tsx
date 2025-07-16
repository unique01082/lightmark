import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Hand, Move, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useState } from 'react';

interface GestureIndicatorProps {
  gestureState: {
    isDragging: boolean;
    isSwipeMode: boolean;
    isPinching: boolean;
    isDoubleTapZooming: boolean;
    swipeDirection: string | null;
  };
  zoom: number;
  isVisible: boolean;
}

export function GestureIndicator({ gestureState, zoom, isVisible }: GestureIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(false);
  const [indicatorText, setIndicatorText] = useState('');
  const [indicatorIcon, setIndicatorIcon] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (!isVisible) return;

    let text = '';
    let icon: React.ReactNode = null;
    let shouldShow = false;

    if (gestureState.isDragging) {
      text = 'Panning';
      icon = <Move className="h-4 w-4" />;
      shouldShow = true;
    } else if (gestureState.isPinching) {
      text = 'Pinch to zoom';
      icon = <ZoomIn className="h-4 w-4" />;
      shouldShow = true;
    } else if (gestureState.isSwipeMode) {
      if (gestureState.swipeDirection === 'left') {
        text = 'Swipe left for next';
        icon = <ChevronRight className="h-4 w-4" />;
      } else if (gestureState.swipeDirection === 'right') {
        text = 'Swipe right for previous';
        icon = <ChevronLeft className="h-4 w-4" />;
      } else {
        text = 'Swipe to navigate';
        icon = <Hand className="h-4 w-4" />;
      }
      shouldShow = true;
    } else if (gestureState.isDoubleTapZooming) {
      text = zoom > 1 ? 'Double tap to zoom out' : 'Double tap to zoom in';
      icon = zoom > 1 ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />;
      shouldShow = true;
    }

    setIndicatorText(text);
    setIndicatorIcon(icon);
    setShowIndicator(shouldShow);

    if (shouldShow) {
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gestureState, zoom, isVisible]);

  if (!showIndicator || !isVisible) return null;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
      <Badge
        variant="secondary"
        className="flex items-center gap-2 bg-black/80 text-white border-white/20 px-3 py-2 text-sm animate-in fade-in-0 duration-200"
      >
        {indicatorIcon}
        {indicatorText}
      </Badge>
    </div>
  );
}

// Touch helper hints component
export function TouchHints({ isVisible }: { isVisible: boolean }) {
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowHints(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!showHints || !isVisible) return null;

  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
      <div className="flex flex-col items-center gap-2 text-white/60 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Hand className="h-3 w-3" />
            <span>Swipe to navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <ZoomIn className="h-3 w-3" />
            <span>Pinch to zoom</span>
          </div>
          <div className="flex items-center gap-1">
            <Move className="h-3 w-3" />
            <span>Double tap to zoom</span>
          </div>
        </div>
        <div className="text-center opacity-80">Touch and hold to access quick actions</div>
      </div>
    </div>
  );
}
