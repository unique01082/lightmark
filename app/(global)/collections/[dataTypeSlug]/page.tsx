'use client';

import {
  CollectionActions,
  CollectionHeader,
  DataItemGrid,
  EmptyState,
  LoadingState,
} from '@/app/(global)/settings/_components/data-type';
import { DataItemForm } from '@/components/forms/data-item-form';
import { MediaViewer } from '@/components/ui/media-viewer';
import { useToast } from '@/hooks/use-toast';
import { DirectusService } from '@/lib/directus';
import type { DataItem } from '@/lib/types';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import { usePageData } from './layout';

export default function CollectionPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);

  const { dataType } = usePageData();

  const {
    data: items = [],
    loading: fetchingItems,
    refreshAsync: refreshItems,
  } = useRequest(DirectusService.getDataItems, {
    defaultParams: [{ type: { _eq: dataType.id } }],
    refreshDeps: [dataType],
    ready: !!dataType,
  });

  const { loading: isCreating, runAsync: createItem } = useRequest(DirectusService.createDataItem, {
    manual: true,
    onSuccess: async (res) => {
      await refreshItems();
      toast({
        title: 'Item created successfully',
        description: `"${res.data?.title || 'Item'}" has been added to your collection.`,
      });
      setIsItemFormOpen(false);
      setEditingItem(null);
    },
    onError: (error) => {
      console.error('Error creating item:', error);
      toast({
        title: 'Error creating item',
        description: 'There was a problem creating your item. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const { toast } = useToast();

  const typedItems = items as DataItem[];
  const filteredItems = typedItems.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(item.custom_values || {}).some(
        (value) =>
          typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const openViewer = (images: string[], startIndex = 0) => {
    setViewerImages(images);
    setSelectedImageIndex(startIndex);
    setIsViewerOpen(true);
  };

  return (
    <>
      <div className="container py-6">
        {/* Header */}
        <CollectionHeader
          dataTypeName={dataType?.name}
          description={dataType?.description}
          isCreating={isCreating}
          onCreateNew={() => setIsItemFormOpen(true)}
        />

        {/* Search and Actions Bar */}
        <CollectionActions
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          dataTypeName={dataType?.name}
        />

        {/* Items Content */}
        {fetchingItems ? (
          <LoadingState dataTypeName={dataType?.name} />
        ) : filteredItems.length > 0 ? (
          <DataItemGrid
            items={filteredItems}
            viewMode={viewMode}
            dataType={dataType}
            onView={openViewer}
            onEdit={(item) => {
              setEditingItem(item);
              setIsItemFormOpen(true);
            }}
            onDelete={(item) => {
              // TODO: Implement delete functionality
              console.log('Delete item:', item);
            }}
          />
        ) : (
          <EmptyState
            searchQuery={searchQuery}
            dataTypeName={dataType?.name}
            isCreating={isCreating}
            onCreateNew={() => setIsItemFormOpen(true)}
          />
        )}
      </div>

      {/* Data Item Form */}
      <DataItemForm
        dataType={dataType}
        dataItem={editingItem || undefined}
        isOpen={isItemFormOpen}
        onClose={() => {
          setIsItemFormOpen(false);
          setEditingItem(null);
        }}
        onSave={async (item) => {
          if (editingItem) {
            // Update existing item
            console.log('Updating item:', item);
            // TODO: Implement update logic
          } else {
            // Create new item - using DirectusService DataItem format
            const newItem = {
              data_type: dataType.id,
              data: {
                title: item.title || '',
                description: item.description || '',
                custom_values: item.custom_values || {},
                avatar: item.avatar,
                gallery: item.gallery || [],
                linked_album_ids: item.linked_album_ids || [],
                slug: item.slug || item.title?.toLowerCase().replace(/\s+/g, '-') || '',
              },
            };
            console.log('Creating item:', newItem);
            await createItem(newItem);
          }
        }}
      />

      {/* Media Viewer */}
      <MediaViewer
        images={viewerImages}
        currentIndex={selectedImageIndex}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onIndexChange={setSelectedImageIndex}
      />
    </>
  );
}
