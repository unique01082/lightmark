import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Star, X } from 'lucide-react';
import { useState } from 'react';

interface RatingSystemProps {
  imageId: string;
  currentRating: number;
  colorLabel: 'none' | 'red' | 'yellow' | 'green' | 'blue' | 'purple';
  isRejected: boolean;
  isPicked: boolean;
  onRatingChange: (imageId: string, rating: number) => void;
  onColorLabelChange: (
    imageId: string,
    color: 'none' | 'red' | 'yellow' | 'green' | 'blue' | 'purple',
  ) => void;
  onRejectToggle: (imageId: string) => void;
  onPickToggle: (imageId: string) => void;
  isVisible: boolean;
  onToggle: () => void;
}

export function RatingSystem({
  imageId,
  currentRating,
  colorLabel,
  isRejected,
  isPicked,
  onRatingChange,
  onColorLabelChange,
  onRejectToggle,
  onPickToggle,
  isVisible,
  onToggle,
}: RatingSystemProps) {
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const colorLabels = [
    { value: 'none', color: 'bg-gray-400', label: 'None' },
    { value: 'red', color: 'bg-red-500', label: 'Red' },
    { value: 'yellow', color: 'bg-yellow-500', label: 'Yellow' },
    { value: 'green', color: 'bg-green-500', label: 'Green' },
    { value: 'blue', color: 'bg-blue-500', label: 'Blue' },
    { value: 'purple', color: 'bg-purple-500', label: 'Purple' },
  ] as const;

  const handleStarClick = (rating: number) => {
    // Clicking the same star rating toggles it off
    const newRating = currentRating === rating ? 0 : rating;
    onRatingChange(imageId, newRating);
  };

  const handleColorLabelClick = (color: typeof colorLabel) => {
    // Clicking the same color toggles it off
    const newColor = colorLabel === color ? 'none' : color;
    onColorLabelChange(imageId, newColor);
  };

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-sm rounded-xl p-4 min-w-[280px] border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium text-sm">Rating & Labels</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-white hover:bg-white/20 h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Pick/Reject Actions */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={isPicked ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onPickToggle(imageId)}
          className={`text-white hover:bg-white/20 ${isPicked ? 'bg-green-600 hover:bg-green-700' : ''}`}
          title={isPicked ? 'Remove pick flag' : 'Mark as pick'}
        >
          <Check className="h-4 w-4 mr-1" />
          Pick
        </Button>

        <Button
          variant={isRejected ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onRejectToggle(imageId)}
          className={`text-white hover:bg-white/20 ${isRejected ? 'bg-red-600 hover:bg-red-700' : ''}`}
          title={isRejected ? 'Remove reject flag' : 'Mark as rejected'}
        >
          <X className="h-4 w-4 mr-1" />
          Reject
        </Button>
      </div>

      {/* Star Rating */}
      <div className="mb-4">
        <div className="text-white text-xs mb-2">Star Rating</div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleStarClick(rating)}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-white hover:text-yellow-400 transition-colors p-1"
              title={`${rating} star${rating > 1 ? 's' : ''}`}
            >
              <Star
                className={`h-5 w-5 ${
                  rating <= (hoveredRating || currentRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-none text-white/60'
                }`}
              />
            </button>
          ))}
          {currentRating > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {currentRating} star{currentRating > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {/* Color Labels */}
      <div>
        <div className="text-white text-xs mb-2">Color Label</div>
        <div className="flex items-center gap-2">
          {colorLabels.map((label) => (
            <button
              key={label.value}
              onClick={() => handleColorLabelClick(label.value)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                colorLabel === label.value
                  ? 'border-white scale-110'
                  : 'border-white/30 hover:border-white/60'
              } ${label.color}`}
              title={label.label}
            />
          ))}
        </div>
        {colorLabel !== 'none' && (
          <Badge variant="secondary" className="mt-2 text-xs">
            {colorLabels.find((l) => l.value === colorLabel)?.label} label
          </Badge>
        )}
      </div>

      {/* Quick Keyboard Shortcuts */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="text-white/60 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>1-5: Star rating</div>
            <div>P: Pick</div>
            <div>X: Reject</div>
            <div>6-0: Color labels</div>
          </div>
        </div>
      </div>
    </div>
  );
}
