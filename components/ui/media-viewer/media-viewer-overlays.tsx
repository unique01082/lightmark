'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { CompactLoadingIndicator } from './loading-indicator';
import { useMediaViewerContext } from './media-viewer-context';

export function MediaViewerOverlays() {
  const {
    offlineSettings,
    isOnline,
    cacheStats,
    toggleOfflineSettings,
    loadingProgress,
    getLoadingStats,
  } = useMediaViewerContext();

  return (
    <>
      {/* Offline Status Indicator */}
      {offlineSettings.enabled && (
        <div className="absolute top-16 right-4 z-30 md:top-20 md:right-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-black/70 rounded-full text-white text-sm">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
            {cacheStats.totalEntries > 0 && (
              <Badge variant="secondary" className="text-xs">
                {cacheStats.totalEntries}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleOfflineSettings}
              className="p-1 h-6 w-6"
              title="Offline settings"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Compact Loading Indicator */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20 md:top-20">
        <CompactLoadingIndicator
          loadingProgress={loadingProgress}
          isLoading={getLoadingStats().loadingImages > 0}
          hasErrors={getLoadingStats().errorImages > 0}
        />
      </div>
    </>
  );
}
