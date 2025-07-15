'use client';

import { AlbumForm } from '@/components/forms/album-form';
import { MediaViewer } from '@/components/ui/media-viewer';
import { PhotoUpload } from '@/components/ui/photo-upload';
import { DirectusService } from '@/lib/directus';
import { useState } from 'react';
import { AlbumHeader } from './_components/album-header';
import { AlbumInfo } from './_components/album-info';
import { AlbumTags } from './_components/album-tags';
import { DeleteConfirmationDialog } from './_components/delete-confirmation-dialog';
import { LinkedItems } from './_components/linked-items';
import { PhotoGallery } from './_components/photo-gallery';
import { usePageData } from './layout';

export default function AlbumDetailPage() {
  const { album, updateAlbum, handlePhotoUpload } = usePageData();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);

  const openViewer = (index: number) => {
    setSelectedImageIndex(index);
    setIsViewerOpen(true);
  };

  const handleAlbumUpdate = async (albumData: any) => {
    await updateAlbum(albumData);
    setIsEditDialogOpen(false);
  };

  const handlePhotoUploadComplete = async (photos: { file: File; tags: string[] }[]) => {
    await handlePhotoUpload(photos);
    setIsPhotoUploadOpen(false);
  };

  return (
    <>
      <div className="container py-6">
        {/* Header */}
        <AlbumHeader
          onEdit={() => setIsEditDialogOpen(true)}
          onDelete={() => setIsDeleteDialogOpen(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Album Info */}
            <AlbumInfo />

            {/* Photos Gallery */}
            <PhotoGallery
              onPhotoUpload={() => setIsPhotoUploadOpen(true)}
              onOpenViewer={openViewer}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Linked Items */}
            <LinkedItems />

            {/* Tags */}
            <AlbumTags />
          </div>
        </div>
      </div>

      {/* Media Viewer */}
      <MediaViewer
        images={album.photos.map((photo) =>
          DirectusService.getAssetUrl(photo.directus_files_id, ''),
        )}
        currentIndex={selectedImageIndex}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onIndexChange={setSelectedImageIndex}
        metadata={album.photos[selectedImageIndex]?.metadata}
      />

      {/* Edit Album Dialog */}
      <AlbumForm
        album={album as any}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleAlbumUpdate}
      />

      {/* Photo Upload Dialog */}
      <PhotoUpload
        isOpen={isPhotoUploadOpen}
        onClose={() => setIsPhotoUploadOpen(false)}
        onUpload={handlePhotoUploadComplete}
        albumId={album.id}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog isOpen={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
    </>
  );
}
