import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Eye, Image as ImageIcon, Loader2, RefreshCw, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  placeholder?: string;
  showLoadingIndicator?: boolean;
  showErrorMessage?: boolean;
  retryOnError?: boolean;
  fadeInDuration?: number;
  blurPlaceholder?: boolean;
  priority?: 'high' | 'low';
  quality?: 'low' | 'medium' | 'high';
  sizes?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'auto' | 'sync' | 'async';
  fetchPriority?: 'high' | 'low' | 'auto';
  // Lazy loading specific props
  loaded?: boolean;
  isLoading?: boolean;
  error?: boolean;
  loadTime?: number;
  imageSize?: { width: number; height: number };
  onRetry?: () => void;
  onPrefetch?: () => void;
}

export function LazyImage({
  src,
  alt,
  className = '',
  style,
  onLoad,
  onError,
  onClick,
  onDoubleClick,
  placeholder,
  showLoadingIndicator = true,
  showErrorMessage = true,
  retryOnError = true,
  fadeInDuration = 300,
  blurPlaceholder = true,
  priority = 'high',
  quality = 'high',
  sizes,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  loaded = false,
  isLoading = false,
  error = false,
  loadTime,
  imageSize,
  onRetry,
  onPrefetch,
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!containerRef.current || loading === 'eager') {
      setIsInView(true);
      return;
    }

    intersectionObserverRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          intersectionObserverRef.current?.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      },
    );

    intersectionObserverRef.current.observe(containerRef.current);

    return () => {
      intersectionObserverRef.current?.disconnect();
    };
  }, [loading]);

  // Handle image load event
  useEffect(() => {
    if (loaded && !fadeIn) {
      setTimeout(() => {
        setFadeIn(true);
      }, 50);
    }
  }, [loaded, fadeIn]);

  // Handle hover prefetch
  const handleMouseEnter = () => {
    if (onPrefetch && !loaded && !isLoading) {
      onPrefetch();
    }
  };

  // Handle retry
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  // Loading state
  if (isLoading || (!loaded && !error && isInView)) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden ${className}`}
        style={style}
        onMouseEnter={handleMouseEnter}
      >
        {/* Skeleton loader */}
        <Skeleton className="w-full h-full min-h-[200px]" />

        {/* Loading indicator */}
        {showLoadingIndicator && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span className="text-white text-sm">Loading...</span>
            </div>
          </div>
        )}

        {/* Performance badge */}
        {priority === 'high' && (
          <div className="absolute top-16 right-2 md:top-20">
            <Badge variant="secondary" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Priority
            </Badge>
          </div>
        )}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}
        style={style}
        onMouseEnter={handleMouseEnter}
      >
        {/* Error placeholder */}
        <div className="w-full h-full min-h-[200px] flex items-center justify-center">
          <div className="text-center p-6">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Failed to load image</p>
            {showErrorMessage && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">{src}</p>
            )}
            {retryOnError && onRetry && (
              <Button variant="outline" size="sm" onClick={handleRetry} className="text-xs">
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Not in view yet
  if (!isInView) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}
        style={style}
        onMouseEnter={handleMouseEnter}
      >
        {/* Placeholder */}
        <div className="w-full h-full min-h-[200px] flex items-center justify-center">
          <div className="text-center p-6">
            <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Scroll to load</p>
          </div>
        </div>
      </div>
    );
  }

  // Loaded state
  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {/* Placeholder/blur background */}
      {placeholder && blurPlaceholder && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-105"
          style={{
            backgroundImage: `url(${placeholder})`,
            opacity: fadeIn ? 0 : 1,
            transition: `opacity ${fadeInDuration}ms ease-in-out`,
          }}
        />
      )}

      {/* Main image */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-contain ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
        style={{
          transition: `opacity ${fadeInDuration}ms ease-in-out`,
        }}
        onLoad={onLoad}
        onError={onError}
        sizes={sizes}
        decoding={decoding}
        fetchPriority={fetchPriority}
      />

      {/* Performance info */}
      {loadTime && (
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="text-xs">
            {loadTime}ms
          </Badge>
        </div>
      )}

      {/* Image dimensions */}
      {imageSize && (
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="text-xs">
            <ImageIcon className="h-3 w-3 mr-1" />
            {imageSize.width}×{imageSize.height}
          </Badge>
        </div>
      )}
    </div>
  );
}

// Preload component for invisible preloading
export function PreloadImage({
  src,
  onLoad,
  onError,
}: {
  src: string;
  onLoad?: () => void;
  onError?: () => void;
}) {
  useEffect(() => {
    const img = new Image();
    img.onload = () => onLoad?.();
    img.onerror = () => onError?.();
    img.src = src;
  }, [src, onLoad, onError]);

  return null;
}
