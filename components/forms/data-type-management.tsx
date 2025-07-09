"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DirectusService } from "@/lib/directus";
import { useRequest } from "ahooks";
import {
  Brush,
  Camera,
  Copy,
  Database,
  Edit,
  GripVertical,
  MoreHorizontal,
  Palette,
  Plus,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface DataType {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: CustomField[];
  created_at: string;
  updated_at: string;
}

interface CustomField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  order: number;
  options?: string[];
}

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Long Text" },
  { value: "number", label: "Number" },
  { value: "select", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
  { value: "date", label: "Date" },
  { value: "file", label: "File" },
];

const ICONS = [
  { value: "palette", label: "Palette", icon: Palette },
  { value: "settings", label: "Settings", icon: Settings },
  { value: "brush", label: "Brush", icon: Brush },
  { value: "camera", label: "Camera", icon: Camera },
  { value: "database", label: "Database", icon: Database },
];

export function DataTypeManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDataType, setEditingDataType] = useState<DataType | null>(null);
  const [deletingDataType, setDeletingDataType] = useState<DataType | null>(
    null
  );
  const { toast } = useToast();

  const {
    data: dataTypes = [],
    runAsync: loadDataTypes,
    loading,
  } = useRequest(DirectusService.getDataTypes, {});
  console.log("dataTypes :>> ", dataTypes);

  const handleCreateDataType = () => {
    setEditingDataType(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditDataType = (dataType: DataType) => {
    setEditingDataType(dataType);
    setIsCreateDialogOpen(true);
  };

  const handleDuplicateDataType = async (dataType: DataType) => {
    try {
      const duplicated = {
        ...dataType,
        name: `${dataType.name} (Copy)`,
        fields: dataType.fields.map((field) => ({
          ...field,
          id: Date.now().toString() + Math.random(),
        })),
      };
      delete (duplicated as any).id;

      await DirectusService.createDataType(duplicated);
      await loadDataTypes();

      toast({
        title: "Success",
        description: "Data type duplicated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate data type",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDataType = async (dataType: DataType) => {
    try {
      await DirectusService.deleteDataType(dataType.id);
      await loadDataTypes();
      setDeletingDataType(null);

      toast({
        title: "Success",
        description: "Data type deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete data type",
        variant: "destructive",
      });
    }
  };

  const filteredDataTypes = dataTypes.filter(
    (dataType) =>
      dataType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataType.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (iconName: string) => {
    const iconConfig = ICONS.find((icon) => icon.value === iconName);
    return iconConfig ? iconConfig.icon : Database;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Types Management</CardTitle>
              <CardDescription>
                Create and manage custom data types for your photography
                workflow. Define custom fields and properties for each type.
              </CardDescription>
            </div>
            <Button onClick={handleCreateDataType}>
              <Plus className="h-4 w-4 mr-2" />
              Create Data Type
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search data types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Data Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDataTypes.map((dataType) => {
              const IconComponent = getIcon(dataType.icon);

              return (
                <Card key={dataType.id} className="relative group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {dataType.name}
                          </CardTitle>
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
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditDataType(dataType)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicateDataType(dataType)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingDataType(dataType)}
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
                    <p className="text-sm text-muted-foreground mb-4">
                      {dataType.description}
                    </p>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Custom Fields:</h5>
                      <div className="flex flex-wrap gap-1">
                        {dataType.fields.slice(0, 3).map((field) => (
                          <Badge
                            key={field.id}
                            variant="secondary"
                            className="text-xs"
                          >
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
            })}
          </div>

          {filteredDataTypes.length === 0 && (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No data types found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "No data types match your search."
                  : "Create your first data type to get started."}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreateDataType}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Data Type
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <DataTypeFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setEditingDataType(null);
        }}
        dataType={editingDataType}
        onSave={loadDataTypes}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deletingDataType}
        onClose={() => setDeletingDataType(null)}
        onConfirm={() =>
          deletingDataType && handleDeleteDataType(deletingDataType)
        }
        title="Delete Data Type"
        description={`Are you sure you want to delete "${deletingDataType?.name}"? This action cannot be undone and will also delete all associated data items.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}

interface DataTypeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dataType: DataType | null;
  onSave: () => void;
}

function DataTypeFormDialog({
  isOpen,
  onClose,
  dataType,
  onSave,
}: DataTypeFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "database",
    fields: [] as CustomField[],
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (dataType) {
      setFormData({
        name: dataType.name,
        description: dataType.description,
        icon: dataType.icon,
        fields: [...dataType.fields],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        icon: "database",
        fields: [],
      });
    }
  }, [dataType, isOpen]);

  const handleSave = async () => {
    console.log("formData :>> ", formData);
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the data type",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      if (dataType) {
        await DirectusService.updateDataType(dataType.id, formData);
        toast({
          title: "Success",
          description: "Data type updated successfully",
        });
      } else {
        await DirectusService.createDataType(formData);
        toast({
          title: "Success",
          description: "Data type created successfully",
        });
      }

      onSave();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${dataType ? "update" : "create"} data type`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      name: "",
      type: "text",
      required: false,
      order: formData.fields.length + 1,
    };
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const updateField = (fieldId: string, updates: Partial<CustomField>) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
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
          <DialogTitle>
            {dataType ? "Edit Data Type" : "Create Data Type"}
          </DialogTitle>
          <DialogDescription>
            Define a custom data type with specific fields and properties for
            your photography workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Color Profiles, Presets, Styles"
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
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, icon: value }))
                }
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addField}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>

            <div className="space-y-3">
              {formData.fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Field {index + 1}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(field.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Field Name</Label>
                      <Input
                        value={field.name}
                        onChange={(e) =>
                          updateField(field.id, { name: e.target.value })
                        }
                        placeholder="e.g., Profile Name"
                      />
                    </div>

                    <div>
                      <Label>Field Type</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value) =>
                          updateField(field.id, { type: value })
                        }
                      >
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
                  </div>

                  {field.type === "select" && (
                    <div>
                      <Label>Options (comma-separated)</Label>
                      <Input
                        value={field.options?.join(", ") || ""}
                        onChange={(e) =>
                          updateField(field.id, {
                            options: e.target.value
                              .split(",")
                              .map((opt) => opt.trim())
                              .filter(Boolean),
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
                      onChange={(e) =>
                        updateField(field.id, { required: e.target.checked })
                      }
                      className="rounded"
                    />
                    <Label htmlFor={`required-${field.id}`} className="text-sm">
                      Required field
                    </Label>
                  </div>
                </div>
              ))}

              {formData.fields.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    No custom fields added yet
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={addField}
                    className="mt-2"
                  >
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
              {dataType ? "Update" : "Create"} Data Type
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
