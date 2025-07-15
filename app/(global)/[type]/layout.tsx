import { DirectusService } from '@/lib/directus';
import { DataType } from '@/lib/types';
import { notFound } from 'next/navigation';
import React from 'react';

interface TypeLayoutProps {
  children: React.ReactNode;
  params: {
    type: string;
  };
}

export default async function TypeLayout({ children, params }: TypeLayoutProps) {
  let dataType: DataType | null = null;

  try {
    dataType = await DirectusService.getDataType(params.type);
  } catch (error) {
    console.error('Failed to fetch data type:', error);
  }

  if (!dataType) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {dataType.icon && (
            <div className="p-2 rounded-lg bg-primary/10">
              <div className="w-6 h-6 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{dataType.name}</h1>
            <p className="text-muted-foreground">{dataType.description}</p>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
