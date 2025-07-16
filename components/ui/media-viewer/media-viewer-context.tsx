'use client';

import { useLocalStorageState } from 'ahooks';
import { createContext, useContext, useEffect, useState } from 'react';
import { useLazyImageLoading } from '../../../hooks/use-lazy-image-loading';
import { useMediaViewerComparison } from '../../../hooks/use-media-viewer-comparison';
import { useOfflineImageCache } from '../../../hooks/use-offline-image-cache';
import type { ImageSize, PanState, RotationState, SlideshowState } from './types';
import { useMediaViewerGestures } from './use-media-viewer-gestures';
import { useMediaViewerKeyboard } from './use-media-viewer-keyboard';
import { useMediaViewerZoom } from './use-media-viewer-zoom';

interface MediaViewerContextType {
  // Core state
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  metadata?: Record<string, any>[];

  // Zoom and Pan
  zoom: number;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  pan: PanState;
  setPan: (pan: PanState) => void;

  // Image state
  imageNaturalSize: ImageSize;
  setImageNaturalSize: (size: ImageSize) => void;
  imageDisplaySize: ImageSize;
  setImageDisplaySize: (size: ImageSize) => void;
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
  rotation: RotationState;
  setRotation: (rotation: RotationState | ((prev: RotationState) => RotationState)) => void;

  // UI state
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
  showHistogram: boolean;
  setShowHistogram: (show: boolean) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  showQuickActions: boolean;
  setShowQuickActions: (show: boolean) => void;
  showRating: boolean;
  setShowRating: (show: boolean) => void;
  showLoadingIndicator: boolean;
  setShowLoadingIndicator: (show: boolean) => void;

  // Slideshow
  slideshow: SlideshowState;
  setSlideshow: (slideshow: SlideshowState | ((prev: SlideshowState) => SlideshowState)) => void;

  // Favorites
  favoritesList: string[];
  setFavoritesList: (favorites: string[]) => void;
  favorites: Set<string>;

  // Ratings
  imageRatings: Record<string, any>;
  setImageRatings: (
    ratings: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>),
  ) => void;

  // Offline caching
  offlineSettings: any;
  isOnline: boolean;
  cacheStats: any;
  setCacheStats: (stats: any) => void;
  showOfflineSettings: boolean;
  setShowOfflineSettings: (show: boolean) => void;

  // Lazy loading
  getImage: (src: string) => any;
  loadImage: (src: string, priority?: 'high' | 'low') => Promise<any>;
  prefetchImage: (src: string) => void;
  loadingProgress: any;
  getLoadingStats: () => any;

  // Comparison
  comparisonState: any;

  // Gestures
  isDragging: boolean;
  getGestureState: () => any;

  // Zoom utilities
  getActualZoomPercentage: () => number;
  getZoomRatio: () => string;
  getImageSizeInfo: () => any;
  calculateNaturalZoom: () => number;
  calculateFitZoom: () => number;
  calculateZoomLevel: (targetPercentage: number) => number;
  calculateZoomForRatio: (ratio: number) => number;
  getZoomLevels: () => { fit: number; '1:1': number; '2:1': number; '3:1': number };

  // Handlers
  handleRotate: () => void;
  handleImageLoad: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  handleQuickZoom: (zoomLevel: number) => void;
  handleNaturalZoom: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleFitZoom: () => void;
  handleZoomToPercentage: (percentage: number) => void;
  handleZoomToRatio: (ratio: number) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  toggleFavorite: () => void;
  handleFullscreen: () => void;
  toggleSlideshow: () => void;
  toggleHistogram: () => void;
  toggleGrid: () => void;
  toggleQuickActions: () => void;
  toggleRating: () => void;
  handleToggleComparison: () => void;
  handleDelete: () => void;
  handleShare: () => void;
  handleEdit: () => void;
  toggleOfflineSettings: () => void;

  // Gesture handlers
  handleWheel: (event: React.WheelEvent) => void;
  handleMouseMove: (event: React.MouseEvent) => void;
  handleTouchMove: (event: React.TouchEvent) => void;
  handleDoubleClick: (event: React.MouseEvent) => void;
  handleTouchStart: (event: React.TouchEvent) => void;
  handleMouseDown: (event: React.MouseEvent) => void;
  handleMouseUp: (event: React.MouseEvent) => void;
  handleTouchEnd: (event: React.TouchEvent) => void;

  // Offline functions
  cacheImage: (src: string, priority?: 'high' | 'medium' | 'low') => Promise<any>;
  getCachedImage: (src: string) => Promise<any>;
  clearCache: () => Promise<void>;
  getCacheStats: () => any;

  // Fullscreen state
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  isDistractionFree: boolean;
  setIsDistractionFree: (distractionFree: boolean) => void;
  fullscreenMode: 'normal' | 'distraction-free' | 'minimal';
  setFullscreenMode: (mode: 'normal' | 'distraction-free' | 'minimal') => void;

  // Fullscreen handlers
  handleDistractionFreeToggle: () => void;
  handleFullscreenModeChange: (mode: 'normal' | 'distraction-free' | 'minimal') => void;
  exitFullscreen: () => void;

  // Help
  showKeyboardHelp: boolean;
  setShowKeyboardHelp: (show: boolean) => void;
  toggleKeyboardHelp: () => void;

  // Crop Simulator
  showCropSimulator: boolean;
  setShowCropSimulator: (show: boolean) => void;
  toggleCropSimulator: () => void;
  handleCropApply: (cropArea: { x: number; y: number; width: number; height: number }) => void;
}

