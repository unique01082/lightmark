'use client';

import { Histogram } from './histogram';
import { useMediaViewerContext } from './media-viewer-context';
import { QuickActions } from './quick-actions';
import { RatingSystem } from './rating-system';

export function MediaViewerFeaturePanels() {
  const {
    images,
    currentIndex,
    showHistogram,
    showQuickActions,
    showRating,
    imageRatings,
    toggleHistogram,
    toggleQuickActions,
    toggleRating,
    handleEdit,
    handleRotate,
    setImageRatings,
  } = useMediaViewerContext();

  const handleApplyPreset = (preset: string) => {
    console.log('Applying preset:', preset);
  };

  const handleCopyAdjustments = () => {
    console.log('Copying adjustments');
  };

  const handlePasteAdjustments = () => {
    console.log('Pasting adjustments');
  };

  const handleExport = () => {
    console.log('Exporting image');
  };

  const handleCrop = () => {
    console.log('Opening crop tool');
  };

  const handleFlipHorizontal = () => {
    console.log('Flipping horizontally');
  };

  const handleFlipVertical = () => {
    console.log('Flipping vertically');
  };

  return (
    <>
      {showHistogram && (
        <Histogram
          imageSrc={images[currentIndex]}
          isVisible={showHistogram}
          onToggle={toggleHistogram}
        />
      )}

      {showQuickActions && (
        <QuickActions
          isVisible={showQuickActions}
          onToggle={toggleQuickActions}
          onEdit={handleEdit}
          onRotate={handleRotate}
          onCrop={handleCrop}
          onFlipHorizontal={handleFlipHorizontal}
          onFlipVertical={handleFlipVertical}
          onApplyPreset={handleApplyPreset}
          onCopyAdjustments={handleCopyAdjustments}
          onPasteAdjustments={handlePasteAdjustments}
          onExport={handleExport}
        />
      )}

      {showRating && (
        <RatingSystem
          imageId={images[currentIndex]}
          currentRating={imageRatings[images[currentIndex]]?.rating || 0}
          colorLabel={imageRatings[images[currentIndex]]?.colorLabel || 'none'}
          isRejected={imageRatings[images[currentIndex]]?.isRejected || false}
          isPicked={imageRatings[images[currentIndex]]?.isPicked || false}
          onRatingChange={(imageId, rating) => {
            setImageRatings((prev) => ({
              ...prev,
              [imageId]: { ...(prev?.[imageId] || {}), rating },
            }));
          }}
          onColorLabelChange={(imageId, colorLabel) => {
            setImageRatings((prev) => ({
              ...prev,
              [imageId]: { ...(prev?.[imageId] || {}), colorLabel },
            }));
          }}
          onRejectToggle={(imageId) => {
            setImageRatings((prev) => ({
              ...prev,
              [imageId]: {
                ...(prev?.[imageId] || {}),
                isRejected: !(prev?.[imageId]?.isRejected || false),
              },
            }));
          }}
          onPickToggle={(imageId) => {
            setImageRatings((prev) => ({
              ...prev,
              [imageId]: {
                ...(prev?.[imageId] || {}),
                isPicked: !(prev?.[imageId]?.isPicked || false),
              },
            }));
          }}
          isVisible={showRating}
          onToggle={toggleRating}
        />
      )}
    </>
  );
}
