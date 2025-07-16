import type { PanState } from './types';

interface MediaViewerImageProps {
  src: string;
  alt: string;
  zoom: number;
  pan: PanState;
  rotation?: 0 | 90 | 180 | 270;
  isDragging: boolean;
  isTransitioning: boolean;
  onLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onDoubleClick: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onWheel: (e: React.WheelEvent) => void;
}

export function MediaViewerImage({
  src,
  alt,
  zoom,
  pan,
  rotation = 0,
  isDragging,
  isTransitioning,
  onLoad,
  onDoubleClick,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onWheel,
}: MediaViewerImageProps) {
  return (
    <div
      className="flex-1 flex items-center justify-center overflow-hidden select-none"
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <img
        src={src || '/placeholder.svg'}
        alt={alt}
        className={`max-w-full max-h-full object-contain ${
          isTransitioning ? 'transition-transform duration-200 ease-out' : ''
        } ${zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-pointer'}`}
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px) rotate(${rotation}deg)`,
          willChange: isDragging ? 'transform' : 'auto',
        }}
        draggable={false}
        onDoubleClick={onDoubleClick}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onLoad={onLoad}
      />
    </div>
  );
}
