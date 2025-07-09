"use client"

import { Button } from "@/components/ui/button"
import { Grid, List, Eye, LayoutGrid } from "lucide-react"

export type ViewMode = "grid" | "list" | "detail" | "compact"

interface ViewSwitcherProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const views = [
    { mode: "grid" as ViewMode, icon: Grid, label: "Grid" },
    { mode: "list" as ViewMode, icon: List, label: "List" },
    { mode: "detail" as ViewMode, icon: Eye, label: "Detail" },
    { mode: "compact" as ViewMode, icon: LayoutGrid, label: "Compact" },
  ]

  return (
    <div className="flex items-center border rounded-md">
      {views.map((view) => (
        <Button
          key={view.mode}
          variant={currentView === view.mode ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange(view.mode)}
          className="rounded-none first:rounded-l-md last:rounded-r-md"
          title={view.label}
        >
          <view.icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  )
}
