'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image } from 'image-js';
import { BarChart3, Grid3X3, Palette, Pause, Play, RotateCcw, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useStackablePopup } from './use-stackable-popup';

interface DominantColor {
  color: string;
  percentage: number;
  rgb: [number, number, number];
  hex: string;
  name?: string;
}

interface HistogramData {
  red: number[];
  green: number[];
  blue: number[];
  luminance: number[];
  zones: { x: number; y: number; histogram: HistogramData }[];
}

interface ColorAnalysis {
  colorTemperature: {
    kelvin: number;
    category: 'Very Warm' | 'Warm' | 'Neutral' | 'Cool' | 'Very Cool';
    ratio: number; // warm/cool ratio
  };
  dominantColors: {
    color: [number, number, number];
    percentage: number;
    hex: string;
    name: string;
  }[];
  whiteBalance: {
    isBalanced: boolean;
    redTint: number;
    blueTint: number;
    suggestions: string[];
  };
  vibrance: {
    average: number;
    category: 'Low' | 'Moderate' | 'High' | 'Very High';
    distribution: number[];
  };
  saturation: {
    average: number;
    category: 'Desaturated' | 'Low' | 'Moderate' | 'High' | 'Oversaturated';
    distribution: number[];
  };
}

interface AdvancedHistogramProps {
  imageSrc: string;
  isVisible: boolean;
  onClose?: () => void;
  dominantColors?: DominantColor[];
  onColorSelect?: (color: DominantColor) => void;
  // For temporal histogram (video/burst analysis)
  imageSequence?: string[];
  currentSequenceIndex?: number;
  isVideoMode?: boolean;
}

interface ColorRange {
  hueMin: number;
  hueMax: number;
  satMin: number;
  satMax: number;
  name: string;
  color: string;
}

const COLOR_RANGES: ColorRange[] = [
  { hueMin: 0, hueMax: 30, satMin: 30, satMax: 100, name: 'Reds', color: '#ef4444' },
  { hueMin: 30, hueMax: 90, satMin: 30, satMax: 100, name: 'Yellows', color: '#eab308' },
  { hueMin: 90, hueMax: 150, satMin: 30, satMax: 100, name: 'Greens', color: '#22c55e' },
  { hueMin: 150, hueMax: 210, satMin: 30, satMax: 100, name: 'Cyans', color: '#06b6d4' },
  { hueMin: 210, hueMax: 270, satMin: 30, satMax: 100, name: 'Blues', color: '#3b82f6' },
  { hueMin: 270, hueMax: 330, satMin: 30, satMax: 100, name: 'Magentas', color: '#a855f7' },
  { hueMin: 330, hueMax: 360, satMin: 30, satMax: 100, name: 'Reds', color: '#ef4444' },
];

