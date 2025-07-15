'use client';

import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { DirectusService } from '@/lib/directus';
import { useRequest } from 'ahooks';
import { useState } from 'react';

import { DataType, DataTypeDetailDialog, DataTypeFormDialog, DataTypeList } from './data-type';

export function DataTypeSettings() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDataType, setEditingDataType] = useState<DataType | null>(null);
  const [deletingDataType, setDeletingDataType] = useState<DataType | null>(null);
  const [viewingDataType, setViewingDataType] = useState<DataType | null>(null);
  const { toast } = useToast();

  const {
    data: dataTypes = [],
    runAsync: loadDataTypes,
    loading,
  } = useRequest(DirectusService.getDataTypes, {});

  const typedDataTypes = dataTypes as DataType[];

  const handleCreateDataType = () => {
    setEditingDataType(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditDataType = (dataType: DataType) => {
    setEditingDataType(dataType);
    setIsCreateDialogOpen(true);
  };

  const handleViewDataType = (dataType: DataType) => {
    setViewingDataType(dataType);
  };

  const handleDuplicateDataType = async (dataType: DataType) => {
    try {
      const newName = window.prompt(
        'Enter a name for the duplicated data type:',
        `${dataType.name} (Copy)`,
      );
      if (!newName || !newName.trim()) {
        toast({
          title: 'Cancelled',
          description: 'Duplication cancelled. No name provided.',
          variant: 'destructive',
        });
        return;
      }
      const duplicated = {
        ...dataType,
        id: newName.toLowerCase().replace(/\s+/g, '-'),
        name: newName,
        slug: newName.toLowerCase().replace(/\s+/g, '-'),
        fields: dataType.fields.map((field) => ({
          ...field,
          id: field.id + '_copy',
        })),
      };

      await DirectusService.createDataType(duplicated);
      await loadDataTypes();

      toast({
        title: 'Success',
        description: 'Data type duplicated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate data type',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDataType = async (dataType: DataType) => {
    try {
      await DirectusService.deleteDataType(dataType.id);
      await loadDataTypes();
      setDeletingDataType(null);

      toast({
        title: 'Success',
        description: 'Data type deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete data type',
        variant: 'destructive',
      });
    }
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
      {/* Data Types List */}
      <DataTypeList
        dataTypes={typedDataTypes}
        onCreateNew={handleCreateDataType}
        onEdit={handleEditDataType}
        onView={handleViewDataType}
        onDuplicate={handleDuplicateDataType}
        onDelete={setDeletingDataType}
      />

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

      {/* View Detail Dialog */}
      <DataTypeDetailDialog
        isOpen={!!viewingDataType}
        onClose={() => setViewingDataType(null)}
        dataType={viewingDataType}
        onEdit={(dataType) => {
          setViewingDataType(null);
          handleEditDataType(dataType);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deletingDataType}
        onClose={() => setDeletingDataType(null)}
        onConfirm={() => deletingDataType && handleDeleteDataType(deletingDataType)}
        title="Delete Data Type"
        description={`Are you sure you want to delete "${deletingDataType?.name}"? This action cannot be undone and will also delete all associated data items.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
