'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Moon, SettingsIcon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export function SettingsHeader() {
  const { theme, setTheme } = useTheme();

  return (
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
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </div>
  );
}
