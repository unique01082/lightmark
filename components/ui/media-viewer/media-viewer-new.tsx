'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CropSimulator } from './crop-simulator';
import { GestureIndicator, TouchHints } from './gesture-indicator';
import { KeyboardShortcutsHelp } from './keyboard-shortcuts-help';
import { LoadingIndicator } from './loading-indicator';
import { MediaViewerExternalDialogs } from './media-viewer-external-dialogs';
import { MediaViewerFeaturePanels } from './media-viewer-feature-panels';
import { MediaViewerFilmstrip } from './media-viewer-filmstrip';
import { MediaViewerHeader } from './media-viewer-header';
import { MediaViewerImageDisplay } from './media-viewer-image-display';
import { MediaViewerMetadataPanel } from './media-viewer-metadata-panel';
import { MediaViewerNavigation } from './media-viewer-navigation';
import { MediaViewerOverlays } from './media-viewer-overlays';
import { MediaViewerSlideshowManager } from './media-viewer-slideshow-manager';
import type { MediaViewerProps } from './types';

// Import all context providers
import {
  MediaViewerCoreProvider,
  MediaViewerCropProvider,
  MediaViewerFavoritesProvider,
  MediaViewerKeyboardProvider,
  MediaViewerRatingsProvider,
  MediaViewerSlideshowProvider,
  MediaViewerUIStateProvider,
  MediaViewerZoomProvider,
  useMediaViewerCore,
  useMediaViewerCrop,
  useMediaViewerFavorites,
  useMediaViewerKeyboard,
  useMediaViewerRatings,
  useMediaViewerSlideshow,
  useMediaViewerUIState,
  useMediaViewerZoom,
} from './contexts';

