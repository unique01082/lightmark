'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Camera,
  Copy,
  Crop,
  FlipHorizontal,
  FlipVertical,
  Grid,
  Image as ImageIcon,
  Maximize2,
  Monitor,
  RotateCcw,
  RotateCw,
  Square,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStackablePopup } from './use-stackable-popup';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AspectRatioPreset {
  name: string;
  ratio: number;
  icon: React.ReactNode;
  description: string;
}

interface CropSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropApply?: (cropArea: CropArea) => void;
  onCropCancel?: () => void;
  popupId?: string; // Add popupId for stackable popup system
}

const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  { name: 'Free', ratio: 0, icon: <Crop className="h-4 w-4" />, description: 'No constraints' },
  { name: '1:1', ratio: 1, icon: <Square className="h-4 w-4" />, description: 'Square' },
  { name: '4:3', ratio: 4 / 3, icon: <Monitor className="h-4 w-4" />, description: 'Standard' },
  { name: '3:2', ratio: 3 / 2, icon: <Camera className="h-4 w-4" />, description: 'Camera' },
  { name: '16:9', ratio: 16 / 9, icon: <Monitor className="h-4 w-4" />, description: 'Widescreen' },
  { name: '2:3', ratio: 2 / 3, icon: <ImageIcon className="h-4 w-4" />, description: 'Portrait' },
  { name: '3:4', ratio: 3 / 4, icon: <ImageIcon className="h-4 w-4" />, description: 'Portrait' },
  {
    name: '21:9',
    ratio: 21 / 9,
    icon: <Maximize2 className="h-4 w-4" />,
    description: 'Cinematic',
  },
  { name: '5:4', ratio: 5 / 4, icon: <Monitor className="h-4 w-4" />, description: 'Classic' },
];

