"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, FileText, FolderOpen, ImageIcon, Eye } from "lucide-react"

interface AnalyticsData {
  totalItems: number
  totalAlbums: number
  totalPhotos: number
  recentViews: number
  storageUsed: number
  storageLimit: number
  itemsByType: Array<{ name: string; value: number; color: string }>
  activityTrend: Array<{ date: string; items: number; albums: number; photos: number }>
  topItems: Array<{ name: string; views: number; type: string }>
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      // Simulate analytics data - in real app, this would come from your backend
      const mockData: AnalyticsData = {
        totalItems: 156,
        totalAlbums: 23,
        totalPhotos: 1247,
        recentViews: 89,
        storageUsed: 2.4, // GB
        storageLimit: 10, // GB
        itemsByType: [
          { name: "Presets", value: 67, color: "#8884d8" },
          { name: "Color Profiles", value: 45, color: "#82ca9d" },
          { name: "Color Styles", value: 44, color: "#ffc658" },
        ],
        activityTrend: [
          { date: "2024-01-01", items: 12, albums: 3, photos: 45 },
          { date: "2024-01-02", items: 15, albums: 2, photos: 38 },
          { date: "2024-01-03", items: 8, albums: 5, photos: 52 },
          { date: "2024-01-04", items: 22, albums: 1, photos: 41 },
          { date: "2024-01-05", items: 18, albums: 4, photos: 67 },
          { date: "2024-01-06", items: 25, albums: 3, photos: 33 },
          { date: "2024-01-07", items: 19, albums: 6, photos: 58 },
        ],
        topItems: [
          { name: "Moody Portrait Preset", views: 234, type: "preset" },
          { name: "Urban Collection", views: 189, type: "album" },
          { name: "Canon Natural Profile", views: 156, type: "profile" },
          { name: "Vintage Film Style", views: 143, type: "style" },
          { name: "Street Photography", views: 128, type: "album" },
        ],
      }

      setData(mockData)
    } catch (error) {
      console.error("Failed to load analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-8 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const storagePercentage = (data.storageUsed / data.storageLimit) * 100

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{data.totalItems}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Albums</p>
                <p className="text-2xl font-bold">{data.totalAlbums}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+8%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Photos</p>
                <p className="text-2xl font-bold">{data.totalPhotos.toLocaleString()}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+23%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recent Views</p>
                <p className="text-2xl font-bold">{data.recentViews}</p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500">-5%</span>
              <span className="text-muted-foreground ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Usage</CardTitle>
          <CardDescription>
            {data.storageUsed.toFixed(1)} GB of {data.storageLimit} GB used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={storagePercentage} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{storagePercentage.toFixed(1)}% used</span>
            <span>{(data.storageLimit - data.storageUsed).toFixed(1)} GB remaining</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="popular">Popular Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Items by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Items by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.itemsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.itemsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Activity Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Trend</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.activityTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <Area type="monotone" dataKey="items" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="albums" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="photos" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity</CardTitle>
              <CardDescription>Content creation over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.activityTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <Bar dataKey="items" fill="#8884d8" name="Items" />
                  <Bar dataKey="albums" fill="#82ca9d" name="Albums" />
                  <Bar dataKey="photos" fill="#ffc658" name="Photos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Viewed Content</CardTitle>
              <CardDescription>Top performing items this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.views}</p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
