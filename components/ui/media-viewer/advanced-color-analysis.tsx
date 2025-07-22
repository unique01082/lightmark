'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image } from 'image-js';
import { Eye, Palette, Thermometer, X, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStackablePopup } from './use-stackable-popup';

interface ColorStats {
  temperature: number;
  temperatureLabel: string;
  dominantColors: DominantColor[];
  vibrance: number;
  saturation: number;
  whiteBalance: WhiteBalanceInfo;
  colorDistribution: ColorDistribution;
}

interface DominantColor {
  rgb: [number, number, number];
  hex: string;
  percentage: number;
  name: string;
  hsl: [number, number, number];
}

interface WhiteBalanceInfo {
  redShift: number;
  blueShift: number;
  suggestion: string;
  confidence: number;
  correctionStrength: number;
}

interface ColorDistribution {
  warm: number;
  cool: number;
  neutral: number;
  vibrant: number;
  muted: number;
  light: number;
  dark: number;
}

interface AdvancedColorAnalysisProps {
  imageSrc: string;
  isVisible: boolean;
  onClose?: () => void;
}

const COLOR_NAMES = {
  red: { min: 0, max: 30, name: 'Red' },
  orange: { min: 31, max: 60, name: 'Orange' },
  yellow: { min: 61, max: 90, name: 'Yellow' },
  green: { min: 91, max: 150, name: 'Green' },
  cyan: { min: 151, max: 180, name: 'Cyan' },
  blue: { min: 181, max: 240, name: 'Blue' },
  purple: { min: 241, max: 300, name: 'Purple' },
  magenta: { min: 301, max: 330, name: 'Magenta' },
  redWrap: { min: 331, max: 359, name: 'Red' },
};

