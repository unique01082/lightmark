'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Database, Edit } from 'lucide-react';
import { DataType, FIELD_TYPES, ICONS } from './types';

interface DataTypeDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dataType: DataType | null;
  onEdit: (dataType: DataType) => void;
}

export function DataTypeDetailDialog({
  isOpen,
  onClose,
  dataType,
  onEdit,
}: DataTypeDetailDialogProps) {
  if (!dataType) return null;

  const IconComponent = ICONS.find((icon) => icon.value === dataType.icon)?.icon || Database;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle>{dataType.name}</DialogTitle>
              <DialogDescription>
                Data Type Details • {dataType.fields.length} custom fields
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">ID</Label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{dataType.id}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <p className="text-sm">{dataType.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Slug</Label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{dataType.slug}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Icon</Label>
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <span className="text-sm">{dataType.icon}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Created</Label>
                  <p className="text-sm">{new Date(dataType.date_created).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Updated</Label>
                  <p className="text-sm">{new Date(dataType.date_updated).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Created By</Label>
                  <p className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {dataType.user_created}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Updated By</Label>
                  <p className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {dataType.user_updated}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {dataType.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          {/* Custom Fields */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Custom Fields ({dataType.fields.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {dataType.fields.length === 0 ? (
                <p className="text-sm text-muted-foreground">No custom fields defined.</p>
              ) : (
                <div className="space-y-3">
                  {dataType.fields.map((field) => (
                    <div key={field.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{field.name}</span>
                          {field.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {FIELD_TYPES.find((t) => t.value === field.type)?.label || field.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        ID:{' '}
                        <span className="font-mono bg-muted px-1 py-0.5 rounded">{field.id}</span>
                      </div>
                      {field.settings.options && field.settings.options.length > 0 && (
                        <div className="mt-2">
                          <Label className="text-xs text-muted-foreground">Options:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {field.settings.options.map((option, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {option}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onEdit(dataType)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Data Type
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
