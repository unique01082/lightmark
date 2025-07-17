'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { useMediaViewerCore } from './core-context';

export interface MediaViewerFavoritesContextType {
  // Favorites state
  favorites: Set<string>;
  setFavorites: (favorites: Set<string>) => void;

  // Favorites handlers
  handleToggleFavorite: (imagePath?: string) => void;
  handleAddToFavorites: (imagePath: string) => void;
  handleRemoveFromFavorites: (imagePath: string) => void;
  isFavorite: (imagePath: string) => boolean;
  isCurrentImageFavorite: () => boolean;
  getFavoriteImages: () => string[];
  clearFavorites: () => void;
}

const MediaViewerFavoritesContext = createContext<MediaViewerFavoritesContextType | null>(null);

export function useMediaViewerFavorites() {
  const context = useContext(MediaViewerFavoritesContext);
  if (!context) {
    throw new Error('useMediaViewerFavorites must be used within a MediaViewerFavoritesProvider');
  }
  return context;
}

interface MediaViewerFavoritesProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
  initialFavorites?: string[];
}

export function MediaViewerFavoritesProvider({
  children,
  enabled = true,
  initialFavorites = [],
}: MediaViewerFavoritesProviderProps) {
  const { images, currentIndex } = useMediaViewerCore();
  const [favorites, setFavorites] = useState<Set<string>>(new Set(initialFavorites));

  const handleToggleFavorite = useCallback(
    (imagePath?: string) => {
      if (!enabled) return;

      const targetImage = imagePath || images[currentIndex];
      if (!targetImage) return;

      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(targetImage)) {
          newFavorites.delete(targetImage);
        } else {
          newFavorites.add(targetImage);
        }
        return newFavorites;
      });
    },
    [enabled, images, currentIndex],
  );

  const handleAddToFavorites = useCallback(
    (imagePath: string) => {
      if (!enabled) return;

      setFavorites((prev) => new Set(prev).add(imagePath));
    },
    [enabled],
  );

  const handleRemoveFromFavorites = useCallback(
    (imagePath: string) => {
      if (!enabled) return;

      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        newFavorites.delete(imagePath);
        return newFavorites;
      });
    },
    [enabled],
  );

  const isFavorite = useCallback(
    (imagePath: string) => {
      return favorites.has(imagePath);
    },
    [favorites],
  );

  const isCurrentImageFavorite = useCallback(() => {
    const currentImage = images[currentIndex];
    return currentImage ? favorites.has(currentImage) : false;
  }, [images, currentIndex, favorites]);

  const getFavoriteImages = useCallback(() => {
    return Array.from(favorites);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites(new Set());
  }, []);

  const contextValue: MediaViewerFavoritesContextType = {
    favorites,
    setFavorites,
    handleToggleFavorite,
    handleAddToFavorites,
    handleRemoveFromFavorites,
    isFavorite,
    isCurrentImageFavorite,
    getFavoriteImages,
    clearFavorites,
  };

  return (
    <MediaViewerFavoritesContext.Provider value={contextValue}>
      {children}
    </MediaViewerFavoritesContext.Provider>
  );
}
