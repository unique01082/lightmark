'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CompositionOverlay } from './composition-overlay';
import { CropSimulator } from './crop-simulator';
import { FullscreenOverlay } from './fullscreen-overlay';
import { GestureIndicator, TouchHints } from './gesture-indicator';
import { KeyboardShortcutsHelp } from './keyboard-shortcuts-help';
import { LoadingIndicator } from './loading-indicator';
import { MediaViewerProvider, useMediaViewerContext } from './media-viewer-context';
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

function MediaViewerContent() {
  const {
    isOpen,
    onClose,
    images,
    currentIndex,
    metadata,
    showInfo,
    setShowInfo,
    handleQuickZoom,
    handleZoomIn,
    handleZoomOut,
    handleNaturalZoom,
    handleFitZoom,
    handleZoomToPercentage,
    handleZoomToRatio,
    zoom,
    setZoom,
    getActualZoomPercentage,
    getZoomRatio,
    getImageSizeInfo,
    handleRotate,
    toggleSlideshow,
    slideshow,
    toggleFavorite,
    favorites,
    handleFullscreen,
    handleDelete,
    handleShare,
    handleEdit,
    toggleHistogram,
    showHistogram,
    toggleGrid,
    showGrid,
    toggleQuickActions,
    showQuickActions,
    toggleRating,
    showRating,
    handleToggleComparison,
    comparisonState,
    handlePrevious,
    handleNext,
    onIndexChange,
    showLoadingIndicator,
    setShowLoadingIndicator,
    loadingProgress,
    getLoadingStats,
    getGestureState,
    isFullscreen,
    isDistractionFree,
    fullscreenMode,
    handleDistractionFreeToggle,
    handleFullscreenModeChange,
    exitFullscreen,
    showKeyboardHelp,
    toggleKeyboardHelp,
    showCropSimulator,
    toggleCropSimulator,
    handleCropApply,
  } = useMediaViewerContext();

  if (!isOpen || images.length === 0) return null;

  return (
    <>
      <Dialog open={isOpen && !isFullscreen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95">
          <div className="relative w-full h-[95vh] flex flex-col">
            <MediaViewerHeader
              currentIndex={currentIndex}
              totalImages={images.length}
              metadata={metadata}
              showInfo={showInfo}
              onToggleInfo={() => setShowInfo(!showInfo)}
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
              onSlideshowToggle={toggleSlideshow}
              onFavoriteToggle={toggleFavorite}
              onFullscreen={handleFullscreen}
              slideshow={slideshow}
              isFavorite={favorites.has(images[currentIndex])}
              onDelete={handleDelete}
              onShare={handleShare}
              onEdit={handleEdit}
              onToggleHistogram={toggleHistogram}
              showHistogram={showHistogram}
              onToggleGrid={toggleGrid}
              showGrid={showGrid}
              onToggleQuickActions={toggleQuickActions}
              showQuickActions={showQuickActions}
              onToggleRating={toggleRating}
              showRating={showRating}
              onToggleComparison={handleToggleComparison}
              showComparison={comparisonState.isActive}
              onToggleKeyboardHelp={toggleKeyboardHelp}
              onToggleCropSimulator={toggleCropSimulator}
            />

            <MediaViewerOverlays />

            <MediaViewerImageDisplay />

            <CompositionOverlay isVisible={showGrid} onToggle={toggleGrid} />

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
              showInfo={showInfo}
              metadata={metadata}
              imageSizeInfo={getImageSizeInfo()}
              zoomPercentage={getActualZoomPercentage()}
            />

            <MediaViewerFeaturePanels />

            {/* Gesture Feedback */}
            <GestureIndicator gestureState={getGestureState()} zoom={zoom} isVisible={isOpen} />

            <TouchHints isVisible={isOpen} />

            {/* Loading Indicator */}
            <LoadingIndicator
              loadingProgress={loadingProgress}
              loadingStats={getLoadingStats()}
              isVisible={showLoadingIndicator}
              onToggle={() => setShowLoadingIndicator(!showLoadingIndicator)}
              showDetailedStats={false}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp isVisible={showKeyboardHelp} onToggle={toggleKeyboardHelp} />

      {/* Crop Simulator */}
      <CropSimulator
        isOpen={showCropSimulator}
        onClose={() => toggleCropSimulator()}
        imageSrc={images[currentIndex]}
        onCropApply={handleCropApply}
        onCropCancel={() => toggleCropSimulator()}
      />

      {/* Fullscreen Container */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Show minimal header only in normal mode */}
          {fullscreenMode === 'normal' && (
            <MediaViewerHeader
              currentIndex={currentIndex}
              totalImages={images.length}
              metadata={metadata}
              showInfo={showInfo}
              onToggleInfo={() => setShowInfo(!showInfo)}
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
              onSlideshowToggle={toggleSlideshow}
              onFavoriteToggle={toggleFavorite}
              onFullscreen={handleFullscreen}
              slideshow={slideshow}
              isFavorite={favorites.has(images[currentIndex])}
              onDelete={handleDelete}
              onShare={handleShare}
              onEdit={handleEdit}
              onToggleHistogram={toggleHistogram}
              showHistogram={showHistogram}
              onToggleGrid={toggleGrid}
              showGrid={showGrid}
              onToggleQuickActions={toggleQuickActions}
              showQuickActions={showQuickActions}
              onToggleRating={toggleRating}
              showRating={showRating}
              onToggleComparison={handleToggleComparison}
              showComparison={comparisonState.isActive}
              onToggleKeyboardHelp={toggleKeyboardHelp}
              onToggleCropSimulator={toggleCropSimulator}
            />
          )}

          <MediaViewerOverlays />

          <MediaViewerImageDisplay />

          <CompositionOverlay isVisible={showGrid} onToggle={toggleGrid} />

          {/* Show navigation only in normal and distraction-free modes */}
          {fullscreenMode !== 'minimal' && (
            <MediaViewerNavigation
              currentIndex={currentIndex}
              totalImages={images.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          )}

          {/* Show filmstrip only in normal mode */}
          {fullscreenMode === 'normal' && (
            <MediaViewerFilmstrip
              images={images}
              currentIndex={currentIndex}
              onImageSelect={onIndexChange}
            />
          )}

          {/* Show metadata panel only in normal mode */}
          {fullscreenMode === 'normal' && (
            <MediaViewerMetadataPanel
              showInfo={showInfo}
              metadata={metadata}
              imageSizeInfo={getImageSizeInfo()}
              zoomPercentage={getActualZoomPercentage()}
            />
          )}

          {/* Show feature panels only in normal mode */}
          {fullscreenMode === 'normal' && <MediaViewerFeaturePanels />}

          {/* Gesture Feedback */}
          <GestureIndicator gestureState={getGestureState()} zoom={zoom} isVisible={isOpen} />

          <TouchHints isVisible={isOpen} />

          {/* Loading Indicator */}
          <LoadingIndicator
            loadingProgress={loadingProgress}
            loadingStats={getLoadingStats()}
            isVisible={showLoadingIndicator}
            onToggle={() => setShowLoadingIndicator(!showLoadingIndicator)}
            showDetailedStats={false}
          />
        </div>
      )}

      <MediaViewerSlideshowManager />

      <MediaViewerExternalDialogs />

      {/* Fullscreen Overlay */}
      <FullscreenOverlay
        isFullscreen={isFullscreen}
        isDistractionFree={isDistractionFree}
        fullscreenMode={fullscreenMode}
        onFullscreenToggle={handleFullscreen}
        onDistractionFreeToggle={handleDistractionFreeToggle}
        onFullscreenModeChange={handleFullscreenModeChange}
        onExitFullscreen={exitFullscreen}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onClose={onClose}
        currentIndex={currentIndex}
        totalImages={images.length}
      />
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
}: MediaViewerProps) {
  return (
    <MediaViewerProvider
      images={images}
      currentIndex={currentIndex}
      isOpen={isOpen}
      onClose={onClose}
      onIndexChange={onIndexChange}
      metadata={Array.isArray(metadata) ? metadata : metadata ? [metadata] : undefined}
    >
      <MediaViewerContent />
    </MediaViewerProvider>
  );
}
