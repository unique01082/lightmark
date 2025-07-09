"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sparkles, Calendar, Camera, Palette, TrendingUp, Filter, Plus, Wand2 } from "lucide-react"

interface SmartCollection {
  id: string
  name: string
  description: string
  rules: CollectionRule[]
  itemCount: number
  icon: any
  color: string
}

interface CollectionRule {
  field: string
  operator: string
  value: string
}

export function SmartCollections() {
  const [collections, setCollections] = useState<SmartCollection[]>([
    {
      id: "recent",
      name: "Recently Added",
      description: "Items added in the last 7 days",
      rules: [{ field: "created_at", operator: "last_days", value: "7" }],
      itemCount: 23,
      icon: Calendar,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      id: "popular",
      name: "Most Viewed",
      description: "Items with high view counts",
      rules: [{ field: "view_count", operator: "greater_than", value: "50" }],
      itemCount: 15,
      icon: TrendingUp,
      color: "bg-green-500/10 text-green-500",
    },
    {
      id: "portraits",
      name: "Portrait Presets",
      description: "Presets tagged with portrait",
      rules: [{ field: "tags", operator: "contains", value: "portrait" }],
      itemCount: 34,
      icon: Camera,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      id: "warm-tones",
      name: "Warm Color Styles",
      description: "Color styles with warm tones",
      rules: [{ field: "color_temperature", operator: "greater_than", value: "5500" }],
      itemCount: 18,
      icon: Palette,
      color: "bg-orange-500/10 text-orange-500",
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    rules: [{ field: "", operator: "", value: "" }],
  })

  const fieldOptions = [
    { value: "created_at", label: "Date Created" },
    { value: "updated_at", label: "Date Modified" },
    { value: "view_count", label: "View Count" },
    { value: "tags", label: "Tags" },
    { value: "type", label: "Item Type" },
    { value: "author", label: "Author" },
    { value: "color_temperature", label: "Color Temperature" },
    { value: "file_size", label: "File Size" },
  ]

  const operatorOptions = [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Not Equals" },
    { value: "contains", label: "Contains" },
    { value: "not_contains", label: "Does Not Contain" },
    { value: "greater_than", label: "Greater Than" },
    { value: "less_than", label: "Less Than" },
    { value: "last_days", label: "Last X Days" },
    { value: "before_date", label: "Before Date" },
    { value: "after_date", label: "After Date" },
  ]

  const addRule = () => {
    setNewCollection((prev) => ({
      ...prev,
      rules: [...prev.rules, { field: "", operator: "", value: "" }],
    }))
  }

  const updateRule = (index: number, field: keyof CollectionRule, value: string) => {
    setNewCollection((prev) => ({
      ...prev,
      rules: prev.rules.map((rule, i) => (i === index ? { ...rule, [field]: value } : rule)),
    }))
  }

  const removeRule = (index: number) => {
    setNewCollection((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }))
  }

  const createCollection = () => {
    const collection: SmartCollection = {
      id: Date.now().toString(),
      name: newCollection.name,
      description: newCollection.description,
      rules: newCollection.rules.filter((rule) => rule.field && rule.operator),
      itemCount: Math.floor(Math.random() * 50), // Simulated count
      icon: Sparkles,
      color: "bg-indigo-500/10 text-indigo-500",
    }

    setCollections((prev) => [...prev, collection])
    setNewCollection({ name: "", description: "", rules: [{ field: "", operator: "", value: "" }] })
    setIsCreateDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Smart Collections</h2>
          <p className="text-muted-foreground">Automatically organized collections based on rules</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Smart Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Smart Collection</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="collection-name">Collection Name</Label>
                <Input
                  id="collection-name"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., High-Quality Portraits"
                />
              </div>

              <div>
                <Label htmlFor="collection-description">Description</Label>
                <Input
                  id="collection-description"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this collection contains..."
                />
              </div>

              <div className="space-y-3">
                <Label>Rules</Label>
                {newCollection.rules.map((rule, index) => (
                  <div key={index} className="flex gap-2 items-center p-3 border rounded-lg">
                    <Select value={rule.field} onValueChange={(value) => updateRule(index, "field", value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={rule.operator} onValueChange={(value) => updateRule(index, "operator", value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {operatorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      value={rule.value}
                      onChange={(e) => updateRule(index, "value", e.target.value)}
                      placeholder="Value"
                      className="flex-1"
                    />

                    {newCollection.rules.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeRule(index)}>
                        ×
                      </Button>
                    )}
                  </div>
                ))}

                <Button variant="outline" onClick={addRule} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={createCollection}
                  disabled={!newCollection.name || newCollection.rules.every((rule) => !rule.field)}
                >
                  Create Collection
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <Card key={collection.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${collection.color}`}>
                  <collection.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary">{collection.itemCount} items</Badge>
              </div>
              <CardTitle className="text-lg">{collection.name}</CardTitle>
              <CardDescription>{collection.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Rules:</div>
                {collection.rules.map((rule, index) => (
                  <div key={index} className="text-xs bg-muted p-2 rounded flex items-center gap-1">
                    <Filter className="h-3 w-3" />
                    <span className="font-medium">{fieldOptions.find((f) => f.value === rule.field)?.label}</span>
                    <span>{operatorOptions.find((o) => o.value === rule.operator)?.label.toLowerCase()}</span>
                    <span className="font-medium">"{rule.value}"</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1">
                  <Wand2 className="h-3 w-3 mr-1" />
                  View Items
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
