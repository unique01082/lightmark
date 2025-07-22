'use client';

import { useEffect, useRef, useState } from 'react';
import { usePopupManager } from './popup-manager';

interface UseStackablePopupOptions {
  width?: number;
  height?: number;
  visible?: boolean;
}

export function useStackablePopup(
  id: string,
  options: UseStackablePopupOptions = {}
) {
  const { width = 320, height = 400, visible = false } = options;
  const popupManager = usePopupManager();
  const [position, setPosition] = useState<{
    bottom: number;
    right: number;
    width: number;
    height: number;
  } | null>(null);
  const [zIndex, setZIndex] = useState(100);

  // Register with popup manager on mount
  useEffect(() => {
    const initialPosition = popupManager.registerPopup(id, width, height);
    setPosition(initialPosition);
    setZIndex(popupManager.getPopupZIndex(id));

    return () => {
      popupManager.unregisterPopup(id);
    };
  }, [id, width, height, popupManager]);

  // Update visibility when visible prop changes
  useEffect(() => {
    popupManager.updatePopupVisibility(id, visible);
  }, [id, visible, popupManager]);

  return {
    popupRef: useRef<HTMLDivElement>(null),
    isVisible: visible,
    style: position ? {
      position: 'fixed' as const,
      bottom: `${position.bottom}px`,
      right: `${position.right}px`,
      width: `${position.width}px`,
      minHeight: `${position.height}px`,
      zIndex,
      pointerEvents: visible ? 'auto' as const : 'none' as const,
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1)' : 'scale(0.95)',
      transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
    } : {
      position: 'fixed' as const,
      bottom: '16px',
      right: '16px',
      width: `${width}px`,
      minHeight: `${height}px`,
      zIndex: 100,
      pointerEvents: 'none' as const,
      opacity: 0,
    },
    position,
    zIndex,
  };
}
