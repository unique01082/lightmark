'use client';

import { Image } from 'image-js';
import { useEffect, useRef, useState } from 'react';

interface DominantColor {
  color: string;
  percentage: number;
  rgb: [number, number, number];
  hex: string;
  name?: string;
}

interface ColorHighlightOverlayProps {
  imageSrc: string;
  selectedColor: DominantColor | null;
  isVisible: boolean;
}

export function ColorHighlightOverlay({
  imageSrc,
  selectedColor,
  isVisible,
}: ColorHighlightOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const createColorMask = async () => {
    if (!selectedColor || !imageSrc || !canvasRef.current) return;

    setIsProcessing(true);
    try {
      // Load the image
      const img = await Image.load(imageSrc);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to match the displayed image size
      const displayedImg = document.querySelector('.media-viewer-image') as HTMLImageElement;
      if (displayedImg) {
        canvas.width = displayedImg.offsetWidth;
        canvas.height = displayedImg.offsetHeight;
      } else {
        canvas.width = 800;
        canvas.height = 600;
      }

      // Create a mask for areas matching the selected color
      const tolerance = 40; // Increased tolerance for better matching
      const selectedRgb = selectedColor.rgb;

      // Resize image to match canvas for processing
      const resized = img.resize({
        width: canvas.width,
        height: canvas.height,
      });

      // Create image data for the mask
      const maskData = ctx.createImageData(canvas.width, canvas.height);

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          if (x < resized.width && y < resized.height) {
            const pixel = resized.getPixelXY(x, y);
            const [r, g, b] = pixel;

            // Check if pixel color is close to selected color
            const colorDistance = Math.sqrt(
              Math.pow(r - selectedRgb[0], 2) +
                Math.pow(g - selectedRgb[1], 2) +
                Math.pow(b - selectedRgb[2], 2),
            );

            const pixelIndex = (y * canvas.width + x) * 4;

            if (colorDistance <= tolerance) {
              // Bright highlight with enhanced visibility
              maskData.data[pixelIndex] = Math.min(255, selectedRgb[0] + 50); // R - brighter
              maskData.data[pixelIndex + 1] = Math.min(255, selectedRgb[1] + 50); // G - brighter
              maskData.data[pixelIndex + 2] = Math.min(255, selectedRgb[2] + 50); // B - brighter
              maskData.data[pixelIndex + 3] = 200; // A - much more opaque
            } else {
              // Significantly dim non-matching areas
              maskData.data[pixelIndex] = 0; // R
              maskData.data[pixelIndex + 1] = 0; // G
              maskData.data[pixelIndex + 2] = 0; // B
              maskData.data[pixelIndex + 3] = 140; // A - stronger dark overlay
            }
          }
        }
      }

      // Clear canvas and draw the mask
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(maskData, 0, 0);

      // Add enhanced glowing border effect
      ctx.globalCompositeOperation = 'source-over';

      // Create a glowing effect
      ctx.shadowColor = selectedColor.color;
      ctx.shadowBlur = 15;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.8;

      // Draw a subtle border around the entire highlighted region
      ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

      // Reset shadow
      ctx.shadowBlur = 0;
    } catch (error) {
      console.error('Error creating color mask:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isVisible && selectedColor && imageSrc) {
      createColorMask();
    } else if (canvasRef.current) {
      // Clear the canvas when no color is selected
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [selectedColor, imageSrc, isVisible]);

  if (!isVisible || !selectedColor) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        style={{
          mixBlendMode: 'overlay',
          opacity: isProcessing ? 0.3 : 0.8,
          filter: 'contrast(1.2) saturate(1.3)',
        }}
      />

      {/* Processing indicator */}
      {isProcessing && (
        <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-lg text-sm">
          Analyzing color areas...
        </div>
      )}

      {/* Color info overlay with enhanced styling */}
      {selectedColor && !isProcessing && (
        <div className="absolute top-4 left-4 bg-black/95 text-white px-4 py-3 rounded-xl text-sm border border-white/30 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded border-2 border-white/50 shadow-lg"
              style={{ backgroundColor: selectedColor.color }}
            />
            <div>
              <div className="font-semibold">Highlighting: {selectedColor.hex}</div>
              <div className="text-white/80 text-xs mt-1">
                {selectedColor.name} • {selectedColor.percentage.toFixed(1)}% of image
              </div>
              <div className="text-green-400 text-xs mt-1 font-medium">
                ✨ Enhanced visibility mode
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
