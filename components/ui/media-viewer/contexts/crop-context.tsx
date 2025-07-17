'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { ImageSize } from '../types';

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropSettings {
  aspectRatio: string;
  rotation: number;
  dimOpacity: number;
  showGrid: boolean;
  lockAspectRatio: boolean;
}

export interface MediaViewerCropContextType {
  // Crop state
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  cropArea: CropArea;
  setCropArea: (area: CropArea) => void;
  settings: CropSettings;
  setSettings: (settings: CropSettings | ((prev: CropSettings) => CropSettings)) => void;

  // Crop handlers
  handleStartCrop: () => void;
  handleEndCrop: () => void;
  handleResetCrop: () => void;
  handleApplyCrop: () => Promise<string | null>;
  handleCropAreaChange: (area: CropArea) => void;
  handleAspectRatioChange: (ratio: string) => void;
  handleRotationChange: (rotation: number) => void;
  handleDimOpacityChange: (opacity: number) => void;
  handleToggleGrid: () => void;
  handleToggleLockAspectRatio: () => void;

  // Crop utilities
  calculateCropArea: (containerSize: ImageSize, imageSize: ImageSize) => CropArea;
  getCropPreview: () => string | null;
  isCropValid: () => boolean;
  getCropData: () => {
    area: CropArea;
    settings: CropSettings;
    originalSize: ImageSize;
  } | null;
}

const MediaViewerCropContext = createContext<MediaViewerCropContextType | null>(null);

export function useMediaViewerCrop() {
  const context = useContext(MediaViewerCropContext);
  if (!context) {
    throw new Error('useMediaViewerCrop must be used within a MediaViewerCropProvider');
  }
  return context;
}

interface MediaViewerCropProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function MediaViewerCropProvider({
  children,
  enabled = true,
}: MediaViewerCropProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [settings, setSettings] = useState<CropSettings>({
    aspectRatio: 'free',
    rotation: 0,
    dimOpacity: 0.5,
    showGrid: true,
    lockAspectRatio: false,
  });

  const handleStartCrop = useCallback(() => {
    if (!enabled) return;
    setIsActive(true);
  }, [enabled]);

  const handleEndCrop = useCallback(() => {
    if (!enabled) return;
    setIsActive(false);
  }, [enabled]);

  const handleResetCrop = useCallback(() => {
    if (!enabled) return;
    setCropArea({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
    setSettings({
      aspectRatio: 'free',
      rotation: 0,
      dimOpacity: 0.5,
      showGrid: true,
      lockAspectRatio: false,
    });
  }, [enabled]);

  const handleApplyCrop = useCallback(async (): Promise<string | null> => {
    if (!enabled || !isActive) return null;

    // In a real implementation, this would process the crop
    console.log('Applying crop:', { cropArea, settings });

    // Simulate async crop processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock cropped image data URL
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
  }, [enabled, isActive, cropArea, settings]);

  const handleCropAreaChange = useCallback(
    (area: CropArea) => {
      if (!enabled) return;
      setCropArea(area);
    },
    [enabled],
  );

  const handleAspectRatioChange = useCallback(
    (ratio: string) => {
      if (!enabled) return;
      setSettings((prev) => ({ ...prev, aspectRatio: ratio }));
    },
    [enabled],
  );

  const handleRotationChange = useCallback(
    (rotation: number) => {
      if (!enabled) return;
      setSettings((prev) => ({ ...prev, rotation }));
    },
    [enabled],
  );

  const handleDimOpacityChange = useCallback(
    (opacity: number) => {
      if (!enabled) return;
      setSettings((prev) => ({ ...prev, dimOpacity: opacity }));
    },
    [enabled],
  );

  const handleToggleGrid = useCallback(() => {
    if (!enabled) return;
    setSettings((prev) => ({ ...prev, showGrid: !prev.showGrid }));
  }, [enabled]);

  const handleToggleLockAspectRatio = useCallback(() => {
    if (!enabled) return;
    setSettings((prev) => ({ ...prev, lockAspectRatio: !prev.lockAspectRatio }));
  }, [enabled]);

  const calculateCropArea = useCallback(
    (containerSize: ImageSize, imageSize: ImageSize): CropArea => {
      // Calculate initial crop area based on container and image size
      const aspectRatio = imageSize.width / imageSize.height;
      const containerAspectRatio = containerSize.width / containerSize.height;

      let cropWidth, cropHeight;

      if (aspectRatio > containerAspectRatio) {
        // Image is wider than container
        cropHeight = containerSize.height * 0.8;
        cropWidth = cropHeight * aspectRatio;
      } else {
        // Image is taller than container
        cropWidth = containerSize.width * 0.8;
        cropHeight = cropWidth / aspectRatio;
      }

      return {
        x: (containerSize.width - cropWidth) / 2,
        y: (containerSize.height - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight,
      };
    },
    [],
  );

  const getCropPreview = useCallback((): string | null => {
    if (!enabled || !isActive) return null;

    // In a real implementation, this would generate a preview
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
  }, [enabled, isActive]);

  const isCropValid = useCallback((): boolean => {
    return cropArea.width > 0 && cropArea.height > 0;
  }, [cropArea]);

  const getCropData = useCallback(() => {
    if (!enabled || !isActive || !isCropValid()) return null;

    return {
      area: cropArea,
      settings,
      originalSize: { width: 1920, height: 1080 }, // Mock original size
    };
  }, [enabled, isActive, isCropValid, cropArea, settings]);

  const contextValue: MediaViewerCropContextType = {
    isActive,
    setIsActive,
    cropArea,
    setCropArea,
    settings,
    setSettings,
    handleStartCrop,
    handleEndCrop,
    handleResetCrop,
    handleApplyCrop,
    handleCropAreaChange,
    handleAspectRatioChange,
    handleRotationChange,
    handleDimOpacityChange,
    handleToggleGrid,
    handleToggleLockAspectRatio,
    calculateCropArea,
    getCropPreview,
    isCropValid,
    getCropData,
  };

  return (
    <MediaViewerCropContext.Provider value={contextValue}>
      {children}
    </MediaViewerCropContext.Provider>
  );
}
