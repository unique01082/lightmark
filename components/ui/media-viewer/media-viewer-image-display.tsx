'use client';

import { useUpdateEffect } from 'ahooks';
import { useEffect } from 'react';
import { LazyImage } from './lazy-image';
import { useMediaViewerContext } from './media-viewer-context';

export function MediaViewerImageDisplay() {
  const {
    images,
    currentIndex,
    zoom,
    pan,
    rotation,
    isDragging,
    isTransitioning,
    showLoadingIndicator,
    getImage,
    loadImage,
    prefetchImage,
    handleImageLoad,
    handleDoubleClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    setPan,
    setImageNaturalSize,
    setImageDisplaySize,
    setRotation,
    setIsTransitioning,
  } = useMediaViewerContext();

  // Reset pan and image data when zoom or image changes
  useUpdateEffect(() => {
    setIsTransitioning(true);
    setPan({ x: 0, y: 0 });
    setImageNaturalSize({ width: 0, height: 0 });
    setImageDisplaySize({ width: 0, height: 0 });
    setRotation({ angle: 0 });

    const timeout = setTimeout(() => {
      setIsTransitioning(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, [zoom, currentIndex]);

  // Service worker registration
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/offline-cache-sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  // Wrapper for touch end without parameters
  const handleTouchEndWrapper = () => {
    // The actual touch end handling is done in the gesture hook
  };

  return (
    <div className="relative w-full h-full">
      <LazyImage
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        className="w-full h-full"
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px) rotate(${rotation.angle}deg)`,
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
        }}
        onLoad={handleImageLoad}
        onDoubleClick={handleDoubleClick}
        showLoadingIndicator={showLoadingIndicator}
        showErrorMessage={true}
        retryOnError={true}
        priority="high"
        quality="high"
        fadeInDuration={300}
        onRetry={() => loadImage(images[currentIndex], 'high')}
        onPrefetch={() => prefetchImage(images[currentIndex])}
        {...getImage(images[currentIndex])}
      />

      {/* Touch and mouse handlers overlay */}
      <div
        className="absolute inset-0 touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEndWrapper}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />
    </div>
  );
}
