'use client';

import { useToast } from '@/hooks/use-toast';
import { DirectusService } from '@/lib/directus';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, use, useContext, useState } from 'react';

type SharedState = {
  album: any;
  refreshAlbum: () => ReturnType<typeof DirectusService.getAlbum>;
  getAllTags: () => string[];
  getAlbumStats: () => { totalPhotos: number; totalTags: number; totalSize: number };
  downloadPhoto: (photo: any) => void;
  removePhotoFromAlbum: (photoIndex: number) => Promise<void>;
  updateAlbum: (albumData: any) => Promise<any>;
  deleteAlbum: () => Promise<any>;
  handlePhotoUpload: (photos: { file: File; tags: string[] }[]) => Promise<void>;
  isUploading: boolean;
  isDeleting: boolean;
  isDragOver: boolean;
  setIsDragOver: (value: boolean) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
};

const SharedStateContext = createContext<SharedState | undefined>(undefined);

export function usePageData() {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error('usePageData must be used within SharedStateProvider');
  }
  return context;
}

// Layout component that provides the shared state
export default function Layout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: ReactNode;
}) {
  const { id } = use(params);
  const { toast } = useToast();
  const router = useRouter();

  // State for drag and drop
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data: album, refreshAsync: refreshAlbum } = useRequest(DirectusService.getAlbum, {
    defaultParams: [id],
    refreshDeps: [id],
  });

  const { runAsync: updateAlbum } = useRequest(
    (albumData) => DirectusService.updateAlbum(id, albumData),
    {
      manual: true,
      onSuccess: () => {
        toast({
          title: 'Album updated',
          description: 'The album has been successfully updated.',
        });
        refreshAlbum();
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to update album. Please try again.',
          variant: 'destructive',
        });
      },
    },
  );

  const { loading: isDeleting, runAsync: deleteAlbum } = useRequest(
    () => DirectusService.deleteAlbum(id),
    {
      manual: true,
      onSuccess: () => {
        toast({
          title: 'Album deleted',
          description: 'The album has been successfully deleted.',
        });
        router.push('/albums');
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to delete album. Please try again.',
          variant: 'destructive',
        });
      },
    },
  );

  const handlePhotoUpload = async (photos: { file: File; tags: string[] }[]) => {
    setIsUploading(true);
    try {
      const uploadPromises = photos.map(({ file, tags }) => DirectusService.uploadFile(file));

      const uploadedFiles = await Promise.all(uploadPromises);

      // Add uploaded photos to the album
      await DirectusService.updateAlbum(id, {
        photos: [...album!.photos, ...uploadedFiles.map((file: any, idx: number) => file.id)].map(
          (fileId: string, idx: number) =>
            typeof fileId === 'string'
              ? {
                  directus_files_id: fileId,
                }
              : fileId,
        ),
      });

      toast({
        title: 'Photos uploaded',
        description: `Successfully uploaded ${photos.length} photo(s) to the album.`,
      });

      refreshAlbum(); // Refresh the album data to show new photos
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload photos. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removePhotoFromAlbum = async (photoIndex: number) => {
    try {
      const updatedPhotos = album!.photos.filter((_, index) => index !== photoIndex);
      await DirectusService.updateAlbum(id, {
        photos: updatedPhotos,
      });

      toast({
        title: 'Photo removed',
        description: 'The photo has been removed from the album.',
      });

      refreshAlbum();
    } catch (error) {
      console.error('Remove photo error:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove photo from album. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      toast({
        title: 'Photos dropped',
        description: `Uploading ${imageFiles.length} photo(s)...`,
      });

      // Convert to the format expected by handlePhotoUpload
      const photosToUpload = imageFiles.map((file) => ({
        file,
        tags: [] as string[],
      }));
      handlePhotoUpload(photosToUpload);
    } else if (files.length > 0) {
      toast({
        title: 'Invalid files',
        description: 'Please drop only image files (JPG, PNG, GIF, WebP).',
        variant: 'destructive',
      });
    }
  };

  // Extract all unique tags from photos in the album
  const getAllTags = (): string[] => {
    if (!album?.photos) return [];

    const allTags: string[] = [];
    album.photos.forEach((photo) => {
      if (Array.isArray(photo.tags)) {
        photo.tags.forEach((tag) => {
          if (typeof tag === 'string') {
            allTags.push(tag);
          }
        });
      }
    });
    return [...new Set(allTags)]; // Remove duplicates
  };

  const getAlbumStats = () => {
    if (!album?.photos) return { totalPhotos: 0, totalTags: 0, totalSize: 0 };

    const totalPhotos = album.photos.length;
    const totalTags = getAllTags().length;
    // This would need to be calculated from actual file metadata
    const totalSize = 0; // placeholder

    return { totalPhotos, totalTags, totalSize };
  };

  const downloadPhoto = (photo: any) => {
    const url = DirectusService.getAssetUrl(photo.directus_files_id);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = `photo-${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!album) {
    return (
      <div className="container py-6">
        <p className="text-muted-foreground">Loading album details...</p>
      </div>
    );
  }

  return (
    <SharedStateContext.Provider
      value={{
        album,
        refreshAlbum,
        getAllTags,
        getAlbumStats,
        downloadPhoto,
        removePhotoFromAlbum,
        updateAlbum,
        deleteAlbum,
        handlePhotoUpload,
        isUploading,
        isDeleting,
        isDragOver,
        setIsDragOver,
        handleDragOver,
        handleDragLeave,
        handleDrop,
      }}
    >
      {children}
    </SharedStateContext.Provider>
  );
}
