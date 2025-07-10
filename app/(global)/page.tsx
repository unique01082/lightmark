"use client";

import { DataItemForm } from "@/components/forms/data-item-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDataItems, mockDataTypes } from "@/lib/mock-data";
import type { DataType } from "@/lib/types";
import { Filter, Grid, LayoutList, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDataType, setSelectedDataType] = useState<DataType | null>(
    null
  );
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);

  return (
    <>
      <div className="container py-6">
        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search items..." className="pl-10" />
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

            <Button
              onClick={() => {
                if (mockDataTypes.length > 0) {
                  setSelectedDataType(mockDataTypes[0]);
                  setIsItemFormOpen(true);
                }
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </div>
        </div>

        {/* Tabs for Data Types */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">All ({mockDataItems.length})</TabsTrigger>
            <TabsTrigger value="color-profiles">
              Color Profile (
              {mockDataItems.filter((item) => item.type_id === "1").length})
            </TabsTrigger>
            <TabsTrigger value="presets">
              Preset (
              {mockDataItems.filter((item) => item.type_id === "2").length})
            </TabsTrigger>
            <TabsTrigger value="color-styles">
              Color Style (
              {mockDataItems.filter((item) => item.type_id === "3").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {mockDataItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockDataItems.map((item) => (
                  <Card
                    key={item.id}
                    className="group hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                      <img
                        src={
                          item.avatar || "/placeholder.svg?height=200&width=300"
                        }
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="secondary">
                          {
                            mockDataTypes.find(
                              (type) => type.id === item.type_id
                            )?.name
                          }
                        </Badge>
                        <span className="text-muted-foreground">
                          {item.gallery.length} images
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No items found"
                description="No items match your current search or filter criteria."
              />
            )}
          </TabsContent>

          <TabsContent value="color-profiles" className="space-y-4">
            <EmptyState
              title="No color profiles found"
              description="Create your first color profile to get started."
            />
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            <EmptyState
              title="No presets found"
              description="Create your first preset to get started."
            />
          </TabsContent>

          <TabsContent value="color-styles" className="space-y-4">
            <EmptyState
              title="No color styles found"
              description="Create your first color style to get started."
            />
          </TabsContent>
        </Tabs>
      </div>
      {selectedDataType && (
        <DataItemForm
          dataType={selectedDataType}
          isOpen={isItemFormOpen}
          onClose={() => {
            setIsItemFormOpen(false);
            setSelectedDataType(null);
          }}
          onSave={(item) => {
            console.log("Saving item:", item);
            // Handle save logic here
          }}
        />
      )}
    </>
  );
}
