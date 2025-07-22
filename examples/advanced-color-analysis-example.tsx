'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Eye, Palette, Thermometer, Zap } from 'lucide-react';
import { useState } from 'react';
import { AdvancedColorAnalysis } from '../components/ui/media-viewer/advanced-color-analysis';

const SAMPLE_IMAGES = [
  '/neom-SUIMrEKVOXc-origin.jpg', // Cool blue image
  '/yux-xiang-bAsOgzNy3XM-origin.jpg', // Warm sunset image
  '/tsuyoshi-kozu-9luf51j0R-0-origin.jpg', // Natural green image
];

const SAMPLE_DESCRIPTIONS = [
  'Cool blue landscape - test color temperature analysis',
  'Warm sunset scene - test vibrance and saturation',
  'Natural forest scene - test color distribution',
];

export function AdvancedColorAnalysisExample() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const currentImage = SAMPLE_IMAGES[currentImageIndex];
  const currentDescription = SAMPLE_DESCRIPTIONS[currentImageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">Advanced Color Analysis Demo</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Comprehensive color analysis including temperature detection, dominant color extraction,
            distribution mapping, white balance analysis, and vibrance measurement.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Thermometer className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Temperature Analysis</h3>
              <p className="text-sm text-slate-400">Warm/cool detection (2000K-10000K)</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Palette className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Dominant Colors</h3>
              <p className="text-sm text-slate-400">Color palette extraction with percentages</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Distribution Maps</h3>
              <p className="text-sm text-slate-400">Warm/cool/neutral distribution analysis</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Vibrance & WB</h3>
              <p className="text-sm text-slate-400">
                Saturation analysis & white balance detection
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Image Selection */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Test Images
            </CardTitle>
            <CardDescription>
              Select different images to see how the color analysis varies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {SAMPLE_IMAGES.map((image, index) => (
                <Button
                  key={index}
                  variant={currentImageIndex === index ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentImageIndex(index)}
                  className="text-xs"
                >
                  Image {index + 1}
                </Button>
              ))}
            </div>

            <div className="relative">
              <img
                src={currentImage}
                alt={currentDescription}
                className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-black/70 text-white">
                  {currentDescription}
                </Badge>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showAnalysis ? 'Hide' : 'Show'} Color Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Analysis Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <div>
                <h4 className="font-semibold text-white mb-2">🌡️ Color Temperature</h4>
                <p className="text-sm">
                  Automatically detects the warmth or coolness of your image on the Kelvin scale.
                  Ranges from very warm (2000K) to very cool (10000K) with precise measurements.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">🎨 Dominant Color Extraction</h4>
                <p className="text-sm">
                  Identifies the most prominent colors in your image with HSL values, percentages,
                  and color names. Perfect for creating color palettes and themes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">📊 Color Distribution</h4>
                <p className="text-sm">
                  Analyzes the distribution of warm, cool, neutral, vibrant, muted, light, and dark
                  colors throughout the image with percentage breakdowns.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Advanced Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <div>
                <h4 className="font-semibold text-white mb-2">⚖️ White Balance Detection</h4>
                <p className="text-sm">
                  Detects color casts and provides correction suggestions. Measures red/blue shifts
                  and recommends adjustments for better color accuracy.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">⚡ Vibrance & Saturation</h4>
                <p className="text-sm">
                  Measures overall image vibrance (emphasizing less saturated colors) and saturation
                  levels to help understand the image's color intensity and mood.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">🎯 Usage Scenarios</h4>
                <p className="text-sm">
                  Perfect for color grading, photo editing, brand color extraction, accessibility
                  analysis, and understanding image characteristics for automated processing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Keyboard Shortcuts */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Integration & Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
              <div>
                <h4 className="font-semibold text-white mb-2">🔤 Keyboard Shortcuts</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">C</kbd> - Toggle Color
                    Analysis
                  </li>
                  <li>
                    <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">K</kbd> - Toggle
                    Dominant Colors
                  </li>
                  <li>
                    <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">H</kbd> - Toggle
                    Histogram
                  </li>
                  <li>
                    <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">?</kbd> - Show All
                    Shortcuts
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">🔧 Component Features</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Compact popup design for side-by-side viewing</li>
                  <li>• Real-time canvas-based visualizations</li>
                  <li>• Tabbed interface for different analysis types</li>
                  <li>• Automatic processing with ImageJS library</li>
                  <li>• Positioned for optimal UX (bottom-right)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Color Analysis Component */}
      <AdvancedColorAnalysis
        imageSrc={currentImage}
        isVisible={showAnalysis}
        onClose={() => setShowAnalysis(false)}
      />
    </div>
  );
}
