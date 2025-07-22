'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { HelpCircle, Keyboard, X } from 'lucide-react';
import { useState } from 'react';

interface KeyboardShortcutsHelpProps {
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
    mac?: string[];
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['←', '→'], description: 'Previous/Next image' },
      { keys: ['Home'], description: 'First image' },
      { keys: ['End'], description: 'Last image' },
      { keys: ['Page Up'], description: 'Previous 10 images' },
      { keys: ['Page Down'], description: 'Next 10 images' },
      { keys: ['Cmd', 'Home'], description: 'Jump to first', mac: ['⌘', 'Home'] },
      { keys: ['Cmd', 'End'], description: 'Jump to last', mac: ['⌘', 'End'] },
    ],
  },
  {
    title: 'Zoom & View',
    shortcuts: [
      { keys: ['+', '='], description: 'Zoom in' },
      { keys: ['-'], description: 'Zoom out' },
      { keys: ['Ctrl', '+'], description: 'Zoom in (fine)', mac: ['⌘', '+'] },
      { keys: ['Ctrl', '-'], description: 'Zoom out (fine)', mac: ['⌘', '-'] },
      { keys: ['Ctrl', '0'], description: 'Zoom to fit', mac: ['⌘', '0'] },
      { keys: ['Ctrl', 'Alt', '0'], description: 'Actual size', mac: ['⌘', '⌥', '0'] },
      { keys: ['Ctrl', 'Shift', '0'], description: 'Zoom to fill', mac: ['⌘', '⇧', '0'] },
      { keys: ['Z'], description: 'Zoom to fit' },
      { keys: ['Shift', 'Z'], description: 'Zoom to fill' },
    ],
  },
  {
    title: 'Fullscreen & Display',
    shortcuts: [
      { keys: ['F'], description: 'Toggle fullscreen' },
      { keys: ['D'], description: 'Toggle distraction-free mode' },
      { keys: ['M'], description: 'Cycle fullscreen modes' },
      { keys: ['Esc'], description: 'Exit fullscreen/Close viewer' },
      { keys: ['H'], description: 'Toggle advanced histogram (multi-zone, selective, 3D)' },
      { keys: ['K'], description: 'Toggle dominant colors' },
      { keys: ['C'], description: 'Toggle color analysis (temperature, palette, distribution)' },
      { keys: ['A'], description: 'Toggle quality assessment (sharpness, noise, focus, contrast)' },
      { keys: ['G'], description: 'Toggle grid overlay' },
      { keys: ['I'], description: 'Toggle info panel' },
    ],
  },
  {
    title: 'Image Operations',
    shortcuts: [
      { keys: ['R'], description: 'Rotate 90° clockwise' },
      { keys: ['Ctrl', 'R'], description: 'Rotate right', mac: ['⌘', 'R'] },
      { keys: ['Ctrl', 'Shift', 'R'], description: 'Rotate left', mac: ['⌘', '⇧', 'R'] },
      { keys: ['Ctrl', ']'], description: 'Rotate right', mac: ['⌘', ']'] },
      { keys: ['Ctrl', '['], description: 'Rotate left', mac: ['⌘', '['] },
      { keys: ['Ctrl', 'Shift', 'H'], description: 'Flip horizontal', mac: ['⌘', '⇧', 'H'] },
      { keys: ['Ctrl', 'Shift', 'V'], description: 'Flip vertical', mac: ['⌘', '⇧', 'V'] },
      { keys: ['C'], description: 'Crop tool' },
    ],
  },
  {
    title: 'Rating & Selection',
    shortcuts: [
      { keys: ['1', '2', '3', '4', '5'], description: 'Set star rating' },
      { keys: ['0'], description: 'Clear rating' },
      { keys: ['B'], description: 'Toggle favorite' },
      { keys: ['P'], description: 'Toggle pick flag' },
      { keys: ['X'], description: 'Toggle reject flag' },
      { keys: ['T'], description: 'Toggle rating panel' },
    ],
  },
  {
    title: 'Color Labels',
    shortcuts: [
      { keys: ['6'], description: 'Red label' },
      { keys: ['7'], description: 'Orange label' },
      { keys: ['8'], description: 'Yellow label' },
      { keys: ['9'], description: 'Green label' },
      { keys: ['Shift', '6'], description: 'Blue label' },
      { keys: ['Shift', '7'], description: 'Purple label' },
      { keys: ['Shift', '8'], description: 'Pink label' },
      { keys: ['Shift', '9'], description: 'Gray label' },
    ],
  },
  {
    title: 'File Operations',
    shortcuts: [
      { keys: ['Delete'], description: 'Delete image' },
      { keys: ['Backspace'], description: 'Delete image' },
      { keys: ['Ctrl', 'S'], description: 'Share image', mac: ['⌘', 'S'] },
      { keys: ['Ctrl', 'C'], description: 'Copy image', mac: ['⌘', 'C'] },
      { keys: ['Ctrl', 'V'], description: 'Paste image', mac: ['⌘', 'V'] },
      { keys: ['Ctrl', 'D'], description: 'Duplicate image', mac: ['⌘', 'D'] },
      { keys: ['F2'], description: 'Rename image' },
      { keys: ['Ctrl', 'E'], description: 'Export image', mac: ['⌘', 'E'] },
      { keys: ['E'], description: 'Edit image' },
    ],
  },
  {
    title: 'View Features',
    shortcuts: [
      { keys: ['Q'], description: 'Toggle quick actions' },
      { keys: ['V'], description: 'Toggle comparison view' },
      { keys: ['S'], description: 'Toggle slideshow' },
      { keys: ['Space'], description: 'Play/pause slideshow' },
      { keys: ['Ctrl', 'Shift', 'F'], description: 'Toggle filmstrip', mac: ['⌘', '⇧', 'F'] },
      { keys: ['Ctrl', 'Shift', 'M'], description: 'Toggle metadata', mac: ['⌘', '⇧', 'M'] },
      { keys: ['Ctrl', 'Shift', 'T'], description: 'Toggle thumbnails', mac: ['⌘', '⇧', 'T'] },
    ],
  },
  {
    title: 'Selection & Batch',
    shortcuts: [
      { keys: ['Ctrl', 'A'], description: 'Select all', mac: ['⌘', 'A'] },
      { keys: ['Ctrl', 'Shift', 'A'], description: 'Deselect all', mac: ['⌘', '⇧', 'A'] },
      { keys: ['Ctrl', 'I'], description: 'Invert selection', mac: ['⌘', 'I'] },
      { keys: ['Ctrl', 'Shift', 'B'], description: 'Batch favorite', mac: ['⌘', '⇧', 'B'] },
      { keys: ['Ctrl', 'Shift', 'D'], description: 'Batch delete', mac: ['⌘', '⇧', 'D'] },
      { keys: ['Ctrl', 'Shift', 'E'], description: 'Batch export', mac: ['⌘', '⇧', 'E'] },
    ],
  },
  {
    title: 'Search & Filter',
    shortcuts: [
      { keys: ['Ctrl', 'F'], description: 'Search images', mac: ['⌘', 'F'] },
      { keys: ['Ctrl', 'Shift', 'L'], description: 'Toggle filter', mac: ['⌘', '⇧', 'L'] },
      { keys: ['Ctrl', 'Shift', 'S'], description: 'Toggle sort', mac: ['⌘', '⇧', 'S'] },
    ],
  },
  {
    title: 'Performance',
    shortcuts: [
      { keys: ['F5'], description: 'Refresh view' },
      { keys: ['Ctrl', 'Shift', 'Delete'], description: 'Clear cache', mac: ['⌘', '⇧', 'Delete'] },
      { keys: ['Ctrl', 'Shift', '→'], description: 'Preload next', mac: ['⌘', '⇧', '→'] },
      { keys: ['Ctrl', 'Shift', '←'], description: 'Preload previous', mac: ['⌘', '⇧', '←'] },
    ],
  },
];

