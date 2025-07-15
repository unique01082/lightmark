'use client';

import { DataTypeSettings } from '@/app/(global)/settings/_components/data-type-settings';
import { ImportExport } from '@/components/ui/import-export';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Palette, Shield, Users } from 'lucide-react';
import { useState } from 'react';
import {
  AdvancedSettings,
  AppearanceSettings,
  BackendSettings,
  SettingsHeader,
  UsersSettings,
} from './_components';

export default function SettingsPage() {
  const [importExportMode, setImportExportMode] = useState<'import' | 'export' | null>(null);

  return (
    <>
      <div className="container py-6 max-w-6xl">
        <SettingsHeader />

        <Tabs defaultValue="data-types" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="data-types" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Types
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="backend" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Backend
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Data Types Management */}
          <TabsContent value="data-types" className="space-y-6">
            <DataTypeSettings />
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <AppearanceSettings />
          </TabsContent>

          {/* Backend Settings */}
          <TabsContent value="backend" className="space-y-6">
            <BackendSettings onImportExport={setImportExportMode} />
          </TabsContent>

          {/* Users & Permissions */}
          <TabsContent value="users" className="space-y-6">
            <UsersSettings />
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-6">
            <AdvancedSettings />
          </TabsContent>
        </Tabs>
      </div>
      {importExportMode && (
        <ImportExport
          isOpen={true}
          onClose={() => setImportExportMode(null)}
          mode={importExportMode}
        />
      )}
    </>
  );
}
