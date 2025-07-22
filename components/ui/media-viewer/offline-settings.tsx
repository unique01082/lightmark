import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  Database,
  Download,
  Gauge,
  Globe,
  HardDrive,
  RefreshCw,
  Settings,
  Signal,
  Trash2,
  Upload,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useStackablePopup } from './use-stackable-popup';

interface OfflineSettingsProps {
  isOnline: boolean;
  offlineStats: {
    totalCacheSize: number;
    totalEntries: number;
    hitRate: number;
    compressionRatio: number;
    lastSync: number;
    isOnline: boolean;
    pendingUploads: number;
  };
  offlineSettings: {
    enabled: boolean;
    maxCacheSize: number;
    maxEntries: number;
    cacheStrategy: 'aggressive' | 'conservative' | 'smart';
    autoSync: boolean;
    compressionLevel: number;
  };
  onSettingsChange: (settings: any) => void;
  onClearCache: () => void;
  onSyncCache: () => void;
  isVisible: boolean;
  onToggle: () => void;
}

export function OfflineSettings({
  isOnline,
  offlineStats,
  offlineSettings,
  onSettingsChange,
  onClearCache,
  onSyncCache,
  isVisible,
  onToggle,
}: OfflineSettingsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (timestamp: number) => {
    if (!timestamp) return 'Never';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getCacheUsagePercentage = () => {
    return (offlineStats.totalCacheSize / offlineSettings.maxCacheSize) * 100;
  };

  const getEntryUsagePercentage = () => {
    return (offlineStats.totalEntries / offlineSettings.maxEntries) * 100;
  };

  // Add stackable popup hook
  const { style: popupStyle, popupRef } = useStackablePopup('offline-settings', {
    width: 600,
    height: 700,
    visible: isVisible,
  });

  if (!isVisible) return null;

  return (
    <div
      ref={popupRef}
      className="overflow-y-auto"
      style={{
        ...popupStyle,
      }}
    >
      <Card className="bg-black/90 backdrop-blur-sm border-white/20 h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-400" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-400" />
              )}
              <CardTitle className="text-white">Offline Cache</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>
          <CardDescription className="text-white/70">
            {isOnline ? 'Online - Syncing enabled' : 'Offline - Using cached images'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
            {isOnline ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">Connected</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">Offline</span>
              </>
            )}
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onSyncCache}
                disabled={!isOnline}
                className="text-white border-white/20 hover:bg-white/20"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Sync
              </Button>
            </div>
          </div>

          {/* Cache Statistics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-medium">
              <BarChart3 className="h-4 w-4" />
              Cache Statistics
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <HardDrive className="h-3 w-3 text-blue-400" />
                  <span className="text-xs text-white/70">Storage</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {offlineStats.totalCacheSize.toFixed(1)} MB
                </div>
                <Progress value={getCacheUsagePercentage()} className="h-1 mt-1" />
              </div>

              <div className="bg-white/5 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-white/70">Images</span>
                </div>
                <div className="text-lg font-bold text-white">{offlineStats.totalEntries}</div>
                <Progress value={getEntryUsagePercentage()} className="h-1 mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="h-3 w-3 text-purple-400" />
                  <span className="text-xs text-white/70">Hit Rate</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {offlineStats.hitRate.toFixed(1)}%
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-3 w-3 text-orange-400" />
                  <span className="text-xs text-white/70">Compression</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {(offlineStats.compressionRatio * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-white/20" />

          {/* Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-medium">
              <Settings className="h-4 w-4" />
              Settings
            </div>

            {/* Enable/Disable */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Signal className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white">Enable Offline Cache</span>
              </div>
              <Switch
                checked={offlineSettings.enabled}
                onCheckedChange={(checked) =>
                  onSettingsChange({ ...offlineSettings, enabled: checked })
                }
              />
            </div>

            {/* Auto Sync */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white">Auto Sync</span>
              </div>
              <Switch
                checked={offlineSettings.autoSync}
                onCheckedChange={(checked) =>
                  onSettingsChange({ ...offlineSettings, autoSync: checked })
                }
              />
            </div>

            {/* Cache Strategy */}
            <div className="space-y-2">
              <label className="text-sm text-white/70">Cache Strategy</label>
              <select
                value={offlineSettings.cacheStrategy}
                onChange={(e) =>
                  onSettingsChange({
                    ...offlineSettings,
                    cacheStrategy: e.target.value as 'aggressive' | 'conservative' | 'smart',
                  })
                }
                className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-sm"
              >
                <option value="conservative">Conservative</option>
                <option value="smart">Smart</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>

            {/* Advanced Settings */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full text-white border-white/20 hover:bg-white/20"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </Button>

            {showAdvanced && (
              <div className="space-y-3 pt-2">
                {/* Max Cache Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-white/70">Max Cache Size</label>
                    <Badge variant="secondary">{offlineSettings.maxCacheSize} MB</Badge>
                  </div>
                  <Slider
                    value={[offlineSettings.maxCacheSize]}
                    onValueChange={(value) =>
                      onSettingsChange({ ...offlineSettings, maxCacheSize: value[0] })
                    }
                    min={10}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                </div>

                {/* Max Entries */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-white/70">Max Images</label>
                    <Badge variant="secondary">{offlineSettings.maxEntries}</Badge>
                  </div>
                  <Slider
                    value={[offlineSettings.maxEntries]}
                    onValueChange={(value) =>
                      onSettingsChange({ ...offlineSettings, maxEntries: value[0] })
                    }
                    min={50}
                    max={1000}
                    step={50}
                    className="w-full"
                  />
                </div>

                {/* Compression Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-white/70">Compression Level</label>
                    <Badge variant="secondary">
                      {Math.round(offlineSettings.compressionLevel * 100)}%
                    </Badge>
                  </div>
                  <Slider
                    value={[offlineSettings.compressionLevel]}
                    onValueChange={(value) =>
                      onSettingsChange({ ...offlineSettings, compressionLevel: value[0] })
                    }
                    min={0.1}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          <Separator className="bg-white/20" />

          {/* Actions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-medium">
              <Clock className="h-4 w-4" />
              Last Sync: {formatTime(offlineStats.lastSync)}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearCache}
                className="flex-1 text-white border-white/20 hover:bg-white/20"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear Cache
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onSyncCache}
                disabled={!isOnline}
                className="flex-1 text-white border-white/20 hover:bg-white/20"
              >
                <Download className="h-3 w-3 mr-1" />
                Sync Now
              </Button>
            </div>
          </div>

          {/* Pending Uploads */}
          {offlineStats.pendingUploads > 0 && (
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">
                  {offlineStats.pendingUploads} pending uploads
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Compact offline indicator for header
export function OfflineIndicator({
  isOnline,
  cacheSize,
  onClick,
}: {
  isOnline: boolean;
  cacheSize: number;
  onClick: () => void;
}) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick} className="text-white hover:bg-white/20">
      {isOnline ? (
        <Wifi className="h-4 w-4 text-green-400" />
      ) : (
        <WifiOff className="h-4 w-4 text-red-400" />
      )}
      <Badge variant="secondary" className="ml-2 text-xs">
        {cacheSize.toFixed(1)} MB
      </Badge>
    </Button>
  );
}