export function AdvancedColorAnalysis({
  imageSrc,
  isVisible,
  onClose,
}: AdvancedColorAnalysisProps) {
  const temperatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const distributionCanvasRef = useRef<HTMLCanvasElement>(null);
  const paletteCanvasRef = useRef<HTMLCanvasElement>(null);
  const vibranceCanvasRef = useRef<HTMLCanvasElement>(null);

  const [colorStats, setColorStats] = useState<ColorStats | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('temperature');

  // Stackable popup positioning
  const { style: popupStyle, popupRef } = useStackablePopup('advanced-color-analysis', {
    width: 380,
    height: 480,
    visible: isVisible,
  });

  // RGB to HSL conversion
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    if (diff !== 0) {
      if (max === r) h = ((g - b) / diff) % 6;
      else if (max === g) h = (b - r) / diff + 2;
      else h = (r - g) / diff + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    const l = (max + min) / 2;
    const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));

    return [h, Math.round(s * 100), Math.round(l * 100)];
  };

  // Get color name from hue
  const getColorName = (hue: number): string => {
    for (const [, range] of Object.entries(COLOR_NAMES)) {
      if (hue >= range.min && hue <= range.max) {
        return range.name;
      }
    }
    return 'Unknown';
  };

  // Calculate color temperature from RGB values
  const calculateColorTemperature = (r: number, g: number, b: number): number => {
    // Simplified color temperature calculation
    // Based on red/blue ratio and green component
    const redBlueRatio = r / Math.max(b, 1);
    const greenWeight = g / 255;

    // Warm colors have higher red/blue ratio
    // Cool colors have higher blue component
    let temperature = 6500; // Neutral starting point

    if (redBlueRatio > 1.2) {
      // Warm
      temperature = 3000 + (redBlueRatio - 1.2) * 1000;
    } else if (redBlueRatio < 0.8) {
      // Cool
      temperature = 9000 - (0.8 - redBlueRatio) * 2000;
    }

    // Adjust for green component
    temperature += (greenWeight - 0.5) * 500;

    return Math.max(2000, Math.min(10000, temperature));
  };

  // Analyze color statistics
  const analyzeColors = async (img: Image): Promise<ColorStats> => {
    const colorCounts = new Map<string, { count: number; rgb: [number, number, number] }>();
    let totalPixels = 0;
    let totalTemperature = 0;
    let totalVibrance = 0;
    let totalSaturation = 0;

    // Color distribution counters
    let warmPixels = 0;
    let coolPixels = 0;
    let neutralPixels = 0;
    let vibrantPixels = 0;
    let mutedPixels = 0;
    let lightPixels = 0;
    let darkPixels = 0;

    // White balance analysis
    let redSum = 0;
    let greenSum = 0;
    let blueSum = 0;

    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const pixel = img.getPixelXY(x, y);
        const [r, g, b] = pixel;
        const [h, s, l] = rgbToHsl(r, g, b);

        totalPixels++;
        redSum += r;
        greenSum += g;
        blueSum += b;

        // Color temperature
        const temperature = calculateColorTemperature(r, g, b);
        totalTemperature += temperature;

        // Vibrance and saturation
        const vibrance = Math.max(0, s - 30); // Vibrance emphasizes less saturated colors
        totalVibrance += vibrance;
        totalSaturation += s;

        // Color distribution analysis
        if (temperature < 5000) warmPixels++;
        else if (temperature > 7000) coolPixels++;
        else neutralPixels++;

        if (s > 60) vibrantPixels++;
        else mutedPixels++;

        if (l > 70) lightPixels++;
        else if (l < 30) darkPixels++;

        // Group similar colors for dominant color extraction
        const quantizedR = Math.floor(r / 32) * 32;
        const quantizedG = Math.floor(g / 32) * 32;
        const quantizedB = Math.floor(b / 32) * 32;
        const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;

        if (!colorCounts.has(colorKey)) {
          colorCounts.set(colorKey, { count: 0, rgb: [quantizedR, quantizedG, quantizedB] });
        }
        colorCounts.get(colorKey)!.count++;
      }
    }

    // Calculate averages
    const avgTemperature = totalTemperature / totalPixels;
    const avgVibrance = totalVibrance / totalPixels;
    const avgSaturation = totalSaturation / totalPixels;

    // Determine temperature label
    let temperatureLabel = 'Neutral';
    if (avgTemperature < 4000) temperatureLabel = 'Very Warm';
    else if (avgTemperature < 5500) temperatureLabel = 'Warm';
    else if (avgTemperature > 8000) temperatureLabel = 'Very Cool';
    else if (avgTemperature > 6500) temperatureLabel = 'Cool';

    // Extract dominant colors
    const sortedColors = Array.from(colorCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8);

    const dominantColors: DominantColor[] = sortedColors.map(([, data]) => {
      const [r, g, b] = data.rgb;
      const [h, s, l] = rgbToHsl(r, g, b);
      const percentage = (data.count / totalPixels) * 100;
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

      return {
        rgb: [r, g, b],
        hex,
        percentage,
        name: getColorName(h),
        hsl: [h, s, l],
      };
    });

    // White balance analysis
    const avgRed = redSum / totalPixels;
    const avgGreen = greenSum / totalPixels;
    const avgBlue = blueSum / totalPixels;

    const redShift = (avgRed - avgGreen) / avgGreen;
    const blueShift = (avgBlue - avgGreen) / avgGreen;

    let suggestion = 'Well balanced';
    let confidence = 1.0;
    let correctionStrength = 0;

    if (Math.abs(redShift) > 0.1 || Math.abs(blueShift) > 0.1) {
      confidence = Math.min(Math.abs(redShift) + Math.abs(blueShift), 1.0);
      correctionStrength = confidence * 100;

      if (redShift > 0.1) {
        suggestion = 'Reduce red/increase cyan';
      } else if (redShift < -0.1) {
        suggestion = 'Increase red/reduce cyan';
      } else if (blueShift > 0.1) {
        suggestion = 'Reduce blue/increase yellow';
      } else if (blueShift < -0.1) {
        suggestion = 'Increase blue/reduce yellow';
      }
    }

    return {
      temperature: Math.round(avgTemperature),
      temperatureLabel,
      dominantColors,
      vibrance: Math.round(avgVibrance),
      saturation: Math.round(avgSaturation),
      whiteBalance: {
        redShift: Math.round(redShift * 100) / 100,
        blueShift: Math.round(blueShift * 100) / 100,
        suggestion,
        confidence: Math.round(confidence * 100) / 100,
        correctionStrength: Math.round(correctionStrength),
      },
      colorDistribution: {
        warm: Math.round((warmPixels / totalPixels) * 100),
        cool: Math.round((coolPixels / totalPixels) * 100),
        neutral: Math.round((neutralPixels / totalPixels) * 100),
        vibrant: Math.round((vibrantPixels / totalPixels) * 100),
        muted: Math.round((mutedPixels / totalPixels) * 100),
        light: Math.round((lightPixels / totalPixels) * 100),
        dark: Math.round((darkPixels / totalPixels) * 100),
      },
    };
  };

  // Draw color temperature visualization
  const drawTemperatureVisualization = (canvas: HTMLCanvasElement, stats: ColorStats) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 380;
    canvas.height = 120;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw temperature scale
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#ff4500'); // 2000K - Very warm
    gradient.addColorStop(0.25, '#ff8c00'); // 3500K - Warm
    gradient.addColorStop(0.5, '#ffffff'); // 6500K - Neutral
    gradient.addColorStop(0.75, '#87ceeb'); // 8000K - Cool
    gradient.addColorStop(1, '#4169e1'); // 10000K - Very cool

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 20, canvas.width, 40);

    // Draw temperature indicator
    const tempPosition = ((stats.temperature - 2000) / 8000) * canvas.width;
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.moveTo(tempPosition - 5, 10);
    ctx.lineTo(tempPosition + 5, 10);
    ctx.lineTo(tempPosition, 20);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';
    ctx.fillText('2000K', 5, 80);
    ctx.fillText('Warm', 5, 95);

    ctx.fillText('6500K', canvas.width / 2 - 20, 80);
    ctx.fillText('Neutral', canvas.width / 2 - 25, 95);

    ctx.fillText('10000K', canvas.width - 50, 80);
    ctx.fillText('Cool', canvas.width - 30, 95);

    // Current temperature
    ctx.fillStyle = 'yellow';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`${stats.temperature}K - ${stats.temperatureLabel}`, tempPosition - 40, 110);
  };

  // Draw color distribution chart
  const drawDistributionChart = (canvas: HTMLCanvasElement, stats: ColorStats) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 380;
    canvas.height = 200;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const distribution = stats.colorDistribution;
    const categories = [
      { label: 'Warm', value: distribution.warm, color: '#ff6b35' },
      { label: 'Cool', value: distribution.cool, color: '#4a90e2' },
      { label: 'Neutral', value: distribution.neutral, color: '#95a5a6' },
      { label: 'Vibrant', value: distribution.vibrant, color: '#e74c3c' },
      { label: 'Muted', value: distribution.muted, color: '#7f8c8d' },
      { label: 'Light', value: distribution.light, color: '#f8f9fa' },
      { label: 'Dark', value: distribution.dark, color: '#2c3e50' },
    ];

    const barWidth = (canvas.width - 40) / categories.length;
    const maxHeight = canvas.height - 60;

    categories.forEach((cat, index) => {
      const x = 20 + index * barWidth;
      const height = (cat.value / 100) * maxHeight;
      const y = canvas.height - 40 - height;

      // Draw bar
      ctx.fillStyle = cat.color;
      ctx.fillRect(x + 2, y, barWidth - 4, height);

      // Draw value
      ctx.fillStyle = 'white';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${cat.value}%`, x + barWidth / 2, y - 5);

      // Draw label
      ctx.save();
      ctx.translate(x + barWidth / 2, canvas.height - 10);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(cat.label, 0, 0);
      ctx.restore();

      ctx.textAlign = 'left';
    });
  };

  // Draw dominant colors palette
  const drawColorPalette = (canvas: HTMLCanvasElement, stats: ColorStats) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 380;
    canvas.height = 180;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colors = stats.dominantColors;
    const colorWidth = (canvas.width - 20) / colors.length;

    colors.forEach((color, index) => {
      const x = 10 + index * colorWidth;
      const height = 60;
      const y = 20;

      // Draw color swatch
      ctx.fillStyle = color.hex;
      ctx.fillRect(x + 2, y, colorWidth - 4, height);

      // Draw border
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 2, y, colorWidth - 4, height);

      // Color info
      ctx.fillStyle = 'white';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';

      const centerX = x + colorWidth / 2;
      ctx.fillText(color.hex.toUpperCase(), centerX, y + height + 15);
      ctx.fillText(color.name, centerX, y + height + 28);
      ctx.fillText(`${color.percentage.toFixed(1)}%`, centerX, y + height + 41);

      // HSL values
      ctx.font = '8px monospace';
      ctx.fillText(`H:${color.hsl[0]}°`, centerX, y + height + 54);
      ctx.fillText(`S:${color.hsl[1]}% L:${color.hsl[2]}%`, centerX, y + height + 65);

      ctx.textAlign = 'left';
    });

    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('Dominant Colors', 10, 15);
  };

  // Draw vibrance and saturation analysis
  const drawVibranceAnalysis = (canvas: HTMLCanvasElement, stats: ColorStats) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 380;
    canvas.height = 160;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vibrance bar
    const vibranceWidth = (stats.vibrance / 100) * (canvas.width - 100);
    ctx.fillStyle = `hsl(${stats.vibrance * 1.2}, 80%, 60%)`;
    ctx.fillRect(50, 30, vibranceWidth, 20);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.strokeRect(50, 30, canvas.width - 100, 20);

    // Saturation bar
    const saturationWidth = (stats.saturation / 100) * (canvas.width - 100);
    ctx.fillStyle = `hsl(200, ${stats.saturation}%, 50%)`;
    ctx.fillRect(50, 70, saturationWidth, 20);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.strokeRect(50, 70, canvas.width - 100, 20);

    // Labels and values
    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';
    ctx.fillText('Vibrance:', 10, 45);
    ctx.fillText(`${stats.vibrance}%`, canvas.width - 40, 45);

    ctx.fillText('Saturation:', 10, 85);
    ctx.fillText(`${stats.saturation}%`, canvas.width - 40, 85);

    // Analysis text
    ctx.font = '11px monospace';
    let vibranceDesc = 'Low';
    if (stats.vibrance > 60) vibranceDesc = 'High';
    else if (stats.vibrance > 30) vibranceDesc = 'Medium';

    let saturationDesc = 'Low';
    if (stats.saturation > 60) saturationDesc = 'High';
    else if (stats.saturation > 30) saturationDesc = 'Medium';

    ctx.fillText(
      `Vibrance: ${vibranceDesc} - ${stats.vibrance > 50 ? 'Punchy colors' : 'Subtle colors'}`,
      10,
      115,
    );
    ctx.fillText(
      `Saturation: ${saturationDesc} - ${stats.saturation > 50 ? 'Vivid image' : 'Muted tones'}`,
      10,
      130,
    );

    // White balance info
    const wb = stats.whiteBalance;
    ctx.fillText(`White Balance: ${wb.suggestion}`, 10, 150);
    if (wb.confidence > 0.2) {
      ctx.fillText(`Correction: ${wb.correctionStrength}% strength`, 200, 150);
    }
  };

  // Process image
  const processImage = async () => {
    if (!imageSrc || !isVisible) return;

    setIsProcessing(true);
    try {
      const img = await Image.load(imageSrc);
      const stats = await analyzeColors(img);
      setColorStats(stats);
    } catch (error) {
      console.error('Error analyzing colors:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to draw current tab
  const drawCurrentTab = useCallback(
    (stats: ColorStats) => {
      if (!stats) return;

      console.log('Drawing tab:', activeTab);

      switch (activeTab) {
        case 'temperature':
          if (temperatureCanvasRef.current) {
            console.log('Drawing temperature visualization');
            try {
              drawTemperatureVisualization(temperatureCanvasRef.current, stats);
            } catch (error) {
              console.error('Error drawing temperature:', error);
            }
          } else {
            console.log('Temperature canvas ref not available');
          }
          break;
        case 'distribution':
          if (distributionCanvasRef.current) {
            console.log('Drawing distribution chart');
            try {
              drawDistributionChart(distributionCanvasRef.current, stats);
            } catch (error) {
              console.error('Error drawing distribution:', error);
            }
          } else {
            console.log('Distribution canvas ref not available');
          }
          break;
        case 'palette':
          if (paletteCanvasRef.current) {
            console.log('Drawing color palette');
            try {
              drawColorPalette(paletteCanvasRef.current, stats);
            } catch (error) {
              console.error('Error drawing palette:', error);
            }
          } else {
            console.log('Palette canvas ref not available');
          }
          break;
        case 'vibrance':
          if (vibranceCanvasRef.current) {
            console.log('Drawing vibrance analysis');
            try {
              drawVibranceAnalysis(vibranceCanvasRef.current, stats);
            } catch (error) {
              console.error('Error drawing vibrance:', error);
            }
          } else {
            console.log('Vibrance canvas ref not available');
          }
          break;
      }
    },
    [activeTab],
  );

  // Update canvas drawings when data changes or tab changes
  useEffect(() => {
    if (!colorStats || !isVisible) return;

    console.log('useEffect triggered with colorStats:', !!colorStats, 'activeTab:', activeTab);

    // Small delay to ensure canvas is properly rendered in the DOM
    const timeoutId = setTimeout(() => {
      drawCurrentTab(colorStats);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [colorStats, drawCurrentTab, isVisible]);

  // Process image when props change
  useEffect(() => {
    processImage();
  }, [imageSrc, isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={popupRef}
      style={popupStyle}
      className="bg-black/95 backdrop-blur-sm rounded-xl border border-white/20 text-white overflow-hidden"
    >
      <div
        className="flex items-center justify-between p-4 border-b border-white/20 cursor-move"
        data-drag-handle
      >
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          <h3 className="font-semibold">Color Analysis</h3>
        </div>
        <div className="flex items-center gap-2">
          {isProcessing && (
            <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-xs">
              Analyzing...
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/60 hover:text-white hover:bg-white/20 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 overflow-auto max-h-[calc(70vh-4rem)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 mb-4 text-xs">
            <TabsTrigger value="temperature" className="text-xs">
              <Thermometer className="w-3 h-3 mr-1" />
              Temp
            </TabsTrigger>
            <TabsTrigger value="palette" className="text-xs">
              <Palette className="w-3 h-3 mr-1" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="distribution" className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              Dist
            </TabsTrigger>
            <TabsTrigger value="vibrance" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Vibr
            </TabsTrigger>
          </TabsList>

          <TabsContent value="temperature" className="mt-4">
            <div className="space-y-4">
              <div className="text-sm text-white/70">Color temperature and warmth analysis</div>
              {colorStats && (
                <>
                  <canvas
                    ref={temperatureCanvasRef}
                    className="w-full border border-white/20 rounded bg-black/50"
                    style={{ maxHeight: '120px' }}
                  />
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-white/70">Temperature</div>
                      <div className="font-mono">{colorStats.temperature}K</div>
                    </div>
                    <div>
                      <div className="text-white/70">Classification</div>
                      <div className="font-mono">{colorStats.temperatureLabel}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="palette" className="mt-4">
            <div className="space-y-4">
              <div className="text-sm text-white/70">Dominant color extraction and palette</div>
              {colorStats && (
                <>
                  <canvas
                    ref={paletteCanvasRef}
                    className="w-full border border-white/20 rounded bg-black/50"
                    style={{ maxHeight: '180px' }}
                  />
                  <div className="text-xs text-white/70">
                    Top {colorStats.dominantColors.length} colors by frequency
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="mt-4">
            <div className="space-y-4">
              <div className="text-sm text-white/70">Color distribution and characteristics</div>
              {colorStats && (
                <>
                  <canvas
                    ref={distributionCanvasRef}
                    className="w-full border border-white/20 rounded bg-black/50"
                    style={{ maxHeight: '200px' }}
                  />
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="space-y-1">
                      <div className="text-white/70">Temperature</div>
                      <div>Warm: {colorStats.colorDistribution.warm}%</div>
                      <div>Cool: {colorStats.colorDistribution.cool}%</div>
                      <div>Neutral: {colorStats.colorDistribution.neutral}%</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-white/70">Saturation</div>
                      <div>Vibrant: {colorStats.colorDistribution.vibrant}%</div>
                      <div>Muted: {colorStats.colorDistribution.muted}%</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-white/70">Luminance</div>
                      <div>Light: {colorStats.colorDistribution.light}%</div>
                      <div>Dark: {colorStats.colorDistribution.dark}%</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="vibrance" className="mt-4">
            <div className="space-y-4">
              <div className="text-sm text-white/70">
                Vibrance, saturation & white balance analysis
              </div>
              {colorStats && (
                <>
                  <canvas
                    ref={vibranceCanvasRef}
                    className="w-full border border-white/20 rounded bg-black/50"
                    style={{ maxHeight: '160px' }}
                  />
                  <div className="space-y-2 text-xs">
                    <div className="text-white/70 font-semibold">White Balance</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>Red Shift: {colorStats.whiteBalance.redShift}</div>
                      <div>Blue Shift: {colorStats.whiteBalance.blueShift}</div>
                    </div>
                    <div className="text-yellow-400">
                      {colorStats.whiteBalance.suggestion}
                      {colorStats.whiteBalance.confidence > 0.2 &&
                        ` (${(colorStats.whiteBalance.confidence * 100).toFixed(0)}% confidence)`}
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
