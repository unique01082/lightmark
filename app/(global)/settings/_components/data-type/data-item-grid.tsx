'use client';

import type { DataItem } from '@/lib/types';
import { DataItemCard } from './data-item-card';

interface DataItemGridProps {
  items: DataItem[];
  viewMode: 'grid' | 'list';
  dataType: any;
  onView: (images: string[], startIndex?: number) => void;
  onEdit: (item: DataItem) => void;
  onDelete: (item: DataItem) => void;
}

export function DataItemGrid({
  items,
  viewMode,
  dataType,
  onView,
  onEdit,
  onDelete,
}: DataItemGridProps) {
  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }
    >
      {items.map((item) => (
        <DataItemCard
          key={item.id}
          item={item}
          dataType={dataType}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
