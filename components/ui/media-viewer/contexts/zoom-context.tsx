'use client';

import { createContext, useContext, useState } from 'react';
import type { PanState } from '../types';
import { useMediaViewerZoom as useZoomUtils } from '../use-media-viewer-zoom';
import { useMediaViewerCore } from './core-context';

export interface MediaViewerZoomContextType {
  // Zoom and Pan
  zoom: number;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  pan: PanState;
  setPan: (pan: PanState) => void;

  // Zoom utilities
  getActualZoomPercentage: () => number;
  getZoomRatio: () => string;
  getImageSizeInfo: () => string;
  calculateNaturalZoom: () => number;
  calculateFitZoom: () => number;
  calculateZoomLevel: (targetPercentage: number) => number;
  calculateZoomForRatio: (ratio: number) => number;
  getZoomLevels: () => { fit: number; '1:1': number; '2:1': number; '3:1': number };

  // Zoom handlers
  handleQuickZoom: (zoomLevel: number) => void;
  handleNaturalZoom: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleFitZoom: () => void;
  handleZoomToPercentage: (percentage: number) => void;
  handleZoomToRatio: (ratio: number) => void;
}

const MediaViewerZoomContext = createContext<MediaViewerZoomContextType | null>(null);

export function useMediaViewerZoom() {
  const context = useContext(MediaViewerZoomContext);
  if (!context) {
    throw new Error('useMediaViewerZoom must be used within a MediaViewerZoomProvider');
  }
  return context;
}

interface MediaViewerZoomProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function MediaViewerZoomProvider({
  children,
  enabled = true,
}: MediaViewerZoomProviderProps) {
  const { imageNaturalSize, imageDisplaySize, setIsTransitioning } = useMediaViewerCore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<PanState>({ x: 0, y: 0 });

  const zoomUtils = useZoomUtils({
    imageNaturalSize,
    imageDisplaySize,
    zoom,
  });

  const handleQuickZoom = (zoomLevel: number) => {
    if (!enabled) return;
    setIsTransitioning(true);
    setZoom(zoomLevel);
    setPan({ x: 0, y: 0 });
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const handleNaturalZoom = () => {
    if (!enabled) return;
    setIsTransitioning(true);
    const naturalZoom = zoomUtils.calculateNaturalZoom();
    setZoom(naturalZoom);
    setPan({ x: 0, y: 0 });
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const handleZoomIn = () => {
    if (!enabled) return;
    setZoom((prev) => Math.min(prev + 0.25, 5));
  };

  const handleZoomOut = () => {
    if (!enabled) return;
    setZoom((prev) => Math.max(prev - 0.25, 0.1));
  };

  const handleFitZoom = () => {
    if (!enabled) return;
    setIsTransitioning(true);
    const fitZoom = zoomUtils.calculateFitZoom();
    setZoom(fitZoom);
    setPan({ x: 0, y: 0 });
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const handleZoomToPercentage = (percentage: number) => {
    if (!enabled) return;
    setIsTransitioning(true);
    const zoomLevel = zoomUtils.calculateZoomLevel(percentage);
    setZoom(zoomLevel);
    setPan({ x: 0, y: 0 });
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const handleZoomToRatio = (ratio: number) => {
    if (!enabled) return;
    setIsTransitioning(true);
    const zoomLevel = zoomUtils.calculateZoomForRatio(ratio);
    setZoom(zoomLevel);
    setPan({ x: 0, y: 0 });
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const contextValue: MediaViewerZoomContextType = {
    zoom,
    setZoom,
    pan,
    setPan,
    getActualZoomPercentage: zoomUtils.getActualZoomPercentage,
    getZoomRatio: zoomUtils.getZoomRatio,
    getImageSizeInfo: zoomUtils.getImageSizeInfo,
    calculateNaturalZoom: zoomUtils.calculateNaturalZoom,
    calculateFitZoom: zoomUtils.calculateFitZoom,
    calculateZoomLevel: zoomUtils.calculateZoomLevel,
    calculateZoomForRatio: zoomUtils.calculateZoomForRatio,
    getZoomLevels: zoomUtils.getZoomLevels,
    handleQuickZoom,
    handleNaturalZoom,
    handleZoomIn,
    handleZoomOut,
    handleFitZoom,
    handleZoomToPercentage,
    handleZoomToRatio,
  };

  return (
    <MediaViewerZoomContext.Provider value={contextValue}>
      {children}
    </MediaViewerZoomContext.Provider>
  );
}
