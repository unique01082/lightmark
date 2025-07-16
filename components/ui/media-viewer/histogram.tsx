import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Info, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface HistogramData {
  red: number[];
  green: number[];
  blue: number[];
  luminance: number[];
  statistics: {
    shadows: number;
    highlights: number;
    mean: number;
    median: number;
    clippingShadows: number;
    clippingHighlights: number;
  };
}

interface HistogramProps {
  imageSrc: string;
  isVisible: boolean;
  onToggle: () => void;
}

export function Histogram({ imageSrc, isVisible, onToggle }: HistogramProps) {
  const [histogramData, setHistogramData] = useState<HistogramData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [activeChannels, setActiveChannels] = useState({
    red: true,
    green: true,
    blue: true,
    luminance: true,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const calculateHistogram = (imageData: ImageData): HistogramData => {
    const red = new Array(256).fill(0);
    const green = new Array(256).fill(0);
    const blue = new Array(256).fill(0);
    const luminance = new Array(256).fill(0);

    let totalPixels = 0;
    let shadowPixels = 0;
    let highlightPixels = 0;
    let totalLuminance = 0;
    let clippingShadows = 0;
    let clippingHighlights = 0;
    const luminanceValues: number[] = [];

    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];

      red[r]++;
      green[g]++;
      blue[b]++;

      // Calculate luminance using the standard formula
      const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      luminance[lum]++;
      luminanceValues.push(lum);
      totalLuminance += lum;
      totalPixels++;

      // Count shadows (< 64) and highlights (> 192)
      if (lum < 64) shadowPixels++;
      if (lum > 192) highlightPixels++;

      // Count clipping (pure black/white)
      if (lum === 0) clippingShadows++;
      if (lum === 255) clippingHighlights++;
    }

    // Calculate statistics
    const mean = totalLuminance / totalPixels;
    luminanceValues.sort((a, b) => a - b);
    const median = luminanceValues[Math.floor(luminanceValues.length / 2)];

    return {
      red,
      green,
      blue,
      luminance,
      statistics: {
        shadows: (shadowPixels / totalPixels) * 100,
        highlights: (highlightPixels / totalPixels) * 100,
        mean,
        median,
        clippingShadows: (clippingShadows / totalPixels) * 100,
        clippingHighlights: (clippingHighlights / totalPixels) * 100,
      },
    };
  };

  const processImage = async () => {
    if (!imageSrc) return;

    setIsLoading(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageSrc;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Use higher resolution for more accurate histogram
      const maxSize = 800;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const histogram = calculateHistogram(imageData);
      setHistogramData(histogram);
    } catch (error) {
      console.error('Error processing image for histogram:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && imageSrc) {
      processImage();
    }
  }, [isVisible, imageSrc]);

  const renderHistogram = () => {
    if (!histogramData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with dark background
    ctx.fillStyle = 'rgb(16, 16, 16)';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Find max value for scaling
    const maxValue = Math.max(
      ...histogramData.red,
      ...histogramData.green,
      ...histogramData.blue,
      ...histogramData.luminance,
    );

    if (maxValue === 0) return;

    const barWidth = width / 256;
    const scale = (height * 0.9) / maxValue;

    // Draw histograms for active channels
    const channels = [
      { data: histogramData.red, color: 'rgba(255, 100, 100, 0.7)', active: activeChannels.red },
      {
        data: histogramData.green,
        color: 'rgba(100, 255, 100, 0.7)',
        active: activeChannels.green,
      },
      { data: histogramData.blue, color: 'rgba(100, 100, 255, 0.7)', active: activeChannels.blue },
    ];

    // Use blend mode for overlapping colors
    ctx.globalCompositeOperation = 'screen';

    channels.forEach(({ data, color, active }) => {
      if (!active) return;

      ctx.fillStyle = color;
      for (let i = 0; i < 256; i++) {
        const barHeight = data[i] * scale;
        if (barHeight > 0) {
          ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
        }
      }
    });

    // Reset blend mode
    ctx.globalCompositeOperation = 'source-over';

    // Draw luminance outline if active
    if (activeChannels.luminance) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 256; i++) {
        const barHeight = histogramData.luminance[i] * scale;
        const x = i * barWidth;
        const y = height - barHeight;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // Draw clipping warnings
    if (histogramData.statistics.clippingShadows > 0.1) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.fillRect(0, 0, 10, height);
    }
    if (histogramData.statistics.clippingHighlights > 0.1) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.fillRect(width - 10, 0, 10, height);
    }
  };

  useEffect(() => {
    if (histogramData) {
      renderHistogram();
    }
  }, [histogramData, activeChannels]);

  const toggleChannel = (channel: keyof typeof activeChannels) => {
    setActiveChannels((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-sm rounded-xl p-4 min-w-[400px] border border-white/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-white" />
          <span className="text-white text-sm font-medium">Histogram</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowStatistics(!showStatistics)}
            className="text-white hover:bg-white/20 h-6 w-6 p-0"
          >
            <Info className="h-3 w-3" />
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

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={320}
          height={120}
          className="w-full h-[120px] border border-gray-600 rounded cursor-crosshair"
          style={{ imageRendering: 'pixelated' }}
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
            <div className="text-white text-sm">Analyzing...</div>
          </div>
        )}

        {/* Exposure warnings */}
        {histogramData && (
          <div className="absolute top-1 left-1 flex gap-1">
            {histogramData.statistics.clippingShadows > 0.1 && (
              <Badge variant="destructive" className="text-xs">
                Shadow clipping
              </Badge>
            )}
            {histogramData.statistics.clippingHighlights > 0.1 && (
              <Badge variant="destructive" className="text-xs">
                Highlight clipping
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Channel toggles */}
      <div className="flex items-center gap-2 mt-3">
        {[
          { key: 'red', color: 'text-red-400', label: 'R' },
          { key: 'green', color: 'text-green-400', label: 'G' },
          { key: 'blue', color: 'text-blue-400', label: 'B' },
          { key: 'luminance', color: 'text-white', label: 'L' },
        ].map(({ key, color, label }) => (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            onClick={() => toggleChannel(key as keyof typeof activeChannels)}
            className={`h-6 w-6 p-0 ${color} ${
              activeChannels[key as keyof typeof activeChannels]
                ? 'bg-white/20'
                : 'opacity-50 hover:opacity-100'
            }`}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Statistics */}
      {showStatistics && histogramData && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
            <div>Mean: {histogramData.statistics.mean.toFixed(1)}</div>
            <div>Median: {histogramData.statistics.median.toFixed(1)}</div>
            <div>Shadows: {histogramData.statistics.shadows.toFixed(1)}%</div>
            <div>Highlights: {histogramData.statistics.highlights.toFixed(1)}%</div>
          </div>
        </div>
      )}
    </div>
  );
}
