"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MediaViewer } from "@/components/ui/media-viewer";
import { DirectusService } from "@/lib/directus";
import { useRequest } from "ahooks";
import { ArrowLeft, Edit, ExternalLink, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

export default function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: album } = useRequest(DirectusService.getAlbum, {
    defaultParams: [id],
    refreshDeps: [id],
  });

  console.log("album :>> ", album);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openViewer = (index: number) => {
    setSelectedImageIndex(index);
    setIsViewerOpen(true);
  };

  if (!album) {
    return (
      <div className="container py-6">
        <p className="text-muted-foreground">Loading album details...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/albums">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{album.name}</h1>
            <p className="text-muted-foreground">
              by {album.author ?? "Unknown"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Album Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{album.description}</p>
                  </div>

                  {album.links.length && (
                    <div className="flex flex-col space-y-2">
                      <h3 className="font-semibold mb-2">External Link</h3>
                      {album.links.map((link) => (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex gap-2 items-center text-primary hover:underline"
                        >
                          <Badge variant="secondary">{link.type}</Badge>
                          {link.url}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{album.photos.length} photos</span>
                    <span>•</span>
                    <span>
                      Created{" "}
                      {new Date(album.date_created).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photos Gallery */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Photos</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Photos
                </Button>
              </div>

              {album.photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {album.photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="aspect-square overflow-hidden rounded-lg cursor-pointer group"
                      onClick={() => openViewer(index)}
                    >
                      <img
                        src={
                          photo.directus_files_id
                            ? DirectusService.getAssetUrl(
                                photo.directus_files_id
                              )
                            : "/placeholder.svg"
                        }
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                  <p className="text-muted-foreground mb-4">
                    No photos in this album yet
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Photo
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Linked Items */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Linked Items</h3>
                {album.items.length > 0 ? (
                  <div className="space-y-3">
                    {album.items.map(({ data_items_id: item }) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <Badge variant="secondary">{item.type}</Badge>
                          <a
                            href={`/collections/${item.type}/${item.id}`}
                            className="inline-flex gap-2 items-center text-primary hover:underline"
                          >
                            {item.name}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No linked items
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">urban</Badge>
                  <Badge variant="secondary">architecture</Badge>
                  <Badge variant="secondary">city</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <MediaViewer
        images={album.photos.map((photo) =>
          DirectusService.getAssetUrl(photo.directus_files_id, "")
        )}
        currentIndex={selectedImageIndex}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onIndexChange={setSelectedImageIndex}
        metadata={album.photos[selectedImageIndex]?.metadata}
      />
    </>
  );
}
