'use client';

import { Button } from '@/components/ui/button';
import { Filter, Plus } from 'lucide-react';

interface EmptyStateProps {
  searchQuery: string;
  dataTypeName?: string;
  isCreating?: boolean;
  onCreateNew: () => void;
}

export function EmptyState({
  searchQuery,
  dataTypeName,
  isCreating,
  onCreateNew,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 p-3 rounded-full bg-muted">
        <Filter className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        No {dataTypeName?.toLowerCase() || 'items'} found
      </h3>
      <p className="text-muted-foreground max-w-sm mb-4">
        {searchQuery
          ? `No ${dataTypeName?.toLowerCase() || 'items'} match your search criteria.`
          : `Create your first ${dataTypeName?.toLowerCase() || 'item'} to get started.`}
      </p>
      <Button onClick={onCreateNew} disabled={isCreating}>
        <Plus className="h-4 w-4 mr-2" />
        Create Your First {dataTypeName || 'Item'}
      </Button>
    </div>
  );
}
