'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { DirectusService } from '@/lib/directus';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { DataTypeFieldEditor } from './data-type-field-editor';
import { CustomField, DataType, ICONS } from './types';

interface DataTypeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dataType: DataType | null;
  onSave: () => void;
}

export function DataTypeFormDialog({ isOpen, onClose, dataType, onSave }: DataTypeFormDialogProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    slug: '',
    description: '',
    icon: 'database',
    fields: [] as CustomField[],
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (dataType) {
      setFormData({
        id: dataType.id,
        name: dataType.name,
        slug: dataType.slug,
        description: dataType.description,
        icon: dataType.icon,
        fields: [...dataType.fields],
      });
    } else {
      setFormData({
        id: '',
        name: '',
        slug: '',
        description: '',
        icon: 'database',
        fields: [],
      });
    }
  }, [dataType, isOpen]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the data type',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.id.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an ID for the data type',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      if (dataType) {
        await DirectusService.updateDataType(dataType.id, formData);
        toast({
          title: 'Success',
          description: 'Data type updated successfully',
        });
      } else {
        await DirectusService.createDataType(formData);
        toast({
          title: 'Success',
          description: 'Data type created successfully',
        });
      }

      onSave();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${dataType ? 'update' : 'create'} data type`,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const addField = () => {
    const newField: CustomField = {
      id: `field_${Date.now()}`,
      name: '',
      type: 'string',
      required: false,
      settings: {},
    };
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const updateField = (originalFieldId: string, updates: Partial<CustomField>) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === originalFieldId ? { ...field, ...updates } : field,
      ),
    }));
  };

  const removeField = (fieldId: string) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== fieldId),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dataType ? 'Edit Data Type' : 'Create Data Type'}</DialogTitle>
          <DialogDescription>
            Define a custom data type with specific fields and properties for your photography
            workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/\s+/g, '-');
                    const id = slug;
                    setFormData((prev) => ({ ...prev, name, slug, id }));
                  }}
                  placeholder="e.g., Color Profiles, Presets, Styles"
                />
              </div>

              <div>
                <Label htmlFor="id">Data Type ID</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, id: e.target.value }))}
                  placeholder="e.g., color-profiles, presets, styles"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="e.g., color-profiles, presets, styles"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe what this data type is used for..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICONS.map((icon) => {
                    const IconComponent = icon.icon;
                    return (
                      <SelectItem key={icon.value} value={icon.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {icon.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom Fields */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Custom Fields</Label>
              <Button type="button" variant="outline" size="sm" onClick={addField}>
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>

            <div className="space-y-3">
              {formData.fields.map((field, index) => (
                <DataTypeFieldEditor
                  key={field.id}
                  field={field}
                  index={index}
                  onUpdate={(updates) => updateField(field.id, updates)}
                  onRemove={() => removeField(field.id)}
                />
              ))}

              {formData.fields.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No custom fields added yet</p>
                  <Button type="button" variant="ghost" onClick={addField} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first field
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <LoadingSpinner size="sm" className="mr-2" />}
              {dataType ? 'Update' : 'Create'} Data Type
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
