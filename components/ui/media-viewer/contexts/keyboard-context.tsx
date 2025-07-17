'use client';

import { createContext, useCallback, useContext, useEffect } from 'react';
import { useMediaViewerCore } from './core-context';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export interface MediaViewerKeyboardContextType {
  // Keyboard shortcuts
  shortcuts: KeyboardShortcut[];
  addShortcut: (shortcut: KeyboardShortcut) => void;
  removeShortcut: (key: string) => void;
  getShortcuts: () => KeyboardShortcut[];

  // Keyboard handlers
  handleKeyDown: (event: KeyboardEvent) => void;
  isShortcutPressed: (shortcut: KeyboardShortcut, event: KeyboardEvent) => boolean;
}

const MediaViewerKeyboardContext = createContext<MediaViewerKeyboardContextType | null>(null);

export function useMediaViewerKeyboard() {
  const context = useContext(MediaViewerKeyboardContext);
  if (!context) {
    throw new Error('useMediaViewerKeyboard must be used within a MediaViewerKeyboardProvider');
  }
  return context;
}

interface MediaViewerKeyboardProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
  customShortcuts?: KeyboardShortcut[];
}

export function MediaViewerKeyboardProvider({
  children,
  enabled = true,
  customShortcuts = [],
}: MediaViewerKeyboardProviderProps) {
  const { handleNext, handlePrevious, handleRotate, onClose } = useMediaViewerCore();

  const defaultShortcuts: KeyboardShortcut[] = [
    {
      key: 'ArrowRight',
      action: handleNext,
      description: 'Next image',
    },
    {
      key: 'ArrowLeft',
      action: handlePrevious,
      description: 'Previous image',
    },
    {
      key: 'r',
      action: handleRotate,
      description: 'Rotate image',
    },
    {
      key: 'Escape',
      action: onClose,
      description: 'Close media viewer',
    },
    {
      key: 'Space',
      action: handleNext,
      description: 'Next image',
    },
    {
      key: 'Backspace',
      action: handlePrevious,
      description: 'Previous image',
    },
  ];

  const shortcuts = [...defaultShortcuts, ...customShortcuts];

  const isShortcutPressed = useCallback((shortcut: KeyboardShortcut, event: KeyboardEvent) => {
    return (
      event.key === shortcut.key &&
      !!event.ctrlKey === !!shortcut.ctrlKey &&
      !!event.altKey === !!shortcut.altKey &&
      !!event.shiftKey === !!shortcut.shiftKey
    );
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Prevent default behavior for handled shortcuts
      const matchedShortcut = shortcuts.find((shortcut) => isShortcutPressed(shortcut, event));

      if (matchedShortcut) {
        event.preventDefault();
        matchedShortcut.action();
      }
    },
    [enabled, shortcuts, isShortcutPressed],
  );

  // Add keyboard event listeners
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);

  const addShortcut = useCallback((shortcut: KeyboardShortcut) => {
    // In a real implementation, this would update the shortcuts state
    console.warn('addShortcut: Dynamic shortcut addition not implemented');
  }, []);

  const removeShortcut = useCallback((key: string) => {
    // In a real implementation, this would update the shortcuts state
    console.warn('removeShortcut: Dynamic shortcut removal not implemented');
  }, []);

  const getShortcuts = useCallback(() => {
    return shortcuts;
  }, [shortcuts]);

  const contextValue: MediaViewerKeyboardContextType = {
    shortcuts,
    addShortcut,
    removeShortcut,
    getShortcuts,
    handleKeyDown,
    isShortcutPressed,
  };

  return (
    <MediaViewerKeyboardContext.Provider value={contextValue}>
      {children}
    </MediaViewerKeyboardContext.Provider>
  );
}