function KeyboardShortcut({
  keys,
  description,
  mac,
}: {
  keys: string[];
  description: string;
  mac?: string[];
}) {
  const isMac =
    typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const displayKeys = isMac && mac ? mac : keys;

  return (
    <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
      <span className="text-sm text-gray-700 dark:text-gray-300">{description}</span>
      <div className="flex items-center gap-1">
        {displayKeys.map((key, index) => (
          <span key={index} className="flex items-center gap-1">
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm">
              {key}
            </kbd>
            {index < displayKeys.length - 1 && <span className="text-gray-500">+</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export function KeyboardShortcutsHelp({
  isVisible,
  onToggle,
  className,
}: KeyboardShortcutsHelpProps) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={cn('text-white hover:bg-white/20', className)}
        title="Keyboard shortcuts (Ctrl+?)"
      >
        <Keyboard className="h-4 w-4" />
      </Button>

      {/* Help Dialog */}
      <Dialog open={isVisible} onOpenChange={onToggle}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Keyboard Shortcuts
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={onToggle}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <ScrollArea className="h-full p-4">
                <div className="space-y-2">
                  {shortcutGroups.map((group) => (
                    <button
                      key={group.title}
                      onClick={() =>
                        setSelectedGroup(selectedGroup === group.title ? null : group.title)
                      }
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        selectedGroup === group.title
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800',
                      )}
                    >
                      {group.title}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <ScrollArea className="h-full p-6">
                {selectedGroup ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{selectedGroup}</h3>
                    <div className="space-y-1">
                      {shortcutGroups
                        .find((g) => g.title === selectedGroup)
                        ?.shortcuts.map((shortcut, index) => (
                          <KeyboardShortcut
                            key={index}
                            keys={shortcut.keys}
                            description={shortcut.description}
                            mac={shortcut.mac}
                          />
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {shortcutGroups.map((group) => (
                      <div key={group.title}>
                        <h3 className="text-lg font-semibold mb-4">{group.title}</h3>
                        <div className="space-y-1">
                          {group.shortcuts.map((shortcut, index) => (
                            <KeyboardShortcut
                              key={index}
                              keys={shortcut.keys}
                              description={shortcut.description}
                              mac={shortcut.mac}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              <p>
                Press{' '}
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl</kbd>
                <span className="mx-1">+</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">?</kbd> to
                toggle this help dialog
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
