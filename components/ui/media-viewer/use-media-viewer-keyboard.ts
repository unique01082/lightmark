import { useKeyPress } from 'ahooks';

interface UseMediaViewerKeyboardProps {
  isOpen: boolean;
  currentIndex: number;
  imagesLength: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate?: () => void;
  onToggleFavorite?: () => void;
  onToggleSlideshow?: () => void;
  onToggleHistogram?: () => void;
  onToggleGrid?: () => void;
  onToggleQuickActions?: () => void;
  onToggleRating?: () => void;
  onToggleComparison?: () => void;
  onRate?: (rating: number) => void;
  onReject?: () => void;
  onPick?: () => void;
  onEdit?: () => void;
  onCrop?: () => void;
  onFullscreen?: () => void;
  onDistractionFreeToggle?: () => void;
  onFullscreenModeChange?: (mode: 'normal' | 'distraction-free' | 'minimal') => void;
  onExitFullscreen?: () => void;
  isFullscreen?: boolean;
  fullscreenMode?: 'normal' | 'distraction-free' | 'minimal';

  // Enhanced navigation
  onJumpToIndex?: (index: number) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onInvertSelection?: () => void;

  // Zoom controls
  onZoomToFit?: () => void;
  onZoomToFill?: () => void;
  onZoomActualSize?: () => void;
  onZoomReset?: () => void;

  // Rotation and flip
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onFlipHorizontal?: () => void;
  onFlipVertical?: () => void;

  // File operations
  onDelete?: () => void;
  onShare?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDuplicate?: () => void;
  onRename?: () => void;
  onExport?: () => void;

  // View modes
  onToggleInfo?: () => void;
  onToggleFilmstrip?: () => void;
  onToggleMetadata?: () => void;
  onToggleThumbnails?: () => void;

  // Color labels
  onColorLabel?: (color: string) => void;

  // Batch operations
  onBatchFavorite?: () => void;
  onBatchDelete?: () => void;
  onBatchExport?: () => void;

  // Advanced features
  onToggleFocus?: () => void;
  onToggleExposure?: () => void;
  onToggleClipping?: () => void;
  onToggleRuler?: () => void;
  onToggleGuides?: () => void;

  // Search and filter
  onSearchToggle?: () => void;
  onFilterToggle?: () => void;
  onSortToggle?: () => void;

  // Performance
  onClearCache?: () => void;
  onRefresh?: () => void;
  onPreloadNext?: () => void;
  onPreloadPrevious?: () => void;

  // Help
  onToggleHelp?: () => void;
}

