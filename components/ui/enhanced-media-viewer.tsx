"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Info,
  RotateCw,
  Maximize,
  Minimize,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react"

interface MediaViewerProps {
  images: string[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onIndexChange: (index: number) => void
  metadata?: Record<string, any>
  autoPlay?: boolean
}

export function EnhancedMediaViewer({
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  metadata,
  autoPlay = false,
}: MediaViewerProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          if (currentIndex > 0) onIndexChange(currentIndex - 1)
          break
        case "ArrowRight":
          if (currentIndex < images.length - 1) onIndexChange(currentIndex + 1)
          break
        case "+":
        case "=":
          e.preventDefault()
          setZoom((prev) => Math.min(prev + 0.25, 5))
          break
        case "-":
          e.preventDefault()
          setZoom((prev) => Math.max(prev - 0.25, 0.1))
          break
        case "0":
          setZoom(1)
          setPosition({ x: 0, y: 0 })
          setRotation(0)
          break
        case "r":
          setRotation((prev) => (prev + 90) % 360)
          break
        case "i":
          setShowInfo((prev) => !prev)
          break
        case "f":
          toggleFullscreen()
          break
        case " ":
          e.preventDefault()
          setIsPlaying((prev) => !prev)
          break
        case "Home":
          onIndexChange(0)
          break
        case "End":
          onIndexChange(images.length - 1)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex, images.length, onClose, onIndexChange])

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      setZoom((prev) => Math.max(0.1, Math.min(5, prev + delta)))
    }
  }, [])

  // Drag to pan
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom > 1) {
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
      }
    },
    [zoom, position],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && zoom > 1) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    },
    [isDragging, dragStart, zoom],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Auto-play slideshow
  useEffect(() => {
    if (isPlaying && images.length > 1) {
      intervalRef.current = setInterval(() => {
        onIndexChange((currentIndex + 1) % images.length)
      }, 3000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, currentIndex, images.length, onIndexChange])

  // Fullscreen API
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // Reset view when image changes
  useEffect(() => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    setRotation(0)
  }, [currentIndex])

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] max-h-[98vh] p-0 bg-black/95 border-0">
        <div ref={containerRef} className="relative w-full h-[98vh] flex flex-col overflow-hidden">
          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-black/50 text-white">
                {currentIndex + 1} / {images.length}
              </Badge>
              {metadata && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-white hover:bg-white/20"
                >
                  <Info className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.1))}
                className="text-white hover:bg-white/20"
                disabled={zoom <= 0.1}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-white text-sm min-w-[4rem] text-center">{Math.round(zoom * 100)}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom((prev) => Math.min(prev + 0.25, 5))}
                className="text-white hover:bg-white/20"
                disabled={zoom >= 5}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              {/* Rotation */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="text-white hover:bg-white/20"
              >
                <RotateCw className="h-4 w-4" />
              </Button>

              {/* Slideshow Controls */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onIndexChange(0)}
                    className="text-white hover:bg-white/20"
                    disabled={currentIndex === 0}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onIndexChange(images.length - 1)}
                    className="text-white hover:bg-white/20"
                    disabled={currentIndex === images.length - 1}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Fullscreen */}
              <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>

              {/* Download */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = currentImage
                  link.download = `image-${currentIndex + 1}`
                  link.click()
                }}
                className="text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4" />
              </Button>

              {/* Close */}
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Image Area */}
          <div
            className="flex-1 flex items-center justify-center overflow-hidden cursor-move"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={currentImage || "/placeholder.svg"}
              alt={`Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
              }}
              draggable={false}
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="lg"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                onClick={() => currentIndex > 0 && onIndexChange(currentIndex - 1)}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                onClick={() => currentIndex < images.length - 1 && onIndexChange(currentIndex + 1)}
                disabled={currentIndex === images.length - 1}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Film Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex gap-2 justify-center overflow-x-auto max-w-full">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => onIndexChange(index)}
                    className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                      index === currentIndex ? "border-white scale-110" : "border-transparent hover:border-white/50"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Panel */}
          {showInfo && metadata && (
            <Card className="absolute right-4 top-20 w-80 bg-black/80 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-white">
                <h3 className="font-semibold mb-3 text-white">Image Information</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-300 capitalize">{key.replace("_", " ")}:</span>
                      <span className="text-white">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Overlay */}
          <div className="absolute bottom-4 left-4 text-white/70 text-xs space-y-1">
            <div>← → Navigate • Ctrl+Wheel Zoom • Space Play/Pause</div>
            <div>R Rotate • I Info • F Fullscreen • 0 Reset • Esc Close</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
