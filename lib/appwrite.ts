import { Client, Account, Databases, Storage, Query, ID } from "appwrite"

// Appwrite configuration
const client = new Client()
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "http://localhost/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "lightmark")

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

// Database and collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "lightmark_db"
export const COLLECTIONS = {
  DATA_TYPES: "data_types",
  DATA_ITEMS: "data_items",
  ALBUMS: "albums",
  PHOTOS: "photos",
  USERS: "users",
}

// Storage bucket ID
export const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "lightmark_files"

// Appwrite service class
export class AppwriteService {
  // Authentication
  static async login(email: string, password: string) {
    try {
      return await account.createEmailSession(email, password)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  static async register(email: string, password: string, name: string) {
    try {
      const user = await account.create(ID.unique(), email, password, name)
      await this.login(email, password)
      return user
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  static async logout() {
    try {
      return await account.deleteSession("current")
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  static async getCurrentUser() {
    try {
      return await account.get()
    } catch (error) {
      return null
    }
  }

  // Data Types
  static async createDataType(dataType: any) {
    try {
      return await databases.createDocument(DATABASE_ID, COLLECTIONS.DATA_TYPES, ID.unique(), {
        ...dataType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Create data type error:", error)
      throw error
    }
  }

  static async getDataTypes() {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.DATA_TYPES, [
        Query.orderDesc("created_at"),
      ])
      return response.documents
    } catch (error) {
      console.error("Get data types error:", error)
      throw error
    }
  }

  static async updateDataType(id: string, dataType: any) {
    try {
      return await databases.updateDocument(DATABASE_ID, COLLECTIONS.DATA_TYPES, id, {
        ...dataType,
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Update data type error:", error)
      throw error
    }
  }

  static async deleteDataType(id: string) {
    try {
      return await databases.deleteDocument(DATABASE_ID, COLLECTIONS.DATA_TYPES, id)
    } catch (error) {
      console.error("Delete data type error:", error)
      throw error
    }
  }

  // Data Items
  static async createDataItem(item: any) {
    try {
      return await databases.createDocument(DATABASE_ID, COLLECTIONS.DATA_ITEMS, ID.unique(), {
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Create data item error:", error)
      throw error
    }
  }

  static async getDataItems(typeId?: string, search?: string) {
    try {
      const queries = [Query.orderDesc("created_at")]

      if (typeId && typeId !== "all") {
        queries.push(Query.equal("type_id", typeId))
      }

      if (search) {
        queries.push(Query.search("title", search))
      }

      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.DATA_ITEMS, queries)
      return response.documents
    } catch (error) {
      console.error("Get data items error:", error)
      throw error
    }
  }

  static async getDataItem(id: string) {
    try {
      return await databases.getDocument(DATABASE_ID, COLLECTIONS.DATA_ITEMS, id)
    } catch (error) {
      console.error("Get data item error:", error)
      throw error
    }
  }

  static async updateDataItem(id: string, item: any) {
    try {
      return await databases.updateDocument(DATABASE_ID, COLLECTIONS.DATA_ITEMS, id, {
        ...item,
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Update data item error:", error)
      throw error
    }
  }

  static async deleteDataItem(id: string) {
    try {
      return await databases.deleteDocument(DATABASE_ID, COLLECTIONS.DATA_ITEMS, id)
    } catch (error) {
      console.error("Delete data item error:", error)
      throw error
    }
  }

  // Albums
  static async createAlbum(album: any) {
    try {
      return await databases.createDocument(DATABASE_ID, COLLECTIONS.ALBUMS, ID.unique(), {
        ...album,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Create album error:", error)
      throw error
    }
  }

  static async getAlbums(search?: string) {
    try {
      const queries = [Query.orderDesc("created_at")]

      if (search) {
        queries.push(Query.search("name", search))
      }

      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ALBUMS, queries)
      return response.documents
    } catch (error) {
      console.error("Get albums error:", error)
      throw error
    }
  }

  static async getAlbum(id: string) {
    try {
      return await databases.getDocument(DATABASE_ID, COLLECTIONS.ALBUMS, id)
    } catch (error) {
      console.error("Get album error:", error)
      throw error
    }
  }

  static async updateAlbum(id: string, album: any) {
    try {
      return await databases.updateDocument(DATABASE_ID, COLLECTIONS.ALBUMS, id, {
        ...album,
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Update album error:", error)
      throw error
    }
  }

  static async deleteAlbum(id: string) {
    try {
      return await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ALBUMS, id)
    } catch (error) {
      console.error("Delete album error:", error)
      throw error
    }
  }

  // File Storage with SeaweedFS
  static async uploadFile(file: File, onProgress?: (progress: number) => void) {
    try {
      return await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), file, undefined, onProgress)
    } catch (error) {
      console.error("Upload file error:", error)
      throw error
    }
  }

  static async deleteFile(fileId: string) {
    try {
      return await storage.deleteFile(STORAGE_BUCKET_ID, fileId)
    } catch (error) {
      console.error("Delete file error:", error)
      throw error
    }
  }

  static getFilePreview(fileId: string, width?: number, height?: number) {
    return storage.getFilePreview(STORAGE_BUCKET_ID, fileId, width, height)
  }

  static getFileView(fileId: string) {
    return storage.getFileView(STORAGE_BUCKET_ID, fileId)
  }

  static getFileDownload(fileId: string) {
    return storage.getFileDownload(STORAGE_BUCKET_ID, fileId)
  }

  // Full-text search across all collections
  static async fullTextSearch(query: string) {
    try {
      const [dataItems, albums] = await Promise.all([
        databases.listDocuments(DATABASE_ID, COLLECTIONS.DATA_ITEMS, [Query.search("title", query), Query.limit(20)]),
        databases.listDocuments(DATABASE_ID, COLLECTIONS.ALBUMS, [Query.search("name", query), Query.limit(20)]),
      ])

      return {
        dataItems: dataItems.documents,
        albums: albums.documents,
      }
    } catch (error) {
      console.error("Full text search error:", error)
      throw error
    }
  }

  // Export all data
  static async exportAllData() {
    try {
      const [dataTypes, dataItems, albums, photos] = await Promise.all([
        this.getDataTypes(),
        databases.listDocuments(DATABASE_ID, COLLECTIONS.DATA_ITEMS, [Query.limit(1000)]),
        databases.listDocuments(DATABASE_ID, COLLECTIONS.ALBUMS, [Query.limit(1000)]),
        databases.listDocuments(DATABASE_ID, COLLECTIONS.PHOTOS, [Query.limit(1000)]),
      ])

      return {
        dataTypes,
        dataItems: dataItems.documents,
        albums: albums.documents,
        photos: photos.documents,
        exportDate: new Date().toISOString(),
        version: "1.0",
      }
    } catch (error) {
      console.error("Export data error:", error)
      throw error
    }
  }
}
