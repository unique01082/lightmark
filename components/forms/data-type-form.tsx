"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, X, GripVertical } from "lucide-react"
import type { DataType, CustomField } from "@/lib/types"

interface DataTypeFormProps {
  dataType?: DataType
  isOpen: boolean
  onClose: () => void
  onSave: (dataType: Partial<DataType>) => void
}

const fieldTypes = [
  { value: "string", label: "Text" },
  { value: "number", label: "Number" },
  { value: "link", label: "Link" },
  { value: "datetime", label: "Date & Time" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "file", label: "File" },
  { value: "tags", label: "Tags" },
  { value: "dropdown", label: "Dropdown" },
  { value: "radio", label: "Radio Button" },
]

export function DataTypeForm({ dataType, isOpen, onClose, onSave }: DataTypeFormProps) {
  const [formData, setFormData] = useState({
    name: dataType?.name || "",
    description: dataType?.description || "",
    fields: dataType?.fields || [],
  })

  const addField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      name: "",
      field_type: "string",
      required: false,
      order: formData.fields.length,
    }
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }))
  }

  const updateField = (index: number, updates: Partial<CustomField>) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((field, i) => (i === index ? { ...field, ...updates } : field)),
    }))
  }

  const removeField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dataType ? "Edit Data Type" : "Create New Data Type"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Color Profile"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this data type is for..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Custom Fields</h3>
              <Button type="button" onClick={addField} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>

            {formData.fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={field.name}
                    onChange={(e) => updateField(index, { name: e.target.value })}
                    placeholder="Field name"
                    className="flex-1"
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeField(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Field Type</Label>
                    <Select
                      value={field.field_type}
                      onValueChange={(value: any) => updateField(index, { field_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) => updateField(index, { required: checked })}
                    />
                    <Label>Required</Label>
                  </div>
                </div>

                {(field.field_type === "dropdown" || field.field_type === "radio") && (
                  <div>
                    <Label>Options (comma-separated)</Label>
                    <Input
                      value={field.options?.options?.join(", ") || ""}
                      onChange={(e) =>
                        updateField(index, {
                          options: {
                            options: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          },
                        })
                      }
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{dataType ? "Update" : "Create"} Data Type</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