function MediaViewerContent() {
  const {
    images,
    currentIndex,
    metadata,
    onClose,
    handleNext,
    handlePrevious,
    handleRotate,
    onIndexChange,
  } = useMediaViewerCore();

  const {
    isTransitioning,
    showOverlay,
    overlayOpacity,
    showControls,
    currentTool,
    isLoading,
    error,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  } = useMediaViewerUIState();

  const {
    zoom,
    pan,
    getActualZoomPercentage,
    getZoomRatio,
    getImageSizeInfo,
    handleQuickZoom,
    handleNaturalZoom,
    handleZoomIn,
    handleZoomOut,
    handleFitZoom,
    handleZoomToPercentage,
    handleZoomToRatio,
  } = useMediaViewerZoom();

  const { isPlaying, interval, handleToggleSlideshow, handleNextSlide, handlePrevSlide } =
    useMediaViewerSlideshow();

  const { favorites, handleToggleFavorite, isCurrentImageFavorite } = useMediaViewerFavorites();

  const { ratings, handleSetCurrentRating, getCurrentRating } = useMediaViewerRatings();

  const { shortcuts, getShortcuts } = useMediaViewerKeyboard();

  const {
    isActive: isCropActive,
    handleStartCrop,
    handleEndCrop,
    handleApplyCrop,
  } = useMediaViewerCrop();

  if (images.length === 0) return null;

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95">
          <div
            className="relative w-full h-[95vh] flex flex-col"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <MediaViewerHeader
              currentIndex={currentIndex}
              totalImages={images.length}
              metadata={metadata}
              showInfo={false}
              onToggleInfo={() => {}}
              onClose={onClose}
              onQuickZoom={handleQuickZoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onNaturalZoom={handleNaturalZoom}
              onFitZoom={handleFitZoom}
              onZoomToPercentage={handleZoomToPercentage}
              onZoomToRatio={handleZoomToRatio}
              zoomPercentage={getActualZoomPercentage()}
              zoomRatio={getZoomRatio()}
              imageSizeInfo={getImageSizeInfo()}
              onRotate={handleRotate}
              onSlideshowToggle={handleToggleSlideshow}
              onFavoriteToggle={handleToggleFavorite}
              onFullscreen={() => {}}
              slideshow={{ isActive: isPlaying, isPaused: false }}
              isFavorite={isCurrentImageFavorite()}
              onDelete={() => {}}
              onShare={() => {}}
              onEdit={() => {}}
              onToggleHistogram={() => {}}
              showHistogram={false}
              onToggleGrid={() => {}}
              showGrid={false}
              onToggleQuickActions={() => {}}
              showQuickActions={false}
              onToggleRating={() => {}}
              showRating={false}
              onToggleComparison={() => {}}
              showComparison={false}
              onToggleKeyboardHelp={() => {}}
              onToggleCropSimulator={handleStartCrop}
            />

            <MediaViewerOverlays />

            <MediaViewerImageDisplay />

            <MediaViewerNavigation
              currentIndex={currentIndex}
              totalImages={images.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />

            <MediaViewerFilmstrip
              images={images}
              currentIndex={currentIndex}
              onImageSelect={onIndexChange}
            />

            <MediaViewerMetadataPanel
              showInfo={false}
              metadata={metadata}
              imageSizeInfo={getImageSizeInfo()}
              zoomPercentage={getActualZoomPercentage()}
            />

            <MediaViewerFeaturePanels />

            <GestureIndicator
              gestureState={{
                isDragging: false,
                isSwipeMode: false,
                isPinching: false,
                isDoubleTapZooming: false,
                swipeDirection: null,
              }}
              zoom={zoom}
              isVisible={true}
            />

            <TouchHints isVisible={true} />

            <LoadingIndicator
              loadingProgress={{ loaded: 0, total: 0, percentage: 0 }}
              loadingStats={{
                totalImages: 0,
                cachedImages: 0,
                loadedImages: 0,
                loadingImages: 0,
                errorImages: 0,
                cacheHitRate: 0,
                averageLoadTime: 0,
              }}
              isVisible={isLoading}
              onToggle={() => {}}
              showDetailedStats={false}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp isVisible={false} onToggle={() => {}} />

      {/* Crop Simulator */}
      <CropSimulator
        isOpen={isCropActive}
        onClose={handleEndCrop}
        imageSrc={images[currentIndex]}
        onCropApply={handleApplyCrop}
        onCropCancel={handleEndCrop}
      />

      <MediaViewerSlideshowManager />

      <MediaViewerExternalDialogs />
    </>
  );
}

export function MediaViewer({
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  metadata,
  // Feature enable/disable props
  enableZoom = true,
  enableSlideshow = true,
  enableFavorites = true,
  enableRatings = true,
  enableKeyboardShortcuts = true,
  enableCrop = true,
  enableFullscreen = true,
  enableGestures = true,
  enableUIState = true,
  // Feature configuration
  initialFavorites = [],
  initialRatings = {},
  customKeyboardShortcuts = [],
  maxRating = 5,
  slideshowInterval = 3000,
}: MediaViewerProps) {
  if (!isOpen) return null;

  return (
    <MediaViewerCoreProvider
      images={images}
      currentIndex={currentIndex}
      isOpen={isOpen}
      onClose={onClose}
      onIndexChange={onIndexChange}
      metadata={Array.isArray(metadata) ? metadata : metadata ? [metadata] : undefined}
    >
      <MediaViewerUIStateProvider enabled={enableUIState}>
        <MediaViewerZoomProvider enabled={enableZoom}>
          <MediaViewerSlideshowProvider enabled={enableSlideshow}>
            <MediaViewerFavoritesProvider
              enabled={enableFavorites}
              initialFavorites={initialFavorites}
            >
              <MediaViewerRatingsProvider
                enabled={enableRatings}
                initialRatings={initialRatings}
                maxRating={maxRating}
              >
                <MediaViewerKeyboardProvider
                  enabled={enableKeyboardShortcuts}
                  customShortcuts={customKeyboardShortcuts}
                >
                  <MediaViewerCropProvider enabled={enableCrop}>
                    <MediaViewerContent />
                  </MediaViewerCropProvider>
                </MediaViewerKeyboardProvider>
              </MediaViewerRatingsProvider>
            </MediaViewerFavoritesProvider>
          </MediaViewerSlideshowProvider>
        </MediaViewerZoomProvider>
      </MediaViewerUIStateProvider>
    </MediaViewerCoreProvider>
  );
}
