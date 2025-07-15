'use client';

import { DataItemForm } from '@/components/forms/data-item-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicFieldRenderer } from '@/components/ui/dynamic-field-renderer';
import { MediaViewer } from '@/components/ui/media-viewer';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { DirectusService } from '@/lib/directus';
import { useRequest } from 'ahooks';
import { ArrowLeft, Calendar, Download, Edit, Share, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { use, useState } from 'react';
import { usePageData } from '../layout';

interface DataItemDetailPageProps {
  params: Promise<{
    dataTypeSlug: string;
    slug: string;
  }>;
}

export default function DataItemDetailPage({ params }: DataItemDetailPageProps) {
  const { dataTypeSlug, slug } = use(params);
  const { dataType } = usePageData();
  const { toast } = useToast();

  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const {
    data: dataItem,
    loading,
    refreshAsync: refreshItem,
  } = useRequest(DirectusService.getDataItem, {
    defaultParams: [slug],
  });

  const { loading: isUpdating, runAsync: updateItem } = useRequest(DirectusService.updateDataItem, {
    manual: true,
    onSuccess: async () => {
      await refreshItem();
      toast({
        title: 'Item updated successfully',
        description: `"${dataItem?.name || 'Item'}" has been updated.`,
      });
      setIsEditFormOpen(false);
    },
  });

  const { loading: isDeleting, runAsync: deleteItem } = useRequest(DirectusService.deleteDataItem, {
    manual: true,
    onSuccess: () => {
      toast({
        title: 'Item deleted successfully',
        description: `"${dataItem?.name || 'Item'}" has been removed.`,
      });
      // Redirect back to collection
      window.location.href = `/collections/${dataTypeSlug}`;
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading item...</p>
        </div>
      </div>
    );
  }

  if (!dataItem || dataItem.type !== dataTypeSlug) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Item not found</h2>
          <p className="text-muted-foreground mb-4">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href={`/collections/${dataTypeSlug}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collection
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const openViewer = (index: number) => {
    setSelectedImageIndex(index);
    setIsViewerOpen(true);
  };

  const handleSave = async (updatedItem: any) => {
    try {
      await updateItem(dataItem.id, updatedItem);
    } catch (error) {
      console.error('Failed to update item:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update the item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await deleteItem(dataItem.id);
      } catch (error) {
        console.error('Failed to delete item:', error);
        toast({
          title: 'Delete failed',
          description: 'Failed to delete the item. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  // Get all images for viewer
  const allImages = [
    ...(dataItem.avatar ? [DirectusService.getAssetUrl(dataItem.avatar)] : []),
    // Add gallery images if they exist
    // ...(dataItem.gallery || []).map(img => DirectusService.getAssetUrl(img))
  ].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/collections/${dataTypeSlug}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {dataType.name}
              </Link>
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsEditFormOpen(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} disabled={isDeleting}>
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <div className="flex items-start gap-4">
              {dataItem.avatar && (
                <Avatar className="w-20 h-20 cursor-pointer" onClick={() => openViewer(0)}>
                  <AvatarImage
                    src={DirectusService.getAssetUrl(dataItem.avatar)}
                    alt={dataItem.name}
                  />
                  <AvatarFallback className="text-2xl">{dataItem.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{dataType.name}</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">{dataItem.name}</h1>
                <p className="text-muted-foreground">{dataItem.description}</p>
              </div>
            </div>

            {/* Dynamic Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dataType.fields.map((field, index) => (
                    <div key={field.id}>
                      <DynamicFieldRenderer
                        field={field}
                        value={dataItem.fields?.[field.id]}
                        isReadOnly={true}
                      />
                      {index < dataType.fields.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Created: {new Date(dataItem.date_created).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Updated: {new Date(dataItem.date_updated).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Albums */}
            {dataItem.albums && dataItem.albums.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Albums</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {dataItem.albums.map((albumId) => (
                      <Link key={albumId} href={`/albums/${albumId}`}>
                        <Badge variant="outline">Album {albumId}</Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Media Viewer */}
      {allImages.length > 0 && (
        <MediaViewer
          images={allImages}
          currentIndex={selectedImageIndex}
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          onIndexChange={setSelectedImageIndex}
        />
      )}

      {/* Edit Form */}
      <DataItemForm
        dataType={dataType}
        dataItem={dataItem}
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
