'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { usePageData } from '../layout';

export function LinkedItems() {
  const { album } = usePageData();

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Linked Items</h3>
        {album.items && album.items.length > 0 ? (
          <div className="space-y-3">
            {album.items.map((item, index) => {
              // Handle both direct items and relational items
              const itemData = item.data_items_id || item;
              return (
                <div
                  key={itemData.id || index}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <Badge variant="secondary">{itemData.type_id || itemData.type || 'Item'}</Badge>
                    <Link
                      href={`/collections/${itemData.type_id || itemData.type}/${itemData.id}`}
                      className="inline-flex gap-2 items-center text-primary hover:underline ml-2"
                    >
                      {itemData.title || itemData.name || 'Untitled Item'}
                    </Link>
                    {itemData.description && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {itemData.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No linked items</p>
        )}
      </CardContent>
    </Card>
  );
}
