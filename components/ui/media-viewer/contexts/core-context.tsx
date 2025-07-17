'use client';

import { createContext, useContext, useState } from 'react';
import type { ImageSize, RotationState } from '../types';

export interface MediaViewerCoreContextType {
  // Core state
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  metadata?: Record<string, any>[];

  // Image state
  imageNaturalSize: ImageSize;
  setImageNaturalSize: (size: ImageSize) => void;
  imageDisplaySize: ImageSize;
  setImageDisplaySize: (size: ImageSize) => void;
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
  rotation: RotationState;
  setRotation: (rotation: RotationState | ((prev: RotationState) => RotationState)) => void;

  // Navigation
  handlePrevious: () => void;
  handleNext: () => void;
  handleRotate: () => void;
  handleImageLoad: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const MediaViewerCoreContext = createContext<MediaViewerCoreContextType | null>(null);

export function useMediaViewerCore() {
  const context = useContext(MediaViewerCoreContext);
  if (!context) {
    throw new Error('useMediaViewerCore must be used within a MediaViewerCoreProvider');
  }
  return context;
}

interface MediaViewerCoreProviderProps {
  children: React.ReactNode;
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  metadata?: Record<string, any>[];
}

export function MediaViewerCoreProvider({
  children,
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  metadata,
}: MediaViewerCoreProviderProps) {
  const [imageNaturalSize, setImageNaturalSize] = useState<ImageSize>({ width: 0, height: 0 });
  const [imageDisplaySize, setImageDisplaySize] = useState<ImageSize>({ width: 0, height: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [rotation, setRotation] = useState<RotationState>({ angle: 0 });

  const handleRotate = () => {
    setRotation((prev) => ({
      angle: ((prev.angle + 90) % 360) as 0 | 90 | 180 | 270,
    }));
  };

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    setImageNaturalSize({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
    setImageDisplaySize({
      width: img.clientWidth,
      height: img.clientHeight,
    });
    setIsTransitioning(false);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) onIndexChange(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) onIndexChange(currentIndex + 1);
  };

  const contextValue: MediaViewerCoreContextType = {
    images,
    currentIndex,
    isOpen,
    onClose,
    onIndexChange,
    metadata,
    imageNaturalSize,
    setImageNaturalSize,
    imageDisplaySize,
    setImageDisplaySize,
    isTransitioning,
    setIsTransitioning,
    rotation,
    setRotation,
    handlePrevious,
    handleNext,
    handleRotate,
    handleImageLoad,
  };

  return (
    <MediaViewerCoreContext.Provider value={contextValue}>
      {children}
    </MediaViewerCoreContext.Provider>
  );
}
