"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RealtimeService } from "@/lib/realtime"
import { formatDistanceToNow } from "date-fns"
import { FileText, FolderOpen, ImageIcon, Edit, Trash2, Plus, Upload, Download, Eye } from "lucide-react"

interface Activity {
  $id: string
  action: string
  resource_type: string
  resource_id: string
  metadata: any
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadActivities()

    // Subscribe to real-time activity updates
    const unsubscribe = RealtimeService.subscribeToCollection("activities", (response) => {
      if (response.events.includes("databases.*.collections.*.documents.*.create")) {
        setActivities((prev) => [response.payload, ...prev].slice(0, 50))
      }
    })

    return unsubscribe
  }, [])

  const loadActivities = async () => {
    try {
      const activities = await RealtimeService.getRecentActivities()
      setActivities(activities)
    } catch (error) {
      console.error("Failed to load activities:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (action: string, resourceType: string) => {
    const iconMap = {
      create: Plus,
      update: Edit,
      delete: Trash2,
      view: Eye,
      upload: Upload,
      download: Download,
    }

    const resourceIconMap = {
      item: FileText,
      album: FolderOpen,
      photo: ImageIcon,
    }

    const ActionIcon = iconMap[action as keyof typeof iconMap] || FileText
    const ResourceIcon = resourceIconMap[resourceType as keyof typeof resourceIconMap] || FileText

    return (
      <div className="relative">
        <ResourceIcon className="h-4 w-4" />
        <ActionIcon className="h-2 w-2 absolute -bottom-1 -right-1 bg-background rounded-full" />
      </div>
    )
  }

  const getActivityColor = (action: string) => {
    const colorMap = {
      create: "bg-green-500/10 text-green-500",
      update: "bg-blue-500/10 text-blue-500",
      delete: "bg-red-500/10 text-red-500",
      view: "bg-gray-500/10 text-gray-500",
      upload: "bg-purple-500/10 text-purple-500",
      download: "bg-orange-500/10 text-orange-500",
    }
    return colorMap[action as keyof typeof colorMap] || colorMap.view
  }

  const formatActivityMessage = (activity: Activity) => {
    const { action, resource_type, metadata } = activity
    const resourceName = metadata?.title || metadata?.name || `${resource_type} ${activity.resource_id.slice(-6)}`

    const messages = {
      create: `Created ${resource_type} "${resourceName}"`,
      update: `Updated ${resource_type} "${resourceName}"`,
      delete: `Deleted ${resource_type} "${resourceName}"`,
      view: `Viewed ${resource_type} "${resourceName}"`,
      upload: `Uploaded ${metadata?.count || 1} file(s) to "${resourceName}"`,
      download: `Downloaded ${resource_type} "${resourceName}"`,
    }

    return messages[action as keyof typeof messages] || `${action} ${resource_type}`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="p-4 space-y-3">
            {activities.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No recent activity</p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.$id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="mt-1">{getActivityIcon(activity.action, activity.resource_type)}</div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{formatActivityMessage(activity)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={`text-xs ${getActivityColor(activity.action)}`}>
                        {activity.action}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {activity.user && (
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{activity.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
