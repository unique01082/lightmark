'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image } from 'image-js';
import { Copy, Eye, EyeOff, Palette, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStackablePopup } from './use-stackable-popup';

interface DominantColor {
  color: string;
  percentage: number;
  rgb: [number, number, number];
  hex: string;
  name?: string;
}

interface DominantColorsProps {
  imageSrc: string;
  isVisible: boolean;
  onToggle: () => void;
  onColorHighlight?: (color: DominantColor | null) => void;
}

export function DominantColors({
  imageSrc,
  isVisible,
  onToggle,
  onColorHighlight,
}: DominantColorsProps) {
  const [dominantColors, setDominantColors] = useState<DominantColor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<DominantColor | null>(null);

  // Stackable popup positioning
  const { style: popupStyle, popupRef } = useStackablePopup('dominant-colors', {
    width: 320,
    height: 400,
    visible: isVisible,
  });

  // Color name mapping for common colors
  const getColorName = (rgb: [number, number, number]): string => {
    const [r, g, b] = rgb;

    // Basic color detection
    if (r > 200 && g > 200 && b > 200) return 'Light';
    if (r < 50 && g < 50 && b < 50) return 'Dark';
    if (r > g && r > b) return 'Red-ish';
    if (g > r && g > b) return 'Green-ish';
    if (b > r && b > g) return 'Blue-ish';
    if (r > 150 && g > 150 && b < 100) return 'Yellow-ish';
    if (r > 150 && g < 100 && b > 150) return 'Magenta-ish';
    if (r < 100 && g > 150 && b > 150) return 'Cyan-ish';
    if (Math.abs(r - g) < 30 && Math.abs(r - b) < 30) return 'Gray-ish';

    return 'Mixed';
  };

  const extractDominantColors = async () => {
    if (!imageSrc) return;

    setIsLoading(true);
    try {
      // Load image with ImageJS
      const img = await Image.load(imageSrc);

      // Resize for faster processing
      const maxSize = 300;
      const resized = img.resize({
        width: Math.min(img.width, maxSize),
        height: Math.min(img.height, maxSize),
      });

      // Use K-means clustering to find dominant colors
      const clusters = 5; // We want top 5 colors
      const colorCounts = new Map<string, { count: number; rgb: [number, number, number] }>();

      // Sample pixels for color analysis
      const sampleStep = Math.max(1, Math.floor((resized.width * resized.height) / 10000)); // Sample ~10k pixels max

      for (let y = 0; y < resized.height; y += sampleStep) {
        for (let x = 0; x < resized.width; x += sampleStep) {
          if (x < resized.width && y < resized.height) {
            const pixel = resized.getPixelXY(x, y);
            const r = Math.round(pixel[0] / 16) * 16; // Quantize to reduce color variations
            const g = Math.round(pixel[1] / 16) * 16;
            const b = Math.round(pixel[2] / 16) * 16;

            const colorKey = `${r},${g},${b}`;
            const existing = colorCounts.get(colorKey);

            if (existing) {
              existing.count++;
            } else {
              colorCounts.set(colorKey, { count: 1, rgb: [r, g, b] });
            }
          }
        }
      }

      // Sort by count and get top 5
      const sortedColors = Array.from(colorCounts.entries())
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 5);

      const totalPixels = sortedColors.reduce((sum, [, data]) => sum + data.count, 0);

      const dominantColorsData: DominantColor[] = sortedColors.map(([, data]) => {
        const [r, g, b] = data.rgb;
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        const percentage = (data.count / totalPixels) * 100;

        return {
          color: `rgb(${r}, ${g}, ${b})`,
          percentage,
          rgb: data.rgb,
          hex,
          name: getColorName(data.rgb),
        };
      });

      setDominantColors(dominantColorsData);
    } catch (error) {
      console.error('Error extracting dominant colors:', error);
      setDominantColors([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && imageSrc) {
      extractDominantColors();
    }
  }, [isVisible, imageSrc]);

  const copyColorToClipboard = async (color: DominantColor) => {
    try {
      await navigator.clipboard.writeText(color.hex);
      setCopiedColor(color.hex);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (error) {
      console.error('Failed to copy color:', error);
    }
  };

  const handleColorSelect = (color: DominantColor) => {
    if (selectedColor?.hex === color.hex) {
      // Deselect if clicking the same color
      setSelectedColor(null);
      onColorHighlight?.(null);
    } else {
      // Select new color
      setSelectedColor(color);
      onColorHighlight?.(color);
    }
  };

  const handleColorClick = (color: DominantColor, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd + click to copy
      copyColorToClipboard(color);
    } else {
      // Regular click to highlight
      handleColorSelect(color);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={popupRef}
      style={popupStyle}
      className="bg-black/90 backdrop-blur-sm rounded-xl p-4 min-w-[300px] border border-white/20"
    >
      <div className="flex items-center justify-between mb-3 cursor-move" data-drag-handle>
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-white" />
          <span className="text-white text-sm font-medium">Dominant Colors</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-white hover:bg-white/20 h-6 w-6 p-0"
          >
            {showDetails ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-white hover:bg-white/20 h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-white text-sm">Analyzing colors...</div>
        </div>
      )}

      {!isLoading && dominantColors.length > 0 && (
        <>
          {/* Color Bar */}
          <div className="flex rounded-lg overflow-hidden h-8 mb-3">
            {dominantColors.map((color, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedColor?.hex === color.hex
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-black'
                    : ''
                }`}
                style={{
                  backgroundColor: color.color,
                  width: `${color.percentage}%`,
                }}
                onClick={(event) => handleColorClick(color, event)}
                title={`Click to highlight areas • Ctrl+Click to copy • ${color.hex} (${color.percentage.toFixed(1)}%)`}
              >
                {/* Selection indicator */}
                {selectedColor?.hex === color.hex && (
                  <div className="absolute inset-0 border-2 border-white animate-pulse" />
                )}

                {/* Hover effect */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                {/* Copy indicator */}
                {copiedColor === color.hex && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                      Copied!
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Color Details */}
          {showDetails && (
            <div className="space-y-2">
              {dominantColors.map((color, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
                    selectedColor?.hex === color.hex
                      ? 'bg-white/20 ring-1 ring-white/40'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={(event) => handleColorClick(color, event)}
                >
                  <div
                    className={`w-6 h-6 rounded border flex-shrink-0 ${
                      selectedColor?.hex === color.hex
                        ? 'border-white ring-2 ring-white/50'
                        : 'border-white/20'
                    }`}
                    style={{ backgroundColor: color.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-mono">{color.hex}</span>
                      <Badge variant="secondary" className="text-xs">
                        {color.name}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/60 hover:text-white hover:bg-white/20 h-5 w-5 p-0 ml-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyColorToClipboard(color);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-white/60 text-xs">
                      RGB({color.rgb.join(', ')}) • {color.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="text-white/60 text-xs">
              Click to highlight areas • Ctrl+Click to copy • {dominantColors.length} colors
              analyzed
              {selectedColor && (
                <div className="mt-1 text-white/80">
                  Highlighting: {selectedColor.hex} ({selectedColor.name})
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!isLoading && dominantColors.length === 0 && (
        <div className="text-white/60 text-sm py-4 text-center">Unable to analyze colors</div>
      )}
    </div>
  );
}
