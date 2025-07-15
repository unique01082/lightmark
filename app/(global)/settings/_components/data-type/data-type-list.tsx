'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Database, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { DataTypeCard } from './data-type-card';
import { DataType } from './types';

interface DataTypeListProps {
  dataTypes: DataType[];
  onCreateNew: () => void;
  onEdit: (dataType: DataType) => void;
  onView: (dataType: DataType) => void;
  onDuplicate: (dataType: DataType) => void;
  onDelete: (dataType: DataType) => void;
}

export function DataTypeList({
  dataTypes,
  onCreateNew,
  onEdit,
  onView,
  onDuplicate,
  onDelete,
}: DataTypeListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDataTypes = dataTypes.filter(
    (dataType) =>
      dataType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataType.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Data Types Management</CardTitle>
            <CardDescription>
              Create and manage custom data types for your photography workflow. Define custom
              fields and properties for each type.
            </CardDescription>
          </div>
          <Button onClick={onCreateNew}>
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
          {filteredDataTypes.map((dataType) => (
            <DataTypeCard
              key={dataType.id}
              dataType={dataType}
              onView={onView}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ))}
        </div>

        {filteredDataTypes.length === 0 && (
          <div className="text-center py-8">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No data types found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? 'No data types match your search.'
                : 'Create your first data type to get started.'}
            </p>
            {!searchQuery && (
              <Button onClick={onCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Data Type
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
