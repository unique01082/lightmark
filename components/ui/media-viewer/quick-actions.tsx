import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Crop,
  Download,
  FlipHorizontal,
  FlipVertical,
  Moon,
  Paintbrush,
  Palette,
  RotateCw,
  Scissors,
  Settings,
  Sliders,
  Sun,
  Upload,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface QuickActionsProps {
  isVisible: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onCrop?: () => void;
  onRotate?: () => void;
  onFlipHorizontal?: () => void;
  onFlipVertical?: () => void;
  onApplyPreset?: (preset: string) => void;
  onExport?: () => void;
  onCopyAdjustments?: () => void;
  onPasteAdjustments?: () => void;
}

interface AdjustmentPreset {
  name: string;
  icon: React.ReactNode;
  description: string;
  adjustments: Record<string, number>;
}

const ADJUSTMENT_PRESETS: AdjustmentPreset[] = [
  {
    name: 'Auto',
    icon: <Wand2 className="h-4 w-4" />,
    description: 'Automatic adjustments',
    adjustments: { exposure: 0.2, highlights: -0.3, shadows: 0.2, clarity: 0.1 },
  },
  {
    name: 'Bright',
    icon: <Sun className="h-4 w-4" />,
    description: 'Brighten image',
    adjustments: { exposure: 0.5, highlights: -0.2, shadows: 0.3, vibrance: 0.1 },
  },
  {
    name: 'Dark & Moody',
    icon: <Moon className="h-4 w-4" />,
    description: 'Dark atmospheric look',
    adjustments: { exposure: -0.3, highlights: -0.5, shadows: -0.2, clarity: 0.2 },
  },
  {
    name: 'High Contrast',
    icon: <Sliders className="h-4 w-4" />,
    description: 'Increase contrast',
    adjustments: { contrast: 0.4, highlights: -0.3, shadows: -0.3, clarity: 0.3 },
  },
  {
    name: 'Vibrant',
    icon: <Palette className="h-4 w-4" />,
    description: 'Boost colors',
    adjustments: { vibrance: 0.4, saturation: 0.2, clarity: 0.1 },
  },
  {
    name: 'B&W',
    icon: <Palette className="h-4 w-4" />,
    description: 'Black and white',
    adjustments: { saturation: -1, contrast: 0.2, clarity: 0.3 },
  },
];

export function QuickActions({
  isVisible,
  onToggle,
  onEdit,
  onCrop,
  onRotate,
  onFlipHorizontal,
  onFlipVertical,
  onApplyPreset,
  onExport,
  onCopyAdjustments,
  onPasteAdjustments,
}: QuickActionsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('transform');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [hasAdjustmentsToCopy, setHasAdjustmentsToCopy] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const applyPreset = (preset: AdjustmentPreset) => {
    setSelectedPreset(preset.name);
    onApplyPreset?.(preset.name);
    setHasAdjustmentsToCopy(true);
  };

  const copyAdjustments = () => {
    onCopyAdjustments?.();
    setHasAdjustmentsToCopy(true);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-xl p-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto border border-white/20">
      <div className="flex items-center justify-between mb-4 cursor-move" data-drag-handle>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-white" />
          <span className="text-white text-sm font-medium">Quick Actions</span>
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

      {/* Transform Section */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => toggleSection('transform')}
          className="w-full flex items-center justify-between text-white hover:bg-white/20 mb-2"
        >
          <span className="flex items-center gap-2">
            <RotateCw className="h-4 w-4" />
            Transform
          </span>
          {expandedSection === 'transform' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {expandedSection === 'transform' && (
          <div className="grid grid-cols-2 gap-2 pl-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCrop}
              className="text-white hover:bg-white/20 flex items-center gap-2"
            >
              <Crop className="h-4 w-4" />
              Crop
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRotate}
              className="text-white hover:bg-white/20 flex items-center gap-2"
            >
              <RotateCw className="h-4 w-4" />
              Rotate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onFlipHorizontal}
              className="text-white hover:bg-white/20 flex items-center gap-2"
            >
              <FlipHorizontal className="h-4 w-4" />
              Flip H
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onFlipVertical}
              className="text-white hover:bg-white/20 flex items-center gap-2"
            >
              <FlipVertical className="h-4 w-4" />
              Flip V
            </Button>
          </div>
        )}
      </div>

      {/* Quick Adjustments Section */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => toggleSection('adjustments')}
          className="w-full flex items-center justify-between text-white hover:bg-white/20 mb-2"
        >
          <span className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Quick Adjustments
          </span>
          {expandedSection === 'adjustments' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {expandedSection === 'adjustments' && (
          <div className="grid grid-cols-2 gap-2 pl-4">
            {ADJUSTMENT_PRESETS.map((preset) => (
              <Button
                key={preset.name}
                variant="ghost"
                size="sm"
                onClick={() => applyPreset(preset)}
                className={`text-white hover:bg-white/20 flex items-center gap-2 ${
                  selectedPreset === preset.name ? 'bg-white/20' : ''
                }`}
                title={preset.description}
              >
                {preset.icon}
                {preset.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Develop Section */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => toggleSection('develop')}
          className="w-full flex items-center justify-between text-white hover:bg-white/20 mb-2"
        >
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Develop
          </span>
          {expandedSection === 'develop' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {expandedSection === 'develop' && (
          <div className="grid grid-cols-1 gap-2 pl-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-white hover:bg-white/20 flex items-center gap-2 justify-start"
            >
              <Paintbrush className="h-4 w-4" />
              Edit in Develop
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAdjustments}
              className="text-white hover:bg-white/20 flex items-center gap-2 justify-start"
            >
              <Copy className="h-4 w-4" />
              Copy Adjustments
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onPasteAdjustments}
              className={`text-white hover:bg-white/20 flex items-center gap-2 justify-start ${
                !hasAdjustmentsToCopy ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!hasAdjustmentsToCopy}
            >
              <Scissors className="h-4 w-4" />
              Paste Adjustments
            </Button>
          </div>
        )}
      </div>

      {/* Export Section */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => toggleSection('export')}
          className="w-full flex items-center justify-between text-white hover:bg-white/20 mb-2"
        >
          <span className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </span>
          {expandedSection === 'export' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {expandedSection === 'export' && (
          <div className="grid grid-cols-1 gap-2 pl-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              className="text-white hover:bg-white/20 flex items-center gap-2 justify-start"
            >
              <Download className="h-4 w-4" />
              Export Original
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 flex items-center gap-2 justify-start"
            >
              <Upload className="h-4 w-4" />
              Export for Web
            </Button>
          </div>
        )}
      </div>

      {/* Current Adjustments Info */}
      {selectedPreset && (
        <div className="mt-4 pt-3 border-t border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              Current: {selectedPreset}
            </Badge>
          </div>
          <div className="text-xs text-white/60">
            Applied quick adjustments. Use "Edit in Develop" for detailed controls.
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts */}
      <div className="mt-4 pt-3 border-t border-white/20">
        <div className="text-xs text-white/60 space-y-1">
          <div>
            <kbd className="px-1 py-0.5 bg-white/20 rounded text-xs">R</kbd> Rotate
          </div>
          <div>
            <kbd className="px-1 py-0.5 bg-white/20 rounded text-xs">C</kbd> Crop
          </div>
          <div>
            <kbd className="px-1 py-0.5 bg-white/20 rounded text-xs">Ctrl+C</kbd> Copy adjustments
          </div>
          <div>
            <kbd className="px-1 py-0.5 bg-white/20 rounded text-xs">Ctrl+V</kbd> Paste adjustments
          </div>
        </div>
      </div>
    </div>
  );
}
