import { useCallback, useEffect, useRef, useState } from 'react';

interface ImageCache {
  [key: string]: {
    src: string;
    loaded: boolean;
    loading: boolean;
    error: boolean;
    element?: HTMLImageElement;
    size?: { width: number; height: number };
    loadTime?: number;
  };
}

interface LazyLoadOptions {
  preloadRadius?: number; // Number of images to preload before/after current
  maxCacheSize?: number; // Maximum number of images to keep in cache
  enablePrefetch?: boolean; // Whether to prefetch images on hover/focus
  quality?: 'low' | 'medium' | 'high'; // Image quality for initial load
  placeholderSrc?: string; // Placeholder image while loading
  retryAttempts?: number; // Number of retry attempts on load failure
  retryDelay?: number; // Delay between retry attempts (ms)
}

export function useLazyImageLoading(
  images: string[],
  currentIndex: number,
  options: LazyLoadOptions = {},
) {
  const {
    preloadRadius = 2,
    maxCacheSize = 20,
    enablePrefetch = true,
    quality = 'high',
    placeholderSrc,
    retryAttempts = 3,
    retryDelay = 1000,
  } = options;

  const [imageCache, setImageCache] = useState<ImageCache>({});
  const [loadingProgress, setLoadingProgress] = useState<{
    loaded: number;
    total: number;
    percentage: number;
  }>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });

  const retryTimeoutsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const prefetchQueueRef = useRef<string[]>([]);

  // Create image element with retry logic
  const createImageElement = useCallback(
    (src: string, attempts = 0): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          resolve(img);
        };

        img.onerror = () => {
          if (attempts < retryAttempts) {
            // Retry after delay
            retryTimeoutsRef.current[src] = setTimeout(() => {
              createImageElement(src, attempts + 1)
                .then(resolve)
                .catch(reject);
            }, retryDelay);
          } else {
            reject(new Error(`Failed to load image after ${retryAttempts} attempts`));
          }
        };

        // Set crossOrigin for CORS support
        img.crossOrigin = 'anonymous';
        img.src = src;
      });
    },
    [retryAttempts, retryDelay],
  );

  // Load image with caching
  const loadImage = useCallback(
    async (src: string, priority: 'high' | 'low' = 'high') => {
      if (imageCache[src]?.loaded || imageCache[src]?.loading) {
        return imageCache[src];
      }

      setImageCache((prev) => ({
        ...prev,
        [src]: {
          ...prev[src],
          src,
          loaded: false,
          loading: true,
          error: false,
        },
      }));

      try {
        const startTime = Date.now();
        const imgElement = await createImageElement(src);
        const loadTime = Date.now() - startTime;

        const cacheEntry = {
          src,
          loaded: true,
          loading: false,
          error: false,
          element: imgElement,
          size: {
            width: imgElement.naturalWidth,
            height: imgElement.naturalHeight,
          },
          loadTime,
        };

        setImageCache((prev) => ({
          ...prev,
          [src]: cacheEntry,
        }));

        // Update loading progress
        setLoadingProgress((prev) => ({
          ...prev,
          loaded: prev.loaded + 1,
          percentage: Math.round(((prev.loaded + 1) / prev.total) * 100),
        }));

        return cacheEntry;
      } catch (error) {
        console.error('Error loading image:', src, error);

        const errorEntry = {
          src,
          loaded: false,
          loading: false,
          error: true,
        };

        setImageCache((prev) => ({
          ...prev,
          [src]: errorEntry,
        }));

        return errorEntry;
      }
    },
    [imageCache, createImageElement],
  );

  // Preload images around current index
  const preloadImages = useCallback(
    async (centerIndex: number) => {
      const imagesToLoad: string[] = [];
      const startIndex = Math.max(0, centerIndex - preloadRadius);
      const endIndex = Math.min(images.length - 1, centerIndex + preloadRadius);

      // Priority order: current, adjacent, then expanding outward
      const priorities: Array<{ index: number; priority: 'high' | 'low' }> = [
        { index: centerIndex, priority: 'high' },
      ];

      for (let i = 1; i <= preloadRadius; i++) {
        if (centerIndex - i >= startIndex) {
          priorities.push({ index: centerIndex - i, priority: i <= 1 ? 'high' : 'low' });
        }
        if (centerIndex + i <= endIndex) {
          priorities.push({ index: centerIndex + i, priority: i <= 1 ? 'high' : 'low' });
        }
      }

      // Load images in priority order
      for (const { index, priority } of priorities) {
        if (images[index] && !imageCache[images[index]]?.loaded) {
          imagesToLoad.push(images[index]);
          loadImage(images[index], priority);
        }
      }

      // Update loading progress
      setLoadingProgress((prev) => ({
        ...prev,
        total: Math.max(prev.total, imagesToLoad.length),
      }));
    },
    [images, preloadRadius, imageCache, loadImage],
  );

  // Cache cleanup - remove old images when cache is full
  const cleanupCache = useCallback(() => {
    const cacheKeys = Object.keys(imageCache);
    if (cacheKeys.length > maxCacheSize) {
      // Calculate which images to keep based on distance from current index
      const imagesToKeep = new Set<string>();
      const startIndex = Math.max(0, currentIndex - preloadRadius);
      const endIndex = Math.min(images.length - 1, currentIndex + preloadRadius);

      for (let i = startIndex; i <= endIndex; i++) {
        if (images[i]) {
          imagesToKeep.add(images[i]);
        }
      }

      // Remove images not in the keep set
      const newCache: ImageCache = {};
      cacheKeys.forEach((key) => {
        if (imagesToKeep.has(key)) {
          newCache[key] = imageCache[key];
        } else {
          // Clean up any retry timeouts
          if (retryTimeoutsRef.current[key]) {
            clearTimeout(retryTimeoutsRef.current[key]);
            delete retryTimeoutsRef.current[key];
          }
        }
      });

      setImageCache(newCache);
    }
  }, [imageCache, maxCacheSize, currentIndex, images, preloadRadius]);

  // Prefetch image on hover/focus
  const prefetchImage = useCallback(
    (src: string) => {
      if (enablePrefetch && !imageCache[src]?.loaded && !imageCache[src]?.loading) {
        prefetchQueueRef.current.push(src);
        // Debounce prefetch to avoid too many requests
        setTimeout(() => {
          const queue = prefetchQueueRef.current;
          prefetchQueueRef.current = [];
          queue.forEach((imageSrc) => {
            if (!imageCache[imageSrc]?.loaded && !imageCache[imageSrc]?.loading) {
              loadImage(imageSrc, 'low');
            }
          });
        }, 100);
      }
    },
    [enablePrefetch, imageCache, loadImage],
  );

  // Get image with lazy loading
  const getImage = useCallback(
    (src: string) => {
      const cached = imageCache[src];

      if (cached?.loaded && cached.element) {
        return {
          loaded: true,
          isLoading: false,
          error: false,
          imageSize: cached.size,
          loadTime: cached.loadTime,
        };
      }

      if (cached?.loading) {
        return {
          loaded: false,
          isLoading: true,
          error: false,
          imageSize: undefined,
          loadTime: undefined,
        };
      }

      if (cached?.error) {
        return {
          loaded: false,
          isLoading: false,
          error: true,
          imageSize: undefined,
          loadTime: undefined,
        };
      }

      // Start loading if not already started
      loadImage(src, 'high');

      return {
        loaded: false,
        isLoading: true,
        error: false,
        imageSize: undefined,
        loadTime: undefined,
      };
    },
    [imageCache, loadImage],
  );

  // Get loading statistics
  const getLoadingStats = useCallback(() => {
    const stats = {
      totalImages: images.length,
      cachedImages: Object.keys(imageCache).length,
      loadedImages: Object.values(imageCache).filter((img) => img.loaded).length,
      loadingImages: Object.values(imageCache).filter((img) => img.loading).length,
      errorImages: Object.values(imageCache).filter((img) => img.error).length,
      cacheHitRate: 0,
      averageLoadTime: 0,
    };

    const loadedWithTime = Object.values(imageCache).filter((img) => img.loaded && img.loadTime);
    if (loadedWithTime.length > 0) {
      stats.averageLoadTime =
        loadedWithTime.reduce((sum, img) => sum + (img.loadTime || 0), 0) / loadedWithTime.length;
    }

    if (stats.cachedImages > 0) {
      stats.cacheHitRate = (stats.loadedImages / stats.cachedImages) * 100;
    }

    return stats;
  }, [images.length, imageCache]);

  // Preload images when current index changes
  useEffect(() => {
    preloadImages(currentIndex);
  }, [currentIndex, preloadImages]);

  // Cleanup cache when it gets too large
  useEffect(() => {
    cleanupCache();
  }, [cleanupCache]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all retry timeouts
      Object.values(retryTimeoutsRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
      retryTimeoutsRef.current = {};

      // Cleanup intersection observer
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, []);

  return {
    getImage,
    loadImage,
    prefetchImage,
    preloadImages,
    imageCache,
    loadingProgress,
    getLoadingStats,
    cleanupCache,
  };
}
