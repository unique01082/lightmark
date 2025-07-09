"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Plus, Zap, Upload, Download, Search, Settings, FolderPlus } from "lucide-react"

interface QuickActionsProps {
  onNewItem?: () => void
  onNewAlbum?: () => void
  onUploadPhotos?: () => void
  onImportData?: () => void
  onExportData?: () => void
  onSearch?: () => void
  onSettings?: () => void
}

export function QuickActions({
  onNewItem,
  onNewAlbum,
  onUploadPhotos,
  onImportData,
  onExportData,
  onSearch,
  onSettings,
}: QuickActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg" title="Quick Actions">
          <Zap className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={onNewItem}>
          <Plus className="mr-2 h-4 w-4" />
          New Item
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onNewAlbum}>
          <FolderPlus className="mr-2 h-4 w-4" />
          New Album
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onUploadPhotos}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Photos
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onImportData}>
          <Download className="mr-2 h-4 w-4" />
          Import Data
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportData}>
          <Upload className="mr-2 h-4 w-4" />
          Export Data
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
