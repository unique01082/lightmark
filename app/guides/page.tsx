"use client"

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, User, ArrowRight } from "lucide-react"
import Link from "next/link"

const guides = [
  {
    id: "getting-started",
    title: "Getting Started with Lightmark",
    description: "Learn the basics of setting up your photography workflow in Lightmark",
    category: "Beginner",
    readTime: "5 min",
    author: "Lightmark Team",
    image: "/placeholder.svg?height=200&width=300",
    content: "A comprehensive guide to help you get started with organizing your photography notes and presets.",
  },
  {
    id: "custom-data-types",
    title: "Creating Custom Data Types",
    description: "Master the art of creating custom fields and data types for your specific needs",
    category: "Advanced",
    readTime: "8 min",
    author: "Lightmark Team",
    image: "/placeholder.svg?height=200&width=300",
    content:
      "Deep dive into the flexible data type system and learn how to create custom fields that match your workflow.",
  },
  {
    id: "organizing-presets",
    title: "Organizing Your Presets",
    description: "Best practices for categorizing and managing your Lightroom presets",
    category: "Workflow",
    readTime: "6 min",
    author: "Pro Photographer",
    image: "/placeholder.svg?height=200&width=300",
    content: "Learn professional techniques for organizing and categorizing your photography presets effectively.",
  },
  {
    id: "color-profiles-guide",
    title: "Understanding Color Profiles",
    description: "A complete guide to camera color profiles and color science",
    category: "Technical",
    readTime: "12 min",
    author: "Color Expert",
    image: "/placeholder.svg?height=200&width=300",
    content: "Comprehensive guide to understanding and managing color profiles for different camera systems.",
  },
  {
    id: "album-management",
    title: "Album and Photo Management",
    description: "Efficiently organize your photography collections with albums",
    category: "Organization",
    readTime: "7 min",
    author: "Lightmark Team",
    image: "/placeholder.svg?height=200&width=300",
    content: "Learn how to create, organize, and manage photo albums to keep your work structured and accessible.",
  },
  {
    id: "import-export",
    title: "Import and Export Your Data",
    description: "Learn how to backup, share, and migrate your photography data",
    category: "Data Management",
    readTime: "4 min",
    author: "Lightmark Team",
    image: "/placeholder.svg?height=200&width=300",
    content: "Step-by-step instructions for importing, exporting, and backing up your valuable photography data.",
  },
  {
    id: "collaboration-tips",
    title: "Sharing and Collaboration",
    description: "Tips for sharing your work and collaborating with other photographers",
    category: "Workflow",
    readTime: "5 min",
    author: "Community Expert",
    image: "/placeholder.svg?height=200&width=300",
    content: "Best practices for sharing your photography work and collaborating with clients and other photographers.",
  },
  {
    id: "advanced-search",
    title: "Advanced Search and Filtering",
    description: "Master the search and filtering capabilities to find content quickly",
    category: "Advanced",
    readTime: "6 min",
    author: "Power User",
    image: "/placeholder.svg?height=200&width=300",
    content: "Learn advanced search techniques and filtering options to quickly locate your photography assets.",
  },
]

const categories = ["All", "Beginner", "Advanced", "Workflow", "Technical", "Organization", "Data Management"]

export default function GuidesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        <aside className="hidden md:block border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Sidebar />
        </aside>

        <main className="flex-1">
          <div className="container py-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">User Guides</h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Comprehensive guides to help you master Lightmark and optimize your photography workflow
              </p>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((category) => (
                <Badge key={category} variant="outline" className="cursor-pointer hover:bg-accent">
                  {category}
                </Badge>
              ))}
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <Link key={guide.id} href={`/guides/${guide.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                    <div className="aspect-[16/10] overflow-hidden rounded-t-lg">
                      <img
                        src={guide.image || "/placeholder.svg"}
                        alt={guide.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{guide.category}</Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {guide.readTime}
                        </div>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                        {guide.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          {guide.author}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                          Read Guide
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Featured Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Featured Guides</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Complete Workflow Guide</h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        A comprehensive guide covering the entire photography workflow from capture to organization
                      </p>
                      <Link href="/guides/complete-workflow" className="text-primary hover:underline text-sm">
                        Read the complete guide →
                      </Link>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Pro Tips & Tricks</h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        Advanced techniques and professional tips from experienced photographers
                      </p>
                      <Link href="/guides/pro-tips" className="text-primary hover:underline text-sm">
                        Learn pro techniques →
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