export function AdvancedHistogram({
  imageSrc,
  isVisible,
  onClose,
  dominantColors,
  onColorSelect,
  imageSequence = [],
  currentSequenceIndex = 0,
  isVideoMode = false,
}: AdvancedHistogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoneCanvasRef = useRef<HTMLCanvasElement>(null);
  const colorCanvasRef = useRef<HTMLCanvasElement>(null);
  const analysisCanvasRef = useRef<HTMLCanvasElement>(null);
  const [histogramData, setHistogramData] = useState<HistogramData | null>(null);
  const [selectedColorRange, setSelectedColorRange] = useState<ColorRange | null>(null);
  const [gridSize, setGridSize] = useState([3, 3]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('standard');
  const [temporalData, setTemporalData] = useState<HistogramData[]>([]);
  const [temporalIndex, setTemporalIndex] = useState(0);
  const [isPlayingTemporal, setIsPlayingTemporal] = useState(false);
  const [colorAnalysis, setColorAnalysis] = useState<ColorAnalysis | null>(null);

  // Stackable popup positioning
  const { style: popupStyle, popupRef } = useStackablePopup('advanced-histogram', {
    width: 400,
    height: 500,
    visible: isVisible,
  });

  // RGB to HSV conversion
  const rgbToHsv = (r: number, g: number, b: number): [number, number, number] => {
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

    const s = max === 0 ? 0 : diff / max;
    const v = max;

    return [h, s * 100, v * 100];
  };

  // Color name mapping
  const getColorName = (r: number, g: number, b: number): string => {
    const colors = [
      { name: 'Red', rgb: [255, 0, 0] },
      { name: 'Orange', rgb: [255, 165, 0] },
      { name: 'Yellow', rgb: [255, 255, 0] },
      { name: 'Green', rgb: [0, 255, 0] },
      { name: 'Cyan', rgb: [0, 255, 255] },
      { name: 'Blue', rgb: [0, 0, 255] },
      { name: 'Purple', rgb: [128, 0, 128] },
      { name: 'Pink', rgb: [255, 192, 203] },
      { name: 'Brown', rgb: [165, 42, 42] },
      { name: 'Gray', rgb: [128, 128, 128] },
      { name: 'Black', rgb: [0, 0, 0] },
      { name: 'White', rgb: [255, 255, 255] },
    ];

    let minDistance = Infinity;
    let closestColor = 'Unknown';

    colors.forEach(({ name, rgb }) => {
      const distance = Math.sqrt(
        Math.pow(r - rgb[0], 2) + Math.pow(g - rgb[1], 2) + Math.pow(b - rgb[2], 2),
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = name;
      }
    });

    return closestColor;
  };

  // Advanced color analysis
  const analyzeColors = (img: Image): ColorAnalysis => {
    const pixels: [number, number, number][] = [];
    let totalR = 0,
      totalG = 0,
      totalB = 0;
    let warmPixels = 0,
      coolPixels = 0;
    const saturationValues: number[] = [];
    const vibranceValues: number[] = [];

    // Collect pixel data and basic statistics
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const pixel = img.getPixelXY(x, y);
        const [r, g, b] = pixel;
        pixels.push([r, g, b]);

        totalR += r;
        totalG += g;
        totalB += b;

        // Color temperature analysis (simplified)
        const colorTemp = (r + g * 0.5) / (b + 1); // Warm vs cool ratio
        if (colorTemp > 1.2) warmPixels++;
        else if (colorTemp < 0.8) coolPixels++;

        // Saturation and vibrance
        const [h, s, v] = rgbToHsv(r, g, b);
        saturationValues.push(s);

        // Vibrance calculation (emphasis on less saturated colors)
        const vibrance = s < 50 ? s * 1.5 : s;
        vibranceValues.push(Math.min(100, vibrance));
      }
    }

    const totalPixels = pixels.length;
    const avgR = totalR / totalPixels;
    const avgG = totalG / totalPixels;
    const avgB = totalB / totalPixels;

    // Color temperature analysis
    const warmCoolRatio = warmPixels / (coolPixels + 1);
    let kelvin = 5500; // Default daylight
    let category: ColorAnalysis['colorTemperature']['category'] = 'Neutral';

    if (warmCoolRatio > 2) {
      kelvin = 3000;
      category = 'Very Warm';
    } else if (warmCoolRatio > 1.5) {
      kelvin = 3500;
      category = 'Warm';
    } else if (warmCoolRatio < 0.5) {
      kelvin = 7000;
      category = 'Very Cool';
    } else if (warmCoolRatio < 0.8) {
      kelvin = 6500;
      category = 'Cool';
    }

    // Dominant color extraction using simplified clustering
    const dominantColors = extractDominantColors(pixels);

    // White balance analysis
    const redTint = ((avgR - 128) / 128) * 100;
    const blueTint = ((avgB - 128) / 128) * 100;
    const isBalanced = Math.abs(redTint) < 10 && Math.abs(blueTint) < 10;

    const suggestions: string[] = [];
    if (redTint > 10) suggestions.push('Reduce red/warm tint');
    if (redTint < -10) suggestions.push('Add red/warm tint');
    if (blueTint > 10) suggestions.push('Reduce blue/cool tint');
    if (blueTint < -10) suggestions.push('Add blue/cool tint');
    if (isBalanced) suggestions.push('White balance looks good');

    // Saturation analysis
    const avgSaturation = saturationValues.reduce((a, b) => a + b, 0) / saturationValues.length;
    let satCategory: ColorAnalysis['saturation']['category'] = 'Moderate';
    if (avgSaturation < 20) satCategory = 'Desaturated';
    else if (avgSaturation < 40) satCategory = 'Low';
    else if (avgSaturation > 80) satCategory = 'Oversaturated';
    else if (avgSaturation > 60) satCategory = 'High';

    // Vibrance analysis
    const avgVibrance = vibranceValues.reduce((a, b) => a + b, 0) / vibranceValues.length;
    let vibranceCategory: ColorAnalysis['vibrance']['category'] = 'Moderate';
    if (avgVibrance < 25) vibranceCategory = 'Low';
    else if (avgVibrance > 75) vibranceCategory = 'Very High';
    else if (avgVibrance > 50) vibranceCategory = 'High';

    // Create distribution histograms
    const saturationDist = createDistribution(saturationValues, 10);
    const vibranceDist = createDistribution(vibranceValues, 10);

    return {
      colorTemperature: {
        kelvin,
        category,
        ratio: warmCoolRatio,
      },
      dominantColors,
      whiteBalance: {
        isBalanced,
        redTint,
        blueTint,
        suggestions,
      },
      vibrance: {
        average: avgVibrance,
        category: vibranceCategory,
        distribution: vibranceDist,
      },
      saturation: {
        average: avgSaturation,
        category: satCategory,
        distribution: saturationDist,
      },
    };
  };

  // Extract dominant colors using simple color quantization
  const extractDominantColors = (
    pixels: [number, number, number][],
  ): ColorAnalysis['dominantColors'] => {
    const colorCounts = new Map<string, { count: number; rgb: [number, number, number] }>();

    // Quantize colors to reduce complexity (divide by 32 and multiply back)
    pixels.forEach(([r, g, b]) => {
      const qR = Math.floor(r / 32) * 32;
      const qG = Math.floor(g / 32) * 32;
      const qB = Math.floor(b / 32) * 32;
      const key = `${qR},${qG},${qB}`;

      if (colorCounts.has(key)) {
        colorCounts.get(key)!.count++;
      } else {
        colorCounts.set(key, { count: 1, rgb: [qR, qG, qB] });
      }
    });

    // Sort by count and take top 6
    const sortedColors = Array.from(colorCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 6);

    const totalPixels = pixels.length;

    return sortedColors.map(([key, { count, rgb }]) => {
      const [r, g, b] = rgb;
      const percentage = (count / totalPixels) * 100;
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      const name = getColorName(r, g, b);

      return {
        color: rgb,
        percentage,
        hex,
        name,
      };
    });
  };

  // Create distribution histogram
  const createDistribution = (values: number[], bins: number): number[] => {
    const distribution = new Array(bins).fill(0);
    const binSize = 100 / bins;

    values.forEach((value) => {
      const binIndex = Math.min(Math.floor(value / binSize), bins - 1);
      distribution[binIndex]++;
    });

    return distribution;
  };

  // Draw color analysis visualization
  const drawColorAnalysis = (canvas: HTMLCanvasElement, analysis: ColorAnalysis) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 380;
    canvas.height = 200;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';

    // Draw dominant colors palette
    const paletteY = 10;
    const colorWidth = canvas.width / analysis.dominantColors.length;

    analysis.dominantColors.forEach((colorData, index) => {
      const x = index * colorWidth;
      const [r, g, b] = colorData.color;

      // Color swatch
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, paletteY, colorWidth, 30);

      // Color info
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.fillText(`${colorData.percentage.toFixed(1)}%`, x + 2, paletteY + 45);
      ctx.strokeText(`${colorData.percentage.toFixed(1)}%`, x + 2, paletteY + 45);
      ctx.fillText(colorData.name, x + 2, paletteY + 58);
      ctx.strokeText(colorData.name, x + 2, paletteY + 58);
    });

    // Draw saturation/vibrance distributions
    const distY = 80;
    const distHeight = 40;
    const barWidth = canvas.width / analysis.saturation.distribution.length;

    // Saturation distribution
    ctx.fillStyle = 'rgba(255, 100, 100, 0.7)';
    const maxSat = Math.max(...analysis.saturation.distribution);
    analysis.saturation.distribution.forEach((value, index) => {
      const height = (value / maxSat) * distHeight;
      ctx.fillRect(index * barWidth, distY + distHeight - height, barWidth, height);
    });

    ctx.fillStyle = 'white';
    ctx.fillText(
      `Saturation Dist. (Avg: ${analysis.saturation.average.toFixed(1)}%)`,
      5,
      distY - 5,
    );

    // Vibrance distribution
    const vibranceY = distY + distHeight + 20;
    ctx.fillStyle = 'rgba(100, 255, 100, 0.7)';
    const maxVib = Math.max(...analysis.vibrance.distribution);
    analysis.vibrance.distribution.forEach((value, index) => {
      const height = (value / maxVib) * distHeight;
      ctx.fillRect(index * barWidth, vibranceY + distHeight - height, barWidth, height);
    });

    ctx.fillStyle = 'white';
    ctx.fillText(
      `Vibrance Dist. (Avg: ${analysis.vibrance.average.toFixed(1)}%)`,
      5,
      vibranceY - 5,
    );
  };

  // Calculate temporal histogram for video/burst sequences
  const calculateTemporalHistogram = async (): Promise<HistogramData[]> => {
    if (!imageSequence.length) return [];

    const results: HistogramData[] = [];

    for (const src of imageSequence) {
      try {
        const img = await Image.load(src);
        const data = await calculateHistogram(img);
        results.push(data);
      } catch (error) {
        console.error('Error processing temporal frame:', error);
        // Add empty data for failed frames
        results.push({
          red: new Array(256).fill(0),
          green: new Array(256).fill(0),
          blue: new Array(256).fill(0),
          luminance: new Array(256).fill(0),
          zones: [],
        });
      }
    }

    return results;
  };

  // Draw temporal histogram comparison
  const drawTemporalHistogram = (canvas: HTMLCanvasElement, temporalData: HistogramData[]) => {
    const ctx = canvas.getContext('2d');
    if (!ctx || !temporalData.length) return;

    canvas.width = 380;
    canvas.height = 180;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const frameWidth = canvas.width / temporalData.length;
    const maxFrames = Math.min(temporalData.length, 20); // Limit display for performance
    const displayData = temporalData.slice(0, maxFrames);
    const actualFrameWidth = canvas.width / displayData.length;

    displayData.forEach((frameData, frameIndex) => {
      const startX = frameIndex * actualFrameWidth;
      const frameHeight = canvas.height;

      const maxValue = Math.max(
        Math.max(...frameData.red),
        Math.max(...frameData.green),
        Math.max(...frameData.blue),
      );

      if (maxValue === 0) return;

      // Draw simplified histogram for each frame
      const samplePoints = 64; // Reduced resolution for overview
      const sampleStep = 256 / samplePoints;
      const barWidth = actualFrameWidth / samplePoints;

      for (let i = 0; i < samplePoints; i++) {
        const sampleIndex = Math.floor(i * sampleStep);
        const x = startX + i * barWidth;

        const redHeight = (frameData.red[sampleIndex] / maxValue) * frameHeight * 0.8;
        const greenHeight = (frameData.green[sampleIndex] / maxValue) * frameHeight * 0.8;
        const blueHeight = (frameData.blue[sampleIndex] / maxValue) * frameHeight * 0.8;

        // Blend colors for temporal view
        ctx.fillStyle = `rgba(255, 0, 0, 0.3)`;
        ctx.fillRect(x, frameHeight - redHeight, barWidth, redHeight);

        ctx.fillStyle = `rgba(0, 255, 0, 0.3)`;
        ctx.fillRect(x, frameHeight - greenHeight, barWidth, greenHeight);

        ctx.fillStyle = `rgba(0, 0, 255, 0.3)`;
        ctx.fillRect(x, frameHeight - blueHeight, barWidth, blueHeight);
      }

      // Highlight current frame
      if (frameIndex === temporalIndex) {
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 3;
        ctx.strokeRect(startX, 0, actualFrameWidth, frameHeight);
      }

      // Frame border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, 0, actualFrameWidth, frameHeight);

      // Frame number
      ctx.fillStyle = 'white';
      ctx.font = '10px monospace';
      ctx.fillText(`${frameIndex}`, startX + 2, 12);
    });

    // Timeline scrubber
    if (temporalIndex < displayData.length) {
      const scrubberX = (temporalIndex / displayData.length) * canvas.width;
      ctx.strokeStyle = 'cyan';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scrubberX, 0);
      ctx.lineTo(scrubberX, canvas.height);
      ctx.stroke();
    }
  };
  const calculateHistogram = async (img: Image): Promise<HistogramData> => {
    const red = new Array(256).fill(0);
    const green = new Array(256).fill(0);
    const blue = new Array(256).fill(0);
    const luminance = new Array(256).fill(0);

    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const pixel = img.getPixelXY(x, y);
        const [r, g, b] = pixel;

        red[r]++;
        green[g]++;
        blue[b]++;

        const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        luminance[lum]++;
      }
    }

    return { red, green, blue, luminance, zones: [] };
  };

  // Calculate multi-zone histogram
  const calculateZoneHistogram = async (img: Image): Promise<HistogramData> => {
    const [gridX, gridY] = gridSize;
    const zoneWidth = Math.floor(img.width / gridX);
    const zoneHeight = Math.floor(img.height / gridY);
    const zones: { x: number; y: number; histogram: HistogramData }[] = [];

    for (let gy = 0; gy < gridY; gy++) {
      for (let gx = 0; gx < gridX; gx++) {
        const startX = gx * zoneWidth;
        const startY = gy * zoneHeight;
        const endX = Math.min(startX + zoneWidth, img.width);
        const endY = Math.min(startY + zoneHeight, img.height);

        const zoneRed = new Array(256).fill(0);
        const zoneGreen = new Array(256).fill(0);
        const zoneBlue = new Array(256).fill(0);
        const zoneLuminance = new Array(256).fill(0);

        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const pixel = img.getPixelXY(x, y);
            const [r, g, b] = pixel;

            zoneRed[r]++;
            zoneGreen[g]++;
            zoneBlue[b]++;

            const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
            zoneLuminance[lum]++;
          }
        }

        zones.push({
          x: gx,
          y: gy,
          histogram: {
            red: zoneRed,
            green: zoneGreen,
            blue: zoneBlue,
            luminance: zoneLuminance,
            zones: [],
          },
        });
      }
    }

    const overall = await calculateHistogram(img);
    return { ...overall, zones };
  };

  // Calculate selective color histogram
  const calculateSelectiveColorHistogram = async (
    img: Image,
    colorRange: ColorRange,
  ): Promise<HistogramData> => {
    const red = new Array(256).fill(0);
    const green = new Array(256).fill(0);
    const blue = new Array(256).fill(0);
    const luminance = new Array(256).fill(0);

    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const pixel = img.getPixelXY(x, y);
        const [r, g, b] = pixel;
        const [h, s, v] = rgbToHsv(r, g, b);

        // Check if pixel falls within the selected color range
        const inHueRange =
          (h >= colorRange.hueMin && h <= colorRange.hueMax) ||
          (colorRange.hueMin > colorRange.hueMax &&
            (h >= colorRange.hueMin || h <= colorRange.hueMax));
        const inSatRange = s >= colorRange.satMin && s <= colorRange.satMax;

        if (inHueRange && inSatRange) {
          red[r]++;
          green[g]++;
          blue[b]++;

          const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          luminance[lum]++;
        }
      }
    }

    return { red, green, blue, luminance, zones: [] };
  };

  // Draw standard histogram
  const drawHistogram = (canvas: HTMLCanvasElement, data: HistogramData) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 380;
    canvas.height = 150;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxValue = Math.max(
      Math.max(...data.red),
      Math.max(...data.green),
      Math.max(...data.blue),
      Math.max(...data.luminance),
    );

    const barWidth = canvas.width / 256;

    // Draw RGB histograms
    for (let i = 0; i < 256; i++) {
      const x = i * barWidth;

      // Red channel
      const redHeight = (data.red[i] / maxValue) * canvas.height * 0.8;
      ctx.fillStyle = `rgba(255, 0, 0, 0.3)`;
      ctx.fillRect(x, canvas.height - redHeight, barWidth, redHeight);

      // Green channel
      const greenHeight = (data.green[i] / maxValue) * canvas.height * 0.8;
      ctx.fillStyle = `rgba(0, 255, 0, 0.3)`;
      ctx.fillRect(x, canvas.height - greenHeight, barWidth, greenHeight);

      // Blue channel
      const blueHeight = (data.blue[i] / maxValue) * canvas.height * 0.8;
      ctx.fillStyle = `rgba(0, 0, 255, 0.3)`;
      ctx.fillRect(x, canvas.height - blueHeight, barWidth, blueHeight);

      // Luminance
      const lumHeight = (data.luminance[i] / maxValue) * canvas.height * 0.8;
      ctx.fillStyle = `rgba(255, 255, 255, 0.5)`;
      ctx.fillRect(x, canvas.height - lumHeight, barWidth * 0.5, lumHeight);
    }

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (canvas.height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  // Draw zone histogram
  const drawZoneHistogram = (canvas: HTMLCanvasElement, data: HistogramData) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const [gridX, gridY] = gridSize;
    canvas.width = Math.min(380, gridX * 80);
    canvas.height = Math.min(200, gridY * 60);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellWidth = canvas.width / gridX;
    const cellHeight = canvas.height / gridY;

    data.zones.forEach((zone) => {
      const startX = zone.x * cellWidth;
      const startY = zone.y * cellHeight;

      const maxValue = Math.max(
        Math.max(...zone.histogram.red),
        Math.max(...zone.histogram.green),
        Math.max(...zone.histogram.blue),
      );

      if (maxValue === 0) return;

      const barWidth = cellWidth / 256;

      for (let i = 0; i < 256; i++) {
        const x = startX + i * barWidth;

        const redHeight = (zone.histogram.red[i] / maxValue) * cellHeight * 0.8;
        const greenHeight = (zone.histogram.green[i] / maxValue) * cellHeight * 0.8;
        const blueHeight = (zone.histogram.blue[i] / maxValue) * cellHeight * 0.8;

        ctx.fillStyle = `rgba(255, 0, 0, 0.4)`;
        ctx.fillRect(x, startY + cellHeight - redHeight, barWidth, redHeight);

        ctx.fillStyle = `rgba(0, 255, 0, 0.4)`;
        ctx.fillRect(x, startY + cellHeight - greenHeight, barWidth, greenHeight);

        ctx.fillStyle = `rgba(0, 0, 255, 0.4)`;
        ctx.fillRect(x, startY + cellHeight - blueHeight, barWidth, blueHeight);
      }

      // Draw zone border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, startY, cellWidth, cellHeight);

      // Zone label
      ctx.fillStyle = 'white';
      ctx.font = '10px monospace';
      ctx.fillText(`${zone.x},${zone.y}`, startX + 2, startY + 12);
    });
  };

  // Process image and generate histograms
  const processImage = async () => {
    if (!imageSrc || !isVisible || activeTab === 'temporal') return;

    setIsProcessing(true);
    try {
      const img = await Image.load(imageSrc);

      let data: HistogramData;

      if (activeTab === 'zones') {
        data = await calculateZoneHistogram(img);
      } else if (activeTab === 'selective' && selectedColorRange) {
        data = await calculateSelectiveColorHistogram(img, selectedColorRange);
      } else {
        data = await calculateHistogram(img);
      }

      setHistogramData(data);

      // Perform color analysis for standard and analysis tabs
      if (activeTab === 'standard' || activeTab === 'analysis') {
        const analysis = analyzeColors(img);
        setColorAnalysis(analysis);
      }
    } catch (error) {
      console.error('Error processing image for histogram:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Update canvas drawings when data changes
  useEffect(() => {
    if (activeTab === 'temporal' && temporalData.length && canvasRef.current) {
      drawTemporalHistogram(canvasRef.current, temporalData);
    } else if (!histogramData) {
      return;
    } else if (activeTab === 'standard' && canvasRef.current) {
      drawHistogram(canvasRef.current, histogramData);
    } else if (activeTab === 'zones' && zoneCanvasRef.current) {
      drawZoneHistogram(zoneCanvasRef.current, histogramData);
    } else if (activeTab === 'selective' && colorCanvasRef.current) {
      drawHistogram(colorCanvasRef.current, histogramData);
    } else if (activeTab === 'analysis' && analysisCanvasRef.current && colorAnalysis) {
      drawColorAnalysis(analysisCanvasRef.current, colorAnalysis);
    }
  }, [histogramData, activeTab, gridSize, temporalData, temporalIndex, colorAnalysis]);

  // Process image when props change
  useEffect(() => {
    processImage();
  }, [imageSrc, isVisible, activeTab, selectedColorRange, gridSize]);

  // Process temporal data when in video mode
  useEffect(() => {
    if (isVideoMode && imageSequence.length && activeTab === 'temporal') {
      setIsProcessing(true);
      calculateTemporalHistogram().then((data) => {
        setTemporalData(data);
        setIsProcessing(false);
      });
    }
  }, [isVideoMode, imageSequence, activeTab]);

  // Temporal animation effect
  useEffect(() => {
    if (isPlayingTemporal && temporalData.length) {
      const interval = setInterval(() => {
        setTemporalIndex((prev) => {
          const next = prev + 1;
          if (next >= temporalData.length) {
            setIsPlayingTemporal(false);
            return prev; // Stop at the end
          }
          return next;
        });
      }, 200); // 5 FPS for temporal playback

      return () => clearInterval(interval);
    }
  }, [isPlayingTemporal, temporalData.length]);

  // Sync temporal index with current sequence index
  useEffect(() => {
    if (isVideoMode && typeof currentSequenceIndex === 'number') {
      setTemporalIndex(currentSequenceIndex);
    }
  }, [currentSequenceIndex, isVideoMode]);

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
          <BarChart3 className="w-5 h-5" />
          <h3 className="font-semibold">Advanced Histogram</h3>
        </div>
        <div className="flex items-center gap-2">
          {isProcessing && (
            <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-xs">
              Processing...
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
          <TabsList
            className={`grid w-full ${isVideoMode ? 'grid-cols-5' : 'grid-cols-4'} bg-white/10 mb-4 text-xs`}
          >
            <TabsTrigger value="standard" className="text-xs">
              Standard
            </TabsTrigger>
            <TabsTrigger value="zones" className="text-xs">
              Zones
            </TabsTrigger>
            <TabsTrigger value="selective" className="text-xs">
              Colors
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs">
              Analysis
            </TabsTrigger>
            {isVideoMode && (
              <TabsTrigger value="temporal" className="text-xs">
                Time
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="standard" className="mt-4">
            <div className="space-y-4">
              <div className="text-sm text-white/70">RGB channels with luminance overlay</div>
              <canvas
                ref={canvasRef}
                className="w-full border border-white/20 rounded bg-black/50"
                style={{ maxHeight: '150px' }}
              />
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500/50 rounded"></div>
                  <span>Red Channel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500/50 rounded"></div>
                  <span>Green Channel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500/50 rounded"></div>
                  <span>Blue Channel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white/50 rounded"></div>
                  <span>Luminance</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="zones" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">
                  <Grid3X3 className="w-4 h-4 inline mr-2" />
                  Grid-based histogram analysis
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">Grid:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGridSize([2, 2])}
                    className={`text-xs px-2 py-1 h-6 ${gridSize[0] === 2 ? 'bg-blue-500/20' : ''}`}
                  >
                    2×2
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGridSize([3, 3])}
                    className={`text-xs px-2 py-1 h-6 ${gridSize[0] === 3 ? 'bg-blue-500/20' : ''}`}
                  >
                    3×3
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGridSize([4, 4])}
                    className={`text-xs px-2 py-1 h-6 ${gridSize[0] === 4 ? 'bg-blue-500/20' : ''}`}
                  >
                    4×4
                  </Button>
                </div>
              </div>
              <canvas
                ref={zoneCanvasRef}
                className="w-full border border-white/20 rounded bg-black/50"
                style={{ maxHeight: '200px' }}
              />
            </div>
          </TabsContent>

          <TabsContent value="selective" className="mt-4">
            <div className="space-y-4">
              <div className="text-sm text-white/70">
                <Palette className="w-4 h-4 inline mr-2" />
                Histogram for specific color ranges
              </div>
              <div className="grid grid-cols-3 gap-1">
                {COLOR_RANGES.slice(0, -1).map((range, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedColorRange(range)}
                    className={`border text-xs px-2 py-1 h-7 ${
                      selectedColorRange?.name === range.name
                        ? 'border-white bg-white/10'
                        : 'border-white/20'
                    }`}
                    style={{
                      borderColor:
                        selectedColorRange?.name === range.name ? range.color : undefined,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded mr-1"
                      style={{ backgroundColor: range.color }}
                    />
                    <span className="truncate">{range.name}</span>
                  </Button>
                ))}
              </div>
              {selectedColorRange && (
                <>
                  <canvas
                    ref={colorCanvasRef}
                    className="w-full border border-white/20 rounded bg-black/50"
                    style={{ maxHeight: '150px' }}
                  />
                  <div className="text-xs text-white/70">
                    Showing histogram for {selectedColorRange.name} (Hue:{' '}
                    {selectedColorRange.hueMin}°-{selectedColorRange.hueMax}°)
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {isVideoMode && (
            <TabsContent value="temporal" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/70">
                    Histogram evolution over time ({imageSequence.length} frames)
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPlayingTemporal(!isPlayingTemporal)}
                      className="flex items-center gap-1 text-xs px-2 py-1 h-6"
                    >
                      {isPlayingTemporal ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                      {isPlayingTemporal ? 'Pause' : 'Play'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTemporalIndex(0)}
                      className="flex items-center gap-1 text-xs px-2 py-1 h-6"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </Button>
                  </div>
                </div>

                <canvas
                  ref={canvasRef}
                  className="w-full border border-white/20 rounded bg-black/50"
                  style={{ maxHeight: '180px' }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const newIndex = Math.floor(x * Math.min(temporalData.length, 20));
                    setTemporalIndex(Math.max(0, Math.min(newIndex, temporalData.length - 1)));
                  }}
                />

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>
                      Frame: {temporalIndex + 1} / {imageSequence.length}
                    </span>
                    <span className="text-white/70">Click timeline to jump</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1">
                      <div className="text-white/70">Color Peaks</div>
                      {temporalData[temporalIndex] && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between">
                            <span className="text-red-400">R:</span>
                            <span>
                              {temporalData[temporalIndex].red.indexOf(
                                Math.max(...temporalData[temporalIndex].red),
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-400">G:</span>
                            <span>
                              {temporalData[temporalIndex].green.indexOf(
                                Math.max(...temporalData[temporalIndex].green),
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-400">B:</span>
                            <span>
                              {temporalData[temporalIndex].blue.indexOf(
                                Math.max(...temporalData[temporalIndex].blue),
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="text-white/70">Progress</div>
                      <div className="space-y-0.5">
                        <div className="flex justify-between">
                          <span>Frame:</span>
                          <span>
                            {temporalIndex + 1}/{imageSequence.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Progress:</span>
                          <span>
                            {(
                              (temporalIndex / Math.max(1, imageSequence.length - 1)) *
                              100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
