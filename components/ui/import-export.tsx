"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { AppwriteService } from "@/lib/appwrite"
import { useToast } from "@/hooks/use-toast"

interface ImportExportProps {
  isOpen: boolean
  onClose: () => void
  mode: "import" | "export"
}

export function ImportExport({ isOpen, onClose, mode }: ImportExportProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const { toast } = useToast()

  const handleExport = async () => {
    setIsProcessing(true)
    setProgress(0)
    setStatus("idle")

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const data = await AppwriteService.exportAllData()

      clearInterval(progressInterval)
      setProgress(100)

      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `lightmark-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setStatus("success")
      setMessage("Data exported successfully!")

      toast({
        title: "Export Complete",
        description: "Your data has been exported successfully.",
      })
    } catch (error) {
      console.error("Export error:", error)
      setStatus("error")
      setMessage("Failed to export data. Please try again.")

      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImport = async (file: File) => {
    setIsProcessing(true)
    setProgress(0)
    setStatus("idle")

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Validate data structure
      if (!data.dataTypes || !data.dataItems || !data.albums) {
        throw new Error("Invalid data format")
      }

      // Simulate progress and import data
      setProgress(25)

      // Import data types
      for (const dataType of data.dataTypes) {
        await AppwriteService.createDataType(dataType)
      }
      setProgress(50)

      // Import data items
      for (const item of data.dataItems) {
        await AppwriteService.createDataItem(item)
      }
      setProgress(75)

      // Import albums
      for (const album of data.albums) {
        await AppwriteService.createAlbum(album)
      }
      setProgress(100)

      setStatus("success")
      setMessage("Data imported successfully!")

      toast({
        title: "Import Complete",
        description: "Your data has been imported successfully.",
      })
    } catch (error) {
      console.error("Import error:", error)
      setStatus("error")
      setMessage("Failed to import data. Please check the file format.")

      toast({
        title: "Import Failed",
        description: "Failed to import data. Please check the file format.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImport(file)
    }
  }

  const resetState = () => {
    setIsProcessing(false)
    setProgress(0)
    setStatus("idle")
    setMessage("")
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetState()
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "export" ? (
              <>
                <Download className="h-5 w-5" />
                Export Data
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Import Data
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {mode === "export" ? (
            <>
              <p className="text-sm text-muted-foreground">
                Export all your data including data types, items, albums, and photos to a JSON file.
              </p>

              {!isProcessing && status === "idle" && (
                <Button onClick={handleExport} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Import data from a previously exported JSON file. This will add to your existing data.
              </p>

              {!isProcessing && status === "idle" && (
                <div>
                  <input type="file" accept=".json" onChange={handleFileSelect} className="hidden" id="import-file" />
                  <Button asChild className="w-full">
                    <label htmlFor="import-file" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Select JSON File
                    </label>
                  </Button>
                </div>
              )}
            </>
          )}

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{mode === "export" ? "Exporting" : "Importing"} data...</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">{progress}% complete</p>
            </div>
          )}

          {status === "success" && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {(status === "success" || status === "error") && (
            <Button
              onClick={() => {
                resetState()
                onClose()
              }}
              className="w-full"
            >
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
