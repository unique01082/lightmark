'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { usePageData } from '../layout';

export function AlbumTags() {
  const { getAllTags } = usePageData();

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Tags</h3>
        {getAllTags().length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {getAllTags().map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No tags available</p>
        )}
      </CardContent>
    </Card>
  );
}
