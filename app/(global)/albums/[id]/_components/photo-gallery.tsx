'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DirectusService } from '@/lib/directus';
import { Download, Eye, Plus, Trash2 } from 'lucide-react';
import { usePageData } from '../layout';

interface PhotoGalleryProps {
  onPhotoUpload: () => void;
  onOpenViewer: (index: number) => void;
}

export function PhotoGallery({ onPhotoUpload, onOpenViewer }: PhotoGalleryProps) {
  const {
    album,
    isUploading,
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    downloadPhoto,
    removePhotoFromAlbum,
  } = usePageData();
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative transition-all duration-200 ${
        isDragOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg p-4' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Photos</h3>
        <Button size="sm" onClick={onPhotoUpload} disabled={isUploading}>
          <Plus className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Add Photos'}
        </Button>
      </div>

      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-10 bg-blue-100/80 border-2 border-blue-400 border-dashed rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Plus className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <p className="text-lg font-semibold text-blue-800">Drop photos here to upload</p>
            <p className="text-sm text-blue-600">Supported formats: JPG, PNG, GIF, WebP</p>
          </div>
        </div>
      )}

      {album.photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {album.photos.map((photo, index: number) => (
            <div
              key={photo.id}
              className="aspect-square overflow-hidden rounded-lg cursor-pointer group relative border-2 border-transparent hover:border-blue-300 transition-all duration-200"
              title="Click to view full size"
              onClick={() => onOpenViewer(index)}
            >
              <img
                src={
                  photo.directus_files_id
                    ? DirectusService.getAssetUrl(photo.directus_files_id)
                    : '/placeholder.svg'
                }
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onClick={() => onOpenViewer(index)}
                title="Click to view full size"
              />

              {/* Hover overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenViewer(index);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadPhoto(photo);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhotoFromAlbum(index);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Photo info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-white text-xs">
                  {photo.tags && photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {photo.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs py-0 px-1">
                          {tag}
                        </Badge>
                      ))}
                      {photo.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs py-0 px-1">
                          +{photo.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg relative">
          <p className="text-muted-foreground mb-4">No photos in this album yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop photos here or click the button below
          </p>
          <Button onClick={onPhotoUpload} disabled={isUploading}>
            <Plus className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Add Your First Photo'}
          </Button>
        </div>
      )}
    </div>
  );
}
