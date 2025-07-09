"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Keyboard } from "lucide-react";

const shortcuts = [
  { keys: ["Ctrl", "K"], description: "Open search" },
  { keys: ["Ctrl", "N"], description: "Create new item" },
  { keys: ["Ctrl", "S"], description: "Save current form" },
  { keys: ["Escape"], description: "Close dialog/modal" },
  { keys: ["Alt", "H"], description: "Go to home" },
  { keys: ["Alt", "A"], description: "Go to albums" },
  { keys: ["Alt", "P"], description: "Go to photos" },
  { keys: ["Alt", "S"], description: "Go to settings" },
  { keys: ["?"], description: "Show keyboard shortcuts" },
  { keys: ["←", "→"], description: "Navigate media viewer" },
  { keys: ["+", "-"], description: "Zoom in/out media viewer" },
  { keys: ["F"], description: "Toggle fullscreen" },
];

export function KeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "k":
            e.preventDefault();
            // Focus search input
            const searchInput = document.querySelector(
              'input[placeholder*="Search"]'
            ) as HTMLInputElement;
            searchInput?.focus();
            break;
          case "n":
            e.preventDefault();
            // Trigger new item creation
            const newButton = document.querySelector(
              'button:has([data-lucide="plus"])'
            ) as HTMLButtonElement;
            newButton?.click();
            break;
        }
      }

      // Navigation shortcuts
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const nextKey = new Promise<string>((resolve) => {
          const handler = (nextE: KeyboardEvent) => {
            document.removeEventListener("keydown", handler);
            resolve(nextE.key);
          };
          document.addEventListener("keydown", handler);
          setTimeout(() => {
            document.removeEventListener("keydown", handler);
            resolve("");
          }, 1000);
        });

        nextKey.then((key) => {
          switch (key) {
            case "h":
              window.location.href = "/";
              break;
            case "a":
              window.location.href = "/albums";
              break;
            case "p":
              window.location.href = "/photos";
              break;
            case "s":
              window.location.href = "/settings";
              break;
          }
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="fixed bottom-4 right-4 z-50"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <span className="text-sm">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <Badge
                    key={keyIndex}
                    variant="outline"
                    className="font-mono text-xs"
                  >
                    {key}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
