'use client';

interface LoadingStateProps {
  dataTypeName?: string;
}

export function LoadingState({ dataTypeName }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading {dataTypeName?.toLowerCase() || 'items'}...</p>
      </div>
    </div>
  );
}
