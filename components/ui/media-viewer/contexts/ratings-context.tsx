'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { useMediaViewerCore } from './core-context';

export interface MediaViewerRatingsContextType {
  // Ratings state
  ratings: Map<string, number>;
  setRatings: (ratings: Map<string, number>) => void;

  // Ratings handlers
  handleSetRating: (imagePath: string, rating: number) => void;
  handleSetCurrentRating: (rating: number) => void;
  handleClearRating: (imagePath: string) => void;
  handleClearCurrentRating: () => void;
  getRating: (imagePath: string) => number;
  getCurrentRating: () => number;
  getAverageRating: () => number;
  getRatedImages: () => Array<{ path: string; rating: number }>;
  clearAllRatings: () => void;
}

const MediaViewerRatingsContext = createContext<MediaViewerRatingsContextType | null>(null);

export function useMediaViewerRatings() {
  const context = useContext(MediaViewerRatingsContext);
  if (!context) {
    throw new Error('useMediaViewerRatings must be used within a MediaViewerRatingsProvider');
  }
  return context;
}

interface MediaViewerRatingsProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
  initialRatings?: Record<string, number>;
  maxRating?: number;
}

export function MediaViewerRatingsProvider({
  children,
  enabled = true,
  initialRatings = {},
  maxRating = 5,
}: MediaViewerRatingsProviderProps) {
  const { images, currentIndex } = useMediaViewerCore();
  const [ratings, setRatings] = useState<Map<string, number>>(
    new Map(Object.entries(initialRatings)),
  );

  const handleSetRating = useCallback(
    (imagePath: string, rating: number) => {
      if (!enabled) return;

      // Validate rating
      if (rating < 0 || rating > maxRating) return;

      setRatings((prev) => {
        const newRatings = new Map(prev);
        if (rating === 0) {
          newRatings.delete(imagePath);
        } else {
          newRatings.set(imagePath, rating);
        }
        return newRatings;
      });
    },
    [enabled, maxRating],
  );

  const handleSetCurrentRating = useCallback(
    (rating: number) => {
      if (!enabled) return;

      const currentImage = images[currentIndex];
      if (!currentImage) return;

      handleSetRating(currentImage, rating);
    },
    [enabled, images, currentIndex, handleSetRating],
  );

  const handleClearRating = useCallback(
    (imagePath: string) => {
      if (!enabled) return;

      setRatings((prev) => {
        const newRatings = new Map(prev);
        newRatings.delete(imagePath);
        return newRatings;
      });
    },
    [enabled],
  );

  const handleClearCurrentRating = useCallback(() => {
    if (!enabled) return;

    const currentImage = images[currentIndex];
    if (!currentImage) return;

    handleClearRating(currentImage);
  }, [enabled, images, currentIndex, handleClearRating]);

  const getRating = useCallback(
    (imagePath: string) => {
      return ratings.get(imagePath) || 0;
    },
    [ratings],
  );

  const getCurrentRating = useCallback(() => {
    const currentImage = images[currentIndex];
    return currentImage ? getRating(currentImage) : 0;
  }, [images, currentIndex, getRating]);

  const getAverageRating = useCallback(() => {
    if (ratings.size === 0) return 0;

    const total = Array.from(ratings.values()).reduce((sum, rating) => sum + rating, 0);
    return total / ratings.size;
  }, [ratings]);

  const getRatedImages = useCallback(() => {
    return Array.from(ratings.entries()).map(([path, rating]) => ({
      path,
      rating,
    }));
  }, [ratings]);

  const clearAllRatings = useCallback(() => {
    setRatings(new Map());
  }, []);

  const contextValue: MediaViewerRatingsContextType = {
    ratings,
    setRatings,
    handleSetRating,
    handleSetCurrentRating,
    handleClearRating,
    handleClearCurrentRating,
    getRating,
    getCurrentRating,
    getAverageRating,
    getRatedImages,
    clearAllRatings,
  };

  return (
    <MediaViewerRatingsContext.Provider value={contextValue}>
      {children}
    </MediaViewerRatingsContext.Provider>
  );
}
