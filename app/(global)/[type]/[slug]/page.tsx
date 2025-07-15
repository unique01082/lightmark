import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DirectusService } from '@/lib/directus';
import { DataItem, DataType } from '@/lib/types';
import { Calendar, Edit, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DynamicFieldRenderer } from '../../../../components/ui/dynamic-field-renderer';

interface DataItemDetailPageProps {
  params: {
    type: string;
    slug: string;
  };
}

export default async function DataItemDetailPage({ params }: DataItemDetailPageProps) {
  let dataItem: DataItem | null = null;
  let dataType: DataType | null = null;

  try {
    // First get the data type to understand the structure
    dataType = (await DirectusService.getDataType(params.type)) as DataType | null;

    if (!dataType) {
      notFound();
    }

    // Then get the data item
    dataItem = (await DirectusService.getDataItem(params.slug)) as DataItem | null;

    if (!dataItem || dataItem.type !== params.type) {
      notFound();
    }
  } catch (error) {
    console.error('Failed to fetch data item:', error);
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {dataItem.avatar && (
            <Avatar className="w-16 h-16">
              <AvatarImage src={DirectusService.getAssetUrl(dataItem.avatar)} alt={dataItem.name} />
              <AvatarFallback>{dataItem.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <div>
            <h1 className="text-3xl font-bold">{dataItem.name}</h1>
            <p className="text-muted-foreground mt-1">{dataItem.description}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/${params.type}/${params.slug}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Created: {new Date(dataItem.date_created).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Updated: {new Date(dataItem.date_updated).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">{dataType.name}</Badge>
            <span className="text-sm text-muted-foreground">Type</span>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {dataType.fields.map((field, index) => (
              <div key={field.id}>
                <DynamicFieldRenderer
                  field={field}
                  value={dataItem.fields[field.id]}
                  isReadOnly={true}
                />
                {index < dataType.fields.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Albums */}
      {dataItem.albums && dataItem.albums.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Albums</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {dataItem.albums.map((albumId) => (
                <Link key={albumId} href={`/albums/${albumId}`}>
                  <Badge variant="outline">Album {albumId}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
