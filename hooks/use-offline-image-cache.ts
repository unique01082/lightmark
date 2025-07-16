import { useLocalStorageState } from 'ahooks';
import { useCallback, useEffect, useRef, useState } from 'react';

interface OfflineCacheEntry {
  src: string;
  blob: Blob;
  size: number;
  lastAccessed: number;
  accessCount: number;
  priority: 'high' | 'medium' | 'low';
  metadata?: {
    dimensions: { width: number; height: number };
    fileSize: number;
    format: string;
    quality: number;
  };
}

interface OfflineCacheOptions {
  maxCacheSize?: number; // Maximum cache size in MB
  maxEntries?: number; // Maximum number of cached images
  priorityThreshold?: number; // Minimum access count for high priority
  enableServiceWorker?: boolean; // Use service worker for advanced caching
  compressionLevel?: number; // 0-1, compression level for cached images
  cacheStrategy?: 'aggressive' | 'conservative' | 'smart'; // Caching strategy
  syncInterval?: number; // Sync interval in minutes
}

interface OfflineStats {
  totalCacheSize: number;
  totalEntries: number;
  hitRate: number;
  compressionRatio: number;
  lastSync: number;
  isOnline: boolean;
  pendingUploads: number;
}

export function useOfflineImageCache(options: OfflineCacheOptions = {}) {
  const {
    maxCacheSize = 100, // 100MB default
    maxEntries = 200,
    priorityThreshold = 3,
    enableServiceWorker = true,
    compressionLevel = 0.8,
    cacheStrategy = 'smart',
    syncInterval = 30, // 30 minutes
  } = options;

  const [cache, setCache] = useState<Map<string, OfflineCacheEntry>>(new Map());
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);
  const [offlineStats, setOfflineStats] = useState<OfflineStats>({
    totalCacheSize: 0,
    totalEntries: 0,
    hitRate: 0,
    compressionRatio: 0,
    lastSync: 0,
    isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
    pendingUploads: 0,
  });

  const [offlineSettings, setOfflineSettings] = useLocalStorageState('offline-cache-settings', {
    defaultValue: {
      enabled: true,
      maxCacheSize,
      maxEntries,
      cacheStrategy,
      autoSync: true,
      compressionLevel,
    },
  });

  const [accessHistory, setAccessHistory] = useLocalStorageState<Record<string, number>>(
    'offline-access-history',
    { defaultValue: {} },
  );

  const serviceWorkerRef = useRef<ServiceWorker | null>(null);
  const dbRef = useRef<IDBDatabase | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize IndexedDB for persistent storage
  const initializeDB = useCallback(async () => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      throw new Error('IndexedDB not available');
    }

    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('OfflineImageCache', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('images')) {
          const store = db.createObjectStore('images', { keyPath: 'src' });
          store.createIndex('lastAccessed', 'lastAccessed');
          store.createIndex('accessCount', 'accessCount');
          store.createIndex('priority', 'priority');
        }
      };
    });
  }, []);

  // Initialize service worker for advanced caching
  const initializeServiceWorker = useCallback(async () => {
    if (typeof window === 'undefined' || !enableServiceWorker || !('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/offline-cache-sw.js');
      serviceWorkerRef.current = registration.active;

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'CACHE_UPDATED') {
          loadCacheFromIndexedDB();
        }
      });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }, [enableServiceWorker]);

  // Load cache from IndexedDB
  const loadCacheFromIndexedDB = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      const db = await initializeDB();
      const transaction = db.transaction(['images'], 'readonly');
      const store = transaction.objectStore('images');
      const request = store.getAll();

      request.onsuccess = () => {
        const entries = request.result as OfflineCacheEntry[];
        const newCache = new Map(entries.map((entry) => [entry.src, entry]));
        setCache(newCache);

        // Update stats
        const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);
        setOfflineStats((prev) => ({
          ...prev,
          totalCacheSize: totalSize / (1024 * 1024), // Convert to MB
          totalEntries: entries.length,
        }));
      };
    } catch (error) {
      console.error('Failed to load cache from IndexedDB:', error);
    }
  }, [initializeDB]);

  // Save cache entry to IndexedDB
  const saveCacheEntryToDB = useCallback(
    async (entry: OfflineCacheEntry) => {
      try {
        const db = await initializeDB();
        const transaction = db.transaction(['images'], 'readwrite');
        const store = transaction.objectStore('images');
        await store.put(entry);
      } catch (error) {
        console.error('Failed to save cache entry to IndexedDB:', error);
      }
    },
    [initializeDB],
  );

  // Remove cache entry from IndexedDB
  const removeCacheEntryFromDB = useCallback(
    async (src: string) => {
      try {
        const db = await initializeDB();
        const transaction = db.transaction(['images'], 'readwrite');
        const store = transaction.objectStore('images');
        await store.delete(src);
      } catch (error) {
        console.error('Failed to remove cache entry from IndexedDB:', error);
      }
    },
    [initializeDB],
  );

  // Compress image blob
  const compressImage = useCallback(
    async (blob: Blob): Promise<Blob> => {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return blob; // Return original blob if not in browser
      }

      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          canvas.toBlob(
            (compressedBlob) => {
              resolve(compressedBlob || blob);
            },
            'image/jpeg',
            compressionLevel,
          );
        };

        img.src = URL.createObjectURL(blob);
      });
    },
    [compressionLevel],
  );

  // Calculate cache priority
  const calculatePriority = useCallback(
    (src: string, accessCount: number): 'high' | 'medium' | 'low' => {
      if (accessCount >= priorityThreshold) return 'high';
      if (accessCount >= 2) return 'medium';
      return 'low';
    },
    [priorityThreshold],
  );

  // Cache image
  const cacheImage = useCallback(
    async (src: string, priority: 'high' | 'medium' | 'low' = 'medium') => {
      if (!offlineSettings.enabled) return;

      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error('Failed to fetch image');

        const blob = await response.blob();
        const compressedBlob = await compressImage(blob);

        const accessCount = accessHistory[src] || 0;
        const calculatedPriority = calculatePriority(src, accessCount);

        const entry: OfflineCacheEntry = {
          src,
          blob: compressedBlob,
          size: compressedBlob.size,
          lastAccessed: Date.now(),
          accessCount,
          priority: priority === 'high' ? 'high' : calculatedPriority,
          metadata: {
            dimensions: { width: 0, height: 0 }, // Will be populated when loaded
            fileSize: blob.size,
            format: blob.type,
            quality: compressionLevel,
          },
        };

        // Check cache size limits
        const currentSize = Array.from(cache.values()).reduce((sum, entry) => sum + entry.size, 0);
        const maxSizeBytes = maxCacheSize * 1024 * 1024;

        if (currentSize + entry.size > maxSizeBytes || cache.size >= maxEntries) {
          await evictLeastRecentlyUsed(entry.size);
        }

        // Add to cache
        setCache((prev) => new Map(prev).set(src, entry));
        await saveCacheEntryToDB(entry);

        // Update access history
        setAccessHistory((prev) => ({
          ...prev,
          [src]: accessCount + 1,
        }));

        return entry;
      } catch (error) {
        console.error('Failed to cache image:', error);
        return null;
      }
    },
    [
      offlineSettings.enabled,
      accessHistory,
      calculatePriority,
      compressImage,
      cache,
      maxCacheSize,
      maxEntries,
      saveCacheEntryToDB,
      setAccessHistory,
    ],
  );

  // Evict least recently used entries
  const evictLeastRecentlyUsed = useCallback(
    async (spaceNeeded: number) => {
      const entries = Array.from(cache.entries());
      entries.sort((a, b) => {
        // Sort by priority first, then by last accessed
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a[1].priority];
        const bPriority = priorityOrder[b[1].priority];

        if (aPriority !== bPriority) {
          return aPriority - bPriority; // Low priority first
        }

        return a[1].lastAccessed - b[1].lastAccessed; // Oldest first
      });

      let freedSpace = 0;
      const toRemove: string[] = [];

      for (const [src, entry] of entries) {
        if (entry.priority === 'high') continue; // Never evict high priority

        toRemove.push(src);
        freedSpace += entry.size;

        if (freedSpace >= spaceNeeded) break;
      }

      // Remove selected entries
      for (const src of toRemove) {
        setCache((prev) => {
          const newCache = new Map(prev);
          newCache.delete(src);
          return newCache;
        });
        await removeCacheEntryFromDB(src);
      }
    },
    [cache, removeCacheEntryFromDB],
  );

  // Get cached image
  const getCachedImage = useCallback(
    async (src: string): Promise<string | null> => {
      const entry = cache.get(src);
      if (!entry) return null;

      // Update access time and count
      entry.lastAccessed = Date.now();
      entry.accessCount++;

      setCache((prev) => new Map(prev).set(src, entry));
      await saveCacheEntryToDB(entry);

      // Update access history
      setAccessHistory((prev) => ({
        ...prev,
        [src]: entry.accessCount,
      }));

      return URL.createObjectURL(entry.blob);
    },
    [cache, saveCacheEntryToDB, setAccessHistory],
  );

  // Clear cache
  const clearCache = useCallback(async () => {
    setCache(new Map());

    try {
      const db = await initializeDB();
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      await store.clear();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }

    setAccessHistory({});
  }, [initializeDB, setAccessHistory]);

  // Sync cache with server
  const syncCache = useCallback(async () => {
    if (!isOnline) return;

    try {
      // Sync logic would go here
      // For now, just update last sync time
      setOfflineStats((prev) => ({
        ...prev,
        lastSync: Date.now(),
      }));
    } catch (error) {
      console.error('Cache sync failed:', error);
    }
  }, [isOnline]);

  // Get cache statistics
  const getCacheStats = useCallback((): OfflineStats => {
    const entries = Array.from(cache.values());
    const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);
    const originalSize = entries.reduce(
      (sum, entry) => sum + (entry.metadata?.fileSize || entry.size),
      0,
    );

    return {
      totalCacheSize: totalSize / (1024 * 1024), // MB
      totalEntries: entries.length,
      hitRate: 0, // Would be calculated based on actual usage
      compressionRatio: originalSize > 0 ? (originalSize - totalSize) / originalSize : 0,
      lastSync: offlineStats.lastSync,
      isOnline,
      pendingUploads: 0,
    };
  }, [cache, offlineStats.lastSync, isOnline]);

  // Online/offline detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      setOfflineStats((prev) => ({ ...prev, isOnline: true }));
      if (offlineSettings.autoSync) {
        syncCache();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOfflineStats((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineSettings.autoSync, syncCache]);

  // Initialize on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeServiceWorker();
      loadCacheFromIndexedDB();
    }
  }, [initializeServiceWorker, loadCacheFromIndexedDB]);

  // Auto-sync interval
  useEffect(() => {
    if (offlineSettings.autoSync && isOnline) {
      syncIntervalRef.current = setInterval(syncCache, syncInterval * 60 * 1000);
    } else if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [offlineSettings.autoSync, isOnline, syncCache, syncInterval]);

  // Update stats regularly
  useEffect(() => {
    const updateStats = () => {
      setOfflineStats(getCacheStats());
    };

    const interval = setInterval(updateStats, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [getCacheStats]);

  return {
    // Cache operations
    cacheImage,
    getCachedImage,
    clearCache,
    evictLeastRecentlyUsed,

    // State
    cache,
    isOnline,
    offlineStats: getCacheStats(),
    offlineSettings,

    // Settings
    setOfflineSettings,

    // Sync
    syncCache,

    // Utilities
    getCacheStats,
  };
}
