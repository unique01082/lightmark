import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaViewerNavigationProps {
  currentIndex: number;
  totalImages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function MediaViewerNavigation({
  currentIndex,
  totalImages,
  onPrevious,
  onNext,
}: MediaViewerNavigationProps) {
  if (totalImages <= 1) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
        onClick={onPrevious}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
        onClick={onNext}
        disabled={currentIndex === totalImages - 1}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </>
  );
}
