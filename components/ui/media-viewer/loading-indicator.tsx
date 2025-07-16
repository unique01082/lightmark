import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  BarChart,
  CheckCircle,
  Clock,
  Download,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoadingIndicatorProps {
  loadingProgress: {
    loaded: number;
    total: number;
    percentage: number;
  };
  loadingStats: {
    totalImages: number;
    cachedImages: number;
    loadedImages: number;
    loadingImages: number;
    errorImages: number;
    cacheHitRate: number;
    averageLoadTime: number;
  };
  isVisible: boolean;
  onToggle: () => void;
  showDetailedStats?: boolean;
}

export function LoadingIndicator({
  loadingProgress,
  loadingStats,
  isVisible,
  onToggle,
  showDetailedStats = false,
}: LoadingIndicatorProps) {
  const [showStats, setShowStats] = useState(showDetailedStats);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  // Animate percentage change
  useEffect(() => {
    const targetPercentage = loadingProgress.percentage;
    const step = (targetPercentage - animatedPercentage) / 10;

    if (Math.abs(step) > 0.1) {
      const timer = setTimeout(() => {
        setAnimatedPercentage((prev) => prev + step);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setAnimatedPercentage(targetPercentage);
    }
  }, [loadingProgress.percentage, animatedPercentage]);

  if (!isVisible) return null;

  const isLoading = loadingStats.loadingImages > 0;
  const hasErrors = loadingStats.errorImages > 0;
  const isComplete = loadingProgress.percentage === 100;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 min-w-64 max-w-80">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-400" />}
            {hasErrors && !isLoading && <AlertCircle className="h-4 w-4 text-red-400" />}
            {isComplete && !hasErrors && <CheckCircle className="h-4 w-4 text-green-400" />}
            <span className="text-white font-medium">
              {isLoading ? 'Loading Images' : hasErrors ? 'Loading Issues' : 'Images Ready'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="text-white hover:bg-white/20 h-6 w-6 p-0"
            >
              <BarChart className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-white/20 h-6 w-6 p-0"
            >
              {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-white/70">
              {loadingProgress.loaded} / {loadingProgress.total} loaded
            </span>
            <span className="text-sm text-white/70">{Math.round(animatedPercentage)}%</span>
          </div>
          <Progress value={animatedPercentage} className="h-2 bg-white/20" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-white/70">Cached:</span>
            <Badge variant="secondary" className="text-xs">
              {loadingStats.cachedImages}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-400" />
            <span className="text-sm text-white/70">Hit Rate:</span>
            <Badge variant="secondary" className="text-xs">
              {Math.round(loadingStats.cacheHitRate)}%
            </Badge>
          </div>
        </div>

        {/* Detailed Stats */}
        {showStats && (
          <div className="border-t border-white/20 pt-3 space-y-2">
            <div className="text-sm text-white/70 font-medium mb-2">Performance Stats</div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60">Total Images:</span>
                <span className="text-white">{loadingStats.totalImages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Loaded:</span>
                <span className="text-green-400">{loadingStats.loadedImages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Loading:</span>
                <span className="text-blue-400">{loadingStats.loadingImages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Errors:</span>
                <span className="text-red-400">{loadingStats.errorImages}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Clock className="h-3 w-3 text-white/60" />
              <span className="text-xs text-white/60">Avg Load Time:</span>
              <Badge variant="outline" className="text-xs">
                {Math.round(loadingStats.averageLoadTime)}ms
              </Badge>
            </div>
          </div>
        )}

        {/* Error Actions */}
        {hasErrors && (
          <div className="border-t border-white/20 pt-3 mt-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-400">
                {loadingStats.errorImages} failed to load
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full text-white border-white/20 hover:bg-white/20"
              onClick={() => window.location.reload()}
            >
              <Download className="h-4 w-4 mr-2" />
              Retry All
            </Button>
          </div>
        )}

        {/* Loading Animation */}
        {isLoading && (
          <div className="mt-3 flex items-center justify-center">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for header
export function CompactLoadingIndicator({
  loadingProgress,
  isLoading,
  hasErrors,
}: {
  loadingProgress: { loaded: number; total: number; percentage: number };
  isLoading: boolean;
  hasErrors: boolean;
}) {
  if (!isLoading && !hasErrors) return null;

  return (
    <div className="flex items-center gap-2">
      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-400" />}
      {hasErrors && <AlertCircle className="h-4 w-4 text-red-400" />}
      <Badge variant="secondary" className="text-xs">
        {isLoading
          ? `${loadingProgress.percentage}%`
          : `${loadingProgress.loaded}/${loadingProgress.total}`}
      </Badge>
    </div>
  );
}
