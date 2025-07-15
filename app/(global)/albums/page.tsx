"use client";

import { AlbumForm } from "@/components/forms/album-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DirectusService } from "@/lib/directus";
import { useRequest } from "ahooks";
import {
  Filter,
  FolderOpen,
  Grid,
  LayoutList,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AlbumsPage() {
  const [isAlbumFormOpen, setIsAlbumFormOpen] = useState(false);
  const {
    data: albums = [],
    loading,
    refreshAsync: refreshAlbums,
  } = useRequest(DirectusService.getAlbums);
  console.log("albums :>> ", albums);

  const { loading: isCreating, runAsync: createAlbum } = useRequest(
    DirectusService.createAlbum,
    {
      manual: true,
      onSuccess: async (res) => {
        await refreshAlbums();

        toast({
          title: "Album created successfully",
          description: `"${res.name}" has been added to your collection.`,
        });
        setIsAlbumFormOpen(false);
      },
      onError: (error) => {
        console.error("Error creating album:", error);
        toast({
          title: "Error creating album",
          description:
            "There was a problem creating your album. Please try again.",
          variant: "destructive",
        });
      },
    }
  );

  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlbums = albums.filter(
    (album) =>
      album.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAlbum = async (albumData: any) => {
    console.log("albumData :>> ", albumData);
    const newAlbum = {
      name: albumData.name,
      author: albumData.author,
      links: albumData.links || [],
      description: albumData.description || "",
      slug: albumData.slug || albumData.name.toLowerCase().replace(/\s+/g, "-"),
      avatar: albumData.avatar,
      photo_ids: [],
      linked_item_ids: [],
    };

    await createAlbum(newAlbum);
  };

  return (
    <>
      <div className="container py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Albums</h1>
            <p className="text-muted-foreground">
              Organize your photography collections
            </p>
          </div>
          <Button
            onClick={() => setIsAlbumFormOpen(true)}
            disabled={isCreating}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isCreating ? "Creating..." : "Create Album"}
          </Button>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search albums..."
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
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Albums Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading albums...</p>
            </div>
          </div>
        ) : filteredAlbums.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredAlbums.map((album) => (
              <Link key={album.id} href={`/albums/${album.id}`}>
                <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                    <img
                      src={
                        album.avatar
                          ? DirectusService.getAssetUrl(album.avatar)
                          : "/placeholder.svg?height=300&width=400"
                      }
                      alt={album.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {album.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {album.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        by {album.author ?? "Unknown"}
                      </span>
                      <Badge variant="secondary">
                        {album.photos?.length || 0} photos
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 p-3 rounded-full bg-muted">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No albums found</h3>
            <p className="text-muted-foreground max-w-sm mb-4">
              {searchQuery
                ? "No albums match your search criteria."
                : "Create your first album to get started organizing your photography collections."}
            </p>
            <Button
              onClick={() => setIsAlbumFormOpen(true)}
              disabled={isCreating}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Album
            </Button>
          </div>
        )}
      </div>
      <AlbumForm
        isOpen={isAlbumFormOpen}
        onClose={() => setIsAlbumFormOpen(false)}
        onSave={handleCreateAlbum}
      />
    </>
  );
}
