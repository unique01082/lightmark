"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Palette,
  Sliders,
  Sparkles,
  FolderOpen,
  ImageIcon,
  HelpCircle,
  BookOpen,
  Settings,
} from "lucide-react";
import { useRequest } from "ahooks";
import { DirectusService } from "@/lib/directus";
import { useState } from "react";
// import { DynamicIcon } from "lucide-react/dynamic";

const navigation = [
  { name: "Home", href: "/", icon: "home" },
  // { name: "Presets", href: "/presets", icon: "sliders" },
  // { name: "Color Profiles", href: "/color-profiles", icon: "palette" },
  // { name: "Color Styles", href: "/color-styles", icon: "sparkles" },
  { name: "Albums", href: "/albums", icon: "album" },
  { name: "Photos", href: "/photos", icon: "image" },
  { name: "FAQs", href: "/faqs", icon: "message-circle-question-mark" },
  { name: "Guides", href: "/guides", icon: "book-open-text" },
  { name: "Settings", href: "/settings", icon: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  const [menuItems, setMenuItems] = useState(navigation);

  const { loading } = useRequest(DirectusService.getDataTypes, {
    onSuccess: (data) => {
      const newMenuItems = data.map((item) => ({
        name: item.name,
        href: `/collections/${item.slug}`,
        icon: item.icon,
      }));
      setMenuItems(([first, ...rest]) => [first, ...newMenuItems, ...rest]);
    },
    onError: (error) => {
      console.error("Failed to fetch data types:", error);
    },
  });

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {!loading && (
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex gap-2 items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {/* <DynamicIcon name={item.icon as any} /> */}
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
