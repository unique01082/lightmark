'use client';

import { createContext, useContext, useState } from 'react';

export interface MediaViewerUIStateContextType {
  // UI State
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
  showOverlay: boolean;
  setShowOverlay: (show: boolean) => void;
  overlayOpacity: number;
  setOverlayOpacity: (opacity: number) => void;
  showControls: boolean;
  setShowControls: (show: boolean) => void;

  // Tool state
  currentTool: string | null;
  setCurrentTool: (tool: string | null) => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;

  // UI handlers
  handleMouseMove: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  resetUIState: () => void;
}

const MediaViewerUIStateContext = createContext<MediaViewerUIStateContextType | null>(null);

export function useMediaViewerUIState() {
  const context = useContext(MediaViewerUIStateContext);
  if (!context) {
    throw new Error('useMediaViewerUIState must be used within a MediaViewerUIStateProvider');
  }
  return context;
}

interface MediaViewerUIStateProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function MediaViewerUIStateProvider({
  children,
  enabled = true,
}: MediaViewerUIStateProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [showControls, setShowControls] = useState(true);
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMouseMove = () => {
    if (!enabled) return;
    setShowControls(true);
  };

  const handleMouseEnter = () => {
    if (!enabled) return;
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    if (!enabled) return;
    // Keep controls visible when using tools
    if (!currentTool) {
      setShowControls(false);
    }
  };

  const resetUIState = () => {
    setIsTransitioning(false);
    setShowOverlay(true);
    setOverlayOpacity(0.5);
    setShowControls(true);
    setCurrentTool(null);
    setIsLoading(false);
    setError(null);
  };

  const contextValue: MediaViewerUIStateContextType = {
    isTransitioning,
    setIsTransitioning,
    showOverlay,
    setShowOverlay,
    overlayOpacity,
    setOverlayOpacity,
    showControls,
    setShowControls,
    currentTool,
    setCurrentTool,
    isLoading,
    setIsLoading,
    error,
    setError,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    resetUIState,
  };

  return (
    <MediaViewerUIStateContext.Provider value={contextValue}>
      {children}
    </MediaViewerUIStateContext.Provider>
  );
}
