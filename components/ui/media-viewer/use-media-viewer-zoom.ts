import type { ImageSize } from './types';

interface UseMediaViewerZoomProps {
  imageNaturalSize: ImageSize;
  imageDisplaySize: ImageSize;
  zoom: number;
}

export function useMediaViewerZoom({
  imageNaturalSize,
  imageDisplaySize,
  zoom,
}: UseMediaViewerZoomProps) {
  const getActualZoomPercentage = () => {
    if (imageNaturalSize.width === 0 || imageDisplaySize.width === 0) return zoom * 100;

    // Calculate the base scale factor (how much the image is scaled to fit in the container)
    const scaleX = imageDisplaySize.width / imageNaturalSize.width;
    const scaleY = imageDisplaySize.height / imageNaturalSize.height;
    const baseScale = Math.min(scaleX, scaleY); // Use the limiting dimension

    // The actual zoom relative to natural size
    const actualZoom = baseScale * zoom;

    return Math.round(actualZoom * 100);
  };
  const getZoomRatio = () => {
    if (imageNaturalSize.width === 0 || imageDisplaySize.width === 0) return '1:1';

    // Calculate the base scale factor (how much the image is scaled to fit in the container)
    const scaleX = imageDisplaySize.width / imageNaturalSize.width;
    const scaleY = imageDisplaySize.height / imageNaturalSize.height;
    const baseScale = Math.min(scaleX, scaleY); // Use the limiting dimension

    // The actual scale factor including zoom (this is displayed size / original size)
    const actualScale = baseScale * zoom;

    // Format the ratio based on displayed vs original size
    if (Math.abs(actualScale - 1) < 0.01) return '1:1';
    if (actualScale > 1) {
      const ratio = actualScale.toFixed(1);
      return `${ratio}:1`;
    } else {
      const ratio = (1 / actualScale).toFixed(1);
      return `1:${ratio}`;
    }
  };

  const getImageSizeInfo = () => {
    if (imageNaturalSize.width === 0 || imageNaturalSize.height === 0) return '';

    const width = imageNaturalSize.width;
    const height = imageNaturalSize.height;

    return `${width} × ${height}`;
  };

  const calculateFitZoom = () => {
    // This is the default zoom level that fits the image in the container
    return 1;
  };

  const calculateNaturalZoom = () => {
    if (imageNaturalSize.width > 0 && imageDisplaySize.width > 0) {
      // Calculate the zoom needed to show image at 100% (1:1 pixel ratio)
      const scaleX = imageDisplaySize.width / imageNaturalSize.width;
      const scaleY = imageDisplaySize.height / imageNaturalSize.height;
      const currentFitScale = Math.min(scaleX, scaleY);
      return 1 / currentFitScale;
    }
    return 1;
  };

  const calculateZoomForRatio = (ratio: number) => {
    if (imageNaturalSize.width === 0 || imageDisplaySize.width === 0) return ratio;

    // Calculate the zoom needed to achieve the target ratio of displayed size to original size
    const scaleX = imageDisplaySize.width / imageNaturalSize.width;
    const scaleY = imageDisplaySize.height / imageNaturalSize.height;
    const currentFitScale = Math.min(scaleX, scaleY);

    // To achieve the target ratio, we need: currentFitScale * zoom = ratio
    return ratio / currentFitScale;
  };

  const calculateZoomLevel = (targetPercentage: number) => {
    if (imageNaturalSize.width === 0 || imageDisplaySize.width === 0) return targetPercentage / 100;

    // Calculate the zoom needed to achieve the target percentage of natural size
    const scaleX = imageDisplaySize.width / imageNaturalSize.width;
    const scaleY = imageDisplaySize.height / imageNaturalSize.height;
    const currentFitScale = Math.min(scaleX, scaleY);

    // Target percentage relative to natural size
    const targetScale = targetPercentage / 100;

    // Calculate zoom level needed
    return targetScale / currentFitScale;
  };

  const getZoomLevels = () => {
    return {
      fit: calculateFitZoom(),
      '1:1': calculateZoomForRatio(1), // 1:1 ratio (displayed = original)
      '2:1': calculateZoomForRatio(2), // 2:1 ratio (displayed = 2x original)
      '3:1': calculateZoomForRatio(3), // 3:1 ratio (displayed = 3x original)
    };
  };

  return {
    getActualZoomPercentage,
    getZoomRatio,
    getImageSizeInfo,
    calculateNaturalZoom,
    calculateFitZoom,
    calculateZoomLevel,
    calculateZoomForRatio,
    getZoomLevels,
  };
}
