'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useMediaViewerCore } from './core-context';

export interface MediaViewerSlideshowContextType {
  // Slideshow state
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  interval: number;
  setInterval: (interval: number) => void;

  // Slideshow handlers
  handleToggleSlideshow: () => void;
  handleNextSlide: () => void;
  handlePrevSlide: () => void;
  handleSetInterval: (interval: number) => void;
  startSlideshow: () => void;
  stopSlideshow: () => void;
  resetSlideshow: () => void;
}

const MediaViewerSlideshowContext = createContext<MediaViewerSlideshowContextType | null>(null);

export function useMediaViewerSlideshow() {
  const context = useContext(MediaViewerSlideshowContext);
  if (!context) {
    throw new Error('useMediaViewerSlideshow must be used within a MediaViewerSlideshowProvider');
  }
  return context;
}

interface MediaViewerSlideshowProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function MediaViewerSlideshowProvider({
  children,
  enabled = true,
}: MediaViewerSlideshowProviderProps) {
  const { handleNext, handlePrevious, images, currentIndex } = useMediaViewerCore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [interval, setInterval] = useState(3000); // 3 seconds default

  const handleNextSlide = useCallback(() => {
    if (!enabled) return;
    handleNext();
  }, [enabled, handleNext]);

  const handlePrevSlide = useCallback(() => {
    if (!enabled) return;
    handlePrevious();
  }, [enabled, handlePrevious]);

  const handleToggleSlideshow = useCallback(() => {
    if (!enabled) return;
    setIsPlaying(!isPlaying);
  }, [enabled, isPlaying]);

  const handleSetInterval = useCallback(
    (newInterval: number) => {
      if (!enabled) return;
      setInterval(newInterval);
    },
    [enabled],
  );

  const startSlideshow = useCallback(() => {
    if (!enabled) return;
    setIsPlaying(true);
  }, [enabled]);

  const stopSlideshow = useCallback(() => {
    if (!enabled) return;
    setIsPlaying(false);
  }, [enabled]);

  const resetSlideshow = useCallback(() => {
    setIsPlaying(false);
    setInterval(3000);
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (!enabled || !isPlaying || images.length <= 1) return;

    const timer = setTimeout(() => {
      // Stop if we've reached the last image
      if (currentIndex >= images.length - 1) {
        setIsPlaying(false);
        return;
      }
      handleNext();
    }, interval);

    return () => clearTimeout(timer);
  }, [enabled, isPlaying, currentIndex, images.length, interval, handleNext]);

  const contextValue: MediaViewerSlideshowContextType = {
    isPlaying,
    setIsPlaying,
    interval,
    setInterval,
    handleToggleSlideshow,
    handleNextSlide,
    handlePrevSlide,
    handleSetInterval,
    startSlideshow,
    stopSlideshow,
    resetSlideshow,
  };

  return (
    <MediaViewerSlideshowContext.Provider value={contextValue}>
      {children}
    </MediaViewerSlideshowContext.Provider>
  );
}
