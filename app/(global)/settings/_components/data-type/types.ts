import {
  Brush,
  Camera,
  Database,
  Palette,
  Settings
} from 'lucide-react';

export interface DataType {
  id: string;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  fields: CustomField[];
}

export interface CustomField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  settings: {
    options?: string[];
  };
}

export const FIELD_TYPES = [
  { value: 'string', label: 'Text' },
  { value: 'text', label: 'Long Text' },
  { value: 'integer', label: 'Number' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'multiple-dropdown', label: 'Multiple Dropdown' },
  { value: 'boolean', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
  { value: 'file', label: 'File' },
];

export const ICONS = [
  { value: 'palette', label: 'Palette', icon: Palette },
  { value: 'settings', label: 'Settings', icon: Settings },
  { value: 'brush', label: 'Brush', icon: Brush },
  { value: 'camera', label: 'Camera', icon: Camera },
  { value: 'database', label: 'Database', icon: Database },
  { value: 'file-sliders', label: 'File Sliders', icon: Settings },
];
