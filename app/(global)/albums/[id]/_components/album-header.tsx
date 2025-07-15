'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePageData } from '../layout';

interface AlbumHeaderProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function AlbumHeader({ onEdit, onDelete }: AlbumHeaderProps) {
  const { album } = usePageData();

  return (
    <div className="flex items-center gap-4 mb-6">
      <Link href="/albums">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{album.name}</h1>
        <p className="text-muted-foreground">by {album.author ?? 'Unknown'}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}
