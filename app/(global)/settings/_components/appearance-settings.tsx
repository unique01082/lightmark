'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, SettingsIcon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize the appearance of your Lightmark application.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Theme</h4>
            <p className="text-sm text-muted-foreground mb-4">Choose your preferred color scheme</p>
            <div className="flex gap-3">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => setTheme('system')}
                className="flex items-center gap-2"
              >
                <SettingsIcon className="h-4 w-4" />
                System
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Layout</h4>
            <p className="text-sm text-muted-foreground mb-4">Customize the layout and density</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">Sidebar</h5>
                <p className="text-sm text-muted-foreground mb-3">Always visible on desktop</p>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">Grid Density</h5>
                <p className="text-sm text-muted-foreground mb-3">Comfortable spacing</p>
                <Button variant="outline" size="sm">
                  Adjust
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
