import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  BarChart3,
  Copy,
  Crop,
  Download,
  Edit,
  Grid3x3,
  Heart,
  Info,
  Keyboard,
  Maximize,
  MoreVertical,
  Pause,
  Play,
  RotateCw,
  Settings,
  Share,
  Star,
  Trash2,
  X,
  Zap,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface MediaViewerHeaderProps {
  currentIndex: number;
  totalImages: number;
  metadata?: Record<string, any>;
  showInfo: boolean;
  onToggleInfo: () => void;
  onClose: () => void;
  onQuickZoom: (zoomLevel: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onNaturalZoom: () => void;
  onFitZoom: () => void;
  onZoomToPercentage: (percentage: number) => void;
  onZoomToRatio: (ratio: number) => void;
  zoomPercentage: number;
  zoomRatio: string;
  imageSizeInfo: string;
  onRotate?: () => void;
  onSlideshowToggle?: () => void;
  onFavoriteToggle?: () => void;
  onFullscreen?: () => void;
  slideshow?: { isActive: boolean; isPaused: boolean };
  isFavorite?: boolean;
  onDelete?: () => void;
  onShare?: () => void;
  onEdit?: () => void;
  onToggleHistogram?: () => void;
  showHistogram?: boolean;
  onToggleGrid?: () => void;
  showGrid?: boolean;
  onToggleQuickActions?: () => void;
  showQuickActions?: boolean;
  onToggleRating?: () => void;
  showRating?: boolean;
  onToggleComparison?: () => void;
  showComparison?: boolean;
  onToggleKeyboardHelp?: () => void;
  onToggleCropSimulator?: () => void;
}

export function MediaViewerHeader({
  currentIndex,
  totalImages,
  metadata,
  showInfo,
  onToggleInfo,
  onClose,
  onQuickZoom,
  onZoomIn,
  onZoomOut,
  onNaturalZoom,
  onFitZoom,
  onZoomToPercentage,
  onZoomToRatio,
  zoomPercentage,
  zoomRatio,
  imageSizeInfo,
  onRotate,
  onSlideshowToggle,
  onFavoriteToggle,
  onFullscreen,
  slideshow,
  isFavorite,
  onDelete,
  onShare,
  onEdit,
  onToggleHistogram,
  showHistogram,
  onToggleGrid,
  showGrid,
  onToggleQuickActions,
  showQuickActions,
  onToggleRating,
  showRating,
  onToggleComparison,
  showComparison,
  onToggleKeyboardHelp,
  onToggleCropSimulator,
}: MediaViewerHeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 md:p-4 bg-gradient-to-b from-black/50 to-transparent">
      {/* Left Section - Navigation & Info */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs md:text-sm">
          {currentIndex + 1} / {totalImages}
        </Badge>
        {metadata && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleInfo}
            className="text-white hover:bg-white/20"
            title="Toggle info panel"
          >
            <Info className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Center Section - Zoom Controls */}
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="text-white hover:bg-white/20"
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomToRatio(1)}
            className="text-white hover:bg-white/20 text-xs px-2"
          >
            1:1
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onFitZoom}
            className="text-white hover:bg-white/20 text-xs px-2"
          >
            Fit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomToRatio(2)}
            className="text-white hover:bg-white/20 text-xs px-2"
          >
            2:1
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomToRatio(3)}
            className="text-white hover:bg-white/20 text-xs px-2"
          >
            3:1
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white text-sm min-w-[4rem] text-center font-mono">
            {zoomPercentage}%
          </span>
          <span className="text-white text-xs bg-black/20 px-2 py-1 rounded">{zoomRatio}</span>
        </div>

        {imageSizeInfo && (
          <span className="text-white text-xs bg-black/20 px-2 py-1 rounded hidden lg:block">
            {imageSizeInfo}
          </span>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="text-white hover:bg-white/20"
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Zoom Controls */}
      <div className="md:hidden flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="text-white hover:bg-white/20 p-1"
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <span className="text-white text-xs min-w-[3rem] text-center font-mono">
          {zoomPercentage}%
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="text-white hover:bg-white/20 p-1"
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Right Section - Tools & Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Primary Tools - Always visible on desktop */}
        <div className="hidden md:flex items-center gap-1">
          {onRotate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRotate}
              className="text-white hover:bg-white/20"
              title="Rotate 90°"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          )}

          {onToggleCropSimulator && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCropSimulator}
              className="text-white hover:bg-white/20"
              title="Crop tool (C)"
            >
              <Crop className="h-4 w-4" />
            </Button>
          )}

          {onToggleGrid && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleGrid}
              className={`text-white hover:bg-white/20 ${showGrid ? 'bg-white/20' : ''}`}
              title="Toggle composition grid"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          )}

          {onToggleHistogram && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleHistogram}
              className={`text-white hover:bg-white/20 ${showHistogram ? 'bg-white/20' : ''}`}
              title="Toggle histogram"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          )}

          {onToggleRating && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleRating}
              className={`text-white hover:bg-white/20 ${showRating ? 'bg-white/20' : ''}`}
              title="Toggle rating system"
            >
              <Star className="h-4 w-4" />
            </Button>
          )}

          <Separator orientation="vertical" className="h-6 bg-white/20" />
        </div>

        {/* View Options Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              title="View options"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {/* Mobile-only zoom controls */}
            <div className="md:hidden">
              <DropdownMenuItem onClick={() => onZoomToRatio(1)}>1:1 Zoom</DropdownMenuItem>
              <DropdownMenuItem onClick={onFitZoom}>Fit to Screen</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onZoomToRatio(2)}>2:1 Zoom</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onZoomToRatio(3)}>3:1 Zoom</DropdownMenuItem>
              <DropdownMenuSeparator />
              {onRotate && (
                <DropdownMenuItem onClick={onRotate}>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Rotate 90°
                </DropdownMenuItem>
              )}
              {onToggleCropSimulator && (
                <DropdownMenuItem onClick={onToggleCropSimulator}>
                  <Crop className="h-4 w-4 mr-2" />
                  Crop Tool
                </DropdownMenuItem>
              )}
              {onToggleGrid && (
                <DropdownMenuItem onClick={onToggleGrid}>
                  <Grid3x3 className="h-4 w-4 mr-2" />
                  {showGrid ? 'Hide' : 'Show'} Grid
                </DropdownMenuItem>
              )}
              {onToggleHistogram && (
                <DropdownMenuItem onClick={onToggleHistogram}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {showHistogram ? 'Hide' : 'Show'} Histogram
                </DropdownMenuItem>
              )}
              {onToggleRating && (
                <DropdownMenuItem onClick={onToggleRating}>
                  <Star className="h-4 w-4 mr-2" />
                  {showRating ? 'Hide' : 'Show'} Rating System
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
            </div>

            {onToggleHistogram && (
              <DropdownMenuItem onClick={onToggleHistogram}>
                <BarChart3 className="h-4 w-4 mr-2" />
                {showHistogram ? 'Hide' : 'Show'} Histogram
              </DropdownMenuItem>
            )}
            {onToggleQuickActions && (
              <DropdownMenuItem onClick={onToggleQuickActions}>
                <Zap className="h-4 w-4 mr-2" />
                {showQuickActions ? 'Hide' : 'Show'} Quick Actions
              </DropdownMenuItem>
            )}
            {onToggleRating && (
              <DropdownMenuItem onClick={onToggleRating}>
                <Star className="h-4 w-4 mr-2" />
                {showRating ? 'Hide' : 'Show'} Rating System
              </DropdownMenuItem>
            )}
            {onToggleComparison && (
              <DropdownMenuItem onClick={onToggleComparison}>
                <Copy className="h-4 w-4 mr-2" />
                {showComparison ? 'Exit' : 'Start'} Comparison
              </DropdownMenuItem>
            )}
            {onSlideshowToggle && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSlideshowToggle}>
                  {slideshow?.isActive ? (
                    <Pause className="h-4 w-4 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {slideshow?.isActive ? 'Stop' : 'Start'} Slideshow
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              title="More actions"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onFavoriteToggle && (
              <DropdownMenuItem onClick={onFavoriteToggle}>
                <Heart
                  className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current text-red-500' : ''}`}
                />
                {isFavorite ? 'Remove from' : 'Add to'} Favorites
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Photo
              </DropdownMenuItem>
            )}
            {onShare && (
              <DropdownMenuItem onClick={onShare}>
                <Share className="h-4 w-4 mr-2" />
                Share Photo
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Download
            </DropdownMenuItem>
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-red-500">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Photo
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Always Visible Actions */}
        <div className="flex items-center gap-1">
          {onFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFullscreen}
              className="text-white hover:bg-white/20"
              title="Toggle fullscreen"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleKeyboardHelp}
            className="text-white hover:bg-white/20 hidden md:flex"
            title="Keyboard Shortcuts (Ctrl+?)"
          >
            <Keyboard className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
            title="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
