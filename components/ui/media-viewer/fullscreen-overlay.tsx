'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Monitor,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface FullscreenOverlayProps {
  isFullscreen: boolean;
  isDistractionFree: boolean;
  fullscreenMode: 'normal' | 'distraction-free' | 'minimal';
  onFullscreenToggle: () => void;
  onDistractionFreeToggle: () => void;
  onFullscreenModeChange: (mode: 'normal' | 'distraction-free' | 'minimal') => void;
  onExitFullscreen: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  currentIndex: number;
  totalImages: number;
  className?: string;
}

export function FullscreenOverlay({
  isFullscreen,
  isDistractionFree,
  fullscreenMode,
  onFullscreenToggle,
  onDistractionFreeToggle,
  onFullscreenModeChange,
  onExitFullscreen,
  onPrevious,
  onNext,
  onClose,
  currentIndex,
  totalImages,
  className,
}: FullscreenOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  // Auto-hide controls in distraction-free mode
  useEffect(() => {
    if (isDistractionFree && isFullscreen) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      setHideTimeout(timeout);

      return () => {
        if (hideTimeout) clearTimeout(hideTimeout);
      };
    } else {
      setIsVisible(true);
      if (hideTimeout) clearTimeout(hideTimeout);
    }
  }, [isDistractionFree, isFullscreen]);

  // Show controls on mouse movement
  const handleMouseMove = () => {
    if (isDistractionFree && isFullscreen) {
      setIsVisible(true);
      if (hideTimeout) clearTimeout(hideTimeout);

      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      setHideTimeout(timeout);
    }
  };

  // Show controls on touch
  const handleTouch = () => {
    if (isDistractionFree && isFullscreen) {
      setIsVisible(true);
      if (hideTimeout) clearTimeout(hideTimeout);

      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      setHideTimeout(timeout);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFullscreen) return;

      switch (event.key) {
        case 'f':
        case 'F':
          event.preventDefault();
          onFullscreenToggle();
          break;
        case 'd':
        case 'D':
          event.preventDefault();
          onDistractionFreeToggle();
          break;
        case 'm':
        case 'M':
          event.preventDefault();
          const modes: ('normal' | 'distraction-free' | 'minimal')[] = [
            'normal',
            'distraction-free',
            'minimal',
          ];
          const currentModeIndex = modes.indexOf(fullscreenMode);
          const nextMode = modes[(currentModeIndex + 1) % modes.length];
          onFullscreenModeChange(nextMode);
          break;
        case 'Escape':
          event.preventDefault();
          onExitFullscreen();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onNext();
          break;
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [
    isFullscreen,
    fullscreenMode,
    onFullscreenToggle,
    onDistractionFreeToggle,
    onFullscreenModeChange,
    onExitFullscreen,
    onPrevious,
    onNext,
  ]);

  if (!isFullscreen) return null;

  return (
    <div
      className={cn('fixed inset-0 z-50 pointer-events-none', className)}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouch}
    >
      {/* Top Controls */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto transition-opacity duration-300',
          isVisible ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium">
              {currentIndex + 1} / {totalImages}
            </span>
            <div className="flex items-center gap-1">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  fullscreenMode === 'normal' ? 'bg-white' : 'bg-white/40',
                )}
              />
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  fullscreenMode === 'distraction-free' ? 'bg-white' : 'bg-white/40',
                )}
              />
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  fullscreenMode === 'minimal' ? 'bg-white' : 'bg-white/40',
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDistractionFreeToggle}
              className="text-white hover:bg-white/20"
              title="Toggle distraction-free mode (D)"
            >
              {isDistractionFree ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const modes: ('normal' | 'distraction-free' | 'minimal')[] = [
                  'normal',
                  'distraction-free',
                  'minimal',
                ];
                const currentModeIndex = modes.indexOf(fullscreenMode);
                const nextMode = modes[(currentModeIndex + 1) % modes.length];
                onFullscreenModeChange(nextMode);
              }}
              className="text-white hover:bg-white/20"
              title="Change fullscreen mode (M)"
            >
              <Monitor className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onFullscreenToggle}
              className="text-white hover:bg-white/20"
              title="Toggle fullscreen (F)"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onExitFullscreen}
              className="text-white hover:bg-white/20"
              title="Exit fullscreen (Escape)"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Side Navigation */}
      {fullscreenMode !== 'minimal' && (
        <>
          <div
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto transition-opacity duration-300',
              isVisible ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Button
              variant="ghost"
              size="lg"
              onClick={onPrevious}
              disabled={currentIndex === 0}
              className="text-white hover:bg-white/20 disabled:opacity-30"
              title="Previous image (←)"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <div
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto transition-opacity duration-300',
              isVisible ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Button
              variant="ghost"
              size="lg"
              onClick={onNext}
              disabled={currentIndex === totalImages - 1}
              className="text-white hover:bg-white/20 disabled:opacity-30"
              title="Next image (→)"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </>
      )}

      {/* Bottom Status Bar */}
      {fullscreenMode === 'normal' && (
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-auto transition-opacity duration-300',
            isVisible ? 'opacity-100' : 'opacity-0',
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-white text-sm">
                Mode: {fullscreenMode.charAt(0).toUpperCase() + fullscreenMode.slice(1)}
              </span>
              {isDistractionFree && (
                <span className="text-green-400 text-sm">Distraction-free</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs">
                F: Fullscreen • D: Distraction-free • M: Mode • ESC: Exit
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Mode Indicator */}
      {fullscreenMode === 'minimal' && (
        <div
          className={cn(
            'absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto transition-opacity duration-300',
            isVisible ? 'opacity-100' : 'opacity-0',
          )}
        >
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white text-sm">
              {currentIndex + 1} / {totalImages}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
