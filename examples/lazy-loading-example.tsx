// Example usage of the lazy loading feature

import { MediaViewer } from '@/components/ui/media-viewer/media-viewer';
import React from 'react';

export function LazyLoadingExample() {
  const images = [
    '/api/images/1.jpg',
    '/api/images/2.jpg',
    '/api/images/3.jpg',
    '/api/images/4.jpg',
    '/api/images/5.jpg',
    // ... more images
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Media Viewer with Lazy Loading</button>

      <MediaViewer
        images={images}
        currentIndex={currentIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onIndexChange={setCurrentIndex}
        // Lazy loading is automatically enabled!
        // Features include:
        // - Intelligent preloading (3 images before/after current)
        // - Automatic cache management (25 image cache)
        // - Hover prefetch for smooth navigation
        // - Error recovery with retry logic
        // - Performance monitoring
        // - Loading indicators
      />
    </div>
  );
}

// Advanced configuration example
export function AdvancedLazyLoadingExample() {
  const images = Array.from({ length: 1000 }, (_, i) => `/api/images/${i + 1}.jpg`);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Large Gallery (1000 images)</button>

      <MediaViewer
        images={images}
        currentIndex={currentIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onIndexChange={setCurrentIndex}
        // The lazy loading system automatically handles:
        // - Only loads visible and nearby images
        // - Manages memory efficiently
        // - Provides smooth navigation
        // - Handles network failures gracefully
        // - Shows loading progress
        // - Optimizes performance for large galleries
      />
    </div>
  );
}

// Performance monitoring example
export function LazyLoadingMonitoringExample() {
  const images = ['/api/images/1.jpg', '/api/images/2.jpg', '/api/images/3.jpg'];
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open with Performance Monitoring</button>

      <MediaViewer
        images={images}
        currentIndex={currentIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onIndexChange={setCurrentIndex}
        // Loading indicators automatically show:
        // - Progress bars for bulk loading
        // - Cache hit rate statistics
        // - Average load times
        // - Error counts and recovery options
        // - Memory usage optimization
      />
    </div>
  );
}
