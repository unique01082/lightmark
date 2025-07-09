"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MediaViewer } from "@/components/ui/media-viewer"
import { DataItemForm } from "@/components/forms/data-item-form"
import { ArrowLeft, Edit, Trash2, Share, Download, ExternalLink, LinkIcon } from "lucide-react"
import { mockDataTypes, mockDataItems, mockAlbums } from "@/lib/mock-data"
import Link from "next/link"

export default function ItemDetailPage({ params }: { params: { type: string; slug: string } }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)

  // Mock data - in real app, fetch based on params
  const dataType = mockDataTypes.find((type) => type.slug === params.type)
  const item = mockDataItems.find((item) => item.slug === params.slug)
  const linkedAlbums = mockAlbums.filter((album) => item?.linked_album_ids.includes(album.id))

  if (!dataType || !item) {
    return <div>Item not found</div>
  }

  const openViewer = (index: number) => {
    setSelectedImageIndex(index)
    setIsViewerOpen(true)
  }

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
            <div className="flex items-center gap-4 mb-6">
              <Link href={`/${params.type}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">{dataType.name}</Badge>
                </div>
                <h1 className="text-3xl font-bold">{item.title}</h1>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditFormOpen(true)}>
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
                {/* Hero Image */}
                {item.avatar && (
                  <div className="aspect-[16/9] overflow-hidden rounded-lg">
                    <img
                      src={item.avatar || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => openViewer(0)}
                    />
                  </div>
                )}

                {/* Custom Fields */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(item.custom_values).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <h4 className="font-medium text-sm text-muted-foreground">{key}</h4>
                          <div className="text-sm">
                            {Array.isArray(value) ? (
                              <div className="flex flex-wrap gap-1">
                                {value.map((tag, i) => (
                                  <Badge key={i} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            ) : typeof value === "string" && value.startsWith("http") ? (
                              <a
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-primary hover:underline"
                              >
                                <LinkIcon className="h-3 w-3 mr-1" />
                                {value}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            ) : (
                              <p>{String(value)}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Gallery */}
                {item.gallery.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Gallery ({item.gallery.length})</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {item.gallery.map((image, index) => (
                          <div
                            key={index}
                            className="aspect-square overflow-hidden rounded-lg cursor-pointer group"
                            onClick={() => openViewer(index)}
                          >
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Metadata */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="secondary">{dataType.name}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Updated:</span>
                        <span>{new Date(item.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Images:</span>
                        <span>{item.gallery.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Linked Albums */}
                {linkedAlbums.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Linked Albums</h3>
                      <div className="space-y-3">
                        {linkedAlbums.map((album) => (
                          <Link key={album.id} href={`/albums/${album.id}`}>
                            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                              <img
                                src={album.cover_image || "/placeholder.svg?height=40&width=40"}
                                alt={album.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{album.name}</p>
                                <p className="text-sm text-muted-foreground">by {album.author}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download Files
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Share className="h-4 w-4 mr-2" />
                        Share Item
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* Media Viewer */}
      <MediaViewer
        images={[item.avatar, ...item.gallery].filter(Boolean) as string[]}
        currentIndex={selectedImageIndex}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onIndexChange={setSelectedImageIndex}
      />

      {/* Edit Form */}
      <DataItemForm
        dataType={dataType}
        dataItem={item}
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSave={(updatedItem) => {
          console.log("Updating item:", updatedItem)
          // Handle update logic here
        }}
      />
    </div>
  )
}
