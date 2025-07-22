import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeftRight,
  BarChart3,
  Eye,
  EyeOff,
  Grid3x3,
  Layers,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStackablePopup } from './use-stackable-popup';

interface ComparisonViewProps {
  images: string[];
  primaryIndex: number;
  secondaryIndex: number;
  onClose: () => void;
  onIndexChange: (primary: number, secondary: number) => void;
  metadata?: Array<Record<string, any>>;
  isVisible: boolean;
}

export function ComparisonView({
  images,
  primaryIndex,
  secondaryIndex,
  onClose,
  onIndexChange,
  metadata,
  isVisible,
}: ComparisonViewProps) {
  const [splitMode, setSplitMode] = useState<'side-by-side' | 'overlay' | 'flicker'>(
    'side-by-side',
  );
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [syncZoom, setSyncZoom] = useState(true);
  const [syncPan, setSyncPan] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showHistogram, setShowHistogram] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [flickerInterval, setFlickerInterval] = useState<NodeJS.Timeout | null>(null);
  const [flickerActive, setFlickerActive] = useState(false);
  const [currentFlickerImage, setCurrentFlickerImage] = useState<'primary' | 'secondary'>(
    'primary',
  );

  const { style: popupStyle, popupRef } = useStackablePopup('comparison-view', {
    width: typeof window !== 'undefined' ? window.innerWidth - 40 : 800, // Just a bit smaller than full window
    height: typeof window !== 'undefined' ? window.innerHeight - 40 : 600,
    visible: isVisible,
  });

  useEffect(() => {
    if (splitMode === 'flicker' && flickerActive) {
      const interval = setInterval(() => {
        setCurrentFlickerImage((prev) => (prev === 'primary' ? 'secondary' : 'primary'));
      }, 500);
      setFlickerInterval(interval);
      return () => clearInterval(interval);
    } else if (flickerInterval) {
      clearInterval(flickerInterval);
      setFlickerInterval(null);
    }
  }, [splitMode, flickerActive]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.25));
  };

  const handlePrevious = () => {
    if (primaryIndex > 0) {
      onIndexChange(primaryIndex - 1, secondaryIndex);
    }
  };

  const handleNext = () => {
    if (primaryIndex < images.length - 1) {
      onIndexChange(primaryIndex + 1, secondaryIndex);
    }
  };

  const handleSecondaryPrevious = () => {
    if (secondaryIndex > 0) {
      onIndexChange(primaryIndex, secondaryIndex - 1);
    }
  };

  const handleSecondaryNext = () => {
    if (secondaryIndex < images.length - 1) {
      onIndexChange(primaryIndex, secondaryIndex + 1);
    }
  };

  const toggleFlicker = () => {
    setFlickerActive(!flickerActive);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={popupRef}
      className="fixed bg-black rounded-lg overflow-hidden shadow-2xl flex flex-col"
      style={{
        ...popupStyle,
      }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <Badge variant="secondary">Comparison Mode</Badge>
          <div className="flex items-center gap-2">
            <Button
              variant={splitMode === 'side-by-side' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSplitMode('side-by-side')}
              className="text-white"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
            <Button
              variant={splitMode === 'overlay' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSplitMode('overlay')}
              className="text-white"
            >
              <Layers className="h-4 w-4" />
            </Button>
            <Button
              variant={splitMode === 'flicker' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSplitMode('flicker')}
              className="text-white"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="text-white hover:bg-white/20"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-white text-sm min-w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="text-white hover:bg-white/20"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          {/* Sync Controls */}
          <Button
            variant={syncZoom ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSyncZoom(!syncZoom)}
            className="text-white"
            title="Sync zoom"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant={syncPan ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSyncPan(!syncPan)}
            className="text-white"
            title="Sync pan"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          {/* View Options */}
          <Button
            variant={showGrid ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className="text-white"
            title="Toggle grid"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={showHistogram ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setShowHistogram(!showHistogram)}
            className="text-white"
            title="Toggle histogram"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-full pt-16">
        {splitMode === 'side-by-side' && (
          <>
            {/* Left Image */}
            <div className="flex-1 relative border-r border-white/20">
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="secondary">
                  Primary ({primaryIndex + 1}/{images.length})
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={primaryIndex === 0}
                  className="text-white hover:bg-white/20"
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  disabled={primaryIndex === images.length - 1}
                  className="text-white hover:bg-white/20"
                >
                  Next
                </Button>
              </div>
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={images[primaryIndex]}
                  alt={`Primary image ${primaryIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                    transition: 'transform 0.2s ease-out',
                  }}
                />
              </div>
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern
                        id="grid-primary"
                        width="33.33%"
                        height="33.33%"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 0 0 L 0 100 M 0 0 L 100 0"
                          fill="none"
                          stroke="white"
                          strokeWidth="1"
                          opacity="0.3"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-primary)" />
                  </svg>
                </div>
              )}
            </div>

            {/* Right Image */}
            <div className="flex-1 relative">
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="secondary">
                  Secondary ({secondaryIndex + 1}/{images.length})
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSecondaryPrevious}
                  disabled={secondaryIndex === 0}
                  className="text-white hover:bg-white/20"
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSecondaryNext}
                  disabled={secondaryIndex === images.length - 1}
                  className="text-white hover:bg-white/20"
                >
                  Next
                </Button>
              </div>
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={images[secondaryIndex]}
                  alt={`Secondary image ${secondaryIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                  style={{
                    transform: `scale(${zoom}) translate(${syncPan ? pan.x : 0}px, ${syncPan ? pan.y : 0}px)`,
                    transition: 'transform 0.2s ease-out',
                  }}
                />
              </div>
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern
                        id="grid-secondary"
                        width="33.33%"
                        height="33.33%"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 0 0 L 0 100 M 0 0 L 100 0"
                          fill="none"
                          stroke="white"
                          strokeWidth="1"
                          opacity="0.3"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-secondary)" />
                  </svg>
                </div>
              )}
            </div>
          </>
        )}

        {splitMode === 'overlay' && (
          <div className="flex-1 relative">
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="secondary">Overlay Mode</Badge>
            </div>
            <div className="absolute top-4 right-4 z-10">
              <div className="flex items-center gap-2 bg-black/50 rounded-lg p-2">
                <span className="text-white text-sm">Opacity:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
            <div className="w-full h-full flex items-center justify-center relative">
              <img
                src={images[primaryIndex]}
                alt={`Primary image ${primaryIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                  transition: 'transform 0.2s ease-out',
                }}
              />
              <img
                src={images[secondaryIndex]}
                alt={`Secondary image ${secondaryIndex + 1}`}
                className="absolute max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${zoom}) translate(${syncPan ? pan.x : 0}px, ${syncPan ? pan.y : 0}px)`,
                  transition: 'transform 0.2s ease-out',
                  opacity: overlayOpacity,
                }}
              />
            </div>
          </div>
        )}

        {splitMode === 'flicker' && (
          <div className="flex-1 relative">
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="secondary">Flicker Mode</Badge>
            </div>
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant={flickerActive ? 'default' : 'ghost'}
                size="sm"
                onClick={toggleFlicker}
                className="text-white"
              >
                {flickerActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {flickerActive ? 'Stop' : 'Start'} Flicker
              </Button>
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={images[currentFlickerImage === 'primary' ? primaryIndex : secondaryIndex]}
                alt={`${currentFlickerImage} image`}
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                  transition: 'transform 0.2s ease-out',
                }}
              />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <Badge variant="secondary">
                {currentFlickerImage === 'primary' ? 'Primary' : 'Secondary'} (
                {currentFlickerImage === 'primary' ? primaryIndex + 1 : secondaryIndex + 1}/
                {images.length})
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Metadata Panel */}
      {metadata && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm text-white">
            <div>
              <h4 className="font-semibold mb-2">Primary Image</h4>
              <div className="space-y-1">
                {metadata[primaryIndex] &&
                  Object.entries(metadata[primaryIndex]).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-white/60">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Secondary Image</h4>
              <div className="space-y-1">
                {metadata[secondaryIndex] &&
                  Object.entries(metadata[secondaryIndex]).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-white/60">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
