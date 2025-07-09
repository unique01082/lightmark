import { Client, Databases, Query } from "appwrite"
import { DATABASE_ID } from "./appwrite"

export class RealtimeService {
  private static client: Client
  private static databases: Databases
  private static subscriptions: Map<string, () => void> = new Map()

  static init() {
    this.client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "http://localhost/v1")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "lightmark")

    this.databases = new Databases(this.client)
  }

  // Subscribe to real-time updates for a collection
  static subscribeToCollection(collection: string, callback: (payload: any) => void, userId?: string): () => void {
    const channels = [`databases.${DATABASE_ID}.collections.${collection}.documents`]

    if (userId) {
      channels.push(`databases.${DATABASE_ID}.collections.${collection}.documents.${userId}`)
    }

    const unsubscribe = this.client.subscribe(channels, (response) => {
      callback(response)
    })

    const subscriptionId = `${collection}-${Date.now()}`
    this.subscriptions.set(subscriptionId, unsubscribe)

    return () => {
      unsubscribe()
      this.subscriptions.delete(subscriptionId)
    }
  }

  // Subscribe to specific document changes
  static subscribeToDocument(collection: string, documentId: string, callback: (payload: any) => void): () => void {
    const channels = [`databases.${DATABASE_ID}.collections.${collection}.documents.${documentId}`]

    const unsubscribe = this.client.subscribe(channels, (response) => {
      callback(response)
    })

    const subscriptionId = `${collection}-${documentId}`
    this.subscriptions.set(subscriptionId, unsubscribe)

    return () => {
      unsubscribe()
      this.subscriptions.delete(subscriptionId)
    }
  }

  // Clean up all subscriptions
  static cleanup() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe())
    this.subscriptions.clear()
  }

  // Activity tracking
  static async trackActivity(action: string, resourceType: string, resourceId: string, metadata?: any) {
    try {
      await this.databases.createDocument(DATABASE_ID, "activities", "unique()", {
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        metadata: metadata || {},
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Failed to track activity:", error)
    }
  }

  // Get recent activities
  static async getRecentActivities(limit = 50) {
    try {
      const response = await this.databases.listDocuments(DATABASE_ID, "activities", [
        Query.orderDesc("timestamp"),
        Query.limit(limit),
      ])
      return response.documents
    } catch (error) {
      console.error("Failed to get activities:", error)
      return []
    }
  }
}
