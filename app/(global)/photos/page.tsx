'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MediaViewer } from '@/components/ui/media-viewer';
import { PhotoUpload } from '@/components/ui/photo-upload';
import { mockPhotos } from '@/lib/mock-data';
import { Filter, Grid, LayoutList, Search, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

export default function PhotosPage() {
  // const {} = useRequest(DirectusService.getPhotos, {});

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const filteredPhotos = mockPhotos.filter((photo) =>
    photo.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const openViewer = (index: number) => {
    setSelectedImageIndex(index);
    setIsViewerOpen(true);
  };

  return (
    <>
      <div className="container py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Photos</h1>
            <p className="text-muted-foreground">Manage and organize your photography collection</p>
          </div>
          <Button onClick={() => setIsUploadOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Photos
          </Button>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by tags..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>

            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                onClick={() => openViewer(index)}
              >
                <img
                  src={photo.file || '/placeholder.svg'}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-wrap gap-1">
                    {photo.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {photo.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{photo.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 p-3 rounded-full bg-muted">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No photos found</h3>
            <p className="text-muted-foreground max-w-sm mb-4">
              {searchQuery
                ? 'No photos match your search criteria.'
                : 'Upload your first photos to get started.'}
            </p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Your First Photos
            </Button>
          </div>
        )}
      </div>
      <PhotoUpload
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={(photos) => {
          console.log('Uploading photos:', photos);
          // Handle upload logic here
        }}
      />
      {/* Media Viewer */}
      <MediaViewer
        images={filteredPhotos.map((photo) => photo.file)}
        currentIndex={selectedImageIndex}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onIndexChange={setSelectedImageIndex}
        metadata={filteredPhotos[selectedImageIndex]?.metadata}
      />
    </>
  );
}
