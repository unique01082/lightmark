'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { usePageData } from '../layout';

export function AlbumInfo() {
  const { album, getAlbumStats } = usePageData();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{album.description}</p>
          </div>

          {album.links && album.links.length > 0 && (
            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold mb-2">External Links</h3>
              {album.links.map((link: { url: string; type: string }, index: number) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex gap-2 items-center text-primary hover:underline"
                >
                  <Badge variant="secondary">{link.type}</Badge>
                  <span className="truncate">{link.url}</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{getAlbumStats().totalPhotos} photos</span>
            <span>•</span>
            <span>{getAlbumStats().totalTags} tags</span>
            <span>•</span>
            <span>Created {new Date(album.date_created).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
