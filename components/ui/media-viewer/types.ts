export interface MediaViewerProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  metadata?: Record<string, any>;
  rotation?: RotationState; // Added rotation state
}

export interface ImageSize {
  width: number;
  height: number;
}

export interface PanState {
  x: number;
  y: number;
}

export interface DragState {
  x: number;
  y: number;
}

export interface RotationState {
  angle: 0 | 90 | 180 | 270;
}

export interface SlideshowState {
  isActive: boolean;
  interval: number;
  isPaused: boolean;
}

export interface ImageMetadata {
  filename?: string;
  fileSize?: number;
  dimensions?: ImageSize;
  dateCreated?: string;
  dateTaken?: string;
  cameraModel?: string;
  iso?: number;
  aperture?: string;
  shutterSpeed?: string;
  focalLength?: string;
  gpsLocation?: {
    lat: number;
    lng: number;
  };
  rating?: number; // 0-5 stars
  colorLabel?: 'none' | 'red' | 'yellow' | 'green' | 'blue' | 'purple';
  isRejected?: boolean;
  isPicked?: boolean;
}

export interface MediaViewerHeaderProps {
  currentIndex: number;
  totalImages: number;
  metadata?: Record<string, any>;
  showInfo: boolean;
  onToggleInfo: () => void;
  onClose: () => void;
  onQuickZoom: (zoomLevel: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate?: () => void;
  onSlideshowToggle?: () => void;
  slideshow?: SlideshowState;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
  onFullscreen?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onToggleHistogram?: () => void;
  showHistogram?: boolean;
  onToggleGrid?: () => void;
  showGrid?: boolean;
  onToggleQuickActions?: () => void;
  showQuickActions?: boolean;
  onToggleRating?: () => void;
  showRating?: boolean;
  onToggleComparison?: () => void;
  showComparison?: boolean;
  onToggleKeyboardHelp?: () => void;
  onToggleCropSimulator?: () => void;
}
