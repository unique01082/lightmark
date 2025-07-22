'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { BarChart3, Contrast, Focus, Gauge, X, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStackablePopup } from './use-stackable-popup';

interface QualityMetrics {
  sharpness: {
    score: number;
    level: 'poor' | 'fair' | 'good' | 'excellent';
    edgeStrength: number;
    blurRadius: number;
  };
  noise: {
    score: number;
    level: 'low' | 'moderate' | 'high' | 'severe';
    variance: number;
    snr: number;
  };
  dynamicRange: {
    score: number;
    level: 'limited' | 'moderate' | 'good' | 'excellent';
    actualDR: number;
    usedDR: number;
    efficiency: number;
  };
  focus: {
    score: number;
    level: 'poor' | 'soft' | 'sharp' | 'excellent';
    gradientVariance: number;
    focusMap: number[];
  };
  contrast: {
    score: number;
    level: 'flat' | 'low' | 'normal' | 'high';
    globalContrast: number;
    localContrast: number;
    michelangeloIndex: number;
  };
}

interface ProfessionalQualityAssessmentProps {
  imageSrc: string;
  isVisible: boolean;
  onToggle: () => void;
}

export function ProfessionalQualityAssessment({
  imageSrc,
  isVisible,
  onToggle,
}: ProfessionalQualityAssessmentProps) {
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'sharpness' | 'noise' | 'dynamic' | 'focus' | 'contrast'
  >('sharpness');

  // Stackable popup positioning
  const { style: popupStyle, popupRef } = useStackablePopup('professional-quality-assessment', {
    width: 320,
    height: 440,
    visible: isVisible,
  });

  // Canvas refs for visualizations
  const sharpnessCanvasRef = useRef<HTMLCanvasElement>(null);
  const noiseCanvasRef = useRef<HTMLCanvasElement>(null);
  const dynamicCanvasRef = useRef<HTMLCanvasElement>(null);
  const focusCanvasRef = useRef<HTMLCanvasElement>(null);
  const contrastCanvasRef = useRef<HTMLCanvasElement>(null);

  // Analyze image quality
  const analyzeImageQuality = useCallback(async (src: string): Promise<QualityMetrics> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;

        // Convert to grayscale for analysis
        const grayscale = new Array(width * height);
        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          grayscale[i / 4] = gray;
        }

        // 1. Sharpness Analysis (Laplacian variance)
        const sharpnessMetrics = calculateSharpness(grayscale, width, height);

        // 2. Noise Analysis
        const noiseMetrics = calculateNoise(grayscale, width, height);

        // 3. Dynamic Range Analysis
        const dynamicRangeMetrics = calculateDynamicRange(data, width, height);

        // 4. Focus Quality Analysis
        const focusMetrics = calculateFocusQuality(grayscale, width, height);

        // 5. Contrast Analysis
        const contrastMetrics = calculateContrast(grayscale, width, height);

        resolve({
          sharpness: sharpnessMetrics,
          noise: noiseMetrics,
          dynamicRange: dynamicRangeMetrics,
          focus: focusMetrics,
          contrast: contrastMetrics,
        });
      };

      img.src = src;
    });
  }, []);

  // Sharpness calculation using Laplacian operator
  const calculateSharpness = (grayscale: number[], width: number, height: number) => {
    let variance = 0;
    let edgeSum = 0;
    let count = 0;

    // Laplacian kernel
    const kernel = [0, -1, 0, -1, 4, -1, 0, -1, 0];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let convSum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = (y + ky) * width + (x + kx);
            const kernelIdx = (ky + 1) * 3 + (kx + 1);
            convSum += grayscale[idx] * kernel[kernelIdx];
          }
        }
        variance += convSum * convSum;
        edgeSum += Math.abs(convSum);
        count++;
      }
    }

    variance /= count;
    const edgeStrength = edgeSum / count;
    const score = Math.min(100, variance / 50); // Normalize to 0-100
    const blurRadius = Math.max(0, 5 - score / 20);

    let level: 'poor' | 'fair' | 'good' | 'excellent';
    if (score < 20) level = 'poor';
    else if (score < 40) level = 'fair';
    else if (score < 70) level = 'good';
    else level = 'excellent';

    return { score, level, edgeStrength, blurRadius };
  };

  // Noise analysis using local variance
  const calculateNoise = (grayscale: number[], width: number, height: number) => {
    let totalVariance = 0;
    let validBlocks = 0;
    const blockSize = 8;

    for (let y = 0; y < height - blockSize; y += blockSize) {
      for (let x = 0; x < width - blockSize; x += blockSize) {
        let blockSum = 0;
        let blockSquareSum = 0;
        let blockCount = 0;

        for (let by = 0; by < blockSize; by++) {
          for (let bx = 0; bx < blockSize; bx++) {
            const idx = (y + by) * width + (x + bx);
            const pixel = grayscale[idx];
            blockSum += pixel;
            blockSquareSum += pixel * pixel;
            blockCount++;
          }
        }

        const mean = blockSum / blockCount;
        const variance = blockSquareSum / blockCount - mean * mean;

        // Filter out high-variance blocks (likely edges/details)
        if (variance < 100) {
          totalVariance += variance;
          validBlocks++;
        }
      }
    }

    const avgVariance = validBlocks > 0 ? totalVariance / validBlocks : 0;
    const score = Math.max(0, 100 - avgVariance * 2); // Higher variance = more noise = lower score
    const snr = avgVariance > 0 ? 20 * Math.log10(255 / Math.sqrt(avgVariance)) : 60;

    let level: 'low' | 'moderate' | 'high' | 'severe';
    if (avgVariance < 10) level = 'low';
    else if (avgVariance < 25) level = 'moderate';
    else if (avgVariance < 50) level = 'high';
    else level = 'severe';

    return { score, level, variance: avgVariance, snr };
  };

  // Dynamic range calculation
  const calculateDynamicRange = (data: Uint8ClampedArray, width: number, height: number) => {
    const histogram = new Array(256).fill(0);
    const totalPixels = width * height;

    // Build histogram
    for (let i = 0; i < data.length; i += 4) {
      const luminance = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      histogram[luminance]++;
    }

    // Find actual range (1% and 99% percentiles)
    let darkPixels = 0;
    let brightPixels = 0;
    let lowPoint = 0;
    let highPoint = 255;

    const threshold = totalPixels * 0.01; // 1%

    for (let i = 0; i < 256; i++) {
      darkPixels += histogram[i];
      if (darkPixels >= threshold && lowPoint === 0) {
        lowPoint = i;
      }
    }

    for (let i = 255; i >= 0; i--) {
      brightPixels += histogram[i];
      if (brightPixels >= threshold && highPoint === 255) {
        highPoint = i;
      }
    }

    const usedDR = highPoint - lowPoint;
    const actualDR = (usedDR / 255) * 100; // Percentage of full range used
    const efficiency = usedDR / 255;
    const score = Math.min(100, actualDR * 1.2);

    let level: 'limited' | 'moderate' | 'good' | 'excellent';
    if (actualDR < 30) level = 'limited';
    else if (actualDR < 60) level = 'moderate';
    else if (actualDR < 85) level = 'good';
    else level = 'excellent';

    return { score, level, actualDR, usedDR, efficiency };
  };

  // Focus quality using gradient variance
  const calculateFocusQuality = (grayscale: number[], width: number, height: number) => {
    const gradients: number[] = [];
    const focusMap: number[] = new Array(width * height).fill(0);

    // Sobel operators
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0,
          gy = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = (y + ky) * width + (x + kx);
            const kernelIdx = (ky + 1) * 3 + (kx + 1);
            gx += grayscale[idx] * sobelX[kernelIdx];
            gy += grayscale[idx] * sobelY[kernelIdx];
          }
        }

        const magnitude = Math.sqrt(gx * gx + gy * gy);
        gradients.push(magnitude);
        focusMap[y * width + x] = magnitude;
      }
    }

    // Calculate variance of gradients
    const mean = gradients.reduce((sum, val) => sum + val, 0) / gradients.length;
    const variance = gradients.reduce((sum, val) => sum + (val - mean) ** 2, 0) / gradients.length;

    const score = Math.min(100, variance / 100);

    let level: 'poor' | 'soft' | 'sharp' | 'excellent';
    if (score < 20) level = 'poor';
    else if (score < 40) level = 'soft';
    else if (score < 70) level = 'sharp';
    else level = 'excellent';

    return { score, level, gradientVariance: variance, focusMap };
  };

  // Contrast analysis
  const calculateContrast = (grayscale: number[], width: number, height: number) => {
    // Global contrast (RMS contrast)
    const mean = grayscale.reduce((sum, val) => sum + val, 0) / grayscale.length;
    const rmsContrast =
      Math.sqrt(grayscale.reduce((sum, val) => sum + (val - mean) ** 2, 0) / grayscale.length) /
      mean;

    // Local contrast using sliding window
    let localContrastSum = 0;
    let localContrastCount = 0;
    const windowSize = 16;

    for (let y = 0; y < height - windowSize; y += windowSize / 2) {
      for (let x = 0; x < width - windowSize; x += windowSize / 2) {
        let min = 255,
          max = 0;

        for (let wy = 0; wy < windowSize; wy++) {
          for (let wx = 0; wx < windowSize; wx++) {
            const idx = (y + wy) * width + (x + wx);
            if (idx < grayscale.length) {
              min = Math.min(min, grayscale[idx]);
              max = Math.max(max, grayscale[idx]);
            }
          }
        }

        const localContrast = (max - min) / (max + min || 1);
        localContrastSum += localContrast;
        localContrastCount++;
      }
    }

    const avgLocalContrast = localContrastSum / localContrastCount;

    // Michelangelo index (edge-based contrast)
    let edgeContrast = 0;
    let edgeCount = 0;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const center = grayscale[y * width + x];
        let maxDiff = 0;

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const neighbor = grayscale[(y + dy) * width + (x + dx)];
            maxDiff = Math.max(maxDiff, Math.abs(center - neighbor));
          }
        }

        edgeContrast += maxDiff;
        edgeCount++;
      }
    }

    const michelangeloIndex = edgeContrast / edgeCount / 255;
    const globalContrast = rmsContrast * 100;
    const localContrast = avgLocalContrast * 100;
    const score = Math.min(100, (globalContrast + localContrast) / 2);

    let level: 'flat' | 'low' | 'normal' | 'high';
    if (score < 15) level = 'flat';
    else if (score < 30) level = 'low';
    else if (score < 60) level = 'normal';
    else level = 'high';

    return { score, level, globalContrast, localContrast, michelangeloIndex };
  };

  // Draw visualizations
  const drawSharpnessVisualization = useCallback(
    (canvas: HTMLCanvasElement, metrics: QualityMetrics) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 300;
      canvas.height = 150;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw sharpness meter
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 50;

      // Background arc
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
      ctx.stroke();

      // Sharpness arc
      const angle = Math.PI + (metrics.sharpness.score / 100) * Math.PI;
      ctx.strokeStyle =
        metrics.sharpness.level === 'excellent'
          ? '#10b981'
          : metrics.sharpness.level === 'good'
            ? '#3b82f6'
            : metrics.sharpness.level === 'fair'
              ? '#f59e0b'
              : '#ef4444';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, Math.PI, angle);
      ctx.stroke();

      // Score text
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`${metrics.sharpness.score.toFixed(1)}`, centerX, centerY - 10);

      ctx.font = '12px system-ui';
      ctx.fillText(metrics.sharpness.level.toUpperCase(), centerX, centerY + 10);

      // Edge strength indicator
      ctx.fillStyle = '#888';
      ctx.font = '10px system-ui';
      ctx.fillText(
        `Edge Strength: ${metrics.sharpness.edgeStrength.toFixed(1)}`,
        centerX,
        centerY + 40,
      );
      ctx.fillText(
        `Blur Radius: ${metrics.sharpness.blurRadius.toFixed(1)}px`,
        centerX,
        centerY + 55,
      );
    },
    [],
  );

  const drawNoiseVisualization = useCallback(
    (canvas: HTMLCanvasElement, metrics: QualityMetrics) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 300;
      canvas.height = 150;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw noise level bars
      const barWidth = 40;
      const barHeight = 80;
      const x = (canvas.width - barWidth) / 2;
      const y = (canvas.height - barHeight) / 2;

      // Background bar
      ctx.fillStyle = '#333';
      ctx.fillRect(x, y, barWidth, barHeight);

      // Noise level bar
      const noiseHeight = (metrics.noise.variance / 100) * barHeight;
      ctx.fillStyle =
        metrics.noise.level === 'low'
          ? '#10b981'
          : metrics.noise.level === 'moderate'
            ? '#3b82f6'
            : metrics.noise.level === 'high'
              ? '#f59e0b'
              : '#ef4444';
      ctx.fillRect(x, y + barHeight - noiseHeight, barWidth, noiseHeight);

      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`${metrics.noise.score.toFixed(1)}`, canvas.width / 2, y - 10);

      ctx.font = '12px system-ui';
      ctx.fillText(metrics.noise.level.toUpperCase(), canvas.width / 2, y + barHeight + 20);

      ctx.fillStyle = '#888';
      ctx.font = '10px system-ui';
      ctx.fillText(`SNR: ${metrics.noise.snr.toFixed(1)} dB`, canvas.width / 2, y + barHeight + 35);
      ctx.fillText(
        `Variance: ${metrics.noise.variance.toFixed(2)}`,
        canvas.width / 2,
        y + barHeight + 50,
      );
    },
    [],
  );

  const drawDynamicRangeVisualization = useCallback(
    (canvas: HTMLCanvasElement, metrics: QualityMetrics) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 300;
      canvas.height = 150;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw gradient bar representing dynamic range
      const barWidth = 200;
      const barHeight = 30;
      const x = (canvas.width - barWidth) / 2;
      const y = (canvas.height - barHeight) / 2;

      // Create gradient
      const gradient = ctx.createLinearGradient(x, 0, x + barWidth, 0);
      gradient.addColorStop(0, '#000');
      gradient.addColorStop(1, '#fff');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Used range indicator
      const usedWidth = metrics.dynamicRange.efficiency * barWidth;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y - 5, usedWidth, barHeight + 10);

      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`${metrics.dynamicRange.score.toFixed(1)}%`, canvas.width / 2, y - 15);

      ctx.font = '12px system-ui';
      ctx.fillText(metrics.dynamicRange.level.toUpperCase(), canvas.width / 2, y + barHeight + 20);

      ctx.fillStyle = '#888';
      ctx.font = '10px system-ui';
      ctx.fillText(
        `Used Range: ${metrics.dynamicRange.actualDR.toFixed(1)}%`,
        canvas.width / 2,
        y + barHeight + 35,
      );
      ctx.fillText(
        `Efficiency: ${(metrics.dynamicRange.efficiency * 100).toFixed(1)}%`,
        canvas.width / 2,
        y + barHeight + 50,
      );
    },
    [],
  );

  const drawFocusVisualization = useCallback(
    (canvas: HTMLCanvasElement, metrics: QualityMetrics) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 300;
      canvas.height = 150;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw focus quality indicator
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = 40;
      const radius = (metrics.focus.score / 100) * maxRadius;

      // Background circle
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, 2 * Math.PI);
      ctx.stroke();

      // Focus circle
      ctx.fillStyle =
        metrics.focus.level === 'excellent'
          ? '#10b981'
          : metrics.focus.level === 'sharp'
            ? '#3b82f6'
            : metrics.focus.level === 'soft'
              ? '#f59e0b'
              : '#ef4444';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Score text
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`${metrics.focus.score.toFixed(1)}`, centerX, centerY + 5);

      ctx.font = '12px system-ui';
      ctx.fillText(metrics.focus.level.toUpperCase(), centerX, centerY + 60);

      ctx.fillStyle = '#888';
      ctx.font = '10px system-ui';
      ctx.fillText(
        `Gradient Variance: ${metrics.focus.gradientVariance.toFixed(1)}`,
        centerX,
        centerY + 75,
      );
    },
    [],
  );

  const drawContrastVisualization = useCallback(
    (canvas: HTMLCanvasElement, metrics: QualityMetrics) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 300;
      canvas.height = 150;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw contrast histogram-like visualization
      const barWidth = 8;
      const spacing = 2;
      const totalBars = 20;
      const startX = (canvas.width - totalBars * (barWidth + spacing)) / 2;
      const baseY = canvas.height - 30;

      for (let i = 0; i < totalBars; i++) {
        const x = startX + i * (barWidth + spacing);
        const height =
          ((Math.sin((i / totalBars) * Math.PI) * metrics.contrast.score) / 100) * 60 + 10;

        ctx.fillStyle = `hsl(${200 + i * 8}, 70%, ${50 + (height / 80) * 30}%)`;
        ctx.fillRect(x, baseY - height, barWidth, height);
      }

      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`${metrics.contrast.score.toFixed(1)}`, canvas.width / 2, 25);

      ctx.font = '12px system-ui';
      ctx.fillText(metrics.contrast.level.toUpperCase(), canvas.width / 2, baseY + 20);

      ctx.fillStyle = '#888';
      ctx.font = '10px system-ui';
      ctx.fillText(
        `Global: ${metrics.contrast.globalContrast.toFixed(1)}`,
        canvas.width / 2 - 50,
        baseY + 35,
      );
      ctx.fillText(
        `Local: ${metrics.contrast.localContrast.toFixed(1)}`,
        canvas.width / 2 + 50,
        baseY + 35,
      );
    },
    [],
  );

  // Main analysis effect
  useEffect(() => {
    if (!isVisible || !imageSrc) return;

    setIsAnalyzing(true);
    analyzeImageQuality(imageSrc)
      .then(setMetrics)
      .finally(() => setIsAnalyzing(false));
  }, [isVisible, imageSrc, analyzeImageQuality]);

  // Draw visualizations when metrics or active tab changes
  useEffect(() => {
    if (!metrics || !isVisible) return;

    const drawCurrentTab = () => {
      switch (activeTab) {
        case 'sharpness':
          if (sharpnessCanvasRef.current) {
            drawSharpnessVisualization(sharpnessCanvasRef.current, metrics);
          }
          break;
        case 'noise':
          if (noiseCanvasRef.current) {
            drawNoiseVisualization(noiseCanvasRef.current, metrics);
          }
          break;
        case 'dynamic':
          if (dynamicCanvasRef.current) {
            drawDynamicRangeVisualization(dynamicCanvasRef.current, metrics);
          }
          break;
        case 'focus':
          if (focusCanvasRef.current) {
            drawFocusVisualization(focusCanvasRef.current, metrics);
          }
          break;
        case 'contrast':
          if (contrastCanvasRef.current) {
            drawContrastVisualization(contrastCanvasRef.current, metrics);
          }
          break;
      }
    };

    // Small delay to ensure canvas is ready
    setTimeout(drawCurrentTab, 50);
  }, [
    metrics,
    activeTab,
    isVisible,
    drawSharpnessVisualization,
    drawNoiseVisualization,
    drawDynamicRangeVisualization,
    drawFocusVisualization,
    drawContrastVisualization,
  ]);

  if (!isVisible) return null;

  const getOverallQuality = () => {
    if (!metrics) return { score: 0, level: 'analyzing' };

    const avgScore =
      (metrics.sharpness.score +
        metrics.noise.score +
        metrics.dynamicRange.score +
        metrics.focus.score +
        metrics.contrast.score) /
      5;

    let level: string;
    if (avgScore >= 80) level = 'excellent';
    else if (avgScore >= 60) level = 'good';
    else if (avgScore >= 40) level = 'fair';
    else level = 'poor';

    return { score: avgScore, level };
  };

  const overall = getOverallQuality();

  return (
    <div ref={popupRef} style={popupStyle}>
      <Card className="w-80 bg-black/90 border-white/20 text-white">
        <CardHeader className="pb-3 cursor-move" data-drag-handle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              <CardTitle className="text-sm font-medium">Quality Assessment</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Overall Quality Score */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {isAnalyzing ? '...' : overall.score.toFixed(0)}
            </div>
            <Badge
              variant={
                overall.level === 'excellent'
                  ? 'default'
                  : overall.level === 'good'
                    ? 'secondary'
                    : 'destructive'
              }
              className={cn(
                overall.level === 'excellent' && 'bg-green-600',
                overall.level === 'good' && 'bg-blue-600',
                overall.level === 'fair' && 'bg-yellow-600',
              )}
            >
              {overall.level}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-gray-400">Analyzing image quality...</div>
            </div>
          ) : metrics ? (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-5 bg-white/10">
                <TabsTrigger value="sharpness" className="p-1">
                  <Focus className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger value="noise" className="p-1">
                  <Zap className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger value="dynamic" className="p-1">
                  <BarChart3 className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger value="focus" className="p-1">
                  <Gauge className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger value="contrast" className="p-1">
                  <Contrast className="w-3 h-3" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sharpness" className="space-y-2 mt-2">
                <canvas
                  ref={sharpnessCanvasRef}
                  className="w-full rounded border border-white/10"
                />
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Measures image sharpness using edge detection</div>
                  <div>Higher scores indicate sharper, more detailed images</div>
                </div>
              </TabsContent>

              <TabsContent value="noise" className="space-y-2 mt-2">
                <canvas ref={noiseCanvasRef} className="w-full rounded border border-white/10" />
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Analyzes image noise levels and signal-to-noise ratio</div>
                  <div>Lower noise levels result in cleaner images</div>
                </div>
              </TabsContent>

              <TabsContent value="dynamic" className="space-y-2 mt-2">
                <canvas ref={dynamicCanvasRef} className="w-full rounded border border-white/10" />
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Measures actual dynamic range utilization</div>
                  <div>Higher efficiency indicates better tonal range usage</div>
                </div>
              </TabsContent>

              <TabsContent value="focus" className="space-y-2 mt-2">
                <canvas ref={focusCanvasRef} className="w-full rounded border border-white/10" />
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Evaluates focus quality using gradient analysis</div>
                  <div>Higher variance indicates better focus quality</div>
                </div>
              </TabsContent>

              <TabsContent value="contrast" className="space-y-2 mt-2">
                <canvas ref={contrastCanvasRef} className="w-full rounded border border-white/10" />
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Analyzes global and local contrast levels</div>
                  <div>Balanced contrast enhances image impact</div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-sm text-gray-400 text-center py-4">No metrics available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
