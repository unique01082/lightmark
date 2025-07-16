'use client';

import { ComparisonView } from './comparison-view';
import { useMediaViewerContext } from './media-viewer-context';
import { OfflineSettings } from './offline-settings';

export function MediaViewerExternalDialogs() {
  const {
    images,
    metadata,
    comparisonState,
    showOfflineSettings,
    setShowOfflineSettings,
    isOnline,
    cacheStats,
    offlineSettings,
    clearCache,
    getCacheStats,
  } = useMediaViewerContext();

  const handleComparisonClose = () => {
    // Implementation would be in the comparison hook
    console.log('Closing comparison');
  };

  const handleComparisonIndexChange = (primary: number, secondary: number) => {
    // Implementation would be in the comparison hook
    console.log('Changing comparison indices:', primary, secondary);
  };

  return (
    <>
      {/* Comparison View - Outside of Dialog */}
      <ComparisonView
        images={images}
        primaryIndex={comparisonState.primaryIndex}
        secondaryIndex={comparisonState.secondaryIndex}
        onClose={handleComparisonClose}
        onIndexChange={handleComparisonIndexChange}
        metadata={metadata ? images.map((_, index) => metadata[index] || {}) : undefined}
        isVisible={comparisonState.isActive}
      />

      {/* Offline Settings Dialog */}
      <OfflineSettings
        isVisible={showOfflineSettings}
        onToggle={() => setShowOfflineSettings(false)}
        isOnline={isOnline}
        offlineStats={cacheStats}
        offlineSettings={offlineSettings}
        onClearCache={clearCache}
        onSyncCache={async () => {
          console.log('Syncing cache with server...');
        }}
        onSettingsChange={async (newSettings) => {
          console.log('Updating offline settings:', newSettings);
        }}
      />
    </>
  );
}
