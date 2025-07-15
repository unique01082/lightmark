'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CollectionHeaderProps {
  dataTypeName?: string;
  description?: string;
  isCreating?: boolean;
  onCreateNew: () => void;
}

export function CollectionHeader({
  dataTypeName,
  description,
  isCreating,
  onCreateNew,
}: CollectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">{dataTypeName || 'Collection'}</h1>
        <p className="text-muted-foreground">{description || 'Manage your collection items'}</p>
      </div>
      <Button onClick={onCreateNew} disabled={isCreating}>
        <Plus className="h-4 w-4 mr-2" />
        {isCreating ? 'Creating...' : `Add New ${dataTypeName || 'Item'}`}
      </Button>
    </div>
  );
}
