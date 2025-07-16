import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CompositionOverlayProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function CompositionOverlay({ isVisible, onToggle }: CompositionOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Rule of thirds grid */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0">
        {/* Vertical lines */}
        <div className="border-r border-white/30"></div>
        <div className="border-r border-white/30"></div>
        <div></div>

        <div className="border-r border-white/30"></div>
        <div className="border-r border-white/30"></div>
        <div></div>

        <div className="border-r border-white/30"></div>
        <div className="border-r border-white/30"></div>
        <div></div>
      </div>

      {/* Horizontal lines */}
      <div className="absolute inset-0 grid grid-rows-3 gap-0">
        <div className="border-b border-white/30"></div>
        <div className="border-b border-white/30"></div>
        <div></div>
      </div>

      {/* Intersection points (rule of thirds power points) */}
      <div className="absolute inset-0">
        {/* Top-left intersection */}
        <div
          className="absolute w-2 h-2 bg-white/50 rounded-full transform -translate-x-1 -translate-y-1"
          style={{ left: '33.33%', top: '33.33%' }}
        ></div>

        {/* Top-right intersection */}
        <div
          className="absolute w-2 h-2 bg-white/50 rounded-full transform -translate-x-1 -translate-y-1"
          style={{ left: '66.67%', top: '33.33%' }}
        ></div>

        {/* Bottom-left intersection */}
        <div
          className="absolute w-2 h-2 bg-white/50 rounded-full transform -translate-x-1 -translate-y-1"
          style={{ left: '33.33%', top: '66.67%' }}
        ></div>

        {/* Bottom-right intersection */}
        <div
          className="absolute w-2 h-2 bg-white/50 rounded-full transform -translate-x-1 -translate-y-1"
          style={{ left: '66.67%', top: '66.67%' }}
        ></div>
      </div>

      {/* Center lines for additional guidance */}
      <div className="absolute inset-0">
        {/* Vertical center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 transform -translate-x-px"></div>

        {/* Horizontal center line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 transform -translate-y-px"></div>
      </div>

      {/* Toggle button */}
      <div className="absolute top-20 right-4 pointer-events-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-white hover:bg-white/20 bg-black/50"
          title="Hide composition grid"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
