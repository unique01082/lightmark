'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GripVertical, X } from 'lucide-react';

import { CustomField, FIELD_TYPES } from './types';

interface DataTypeFieldEditorProps {
  field: CustomField;
  index: number;
  onUpdate: (updates: Partial<CustomField>) => void;
  onRemove: () => void;
}

export function DataTypeFieldEditor({
  field,
  index,
  onUpdate,
  onRemove,
}: DataTypeFieldEditorProps) {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Field {index + 1}</span>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Field Name</Label>
          <Input
            value={field.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g., Profile Name"
          />
        </div>

        <div>
          <Label>Field ID</Label>
          <Input
            value={field.id}
            onChange={(e) => onUpdate({ id: e.target.value })}
            placeholder="e.g., profile_name"
          />
        </div>
      </div>

      <div>
        <Label>Field Type</Label>
        <Select value={field.type} onValueChange={(value) => onUpdate({ type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FIELD_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(field.type === 'dropdown' || field.type === 'multiple-dropdown') && (
        <div>
          <Label>Options (comma-separated)</Label>
          <Input
            value={field.settings.options?.join(', ') || ''}
            onChange={(e) =>
              onUpdate({
                settings: {
                  ...field.settings,
                  options: e.target.value
                    .split(',')
                    .map((opt) => opt.trim())
                    .filter(Boolean),
                },
              })
            }
            placeholder="Option 1, Option 2, Option 3"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={`required-${field.id}`}
          checked={field.required}
          onChange={(e) => onUpdate({ required: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor={`required-${field.id}`} className="text-sm">
          Required field
        </Label>
      </div>
    </div>
  );
}
