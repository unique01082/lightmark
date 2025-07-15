'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Database, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { DataType, ICONS } from './types';

interface DataTypeCardProps {
  dataType: DataType;
  onView: (dataType: DataType) => void;
  onEdit: (dataType: DataType) => void;
  onDuplicate: (dataType: DataType) => void;
  onDelete: (dataType: DataType) => void;
}

export function DataTypeCard({
  dataType,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}: DataTypeCardProps) {
  const getIcon = (iconName: string) => {
    const iconConfig = ICONS.find((icon) => icon.value === iconName);
    return iconConfig ? iconConfig.icon : Database;
  };

  const IconComponent = getIcon(dataType.icon);

  return (
    <Card
      className="relative group cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onView(dataType)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{dataType.name}</CardTitle>
              <CardDescription className="text-sm">
                {dataType.fields.length} custom fields
              </CardDescription>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(dataType);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(dataType);
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(dataType);
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4">{dataType.description}</p>

        <div className="space-y-2">
          <h5 className="text-sm font-medium">Custom Fields:</h5>
          <div className="flex flex-wrap gap-1">
            {dataType.fields.slice(0, 3).map((field) => (
              <Badge key={field.id} variant="secondary" className="text-xs">
                {field.name}
              </Badge>
            ))}
            {dataType.fields.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{dataType.fields.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
