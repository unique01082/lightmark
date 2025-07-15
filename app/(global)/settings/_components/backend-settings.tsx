'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DirectusStatus } from '@/components/ui/directus-status';

interface BackendSettingsProps {
  onImportExport: (mode: 'import' | 'export') => void;
}

export function BackendSettings({ onImportExport }: BackendSettingsProps) {
  return (
    <div className="space-y-6">
      <DirectusStatus />

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Manage your application data, import/export, and storage preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Import Data</h4>
              <p className="text-sm text-muted-foreground mb-3">Import from JSON or CSV files</p>
              <Button variant="outline" size="sm" onClick={() => onImportExport('import')}>
                Import
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Export Data</h4>
              <p className="text-sm text-muted-foreground mb-3">Export your data for backup</p>
              <Button variant="outline" size="sm" onClick={() => onImportExport('export')}>
                Export
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Sync Status</h4>
              <p className="text-sm text-muted-foreground mb-3">Real-time synchronization</p>
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
          <CardDescription>Configure file storage and media handling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">File Storage</h5>
                <p className="text-sm text-muted-foreground">Directus file storage</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Image Processing</h5>
                <p className="text-sm text-muted-foreground">Automatic image optimization</p>
              </div>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
