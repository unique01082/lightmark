"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, X } from "lucide-react"
import { format } from "date-fns"
import type { DataType, DataItem, CustomField } from "@/lib/types"

interface DataItemFormProps {
  dataType: DataType
  dataItem?: DataItem
  isOpen: boolean
  onClose: () => void
  onSave: (dataItem: Partial<DataItem>) => void
}

export function DataItemForm({ dataType, dataItem, isOpen, onClose, onSave }: DataItemFormProps) {
  const [formData, setFormData] = useState({
    title: dataItem?.title || "",
    description: dataItem?.description || "",
    custom_values: dataItem?.custom_values || {},
    gallery: dataItem?.gallery || [],
  })

  const renderCustomField = (field: CustomField) => {
    const value = formData.custom_values[field.name] || ""

    switch (field.field_type) {
      case "string":
        return (
          <Input
            value={value}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                custom_values: { ...prev.custom_values, [field.name]: e.target.value },
              }))
            }
            required={field.required}
          />
        )

      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                custom_values: { ...prev.custom_values, [field.name]: e.target.value },
              }))
            }
            required={field.required}
          />
        )

      case "dropdown":
        return (
          <Select
            value={value}
            onValueChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                custom_values: { ...prev.custom_values, [field.name]: val },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "tags":
        const tags = Array.isArray(value) ? value : []
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      const newTags = tags.filter((_, i) => i !== index)
                      setFormData((prev) => ({
                        ...prev,
                        custom_values: { ...prev.custom_values, [field.name]: newTags },
                      }))
                    }}
                  />
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Type and press Enter to add tags"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  const input = e.target as HTMLInputElement
                  const newTag = input.value.trim()
                  if (newTag && !tags.includes(newTag)) {
                    setFormData((prev) => ({
                      ...prev,
                      custom_values: { ...prev.custom_values, [field.name]: [...tags, newTag] },
                    }))
                    input.value = ""
                  }
                }
              }}
            />
          </div>
        )

      case "datetime":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    custom_values: { ...prev.custom_values, [field.name]: date?.toISOString() },
                  }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )

      case "link":
        return (
          <Input
            type="url"
            value={value}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                custom_values: { ...prev.custom_values, [field.name]: e.target.value },
              }))
            }
            placeholder="https://example.com"
            required={field.required}
          />
        )

      default:
        return (
          <Textarea
            value={value}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                custom_values: { ...prev.custom_values, [field.name]: e.target.value },
              }))
            }
            required={field.required}
            rows={3}
          />
        )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      type_id: dataType.id,
      slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dataItem ? `Edit ${dataType.name}` : `Create New ${dataType.name}`}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          {dataType.fields.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Custom Fields</h3>
              {dataType.fields.map((field) => (
                <div key={field.id}>
                  <Label>
                    {field.name}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderCustomField(field)}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Gallery Images</Label>
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
            </div>
            {formData.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {formData.gallery.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          gallery: prev.gallery.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {dataItem ? "Update" : "Create"} {dataType.name}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
