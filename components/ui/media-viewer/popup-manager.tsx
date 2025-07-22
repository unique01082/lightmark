'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

interface PopupPosition {
  bottom: number;
  right: number;
  width: number;
  height: number;
}

interface PopupInfo {
  id: string;
  isVisible: boolean;
  position: PopupPosition;
  zIndex: number;
}

interface PopupManagerContextType {
  registerPopup: (id: string, width: number, height: number) => PopupPosition;
  unregisterPopup: (id: string) => void;
  updatePopupVisibility: (id: string, isVisible: boolean) => void;
  getPopupPosition: (id: string) => PopupPosition | null;
  getPopupZIndex: (id: string) => number;
}

const PopupManagerContext = createContext<PopupManagerContextType | null>(null);

export function usePopupManager() {
  const context = useContext(PopupManagerContext);
  if (!context) {
    throw new Error('usePopupManager must be used within PopupManagerProvider');
  }
  return context;
}

interface PopupManagerProviderProps {
  children: React.ReactNode;
}

export function PopupManagerProvider({ children }: PopupManagerProviderProps) {
  const [popups, setPopups] = useState<Map<string, PopupInfo>>(new Map());
  const popupsRef = useRef<Map<string, PopupInfo>>(new Map());
  const nextZIndexRef = useRef(100);

  // Keep ref in sync with state
  popupsRef.current = popups;

  const calculateSimplePosition = (id: string, width: number, height: number): PopupPosition => {
    const visiblePopups = Array.from(popupsRef.current.values()).filter(
      (p) => p.isVisible && p.id !== id,
    );
    const baseRight = 16;
    const baseBottom = 16;
    const gap = 12;

    // Simple stacking: each popup goes above the previous one
    let targetBottom = baseBottom;
    for (const popup of visiblePopups) {
      targetBottom = Math.max(targetBottom, popup.position.bottom + popup.position.height + gap);
    }

    return {
      bottom: targetBottom,
      right: baseRight,
      width,
      height,
    };
  };

  const registerPopup = useCallback((id: string, width: number, height: number): PopupPosition => {
    const position = calculateSimplePosition(id, width, height);
    const zIndex = nextZIndexRef.current++;

    const newPopup: PopupInfo = {
      id,
      isVisible: false,
      position,
      zIndex,
    };

    setPopups((prev) => new Map(prev.set(id, newPopup)));
    return position;
  }, []);

  const unregisterPopup = useCallback((id: string) => {
    setPopups((prev) => {
      if (!prev.has(id)) {
        return prev;
      }
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const updatePopupVisibility = useCallback((id: string, isVisible: boolean) => {
    setPopups((prev) => {
      const popup = prev.get(id);
      if (!popup || popup.isVisible === isVisible) {
        return prev;
      }

      const newMap = new Map(prev);
      newMap.set(id, {
        ...popup,
        isVisible,
      });

      return newMap;
    });
  }, []);

  const getPopupPosition = useCallback((id: string): PopupPosition | null => {
    const popup = popupsRef.current.get(id);
    return popup ? popup.position : null;
  }, []);

  const getPopupZIndex = useCallback((id: string): number => {
    const popup = popupsRef.current.get(id);
    return popup ? popup.zIndex : 100;
  }, []);

  const contextValue: PopupManagerContextType = {
    registerPopup,
    unregisterPopup,
    updatePopupVisibility,
    getPopupPosition,
    getPopupZIndex,
  };

  return (
    <PopupManagerContext.Provider value={contextValue}>{children}</PopupManagerContext.Provider>
  );
}