export function useMediaViewerKeyboard({
  isOpen,
  currentIndex,
  imagesLength,
  onClose,
  onIndexChange,
  onZoomIn,
  onZoomOut,
  onRotate,
  onToggleFavorite,
  onToggleSlideshow,
  onToggleHistogram,
  onToggleGrid,
  onToggleQuickActions,
  onToggleRating,
  onToggleComparison,
  onRate,
  onReject,
  onPick,
  onEdit,
  onCrop,
  onFullscreen,
  onDistractionFreeToggle,
  onFullscreenModeChange,
  onExitFullscreen,
  isFullscreen,
  fullscreenMode,

  // Enhanced navigation
  onJumpToIndex,
  onSelectAll,
  onDeselectAll,
  onInvertSelection,

  // Zoom controls
  onZoomToFit,
  onZoomToFill,
  onZoomActualSize,
  onZoomReset,

  // Rotation and flip
  onRotateLeft,
  onRotateRight,
  onFlipHorizontal,
  onFlipVertical,

  // File operations
  onDelete,
  onShare,
  onCopy,
  onPaste,
  onDuplicate,
  onRename,
  onExport,

  // View modes
  onToggleInfo,
  onToggleFilmstrip,
  onToggleMetadata,
  onToggleThumbnails,

  // Color labels
  onColorLabel,

  // Batch operations
  onBatchFavorite,
  onBatchDelete,
  onBatchExport,

  // Advanced features
  onToggleFocus,
  onToggleExposure,
  onToggleClipping,
  onToggleRuler,
  onToggleGuides,

  // Search and filter
  onSearchToggle,
  onFilterToggle,
  onSortToggle,

  // Performance
  onClearCache,
  onRefresh,
  onPreloadNext,
  onPreloadPrevious,

  // Help
  onToggleHelp,
}: UseMediaViewerKeyboardProps) {
  // Navigation
  useKeyPress('leftarrow', () => {
    if (isOpen && currentIndex > 0) onIndexChange(currentIndex - 1);
  });

  useKeyPress('rightarrow', () => {
    if (isOpen && currentIndex < imagesLength - 1) onIndexChange(currentIndex + 1);
  });

  useKeyPress('home', () => {
    if (isOpen) onIndexChange(0);
  });

  useKeyPress('end', () => {
    if (isOpen) onIndexChange(imagesLength - 1);
  });

  // Page navigation
  useKeyPress('pageup', () => {
    if (isOpen) {
      const newIndex = Math.max(0, currentIndex - 10);
      onIndexChange(newIndex);
    }
  });

  useKeyPress('pagedown', () => {
    if (isOpen) {
      const newIndex = Math.min(imagesLength - 1, currentIndex + 10);
      onIndexChange(newIndex);
    }
  });

  // Jump to specific positions
  useKeyPress('meta+home', () => {
    if (isOpen) onIndexChange(0);
  });

  useKeyPress('meta+end', () => {
    if (isOpen) onIndexChange(imagesLength - 1);
  });

  // Selection shortcuts
  useKeyPress('ctrl+a', () => {
    if (isOpen) onSelectAll?.();
  });

  useKeyPress('ctrl+shift+a', () => {
    if (isOpen) onDeselectAll?.();
  });

  useKeyPress('ctrl+i', () => {
    if (isOpen) onInvertSelection?.();
  });

  // Zoom controls
  useKeyPress(['=', '+'], () => {
    if (isOpen) onZoomIn();
  });

  useKeyPress('-', () => {
    if (isOpen) onZoomOut();
  });

  // Advanced zoom shortcuts
  useKeyPress('ctrl+=', () => {
    if (isOpen) onZoomIn();
  });

  useKeyPress('ctrl+-', () => {
    if (isOpen) onZoomOut();
  });

  useKeyPress('ctrl+0', () => {
    if (isOpen) onZoomToFit?.();
  });

  useKeyPress('ctrl+alt+0', () => {
    if (isOpen) onZoomActualSize?.();
  });

  useKeyPress('ctrl+shift+0', () => {
    if (isOpen) onZoomToFill?.();
  });

  useKeyPress('ctrl+alt+z', () => {
    if (isOpen) onZoomReset?.();
  });

  // Fit zoom shortcuts
  useKeyPress('z', () => {
    if (isOpen) onZoomToFit?.();
  });

  useKeyPress('shift+z', () => {
    if (isOpen) onZoomToFill?.();
  });

  // Transform controls
  useKeyPress('r', () => {
    if (isOpen) onRotate?.();
  });

  // Enhanced rotation controls
  useKeyPress('ctrl+r', () => {
    if (isOpen) onRotateRight?.();
  });

  useKeyPress('ctrl+shift+r', () => {
    if (isOpen) onRotateLeft?.();
  });

  useKeyPress('ctrl+]', () => {
    if (isOpen) onRotateRight?.();
  });

  useKeyPress('ctrl+[', () => {
    if (isOpen) onRotateLeft?.();
  });

  // Flip controls
  useKeyPress('ctrl+shift+h', () => {
    if (isOpen) onFlipHorizontal?.();
  });

  useKeyPress('ctrl+shift+v', () => {
    if (isOpen) onFlipVertical?.();
  });

  useKeyPress('c', () => {
    if (isOpen) onCrop?.();
  });

  // View controls
  useKeyPress('f', () => {
    if (isOpen) onFullscreen?.();
  });

  useKeyPress('d', () => {
    if (isOpen) onDistractionFreeToggle?.();
  });

  useKeyPress('m', () => {
    if (isOpen && fullscreenMode) {
      const modes: ('normal' | 'distraction-free' | 'minimal')[] = [
        'normal',
        'distraction-free',
        'minimal',
      ];
      const currentModeIndex = modes.indexOf(fullscreenMode);
      const nextMode = modes[(currentModeIndex + 1) % modes.length];
      onFullscreenModeChange?.(nextMode);
    }
  });

  useKeyPress(
    'esc',
    () => {
      if (isOpen) {
        if (isFullscreen) {
          onExitFullscreen?.();
        } else {
          onClose();
        }
      }
    },
    { exactMatch: true },
  );

  useKeyPress('h', () => {
    if (isOpen) onToggleHistogram?.();
  });

  useKeyPress('g', () => {
    if (isOpen) onToggleGrid?.();
  });

  useKeyPress('q', () => {
    if (isOpen) onToggleQuickActions?.();
  });

  // Rating and selection
  useKeyPress('b', () => {
    if (isOpen) onToggleFavorite?.();
  });

  useKeyPress('s', () => {
    if (isOpen) onToggleSlideshow?.();
  });

  useKeyPress('t', () => {
    if (isOpen) onToggleRating?.();
  });

  useKeyPress('v', () => {
    if (isOpen) onToggleComparison?.();
  });

  useKeyPress('x', () => {
    if (isOpen) onReject?.();
  });

  useKeyPress('p', () => {
    if (isOpen) onPick?.();
  });

  // Star ratings (1-5)
  useKeyPress('1', () => {
    if (isOpen) onRate?.(1);
  });

  useKeyPress('2', () => {
    if (isOpen) onRate?.(2);
  });

  useKeyPress('3', () => {
    if (isOpen) onRate?.(3);
  });

  useKeyPress('4', () => {
    if (isOpen) onRate?.(4);
  });

  useKeyPress('5', () => {
    if (isOpen) onRate?.(5);
  });

  useKeyPress('0', () => {
    if (isOpen) onRate?.(0);
  });

  // Edit mode
  useKeyPress('e', () => {
    if (isOpen) onEdit?.();
  });

  // File operations
  useKeyPress('delete', () => {
    if (isOpen) onDelete?.();
  });

  useKeyPress('backspace', () => {
    if (isOpen) onDelete?.();
  });

  useKeyPress('ctrl+s', () => {
    if (isOpen) onShare?.();
  });

  useKeyPress('ctrl+c', () => {
    if (isOpen) onCopy?.();
  });

  useKeyPress('ctrl+v', () => {
    if (isOpen) onPaste?.();
  });

  useKeyPress('ctrl+d', () => {
    if (isOpen) onDuplicate?.();
  });

  useKeyPress('f2', () => {
    if (isOpen) onRename?.();
  });

  useKeyPress('ctrl+e', () => {
    if (isOpen) onExport?.();
  });

  // Color labels (professional photography workflow)
  useKeyPress('6', () => {
    if (isOpen) onColorLabel?.('red');
  });

  useKeyPress('7', () => {
    if (isOpen) onColorLabel?.('orange');
  });

  useKeyPress('8', () => {
    if (isOpen) onColorLabel?.('yellow');
  });

  useKeyPress('9', () => {
    if (isOpen) onColorLabel?.('green');
  });

  useKeyPress('shift+6', () => {
    if (isOpen) onColorLabel?.('blue');
  });

  useKeyPress('shift+7', () => {
    if (isOpen) onColorLabel?.('purple');
  });

  useKeyPress('shift+8', () => {
    if (isOpen) onColorLabel?.('pink');
  });

  useKeyPress('shift+9', () => {
    if (isOpen) onColorLabel?.('gray');
  });

  // View toggles
  useKeyPress('i', () => {
    if (isOpen) onToggleInfo?.();
  });

  useKeyPress('ctrl+shift+f', () => {
    if (isOpen) onToggleFilmstrip?.();
  });

  useKeyPress('ctrl+shift+m', () => {
    if (isOpen) onToggleMetadata?.();
  });

  useKeyPress('ctrl+shift+t', () => {
    if (isOpen) onToggleThumbnails?.();
  });

  // Advanced features
  useKeyPress('ctrl+shift+f', () => {
    if (isOpen) onToggleFocus?.();
  });

  useKeyPress('ctrl+shift+e', () => {
    if (isOpen) onToggleExposure?.();
  });

  useKeyPress('ctrl+shift+c', () => {
    if (isOpen) onToggleClipping?.();
  });

  useKeyPress('ctrl+shift+r', () => {
    if (isOpen) onToggleRuler?.();
  });

  useKeyPress('ctrl+shift+g', () => {
    if (isOpen) onToggleGuides?.();
  });

  // Search and filter
  useKeyPress('ctrl+f', () => {
    if (isOpen) onSearchToggle?.();
  });

  useKeyPress('ctrl+shift+l', () => {
    if (isOpen) onFilterToggle?.();
  });

  useKeyPress('ctrl+shift+s', () => {
    if (isOpen) onSortToggle?.();
  });

  // Batch operations
  useKeyPress('ctrl+shift+b', () => {
    if (isOpen) onBatchFavorite?.();
  });

  useKeyPress('ctrl+shift+d', () => {
    if (isOpen) onBatchDelete?.();
  });

  useKeyPress('ctrl+shift+e', () => {
    if (isOpen) onBatchExport?.();
  });

  // Performance shortcuts
  useKeyPress('ctrl+shift+delete', () => {
    if (isOpen) onClearCache?.();
  });

  useKeyPress('f5', () => {
    if (isOpen) onRefresh?.();
  });

  useKeyPress('ctrl+shift+rightarrow', () => {
    if (isOpen) onPreloadNext?.();
  });

  useKeyPress('ctrl+shift+leftarrow', () => {
    if (isOpen) onPreloadPrevious?.();
  });

  // Help
  useKeyPress('ctrl+?', () => {
    if (isOpen) onToggleHelp?.();
  });

  useKeyPress('f1', () => {
    if (isOpen) onToggleHelp?.();
  });

  // Spacebar for slideshow play/pause
  useKeyPress('space', (e) => {
    if (isOpen) {
      e.preventDefault();
      onToggleSlideshow?.();
    }
  });
}
