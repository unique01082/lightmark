import { useLocalStorageState } from 'ahooks';
import { useCallback } from 'react';

interface ComparisonState {
  isActive: boolean;
  primaryIndex: number;
  secondaryIndex: number;
  splitMode: 'side-by-side' | 'overlay' | 'flicker';
  syncZoom: boolean;
  syncPan: boolean;
  showMetadata: boolean;
}

export function useMediaViewerComparison(totalImages: number) {
  const [comparisonState, setComparisonState] = useLocalStorageState<ComparisonState>(
    'media-viewer-comparison',
    {
      defaultValue: {
        isActive: false,
        primaryIndex: 0,
        secondaryIndex: 1,
        splitMode: 'side-by-side',
        syncZoom: true,
        syncPan: true,
        showMetadata: true,
      },
    },
  );

  const [recentlyCompared, setRecentlyCompared] = useLocalStorageState<
    Array<{ primary: number; secondary: number; timestamp: number }>
  >('media-viewer-recently-compared', {
    defaultValue: [],
  });

  const startComparison = useCallback(
    (currentIndex: number) => {
      const secondaryIndex =
        currentIndex + 1 < totalImages ? currentIndex + 1 : Math.max(0, currentIndex - 1);

      setComparisonState((prev) => {
        const defaultState = {
          isActive: false,
          primaryIndex: 0,
          secondaryIndex: 1,
          splitMode: 'side-by-side' as const,
          syncZoom: true,
          syncPan: true,
          showMetadata: true,
        };

        return {
          ...(prev || defaultState),
          isActive: true,
          primaryIndex: currentIndex,
          secondaryIndex,
        };
      });
    },
    [totalImages, setComparisonState],
  );

  const exitComparison = useCallback(() => {
    setComparisonState((prev) => {
      const defaultState = {
        isActive: false,
        primaryIndex: 0,
        secondaryIndex: 1,
        splitMode: 'side-by-side' as const,
        syncZoom: true,
        syncPan: true,
        showMetadata: true,
      };

      return {
        ...(prev || defaultState),
        isActive: false,
      };
    });
  }, [setComparisonState]);

  const setIndices = useCallback(
    (primary: number, secondary: number) => {
      setComparisonState((prev) => {
        const defaultState = {
          isActive: false,
          primaryIndex: 0,
          secondaryIndex: 1,
          splitMode: 'side-by-side' as const,
          syncZoom: true,
          syncPan: true,
          showMetadata: true,
        };

        return {
          ...(prev || defaultState),
          primaryIndex: primary,
          secondaryIndex: secondary,
        };
      });

      // Add to recently compared
      const newComparison = {
        primary,
        secondary,
        timestamp: Date.now(),
      };

      setRecentlyCompared((prev) => {
        const currentList = prev || [];
        const filtered = currentList.filter(
          (item) =>
            !(item.primary === primary && item.secondary === secondary) &&
            !(item.primary === secondary && item.secondary === primary),
        );

        return [newComparison, ...filtered].slice(0, 10); // Keep only last 10
      });
    },
    [setComparisonState, setRecentlyCompared],
  );

  const setSplitMode = useCallback(
    (mode: 'side-by-side' | 'overlay' | 'flicker') => {
      setComparisonState((prev) => {
        const defaultState = {
          isActive: false,
          primaryIndex: 0,
          secondaryIndex: 1,
          splitMode: 'side-by-side' as const,
          syncZoom: true,
          syncPan: true,
          showMetadata: true,
        };

        return {
          ...(prev || defaultState),
          splitMode: mode,
        };
      });
    },
    [setComparisonState],
  );

  const toggleSyncZoom = useCallback(() => {
    setComparisonState((prev) => {
      const defaultState = {
        isActive: false,
        primaryIndex: 0,
        secondaryIndex: 1,
        splitMode: 'side-by-side' as const,
        syncZoom: true,
        syncPan: true,
        showMetadata: true,
      };

      const currentState = prev || defaultState;

      return {
        ...currentState,
        syncZoom: !currentState.syncZoom,
      };
    });
  }, [setComparisonState]);

  const toggleSyncPan = useCallback(() => {
    setComparisonState((prev) => {
      const defaultState = {
        isActive: false,
        primaryIndex: 0,
        secondaryIndex: 1,
        splitMode: 'side-by-side' as const,
        syncZoom: true,
        syncPan: true,
        showMetadata: true,
      };

      const currentState = prev || defaultState;

      return {
        ...currentState,
        syncPan: !currentState.syncPan,
      };
    });
  }, [setComparisonState]);

  const toggleMetadata = useCallback(() => {
    setComparisonState((prev) => {
      const defaultState = {
        isActive: false,
        primaryIndex: 0,
        secondaryIndex: 1,
        splitMode: 'side-by-side' as const,
        syncZoom: true,
        syncPan: true,
        showMetadata: true,
      };

      const currentState = prev || defaultState;

      return {
        ...currentState,
        showMetadata: !currentState.showMetadata,
      };
    });
  }, [setComparisonState]);

  const quickCompare = useCallback(
    (index1: number, index2: number) => {
      setComparisonState((prev) => {
        const defaultState = {
          isActive: false,
          primaryIndex: 0,
          secondaryIndex: 1,
          splitMode: 'side-by-side' as const,
          syncZoom: true,
          syncPan: true,
          showMetadata: true,
        };

        return {
          ...(prev || defaultState),
          isActive: true,
          primaryIndex: index1,
          secondaryIndex: index2,
        };
      });
    },
    [setComparisonState],
  );

  const swapImages = useCallback(() => {
    setComparisonState((prev) => {
      const defaultState = {
        isActive: false,
        primaryIndex: 0,
        secondaryIndex: 1,
        splitMode: 'side-by-side' as const,
        syncZoom: true,
        syncPan: true,
        showMetadata: true,
      };

      const currentState = prev || defaultState;

      return {
        ...currentState,
        primaryIndex: currentState.secondaryIndex,
        secondaryIndex: currentState.primaryIndex,
      };
    });
  }, [setComparisonState]);

  const loadRecentComparison = useCallback(
    (comparison: { primary: number; secondary: number }) => {
      setComparisonState((prev) => {
        const defaultState = {
          isActive: false,
          primaryIndex: 0,
          secondaryIndex: 1,
          splitMode: 'side-by-side' as const,
          syncZoom: true,
          syncPan: true,
          showMetadata: true,
        };

        return {
          ...(prev || defaultState),
          isActive: true,
          primaryIndex: comparison.primary,
          secondaryIndex: comparison.secondary,
        };
      });
    },
    [setComparisonState],
  );

  const getSimilarImages = useCallback(
    (index: number): number[] => {
      // Simple similarity based on index proximity
      // In a real app, this would use image analysis
      const similar: number[] = [];
      const range = 3;

      for (let i = Math.max(0, index - range); i <= Math.min(totalImages - 1, index + range); i++) {
        if (i !== index) {
          similar.push(i);
        }
      }

      return similar;
    },
    [totalImages],
  );

  const getComparisonHistory = useCallback(() => {
    const history = recentlyCompared || [];
    return history.map((item) => ({
      ...item,
      formattedDate: new Date(item.timestamp).toLocaleDateString(),
      formattedTime: new Date(item.timestamp).toLocaleTimeString(),
    }));
  }, [recentlyCompared]);

  const defaultState = {
    isActive: false,
    primaryIndex: 0,
    secondaryIndex: 1,
    splitMode: 'side-by-side' as const,
    syncZoom: true,
    syncPan: true,
    showMetadata: true,
  };

  return {
    comparisonState: comparisonState || defaultState,
    recentlyCompared: getComparisonHistory(),
    startComparison,
    exitComparison,
    setIndices,
    setSplitMode,
    toggleSyncZoom,
    toggleSyncPan,
    toggleMetadata,
    quickCompare,
    swapImages,
    loadRecentComparison,
    getSimilarImages,
  };
}
