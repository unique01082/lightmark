'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DirectusService } from '@/lib/directus';
import type { DataItem } from '@/lib/types';
import { Edit, ExternalLink, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DataItemCardProps {
  item: DataItem;
  dataType: any;
  onView: (images: string[], startIndex?: number) => void;
  onEdit: (item: DataItem) => void;
  onDelete: (item: DataItem) => void;
}

export function DataItemCard({ item, dataType, onView, onEdit, onDelete }: DataItemCardProps) {
  const pathname = usePathname();
  const dataTypeSlug = dataType?.slug || dataType?.id;

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
        <img
          src={
            item.avatar
              ? DirectusService.getAssetUrl(item.avatar)
              : '/placeholder.svg?height=200&width=300'
          }
          alt={item.name || 'Item'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                // Create images array for viewer
                const images = [...(item.avatar ? [DirectusService.getAssetUrl(item.avatar)] : [])];
                if (images.length > 0) {
                  onView(images);
                }
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onEdit(item)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(item)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
        <div className="space-y-2">
          {item.fields &&
            Object.entries(item.fields).map(([key, value]) => {
              // Find the field definition to get the display name
              const fieldDef = dataType?.fields?.find((f: any) => f.id === key);
              const fieldName = fieldDef?.name || key;

              if (!value || (Array.isArray(value) && value.length === 0)) return null;

              return (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{fieldName}:</span>
                  <span className="font-medium">
                    {Array.isArray(value) ? (
                      <div className="flex gap-1 flex-wrap">
                        {value.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {value.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{value.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-right">{String(value)}</span>
                    )}
                  </span>
                </div>
              );
            })}
        </div>
        <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t">
          <Badge variant="secondary">{dataType?.name}</Badge>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{item.albums?.length || 0} albums</span>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/collections/${dataTypeSlug}/${item.id}`}>
                <ExternalLink className="h-3 w-3 mr-1" />
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
