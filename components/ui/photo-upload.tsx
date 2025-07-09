"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, X, Check } from "lucide-react"

interface PhotoUploadProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (photos: { file: File; tags: string[] }[]) => void
  albumId?: string
}

interface UploadFile {
  file: File
  preview: string
  tags: string[]
  uploaded: boolean
  progress: number
}

export function PhotoUpload({ isOpen, onClose, onUpload, albumId }: PhotoUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    addFiles(droppedFiles)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    addFiles(selectedFiles)
  }

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      tags: [],
      uploaded: false,
      progress: 0,
    }))
    setFiles((prev) => [...prev, ...uploadFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const addTag = (index: number, tag: string) => {
    if (!tag.trim()) return
    setFiles((prev) =>
      prev.map((file, i) =>
        i === index && !file.tags.includes(tag.trim()) ? { ...file, tags: [...file.tags, tag.trim()] } : file,
      ),
    )
  }

  const removeTag = (fileIndex: number, tagIndex: number) => {
    setFiles((prev) =>
      prev.map((file, i) => (i === fileIndex ? { ...file, tags: file.tags.filter((_, ti) => ti !== tagIndex) } : file)),
    )
  }

  const handleUpload = async () => {
    setUploading(true)

    // Simulate upload progress
    for (let i = 0; i < files.length; i++) {
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 50))
        setFiles((prev) => prev.map((file, index) => (index === i ? { ...file, progress } : file)))
      }
      setFiles((prev) => prev.map((file, index) => (index === i ? { ...file, uploaded: true } : file)))
    }

    // Call the upload callback
    onUpload(files.map(({ file, tags }) => ({ file, tags })))
    setUploading(false)
    onClose()
    setFiles([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Photos {albumId && "to Album"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Drop photos here or click to browse</h3>
            <p className="text-muted-foreground mb-4">Support for JPG, PNG, WebP files</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="photo-upload"
            />
            <Button variant="outline" asChild>
              <label htmlFor="photo-upload" className="cursor-pointer">
                Choose Photos
              </label>
            </Button>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Photos to Upload ({files.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt={file.file.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        {uploading && (
                          <div className="mt-2">
                            <Progress value={file.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">{file.progress}%</p>
                          </div>
                        )}
                        {file.uploaded && (
                          <div className="flex items-center gap-1 mt-2 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-sm">Uploaded</span>
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)} disabled={uploading}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <Label className="text-sm">Tags</Label>
                      <div className="flex flex-wrap gap-1 mt-1 mb-2">
                        {file.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                            <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeTag(index, tagIndex)} />
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Add tags (press Enter)"
                        size="sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            const input = e.target as HTMLInputElement
                            addTag(index, input.value)
                            input.value = ""
                          }
                        }}
                        disabled={uploading}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={files.length === 0 || uploading}>
              {uploading ? "Uploading..." : `Upload ${files.length} Photo${files.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
