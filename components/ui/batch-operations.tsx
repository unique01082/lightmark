"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Trash2, FolderPlus, Tag, Download, Copy, CheckSquare, Square } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BatchItem {
  id: string
  title: string
  type: string
  thumbnail?: string
  selected: boolean
}

interface BatchOperationsProps {
  items: BatchItem[]
  isOpen: boolean
  onClose: () => void
  onItemsUpdate: (items: BatchItem[]) => void
}

export function BatchOperations({ items, isOpen, onClose, onItemsUpdate }: BatchOperationsProps) {
  const [selectedItems, setSelectedItems] = useState<BatchItem[]>([])
  const [operation, setOperation] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const handleSelectAll = () => {
    const allSelected = selectedItems.length === items.length
    if (allSelected) {
      setSelectedItems([])
    } else {
      setSelectedItems([...items])
    }
  }

  const handleItemSelect = (item: BatchItem) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((selected) => selected.id === item.id)
      if (isSelected) {
        return prev.filter((selected) => selected.id !== item.id)
      } else {
        return [...prev, item]
      }
    })
  }

  const executeOperation = async () => {
    if (!operation || selectedItems.length === 0) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const totalItems = selectedItems.length

      for (let i = 0; i < totalItems; i++) {
        const item = selectedItems[i]

        // Simulate operation processing
        await new Promise((resolve) => setTimeout(resolve, 500))

        switch (operation) {
          case "delete":
            // Delete item logic
            console.log(`Deleting item: ${item.title}`)
            break
          case "add-to-album":
            // Add to album logic
            console.log(`Adding ${item.title} to album`)
            break
          case "add-tags":
            // Add tags logic
            console.log(`Adding tags to ${item.title}`)
            break
          case "export":
            // Export logic
            console.log(`Exporting ${item.title}`)
            break
          case "duplicate":
            // Duplicate logic
            console.log(`Duplicating ${item.title}`)
            break
        }

        setProgress(((i + 1) / totalItems) * 100)
      }

      toast({
        title: "Batch Operation Complete",
        description: `Successfully processed ${totalItems} items.`,
      })

      // Update items list
      const updatedItems = items.filter((item) =>
        operation === "delete" ? !selectedItems.some((selected) => selected.id === item.id) : true,
      )
      onItemsUpdate(updatedItems)
    } catch (error) {
      console.error("Batch operation error:", error)
      toast({
        title: "Operation Failed",
        description: "Some items could not be processed.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
      setSelectedItems([])
      setOperation("")
    }
  }

  const operations = [
    { value: "delete", label: "Delete Items", icon: Trash2, color: "text-red-500" },
    { value: "add-to-album", label: "Add to Album", icon: FolderPlus, color: "text-blue-500" },
    { value: "add-tags", label: "Add Tags", icon: Tag, color: "text-green-500" },
    { value: "export", label: "Export Items", icon: Download, color: "text-purple-500" },
    { value: "duplicate", label: "Duplicate Items", icon: Copy, color: "text-orange-500" },
  ]

  const selectedOperation = operations.find((op) => op.value === operation)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Batch Operations</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selection Summary */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleSelectAll} className="p-1">
                {selectedItems.length === items.length ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </Button>
              <span className="text-sm font-medium">
                {selectedItems.length} of {items.length} items selected
              </span>
            </div>

            {selectedItems.length > 0 && <Badge variant="secondary">{selectedItems.length} selected</Badge>}
          </div>

          {/* Items List */}
          <ScrollArea className="h-64 border rounded-lg">
            <div className="p-2 space-y-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedItems.some((selected) => selected.id === item.id) ? "bg-accent" : "hover:bg-accent/50"
                  }`}
                  onClick={() => handleItemSelect(item)}
                >
                  <Checkbox
                    checked={selectedItems.some((selected) => selected.id === item.id)}
                    onChange={() => handleItemSelect(item)}
                  />

                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Operation Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Operation</label>
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an operation..." />
              </SelectTrigger>
              <SelectContent>
                {operations.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    <div className="flex items-center gap-2">
                      <op.icon className={`h-4 w-4 ${op.color}`} />
                      {op.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Processing Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {selectedOperation && <selectedOperation.icon className={`h-4 w-4 ${selectedOperation.color}`} />}
                <span className="text-sm">Processing {selectedItems.length} items...</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">{Math.round(progress)}% complete</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={executeOperation} disabled={!operation || selectedItems.length === 0 || isProcessing}>
              {isProcessing ? "Processing..." : `Execute Operation`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