const MediaViewerContext = createContext<MediaViewerContextType | null>(null);

export function useMediaViewerContext() {
  const context = useContext(MediaViewerContext);
  if (!context) {
    throw new Error('useMediaViewerContext must be used within a MediaViewerProvider');
  }
  return context;
}

interface MediaViewerProviderProps {
  children: React.ReactNode;
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  metadata?: Record<string, any>[];
}

export function MediaViewerProvider({
  children,
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  metadata,
}: MediaViewerProviderProps) {
  // Core state
  const [zoom, setZoom] = useState(1);
  const [showInfo, setShowInfo] = useLocalStorageState('media-viewer-show-info', {
    defaultValue: false,
  });
  const [pan, setPan] = useState<PanState>({ x: 0, y: 0 });
  const [imageNaturalSize, setImageNaturalSize] = useState<ImageSize>({ width: 0, height: 0 });
  const [imageDisplaySize, setImageDisplaySize] = useState<ImageSize>({ width: 0, height: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [rotation, setRotation] = useState<RotationState>({ angle: 0 });
  const [slideshow, setSlideshow] = useState<SlideshowState>({
    isActive: false,
    interval: 3000,
    isPaused: false,
  });
  const [favoritesList, setFavoritesList] = useLocalStorageState<string[]>(
    'media-viewer-favorites',
    {
      defaultValue: [],
    },
  );
  const favorites = new Set(favoritesList);
  const [showHistogram, setShowHistogram] = useLocalStorageState('media-viewer-show-histogram', {
    defaultValue: false,
  });
  const [showGrid, setShowGrid] = useLocalStorageState('media-viewer-show-grid', {
    defaultValue: false,
  });
  const [showQuickActions, setShowQuickActions] = useLocalStorageState(
    'media-viewer-show-quick-actions',
    {
      defaultValue: false,
    },
  );
  const [showRating, setShowRating] = useLocalStorageState('media-viewer-show-rating', {
    defaultValue: false,
  });
  const [imageRatings, setImageRatings] = useLocalStorageState<Record<string, any>>(
    'media-viewer-ratings',
    {
      defaultValue: {},
    },
  );
  const [showLoadingIndicator, setShowLoadingIndicator] = useLocalStorageState(
    'media-viewer-show-loading-indicator',
    {
      defaultValue: true,
    },
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState<'normal' | 'distraction-free' | 'minimal'>(
    'normal',
  );
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showCropSimulator, setShowCropSimulator] = useState(false);

  // Hooks
  const { getImage, loadImage, prefetchImage, loadingProgress, getLoadingStats } =
    useLazyImageLoading(images, currentIndex, {
      preloadRadius: 3,
      maxCacheSize: 25,
      enablePrefetch: true,
      quality: 'high',
      retryAttempts: 3,
      retryDelay: 1000,
    });

  const { cacheImage, getCachedImage, clearCache, isOnline, offlineSettings, getCacheStats } =
    useOfflineImageCache();

  const [showOfflineSettings, setShowOfflineSettings] = useState(false);
  const [cacheStats, setCacheStats] = useState<any>({
    totalCacheSize: 0,
    totalEntries: 0,
    hitRate: 0,
    compressionRatio: 0,
    lastSync: 0,
    isOnline: true,
    pendingUploads: 0,
  });

  const { comparisonState, startComparison, exitComparison } = useMediaViewerComparison(
    images.length,
  );

  const {
    isDragging,
    handleWheel,
    handleMouseMove,
    handleTouchMove,
    handleDoubleClick,
    handleTouchStart,
    handleMouseDown,
    handleMouseUp,
    handleTouchEnd,
    getGestureState,
  } = useMediaViewerGestures({
    zoom,
    pan,
    setPan,
    setZoom,
    setIsTransitioning,
    imageNaturalSize,
    imageDisplaySize,
    onIndexChange,
    currentIndex,
    totalImages: images.length,
    onRotate: () => handleRotate(),
  });

  const {
    getActualZoomPercentage,
    getZoomRatio,
    getImageSizeInfo,
    calculateNaturalZoom,
    calculateFitZoom,
    calculateZoomLevel,
    calculateZoomForRatio,
    getZoomLevels,
  } = useMediaViewerZoom({
    imageNaturalSize,
    imageDisplaySize,
    zoom,
  });

  // Handlers
  const handleRotate = () => {
    setRotation((prev) => ({
      angle: ((prev.angle + 90) % 360) as 0 | 90 | 180 | 270,
    }));
  };

  const handleImageLoad = async (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
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

    if (offlineSettings.enabled) {
      const currentSrc = images[currentIndex];
      await cacheImage(currentSrc, 'high');

      const preloadImages = [
        images[currentIndex - 1],
        images[currentIndex + 1],
        images[currentIndex - 2],
        images[currentIndex + 2],
      ].filter((src) => src && src !== currentSrc);

      preloadImages.forEach(async (src) => {
        if (src) {
          await cacheImage(src, 'medium');
        }
      });
    }
  };

  const handleQuickZoom = (zoomLevel: number) => {
    setIsTransitioning(true);
    setZoom(zoomLevel);
    setPan({ x: 0, y: 0 });
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const handleNaturalZoom = () => {
    setIsTransitioning(true);
    const naturalZoom = calculateNaturalZoom();
    setZoom(naturalZoom);
    setPan({ x: 0, y: 0 });
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 5)); // Max zoom 5x
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.1)); // Min zoom 0.1x
  };

  const handleFitZoom = () => {
    setIsTransitioning(true);
    const fitZoom = calculateFitZoom();
    setZoom(fitZoom);
    setPan({ x: 0, y: 0 });
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const handleZoomToPercentage = (percentage: number) => {
    setIsTransitioning(true);
    const zoomLevel = calculateZoomLevel(percentage);
    setZoom(zoomLevel);
    setPan({ x: 0, y: 0 });
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const handleZoomToRatio = (ratio: number) => {
    setIsTransitioning(true);
    const zoomLevel = calculateZoomForRatio(ratio);
    setZoom(zoomLevel);
    setPan({ x: 0, y: 0 });
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) onIndexChange(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) onIndexChange(currentIndex + 1);
  };

  const toggleFavorite = () => {
    const currentImage = images[currentIndex];
    if (favorites.has(currentImage)) {
      setFavoritesList(favoritesList.filter((img) => img !== currentImage));
    } else {
      setFavoritesList([...favoritesList, currentImage]);
    }
  };

  const handleFullscreen = () => {
    if (typeof document !== 'undefined') {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  const handleDistractionFreeToggle = () => {
    setIsDistractionFree((prev) => !prev);
    if (!isDistractionFree) {
      setFullscreenMode('distraction-free');
    } else {
      setFullscreenMode('normal');
    }
  };

  const handleFullscreenModeChange = (mode: 'normal' | 'distraction-free' | 'minimal') => {
    setFullscreenMode(mode);
    if (mode === 'distraction-free') {
      setIsDistractionFree(true);
    } else {
      setIsDistractionFree(false);
    }
  };

  const exitFullscreen = () => {
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
      setIsDistractionFree(false);
      setFullscreenMode('normal');
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const handleFullscreenChange = () => {
        const isCurrentlyFullscreen = !!document.fullscreenElement;
        setIsFullscreen(isCurrentlyFullscreen);

        if (!isCurrentlyFullscreen) {
          setIsDistractionFree(false);
          setFullscreenMode('normal');
        }
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', handleFullscreenChange);
      document.addEventListener('MSFullscreenChange', handleFullscreenChange);

      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      };
    }
  }, []);

  const toggleSlideshow = () => {
    setSlideshow((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const toggleHistogram = () => {
    setShowHistogram(!showHistogram);
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  const toggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
  };

  const toggleRating = () => {
    setShowRating(!showRating);
  };

  const handleToggleComparison = () => {
    if (comparisonState.isActive) {
      exitComparison();
    } else {
      startComparison(currentIndex);
    }
  };

  const handleDelete = () => {
    if (
      typeof window !== 'undefined' &&
      window.confirm('Are you sure you want to delete this photo?')
    ) {
      console.log('Delete photo:', images[currentIndex]);
      const newImages = images.filter((_, index) => index !== currentIndex);
      if (newImages.length === 0) {
        onClose();
      } else {
        const newIndex = currentIndex >= newImages.length ? newImages.length - 1 : currentIndex;
        onIndexChange(newIndex);
      }
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      const currentImage = images[currentIndex];
      if (navigator.share) {
        navigator
          .share({
            title: 'Shared Photo',
            text: `Check out this photo!`,
            url: currentImage,
          })
          .catch((error) => console.log('Error sharing:', error));
      } else {
        navigator.clipboard
          .writeText(currentImage)
          .then(() => {
            alert('Photo URL copied to clipboard!');
          })
          .catch(() => {
            alert('Unable to share photo');
          });
      }
    }
  };

  const handleEdit = () => {
    console.log('Edit photo:', images[currentIndex]);
    alert('Edit functionality would open here');
  };

  const toggleOfflineSettings = () => {
    setShowOfflineSettings(!showOfflineSettings);
  };

  const toggleKeyboardHelp = () => {
    setShowKeyboardHelp(!showKeyboardHelp);
  };

  const toggleCropSimulator = () => {
    setShowCropSimulator(!showCropSimulator);
  };

  const handleCropApply = (cropArea: { x: number; y: number; width: number; height: number }) => {
    console.log('Crop applied:', cropArea);
    // Here you would typically apply the crop to the image
    // For now, we'll just log the crop area
    setShowCropSimulator(false);
  };

  // Update cache stats
  useEffect(() => {
    const updateStats = async () => {
      const stats = await getCacheStats();
      setCacheStats(stats);
    };
    updateStats();
  }, [getCacheStats]);

  // Keyboard shortcuts
  useMediaViewerKeyboard({
    isOpen,
    currentIndex,
    imagesLength: images.length,
    onClose,
    onIndexChange,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onRotate: handleRotate,
    onToggleFavorite: toggleFavorite,
    onToggleSlideshow: toggleSlideshow,
    onToggleHistogram: toggleHistogram,
    onToggleGrid: toggleGrid,
    onToggleQuickActions: toggleQuickActions,
    onToggleRating: toggleRating,
    onToggleComparison: handleToggleComparison,
    onRate: (rating) => {
      const imageId = images[currentIndex];
      setImageRatings((prev) => ({
        ...prev,
        [imageId]: { ...(prev?.[imageId] || {}), rating },
      }));
    },
    onReject: () => {
      const imageId = images[currentIndex];
      setImageRatings((prev) => ({
        ...prev,
        [imageId]: {
          ...(prev?.[imageId] || {}),
          isRejected: !(prev?.[imageId]?.isRejected || false),
        },
      }));
    },
    onPick: () => {
      const imageId = images[currentIndex];
      setImageRatings((prev) => ({
        ...prev,
        [imageId]: { ...(prev?.[imageId] || {}), isPicked: !(prev?.[imageId]?.isPicked || false) },
      }));
    },
    onEdit: handleEdit,
    onCrop: toggleCropSimulator,
    onFullscreen: handleFullscreen,
    onDistractionFreeToggle: handleDistractionFreeToggle,
    onFullscreenModeChange: handleFullscreenModeChange,
    onExitFullscreen: exitFullscreen,
    isFullscreen,
    fullscreenMode,
    onToggleHelp: toggleKeyboardHelp,
  });

  const contextValue: MediaViewerContextType = {
    images,
    currentIndex,
    isOpen,
    onClose,
    onIndexChange,
    metadata,
    zoom,
    setZoom,
    pan,
    setPan,
    imageNaturalSize,
    setImageNaturalSize,
    imageDisplaySize,
    setImageDisplaySize,
    isTransitioning,
    setIsTransitioning,
    rotation,
    setRotation,
    showInfo,
    setShowInfo,
    showHistogram,
    setShowHistogram,
    showGrid,
    setShowGrid,
    showQuickActions,
    setShowQuickActions,
    showRating,
    setShowRating,
    showLoadingIndicator,
    setShowLoadingIndicator,
    slideshow,
    setSlideshow,
    favoritesList,
    setFavoritesList,
    favorites,
    imageRatings,
    setImageRatings,
    offlineSettings,
    isOnline,
    cacheStats,
    setCacheStats,
    showOfflineSettings,
    setShowOfflineSettings,
    getImage,
    loadImage,
    prefetchImage,
    loadingProgress,
    getLoadingStats,
    comparisonState,
    isDragging,
    getGestureState,
    getActualZoomPercentage,
    getZoomRatio,
    getImageSizeInfo,
    calculateNaturalZoom,
    calculateFitZoom,
    calculateZoomLevel,
    calculateZoomForRatio,
    getZoomLevels,
    handleRotate,
    handleImageLoad,
    handleQuickZoom,
    handleNaturalZoom,
    handleZoomIn,
    handleZoomOut,
    handleFitZoom,
    handleZoomToPercentage,
    handleZoomToRatio,
    handlePrevious,
    handleNext,
    toggleFavorite,
    handleFullscreen,
    toggleSlideshow,
    toggleHistogram,
    toggleGrid,
    toggleQuickActions,
    toggleRating,
    handleToggleComparison,
    handleDelete,
    handleShare,
    handleEdit,
    toggleOfflineSettings,
    handleWheel,
    handleMouseMove,
    handleTouchMove,
    handleDoubleClick,
    handleTouchStart,
    handleMouseDown,
    handleMouseUp,
    handleTouchEnd,
    cacheImage,
    getCachedImage,
    clearCache,
    getCacheStats,
    isFullscreen,
    setIsFullscreen,
    isDistractionFree,
    setIsDistractionFree,
    fullscreenMode,
    setFullscreenMode,
    handleDistractionFreeToggle,
    handleFullscreenModeChange,
    exitFullscreen,
    showKeyboardHelp,
    setShowKeyboardHelp,
    toggleKeyboardHelp,
    showCropSimulator,
    setShowCropSimulator,
    toggleCropSimulator,
    handleCropApply,
  };

  return <MediaViewerContext.Provider value={contextValue}>{children}</MediaViewerContext.Provider>;
}
