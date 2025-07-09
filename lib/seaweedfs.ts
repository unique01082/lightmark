// SeaweedFS integration for file storage
export class SeaweedFSService {
  private static baseUrl = process.env.NEXT_PUBLIC_SEAWEEDFS_URL || "http://localhost:9333"

  // Upload file to SeaweedFS
  static async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<string> {
    try {
      // Step 1: Get file ID from master
      const assignResponse = await fetch(`${this.baseUrl}/dir/assign`)
      const assignData = await assignResponse.json()

      if (!assignData.fid) {
        throw new Error("Failed to get file ID from SeaweedFS")
      }

      // Step 2: Upload file to volume server
      const formData = new FormData()
      formData.append("file", file)

      const uploadUrl = `http://${assignData.url}/${assignData.fid}`

      const xhr = new XMLHttpRequest()

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = (event.loaded / event.total) * 100
            onProgress(progress)
          }
        })

        xhr.addEventListener("load", () => {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve(assignData.fid)
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        })

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"))
        })

        xhr.open("POST", uploadUrl)
        xhr.send(formData)
      })
    } catch (error) {
      console.error("SeaweedFS upload error:", error)
      throw error
    }
  }

  // Get file URL
  static getFileUrl(fileId: string): string {
    return `${this.baseUrl}/${fileId}`
  }

  // Delete file
  static async deleteFile(fileId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${fileId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`)
      }
    } catch (error) {
      console.error("SeaweedFS delete error:", error)
      throw error
    }
  }

  // Get file info
  static async getFileInfo(fileId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/${fileId}?metadata`)
      return await response.json()
    } catch (error) {
      console.error("SeaweedFS file info error:", error)
      throw error
    }
  }
}
