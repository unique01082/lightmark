'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AdvancedHistogram } from '@/components/ui/media-viewer/advanced-histogram';
import { BarChart3, Pause, Play, RotateCcw } from 'lucide-react';
import { useState } from 'react';

const SAMPLE_IMAGES = [
  '/placeholder.jpg',
  '/auth-layout-bg.jpg',
  '/neom-SUIMrEKVOXc-large.jpg',
  '/neom-SUIMrEKVOXc-medium.jpg',
  '/tsuyoshi-kozu-9luf51j0R-0-origin.jpg',
  '/yux-xiang-bAsOgzNy3XM-origin.jpg',
];

export function AdvancedHistogramExample() {
  const [currentImage, setCurrentImage] = useState(SAMPLE_IMAGES[0]);
  const [showHistogram, setShowHistogram] = useState(true);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggleVideoMode = () => {
    setIsVideoMode(!isVideoMode);
    setCurrentSequenceIndex(0);
    setIsPlaying(false);
  };

  const handlePlaySequence = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentSequenceIndex((prev) => {
        const next = prev + 1;
        if (next >= SAMPLE_IMAGES.length) {
          setIsPlaying(false);
          clearInterval(interval);
          return 0; // Reset to start
        }
        setCurrentImage(SAMPLE_IMAGES[next]);
        return next;
      });
    }, 1000); // 1 second per frame
  };

  const handleReset = () => {
    setCurrentSequenceIndex(0);
    setCurrentImage(SAMPLE_IMAGES[0]);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="p-6 bg-black/95 border-white/20 text-white">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Advanced Histogram Demo</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistogram(!showHistogram)}
                className={showHistogram ? 'bg-blue-500/20' : ''}
              >
                {showHistogram ? 'Hide' : 'Show'} Histogram
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleVideoMode}
                className={isVideoMode ? 'bg-green-500/20' : ''}
              >
                {isVideoMode ? 'Single' : 'Temporal'} Mode
              </Button>
            </div>
          </div>

          {isVideoMode && (
            <div className="flex items-center gap-2 p-3 bg-green-900/20 rounded border border-green-500/30">
              <div className="text-sm text-green-400">
                Temporal Mode: Analyzing {SAMPLE_IMAGES.length} frame sequence
              </div>
              <div className="flex-1" />
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlaySequence}
                className="flex items-center gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play'} Sequence
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Image</h3>
              <div className="aspect-video bg-black/50 border border-white/20 rounded overflow-hidden">
                <img src={currentImage} alt="Sample" className="w-full h-full object-cover" />
              </div>

              {isVideoMode && (
                <div className="space-y-2">
                  <div className="text-sm text-white/70">
                    Frame {currentSequenceIndex + 1} of {SAMPLE_IMAGES.length}
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {SAMPLE_IMAGES.map((src, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentSequenceIndex(index);
                          setCurrentImage(src);
                        }}
                        className={`aspect-square border-2 rounded overflow-hidden ${
                          index === currentSequenceIndex
                            ? 'border-blue-500'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <img
                          src={src}
                          alt={`Frame ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!isVideoMode && (
                <div className="space-y-2">
                  <div className="text-sm text-white/70">Select Image:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {SAMPLE_IMAGES.slice(0, 6).map((src, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(src)}
                        className={`aspect-video border-2 rounded overflow-hidden ${
                          src === currentImage
                            ? 'border-blue-500'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <img
                          src={src}
                          alt={`Sample ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Advanced Features</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-900/20 rounded border border-blue-500/30">
                  <div className="font-medium text-blue-400">📊 Standard Histogram</div>
                  <div className="text-sm text-white/70 mt-1">
                    RGB + Luminance channels with real-time analysis
                  </div>
                </div>

                <div className="p-3 bg-purple-900/20 rounded border border-purple-500/30">
                  <div className="font-medium text-purple-400">🔲 Multi-Zone Analysis</div>
                  <div className="text-sm text-white/70 mt-1">
                    Grid-based histogram breakdown (2×2, 3×3, 4×4)
                  </div>
                </div>

                <div className="p-3 bg-orange-900/20 rounded border border-orange-500/30">
                  <div className="font-medium text-orange-400">🎨 Selective Color Ranges</div>
                  <div className="text-sm text-white/70 mt-1">
                    Histogram for specific hue/saturation ranges
                  </div>
                </div>

                <div className="p-3 bg-cyan-900/20 rounded border border-cyan-500/30">
                  <div className="font-medium text-cyan-400">🎲 3D Color Space</div>
                  <div className="text-sm text-white/70 mt-1">
                    Interactive RGB cube visualization with rotation
                  </div>
                </div>

                {isVideoMode && (
                  <div className="p-3 bg-green-900/20 rounded border border-green-500/30">
                    <div className="font-medium text-green-400">⏱️ Temporal Analysis</div>
                    <div className="text-sm text-white/70 mt-1">
                      Histogram evolution over time for video/burst sequences
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Advanced Histogram Component */}
      <AdvancedHistogram
        imageSrc={currentImage}
        isVisible={showHistogram}
        onClose={() => setShowHistogram(false)}
        isVideoMode={isVideoMode}
        imageSequence={isVideoMode ? SAMPLE_IMAGES : []}
        currentSequenceIndex={currentSequenceIndex}
      />
    </div>
  );
}
