"use client";

import { DataTypeManagement } from "@/components/forms/data-type-management";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DirectusStatus } from "@/components/ui/directus-status";
import { ImportExport } from "@/components/ui/import-export";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Database,
  Moon,
  Palette,
  SettingsIcon,
  Shield,
  Sun,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [importExportMode, setImportExportMode] = useState<
    "import" | "export" | null
  >(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        <aside className="hidden md:block border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Sidebar />
        </aside>

        <main className="flex-1">
          <div className="container py-6 max-w-6xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                <h1 className="text-2xl font-bold">Settings</h1>
              </div>
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="data-types" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger
                  value="data-types"
                  className="flex items-center gap-2"
                >
                  <Database className="h-4 w-4" />
                  Data Types
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="flex items-center gap-2"
                >
                  <Palette className="h-4 w-4" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger
                  value="backend"
                  className="flex items-center gap-2"
                >
                  <Database className="h-4 w-4" />
                  Backend
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              {/* Data Types Management */}
              <TabsContent value="data-types" className="space-y-6">
                <DataTypeManagement />
              </TabsContent>

              {/* Appearance Settings */}
              <TabsContent value="appearance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize the appearance of your Lightmark application.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Theme</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Choose your preferred color scheme
                        </p>
                        <div className="flex gap-3">
                          <Button
                            variant={theme === "light" ? "default" : "outline"}
                            onClick={() => setTheme("light")}
                            className="flex items-center gap-2"
                          >
                            <Sun className="h-4 w-4" />
                            Light
                          </Button>
                          <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            onClick={() => setTheme("dark")}
                            className="flex items-center gap-2"
                          >
                            <Moon className="h-4 w-4" />
                            Dark
                          </Button>
                          <Button
                            variant={theme === "system" ? "default" : "outline"}
                            onClick={() => setTheme("system")}
                            className="flex items-center gap-2"
                          >
                            <SettingsIcon className="h-4 w-4" />
                            System
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Layout</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Customize the layout and density
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">Sidebar</h5>
                            <p className="text-sm text-muted-foreground mb-3">
                              Always visible on desktop
                            </p>
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">Grid Density</h5>
                            <p className="text-sm text-muted-foreground mb-3">
                              Comfortable spacing
                            </p>
                            <Button variant="outline" size="sm">
                              Adjust
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Backend Settings */}
              <TabsContent value="backend" className="space-y-6">
                <DirectusStatus />

                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>
                      Manage your application data, import/export, and storage
                      preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Import Data</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Import from JSON or CSV files
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setImportExportMode("import")}
                        >
                          Import
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Export Data</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Export your data for backup
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setImportExportMode("export")}
                        >
                          Export
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Sync Status</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Real-time synchronization
                        </p>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Storage Configuration</CardTitle>
                    <CardDescription>
                      Configure file storage and media handling
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium">File Storage</h5>
                          <p className="text-sm text-muted-foreground">
                            Directus file storage
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium">Image Processing</h5>
                          <p className="text-sm text-muted-foreground">
                            Automatic image optimization
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users & Permissions */}
              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage users and their permissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium">Current User</h5>
                          <p className="text-sm text-muted-foreground">
                            Administrator
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit Profile
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium">Team Members</h5>
                          <p className="text-sm text-muted-foreground">
                            Invite and manage team access
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Permissions</CardTitle>
                    <CardDescription>
                      Configure access levels and permissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">Data Access</h5>
                        <p className="text-sm text-muted-foreground mb-3">
                          Control who can view and edit data
                        </p>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">File Access</h5>
                        <p className="text-sm text-muted-foreground mb-3">
                          Manage file upload and download permissions
                        </p>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Settings */}
              <TabsContent value="advanced" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Configuration</CardTitle>
                    <CardDescription>
                      Advanced settings for power users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium">API Configuration</h5>
                          <p className="text-sm text-muted-foreground">
                            Configure API endpoints and authentication
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium">Webhooks</h5>
                          <p className="text-sm text-muted-foreground">
                            Set up webhooks for external integrations
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium">Cache Settings</h5>
                          <p className="text-sm text-muted-foreground">
                            Configure caching for better performance
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Information</CardTitle>
                    <CardDescription>
                      Application and system details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium mb-2">Application</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Version:
                            </span>
                            <span>1.0.0</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Build:
                            </span>
                            <span>2025.01.15</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Environment:
                            </span>
                            <span>Production</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Backend</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Directus:
                            </span>
                            <span>Connected</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Database:
                            </span>
                            <span>PostgreSQL</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Storage:
                            </span>
                            <span>Local</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <Footer />

      {/* Import/Export Dialog */}
      {importExportMode && (
        <ImportExport
          isOpen={true}
          onClose={() => setImportExportMode(null)}
          mode={importExportMode}
        />
      )}
    </div>
  );
}
