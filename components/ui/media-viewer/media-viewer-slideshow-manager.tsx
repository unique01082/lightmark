'use client';

import { useEffect, useRef } from 'react';
import { useMediaViewerContext } from './media-viewer-context';

export function MediaViewerSlideshowManager() {
  const { slideshow, currentIndex, images, onIndexChange, setSlideshow } = useMediaViewerContext();

  const slideshowIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSlideshow = () => {
    if (slideshowIntervalRef.current) {
      clearInterval(slideshowIntervalRef.current);
    }

    slideshowIntervalRef.current = setInterval(() => {
      if (!slideshow.isPaused) {
        const nextIndex = (currentIndex + 1) % images.length;
        onIndexChange(nextIndex);
      }
    }, slideshow.interval);
  };

  const stopSlideshow = () => {
    if (slideshowIntervalRef.current) {
      clearInterval(slideshowIntervalRef.current);
      slideshowIntervalRef.current = null;
    }
  };

  // Handle slideshow state changes
  useEffect(() => {
    if (slideshow.isActive && !slideshow.isPaused) {
      startSlideshow();
    } else {
      stopSlideshow();
    }

    return () => {
      stopSlideshow();
    };
  }, [slideshow.isActive, slideshow.isPaused, slideshow.interval, currentIndex]);

  // Pause slideshow on user interaction
  const pauseSlideshowOnInteraction = () => {
    if (slideshow.isActive) {
      setSlideshow((prev) => ({ ...prev, isPaused: true }));
      setTimeout(() => {
        setSlideshow((prev) => ({ ...prev, isPaused: false }));
      }, 2000);
    }
  };

  // This component doesn't render anything, it just manages slideshow logic
  return null;
}
