"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataItemForm } from "@/components/forms/data-item-form";
import { MediaViewer } from "@/components/ui/media-viewer";
import {
  Search,
  Plus,
  Grid,
  LayoutList,
  Filter,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { mockDataItems } from "@/lib/mock-data";
import type { DataItem } from "@/lib/types";
import { usePageData } from "./layout";
import { useRequest } from "ahooks";
import { DirectusService } from "@/lib/directus";

export default function PresetsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);

  const { dataType } = usePageData();
  console.log("a :>> ", dataType);

  const { data: items = [], loading: fetchingItems } = useRequest(
    DirectusService.getDataItems,
    {
      defaultParams: [{ type: { _eq: dataType.id } }],
      refreshDeps: [dataType],
      ready: !!dataType,
    }
  );

  console.log("items :>> ", items);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openViewer = (images: string[], startIndex = 0) => {
    setViewerImages(images);
    setSelectedImageIndex(startIndex);
    setIsViewerOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        <aside className="hidden md:block border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Sidebar />
        </aside>

        <main className="flex-1">
          <div className="container py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Presets</h1>
                <p className="text-muted-foreground">
                  Lightroom and photo editing presets
                </p>
              </div>
              <Button onClick={() => setIsItemFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Preset
              </Button>
            </div>

            {/* Search and Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search presets..."
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

            {/* Items Grid/List */}
            {filteredItems.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="group hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
                      <img
                        src={
                          item.avatar
                            ? DirectusService.getAssetUrl(item.avatar)
                            : "/placeholder.svg?height=200&width=300"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              item.gallery.length > 0 &&
                              openViewer(item.gallery)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setEditingItem(item);
                              setIsItemFormOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="space-y-2">
                        {false &&
                          Object.entries(item.custom_values).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-muted-foreground">
                                  {key}:
                                </span>
                                <span className="font-medium">
                                  {Array.isArray(value) ? (
                                    <div className="flex gap-1">
                                      {value.slice(0, 2).map((tag, i) => (
                                        <Badge
                                          key={i}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                      {value.length > 2 && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          +{value.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    String(value)
                                  )}
                                </span>
                              </div>
                            )
                          )}
                      </div>
                      <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t">
                        <Badge variant="secondary">{dataType.name}</Badge>
                        <span className="text-muted-foreground">
                          {0} images
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 p-3 rounded-full bg-muted">
                  <Filter className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No presets found</h3>
                <p className="text-muted-foreground max-w-sm mb-4">
                  {searchQuery
                    ? "No presets match your search criteria."
                    : "Create your first preset to get started."}
                </p>
                <Button onClick={() => setIsItemFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Preset
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />

      {/* Data Item Form */}
      <DataItemForm
        dataType={dataType}
        dataItem={editingItem}
        isOpen={isItemFormOpen}
        onClose={() => {
          setIsItemFormOpen(false);
          setEditingItem(null);
        }}
        onSave={(item) => {
          console.log("Saving preset:", item);
          // Handle save logic here
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
    </div>
  );
}
