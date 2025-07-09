"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from "lucide-react"
import type { Album } from "@/lib/types"

interface AlbumFormProps {
  album?: Album
  isOpen: boolean
  onClose: () => void
  onSave: (album: Partial<Album>) => void
}

export function AlbumForm({ album, isOpen, onClose, onSave }: AlbumFormProps) {
  const [formData, setFormData] = useState({
    name: album?.name || "",
    author: album?.author || "",
    link: album?.link || "",
    description: album?.description || "",
    cover_image: album?.cover_image || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
    })
    onClose()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, upload to storage and get URL
      const imageUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, cover_image: imageUrl }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{album ? "Edit Album" : "Create New Album"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Album Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Urban Photography Collection"
                required
              />
            </div>

            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="Photographer name"
                required
              />
            </div>

            <div>
              <Label htmlFor="link">External Link (Optional)</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                placeholder="https://example.com/portfolio"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your album..."
                rows={4}
              />
            </div>

            <div>
              <Label>Cover Image</Label>
              <div className="mt-2">
                {formData.cover_image ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.cover_image || "/placeholder.svg"}
                      alt="Cover"
                      className="w-32 h-24 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2"
                      onClick={() => setFormData((prev) => ({ ...prev, cover_image: "" }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Upload a cover image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="cover-upload"
                    />
                    <Button type="button" variant="outline" size="sm" asChild>
                      <label htmlFor="cover-upload" className="cursor-pointer">
                        Choose Image
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{album ? "Update" : "Create"} Album</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
