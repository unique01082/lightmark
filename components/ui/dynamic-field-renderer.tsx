import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DirectusService } from '@/lib/directus';
import { CustomField } from '@/lib/types';
import { CalendarDays, File, Image, Link as LinkIcon, Tag, Video } from 'lucide-react';

interface DynamicFieldRendererProps {
  field: CustomField;
  value: any;
  isReadOnly?: boolean;
}

export function DynamicFieldRenderer({
  field,
  value,
  isReadOnly = false,
}: DynamicFieldRendererProps) {
  const renderFieldValue = () => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">No value</span>;
    }

    switch (field.type) {
      case 'string':
        return <span>{value}</span>;

      case 'number':
        return <span className="font-mono">{value}</span>;

      case 'datetime':
        return (
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span>{new Date(value).toLocaleDateString()}</span>
          </div>
        );

      case 'link':
        return (
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {value}
            </a>
          </div>
        );

      case 'image':
        return (
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={DirectusService.getAssetUrl(value)} alt="Image" />
              <AvatarFallback>
                <Image className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">Image file</span>
          </div>
        );

      case 'video':
        return (
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">Video file</span>
          </div>
        );

      case 'file':
        return (
          <div className="flex items-center gap-2">
            <File className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">File attachment</span>
          </div>
        );

      case 'tags':
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          );
        }
        return <span>{value}</span>;

      case 'dropdown':
        return <Badge variant="outline">{value}</Badge>;

      case 'multiple-dropdown':
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.map((item: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          );
        }
        return <span>{value}</span>;

      case 'radio':
        return <Badge variant="outline">{value}</Badge>;

      default:
        return <span>{String(value)}</span>;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h3 className="font-medium">{field.name}</h3>
        {field.required && (
          <Badge variant="destructive" className="text-xs">
            Required
          </Badge>
        )}
      </div>

      <div className="pl-0">{renderFieldValue()}</div>

      {/* Show field options for reference if it's a dropdown/radio */}
      {(field.type === 'dropdown' ||
        field.type === 'radio' ||
        field.type === 'multiple-dropdown') &&
        field.settings?.options && (
          <div className="text-xs text-muted-foreground">
            <span>Options: </span>
            {field.settings.options.join(', ')}
          </div>
        )}
    </div>
  );
}
