import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DirectusService } from '@/lib/directus';
import { DataItem, DataType } from '@/lib/types';
import { Calendar, Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface TypePageProps {
  params: {
    type: string;
  };
}

export default async function TypePage({ params }: TypePageProps) {
  let dataType: DataType | null = null;
  let dataItems: DataItem[] = [];

  try {
    dataType = (await DirectusService.getDataType(params.type)) as DataType | null;

    if (!dataType) {
      notFound();
    }

    // Get all data items of this type
    const allItems = await DirectusService.getDataItems({ type: { _eq: params.type } });
    dataItems = (allItems || []) as DataItem[];
  } catch (error) {
    console.error('Failed to fetch data:', error);
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">All {dataType.name}</h2>
          <p className="text-muted-foreground">
            {dataItems.length} {dataItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <Button asChild>
          <Link href={`/${params.type}/new`}>
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Link>
        </Button>
      </div>

      {/* Items grid */}
      {dataItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No items found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first {dataType.name.toLowerCase()}.
              </p>
              <Button asChild>
                <Link href={`/${params.type}/new`}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Item
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {item.avatar && (
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={DirectusService.getAssetUrl(item.avatar)}
                          alt={item.name}
                        />
                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Show a few key fields */}
                  <div className="space-y-2">
                    {dataType.fields.slice(0, 3).map((field) => {
                      const value = item.fields[field.id];
                      if (!value) return null;

                      return (
                        <div key={field.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{field.name}:</span>
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(value) ? (
                              value.slice(0, 2).map((v, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {v}
                                </Badge>
                              ))
                            ) : (
                              <span className="font-medium">{String(value)}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.date_created).toLocaleDateString()}</span>
                    </div>
                    {item.albums && item.albums.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span>
                          {item.albums.length} album{item.albums.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={`/${params.type}/${item.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