export function CropSimulator({
  isOpen,
  onClose,
  imageSrc,
  onCropApply,
  onCropCancel,
  popupId = 'crop-simulator', // Default ID if none provided
}: CropSimulatorProps) {
  // Generate unique ID for SVG mask (memoized to prevent regeneration)
  const maskId = useMemo(() => `cropMask-${Math.random().toString(36).substr(2, 9)}`, []);

  // Initialize stackable popup
  const { style: popupStyle, popupRef: popupContainerRef } = useStackablePopup(popupId, {
    width: 700, // Adjust width as needed
    height: 500, // Adjust height as needed
    visible: isOpen,
  });

  const [selectedPreset, setSelectedPreset] = useState<AspectRatioPreset>(ASPECT_RATIO_PRESETS[0]);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<
    | 'move'
    | 'resize-nw'
    | 'resize-ne'
    | 'resize-sw'
    | 'resize-se'
    | 'resize-n'
    | 'resize-s'
    | 'resize-w'
    | 'resize-e'
    | null
  >(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [cropRotation, setCropRotation] = useState(0);
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });
  const [imageDisplaySize, setImageDisplaySize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Update container size when component mounts or window resizes
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const maxWidth = Math.max(300, rect.width || 600);
        const maxHeight = Math.max(200, rect.height || 400);

        if (imageNaturalSize.width > 0 && imageNaturalSize.height > 0) {
          // Calculate responsive size based on image aspect ratio
          const aspectRatio = imageNaturalSize.width / imageNaturalSize.height;
          let newWidth = maxWidth;
          let newHeight = maxHeight;

          if (aspectRatio > 1) {
            // Landscape image
            newHeight = Math.min(newWidth / aspectRatio, maxHeight);
            newWidth = newHeight * aspectRatio;
          } else {
            // Portrait image
            newWidth = Math.min(newHeight * aspectRatio, maxWidth);
            newHeight = newWidth / aspectRatio;
          }

          setContainerSize({ width: newWidth, height: newHeight });
        } else {
          // Fallback when image isn't loaded yet
          setContainerSize({ width: maxWidth, height: maxHeight });
        }
      }
    };

    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, [imageNaturalSize]);

  // Initialize crop area to full image when container is ready
  useEffect(() => {
    if (containerSize.width > 0 && containerSize.height > 0 && !isInitialized) {
      setCropArea({
        x: 0,
        y: 0,
        width: containerSize.width,
        height: containerSize.height,
      });
      setIsInitialized(true);
    }
  }, [containerSize, isInitialized]);

  // Update crop area when aspect ratio changes
  useEffect(() => {
    if (selectedPreset.ratio > 0 && containerSize.width > 0) {
      const containerWidth = containerSize.width;
      const containerHeight = containerSize.height;

      let newWidth = cropArea.width;
      let newHeight = cropArea.height;

      // Get the actual ratio considering crop rotation
      let actualRatio = selectedPreset.ratio;
      if (cropRotation === 90 || cropRotation === 270) {
        actualRatio = 1 / selectedPreset.ratio;
      }

      if (actualRatio > 1) {
        // Landscape
        newHeight = newWidth / actualRatio;
        if (newHeight > containerHeight - cropArea.y) {
          newHeight = containerHeight - cropArea.y;
          newWidth = newHeight * actualRatio;
        }
      } else {
        // Portrait
        newWidth = newHeight * actualRatio;
        if (newWidth > containerWidth - cropArea.x) {
          newWidth = containerWidth - cropArea.x;
          newHeight = newWidth / actualRatio;
        }
      }

      setCropArea((prev) => ({
        ...prev,
        width: Math.max(20, Math.min(newWidth, containerWidth - prev.x)),
        height: Math.max(20, Math.min(newHeight, containerHeight - prev.y)),
      }));
    }
  }, [selectedPreset, cropRotation, containerSize]);

  // Handle image load to get natural dimensions
  const handleImageLoad = () => {
    if (imageRef.current) {
      const naturalWidth = imageRef.current.naturalWidth;
      const naturalHeight = imageRef.current.naturalHeight;

      setImageNaturalSize({
        width: naturalWidth,
        height: naturalHeight,
      });
      setImageDisplaySize({
        width: imageRef.current.clientWidth,
        height: imageRef.current.clientHeight,
      });

      // Reset initialization flag to allow re-initialization with new image
      setIsInitialized(false);
    }
  };

  // Calculate actual crop dimensions based on image scaling
  const getActualCropDimensions = () => {
    if (imageNaturalSize.width === 0 || imageDisplaySize.width === 0)
      return { width: 0, height: 0 };

    const scaleX = imageNaturalSize.width / imageDisplaySize.width;
    const scaleY = imageNaturalSize.height / imageDisplaySize.height;

    return {
      width: Math.round(cropArea.width * scaleX),
      height: Math.round(cropArea.height * scaleY),
    };
  };

  const handleMouseDown = (
    e: React.MouseEvent,
    mode:
      | 'move'
      | 'resize-nw'
      | 'resize-ne'
      | 'resize-sw'
      | 'resize-se'
      | 'resize-n'
      | 'resize-s'
      | 'resize-w'
      | 'resize-e',
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    setDragMode(mode);
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragMode || !containerRef.current || containerSize.width === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (dragMode === 'move') {
      const deltaX = currentX - dragStart.x;
      const deltaY = currentY - dragStart.y;

      setCropArea((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(prev.x + deltaX, containerSize.width - prev.width)),
        y: Math.max(0, Math.min(prev.y + deltaY, containerSize.height - prev.height)),
      }));

      setDragStart({ x: currentX, y: currentY });
    } else if (dragMode.startsWith('resize-')) {
      const direction = dragMode.split('-')[1] as 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e';

      let newX = cropArea.x;
      let newY = cropArea.y;
      let newWidth = cropArea.width;
      let newHeight = cropArea.height;

      // Calculate new dimensions based on resize direction
      switch (direction) {
        case 'nw':
          newX = Math.max(0, Math.min(currentX, cropArea.x + cropArea.width - 20));
          newY = Math.max(0, Math.min(currentY, cropArea.y + cropArea.height - 20));
          newWidth = cropArea.x + cropArea.width - newX;
          newHeight = cropArea.y + cropArea.height - newY;
          break;
        case 'ne':
          newY = Math.max(0, Math.min(currentY, cropArea.y + cropArea.height - 20));
          newWidth = Math.max(
            20,
            Math.min(currentX - cropArea.x, containerSize.width - cropArea.x),
          );
          newHeight = cropArea.y + cropArea.height - newY;
          break;
        case 'sw':
          newX = Math.max(0, Math.min(currentX, cropArea.x + cropArea.width - 20));
          newWidth = cropArea.x + cropArea.width - newX;
          newHeight = Math.max(
            20,
            Math.min(currentY - cropArea.y, containerSize.height - cropArea.y),
          );
          break;
        case 'se':
          newWidth = Math.max(
            20,
            Math.min(currentX - cropArea.x, containerSize.width - cropArea.x),
          );
          newHeight = Math.max(
            20,
            Math.min(currentY - cropArea.y, containerSize.height - cropArea.y),
          );
          break;
        case 'n':
          newY = Math.max(0, Math.min(currentY, cropArea.y + cropArea.height - 20));
          newHeight = cropArea.y + cropArea.height - newY;
          break;
        case 's':
          newHeight = Math.max(
            20,
            Math.min(currentY - cropArea.y, containerSize.height - cropArea.y),
          );
          break;
        case 'w':
          newX = Math.max(0, Math.min(currentX, cropArea.x + cropArea.width - 20));
          newWidth = cropArea.x + cropArea.width - newX;
          break;
        case 'e':
          newWidth = Math.max(
            20,
            Math.min(currentX - cropArea.x, containerSize.width - cropArea.x),
          );
          break;
      }

      // Apply aspect ratio constraint if needed
      if (selectedPreset.ratio > 0) {
        let actualRatio = selectedPreset.ratio;
        if (cropRotation === 90 || cropRotation === 270) {
          actualRatio = 1 / selectedPreset.ratio;
        }

        if (actualRatio > 1) {
          // Landscape: adjust height based on width
          newHeight = newWidth / actualRatio;
          if (direction === 'nw' || direction === 'ne' || direction === 'n') {
            newY = cropArea.y + cropArea.height - newHeight;
          }
        } else {
          // Portrait: adjust width based on height
          newWidth = newHeight * actualRatio;
          if (direction === 'nw' || direction === 'sw' || direction === 'w') {
            newX = cropArea.x + cropArea.width - newWidth;
          }
        }
      }

      // Ensure crop area stays within bounds
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);
      newWidth = Math.min(newWidth, containerSize.width - newX);
      newHeight = Math.min(newHeight, containerSize.height - newY);

      setCropArea({ x: newX, y: newY, width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragMode(null);
  };

  const handleReset = () => {
    setCropArea({
      x: 0,
      y: 0,
      width: containerSize.width || 100,
      height: containerSize.height || 100,
    });
    setSelectedPreset(ASPECT_RATIO_PRESETS[0]);
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setCropRotation(0);
  };

  const handleCropRotate = () => {
    setCropRotation((prev) => (prev + 90) % 360);
  };

  const handleApply = () => {
    const actualDimensions = getActualCropDimensions();
    const scaleX = imageNaturalSize.width / imageDisplaySize.width;
    const scaleY = imageNaturalSize.height / imageDisplaySize.height;

    const actualCropArea = {
      x: Math.round(cropArea.x * scaleX),
      y: Math.round(cropArea.y * scaleY),
      width: actualDimensions.width,
      height: actualDimensions.height,
    };

    onCropApply?.(actualCropArea);
    onClose();
  };

  const actualDimensions = getActualCropDimensions();

  return (
    <div
      ref={popupContainerRef}
      className="fixed bg-background border rounded-lg shadow-lg flex flex-col max-w-6xl"
      style={{
        ...popupStyle,
        display: isOpen ? 'flex' : 'none',
        height: '90vh',
      }}
    >
      <div className="sticky top-0 p-4 bg-background border-b z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Crop className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Crop Simulator</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Main crop area */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant={showGrid ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={showDimensions ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowDimensions(!showDimensions)}
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Dimensions
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Rotate Image
            </Button>
            <Button variant="outline" size="sm" onClick={handleCropRotate}>
              <RotateCw className="h-4 w-4 mr-2" />
              Rotate Crop
            </Button>
            <Button variant="outline" size="sm" onClick={() => setFlipHorizontal(!flipHorizontal)}>
              <FlipHorizontal className="h-4 w-4 mr-2" />
              Flip H
            </Button>
            <Button variant="outline" size="sm" onClick={() => setFlipVertical(!flipVertical)}>
              <FlipVertical className="h-4 w-4 mr-2" />
              Flip V
            </Button>
          </div>

          {/* Crop preview container */}
          <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg p-4 min-h-0">
            <div
              ref={containerRef}
              className="relative bg-black rounded-lg overflow-hidden shadow-2xl max-w-full max-h-full"
              style={{
                width: containerSize.width || 'auto',
                height: containerSize.height || 'auto',
                minWidth: '300px',
                minHeight: '200px',
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                className="w-full h-full object-contain"
                style={{
                  transform: `rotate(${rotation}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
                }}
                onLoad={handleImageLoad}
              />

              {/* Dimming overlay - areas outside crop selection */}
              <div className="absolute inset-0 pointer-events-none">
                {cropRotation === 0 ? (
                  // Simple rectangular overlay for non-rotated crop
                  <>
                    {/* Top overlay */}
                    <div
                      className="absolute top-0 left-0 right-0 bg-black/60"
                      style={{ height: `${cropArea.y}px` }}
                    />

                    {/* Bottom overlay */}
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-black/60"
                      style={{
                        height: `${(containerSize.height || 300) - cropArea.y - cropArea.height}px`,
                      }}
                    />

                    {/* Left overlay */}
                    <div
                      className="absolute bg-black/60"
                      style={{
                        top: `${cropArea.y}px`,
                        left: '0px',
                        width: `${cropArea.x}px`,
                        height: `${cropArea.height}px`,
                      }}
                    />

                    {/* Right overlay */}
                    <div
                      className="absolute bg-black/60"
                      style={{
                        top: `${cropArea.y}px`,
                        right: '0px',
                        width: `${(containerSize.width || 400) - cropArea.x - cropArea.width}px`,
                        height: `${cropArea.height}px`,
                      }}
                    />
                  </>
                ) : (
                  // SVG mask overlay for rotated crop
                  <div className="absolute inset-0 bg-black/60">
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox={`0 0 ${containerSize.width || 400} ${containerSize.height || 300}`}
                    >
                      <defs>
                        <mask id={maskId}>
                          <rect width="100%" height="100%" fill="white" />
                          <rect
                            x={cropArea.x}
                            y={cropArea.y}
                            width={cropArea.width}
                            height={cropArea.height}
                            fill="black"
                            transform={`rotate(${cropRotation} ${cropArea.x + cropArea.width / 2} ${cropArea.y + cropArea.height / 2})`}
                          />
                        </mask>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill="black"
                        fillOpacity="0.6"
                        mask={`url(#${maskId})`}
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Grid overlay */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Rule of thirds grid */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="border border-white/20" />
                    ))}
                  </div>
                </div>
              )}

              {/* Crop area */}
              <div
                className="absolute border-2 border-white shadow-lg bg-transparent cursor-move"
                style={{
                  left: `${cropArea.x}px`,
                  top: `${cropArea.y}px`,
                  width: `${cropArea.width}px`,
                  height: `${cropArea.height}px`,
                  transform: `rotate(${cropRotation}deg)`,
                  transformOrigin: 'center center',
                }}
                onMouseDown={(e) => handleMouseDown(e, 'move')}
              >
                {/* Corner handles */}
                <div
                  className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-gray-300 rounded-full cursor-nw-resize"
                  onMouseDown={(e) => handleMouseDown(e, 'resize-nw')}
                />
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-gray-300 rounded-full cursor-ne-resize"
                  onMouseDown={(e) => handleMouseDown(e, 'resize-ne')}
                />
                <div
                  className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-gray-300 rounded-full cursor-sw-resize"
                  onMouseDown={(e) => handleMouseDown(e, 'resize-sw')}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-gray-300 rounded-full cursor-se-resize"
                  onMouseDown={(e) => handleMouseDown(e, 'resize-se')}
                />

                {/* Edge handles */}
                <div
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border border-gray-300 rounded-full cursor-n-resize"
                  onMouseDown={(e) => handleMouseDown(e, 'resize-n')}
                />
                <div
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border border-gray-300 rounded-full cursor-s-resize"
                  onMouseDown={(e) => handleMouseDown(e, 'resize-s')}
                />
                <div
                  className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white border border-gray-300 rounded-full cursor-w-resize"
                  onMouseDown={(e) => handleMouseDown(e, 'resize-w')}
                />
                <div
                  className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white border border-gray-300 rounded-full cursor-e-resize"
                  onMouseDown={(e) => handleMouseDown(e, 'resize-e')}
                />

                {/* Crop area grid */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-white/30" />
                  ))}
                </div>
              </div>

              {/* Dimensions display */}
              {showDimensions && (
                <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                  {actualDimensions.width} × {actualDimensions.height}px
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Control panel */}
        <div className="w-80 flex flex-col gap-4 overflow-y-auto max-h-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Aspect Ratio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {ASPECT_RATIO_PRESETS.map((preset) => (
                  <Button
                    key={preset.name}
                    variant={selectedPreset.name === preset.name ? 'default' : 'outline'}
                    size="sm"
                    className="justify-start"
                    onClick={() => setSelectedPreset(preset)}
                  >
                    {preset.icon}
                    <span className="ml-2">{preset.name}</span>
                  </Button>
                ))}
              </div>

              <div className="text-xs text-muted-foreground">{selectedPreset.description}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Crop Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-grid" className="text-sm">
                  Show Grid
                </Label>
                <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-dimensions" className="text-sm">
                  Show Dimensions
                </Label>
                <Switch
                  id="show-dimensions"
                  checked={showDimensions}
                  onCheckedChange={setShowDimensions}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm">Crop Area</Label>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>
                    Position: {Math.round(cropArea.x)}, {Math.round(cropArea.y)}
                  </div>
                  <div>
                    Size: {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
                  </div>
                  <div>
                    Actual: {actualDimensions.width} × {actualDimensions.height}px
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Transform</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Image Rotation: {rotation}°</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Crop Rotation: {cropRotation}°</Label>
                <Button variant="outline" size="sm" onClick={handleCropRotate}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="flip-h" className="text-sm">
                  Flip Horizontal
                </Label>
                <Switch id="flip-h" checked={flipHorizontal} onCheckedChange={setFlipHorizontal} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="flip-v" className="text-sm">
                  Flip Vertical
                </Label>
                <Switch id="flip-v" checked={flipVertical} onCheckedChange={setFlipVertical} />
              </div>
            </CardContent>
          </Card>

          <div className="flex-1" />

          {/* Action buttons */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                navigator.clipboard.writeText(
                  `${actualDimensions.width}x${actualDimensions.height}`,
                )
              }
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Dimensions
            </Button>

            <Separator />

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onCropCancel || onClose}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleApply}>
                <Zap className="h-4 w-4 mr-2" />
                Apply Crop
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
