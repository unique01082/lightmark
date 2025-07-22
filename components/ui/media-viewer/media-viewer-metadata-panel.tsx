interface MediaViewerMetadataPanelProps {
  showInfo: boolean;
  metadata?: Record<string, any>;
  imageSizeInfo: string;
  zoomPercentage: number;
}

export function MediaViewerMetadataPanel({
  showInfo,
  metadata,
  imageSizeInfo,
  zoomPercentage,
}: MediaViewerMetadataPanelProps) {
  if (!showInfo || !metadata) return null;

  return (
    <div className="w-80 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white">
      <h3 className="font-semibold mb-3 cursor-move" data-drag-handle>
        Image Information
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-300">Dimensions:</span>
          <span>{imageSizeInfo}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Zoom:</span>
          <span>{zoomPercentage}%</span>
        </div>
        {Object.entries(metadata).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-300 capitalize">{key}:</span>
            <span>{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
