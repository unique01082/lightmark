"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "./loading-spinner"
import { Search, FileText, FolderOpen, ImageIcon } from "lucide-react"
import { AppwriteService } from "@/lib/appwrite"
import { useToast } from "@/hooks/use-toast"

interface SearchResult {
  id: string
  title: string
  type: "item" | "album" | "photo"
  description?: string
  thumbnail?: string
  url: string
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setQuery("")
      setResults([])
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Search function with debouncing
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      try {
        const searchResults = await AppwriteService.fullTextSearch(query)

        const formattedResults: SearchResult[] = [
          ...searchResults.dataItems.map((item) => ({
            id: item.$id,
            title: item.title,
            type: "item" as const,
            description: item.description,
            thumbnail: item.avatar,
            url: `/items/${item.$id}`,
          })),
          ...searchResults.albums.map((album) => ({
            id: album.$id,
            title: album.name,
            type: "album" as const,
            description: album.description,
            thumbnail: album.cover_image,
            url: `/albums/${album.$id}`,
          })),
        ]

        setResults(formattedResults)
        setSelectedIndex(0)
      } catch (error) {
        console.error("Search error:", error)
        toast({
          title: "Search Error",
          description: "Failed to search. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, toast])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
        case "Enter":
          e.preventDefault()
          if (results[selectedIndex]) {
            window.location.href = results[selectedIndex].url
            onClose()
          }
          break
        case "Escape":
          onClose()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, results, selectedIndex, onClose])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "item":
        return <FileText className="h-4 w-4" />
      case "album":
        return <FolderOpen className="h-4 w-4" />
      case "photo":
        return <ImageIcon className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      item: "bg-blue-500/10 text-blue-500",
      album: "bg-green-500/10 text-green-500",
      photo: "bg-purple-500/10 text-purple-500",
    }
    return colors[type as keyof typeof colors] || colors.item
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <div className="flex flex-col max-h-[80vh]">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search items, albums, photos..."
              className="border-0 focus-visible:ring-0 text-lg"
            />
            {isLoading && <LoadingSpinner size="sm" />}
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {query && !isLoading && results.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found for "{query}"</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="p-2">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => {
                      window.location.href = result.url
                      onClose()
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
                    }`}
                  >
                    {result.thumbnail ? (
                      <img
                        src={result.thumbnail || "/placeholder.svg"}
                        alt={result.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                        {getTypeIcon(result.type)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{result.title}</h3>
                        <Badge variant="secondary" className={`text-xs ${getTypeBadge(result.type)}`}>
                          {result.type}
                        </Badge>
                      </div>
                      {result.description && (
                        <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t bg-muted/50 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
              <span>{results.length} results</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
