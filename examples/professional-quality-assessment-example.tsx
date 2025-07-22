'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfessionalQualityAssessment } from '@/components/ui/media-viewer/professional-quality-assessment';
import { useState } from 'react';

export default function ProfessionalQualityAssessmentExample() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('/neom-SUIMrEKVOXc-origin.jpg');

  const sampleImages = [
    { src: '/neom-SUIMrEKVOXc-origin.jpg', name: 'Mountain Landscape' },
    { src: '/tsuyoshi-kozu-9luf51j0R-0-origin.jpg', name: 'Portrait Photography' },
    { src: '/yux-xiang-bAsOgzNy3XM-origin.jpg', name: 'Nature Close-up' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Image Quality Assessment
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Advanced algorithms for comprehensive image quality analysis
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                Sharpness Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Uses Laplacian edge detection to measure image sharpness and blur radius. Provides
                accurate focus quality assessment.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Noise Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Statistical analysis of image noise using local variance calculations. Measures
                signal-to-noise ratio and noise levels.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🌈</span>
                Dynamic Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Calculates actual dynamic range utilization and tonal distribution efficiency across
                the full luminance spectrum.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Focus Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Gradient-based focus analysis using Sobel operators to measure focus variance and
                sharpness distribution.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Contrast Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Comprehensive contrast measurement including global RMS contrast, local contrast,
                and Michelangelo edge-based analysis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📈</span>
                Overall Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Combines all metrics into a comprehensive quality score with detailed breakdowns and
                improvement suggestions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Sample Image:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleImages.map((image) => (
                  <div
                    key={image.src}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === image.src
                        ? 'border-blue-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedImage(image.src)}
                  >
                    <img src={image.src} alt={image.name} className="w-full h-32 object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-2 text-sm">
                      {image.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setIsVisible(!isVisible)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isVisible ? 'Hide' : 'Show'} Quality Assessment
              </button>
            </div>

            {/* Usage Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">How to Use:</h3>
              <ul className="space-y-1 text-blue-800 text-sm">
                <li>• Click "Show Quality Assessment" to open the analysis panel</li>
                <li>• Switch between different tabs to view specific metrics</li>
                <li>• Each tab shows real-time visualizations and detailed scores</li>
                <li>• The overall score combines all metrics for quick assessment</li>
                <li>• In MediaViewer, press 'A' key to toggle quality assessment</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Algorithms Used:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Laplacian edge detection for sharpness</li>
                  <li>• Local variance analysis for noise</li>
                  <li>• Percentile-based dynamic range calculation</li>
                  <li>• Sobel gradient analysis for focus</li>
                  <li>• RMS and local contrast measurement</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Real-time Features:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Canvas-based visualizations</li>
                  <li>• Interactive tabbed interface</li>
                  <li>• Detailed score breakdowns</li>
                  <li>• Professional assessment levels</li>
                  <li>• Cross-origin image support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Assessment Component */}
      <ProfessionalQualityAssessment
        imageSrc={selectedImage}
        isVisible={isVisible}
        onToggle={() => setIsVisible(!isVisible)}
      />
    </div>
  );
}
