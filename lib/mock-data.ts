import type { Album, DataItem, DataType, Photo } from './types';

export const mockDataTypes: DataType[] = [
  {
    id: '1',
    name: 'Color Profile',
    slug: 'color-profiles',
    description: 'Camera color profiles and color science settings',
    fields: [
      {
        id: '1',
        name: 'Camera Compatibility',
        field_type: 'dropdown',
        options: { options: ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Panasonic'] },
        required: true,
        order: 1,
      },
      {
        id: '2',
        name: 'Color Science',
        field_type: 'string',
        required: false,
        order: 2,
      },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Preset',
    slug: 'presets',
    description: 'Lightroom and photo editing presets',
    fields: [
      {
        id: '3',
        name: 'Author',
        field_type: 'string',
        required: true,
        order: 1,
      },
      {
        id: '4',
        name: 'Genre',
        field_type: 'dropdown',
        options: { options: ['Portrait', 'Landscape', 'Street', 'Wedding', 'Fashion'] },
        required: false,
        order: 2,
      },
      {
        id: '5',
        name: 'Mood',
        field_type: 'tags',
        required: false,
        order: 3,
      },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Color Style',
    slug: 'color-styles',
    description: 'Color grading styles and looks',
    fields: [
      {
        id: '6',
        name: 'Intensity',
        field_type: 'dropdown',
        options: { options: ['Subtle', 'Medium', 'Strong', 'Extreme'] },
        required: false,
        order: 1,
      },
      {
        id: '7',
        name: 'Best For',
        field_type: 'tags',
        required: false,
        order: 2,
      },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const mockDataItems: DataItem[] = [
  {
    id: '1',
    type_id: '1',
    slug: 'canon-natural',
    title: 'Canon Natural Profile',
    description: 'Natural color profile for Canon cameras with balanced tones',
    avatar: '/placeholder.svg?height=200&width=300',
    custom_values: {
      'Camera Compatibility': 'Canon',
      'Color Science': 'Natural, balanced color reproduction',
    },
    gallery: ['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600'],
    linked_album_ids: ['1'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    type_id: '2',
    slug: 'moody-portrait',
    title: 'Moody Portrait Preset',
    description: 'Dark and moody preset perfect for dramatic portraits',
    avatar: '/placeholder.svg?height=200&width=300',
    custom_values: {
      Author: 'John Photographer',
      Genre: 'Portrait',
      Mood: ['Dark', 'Moody', 'Dramatic'],
    },
    gallery: ['/placeholder.svg?height=400&width=600'],
    linked_album_ids: [],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const mockAlbums: Album[] = [
  {
    id: '1',
    name: 'Urban Photography Collection',
    slug: 'urban-photography',
    author: 'Jane Smith',
    link: 'https://example.com/urban-collection',
    description: 'A collection of urban photography showcasing city life and architecture',
    cover_image: '/placeholder.svg?height=300&width=400',
    photo_ids: ['1', '2', '3'],
    linked_item_ids: ['1', '2'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const mockPhotos: Photo[] = [
  {
    id: '1',
    // file: "/placeholder.svg?height=600&width=800",
    file: '/neom-SUIMrEKVOXc-origin.jpg',
    album_id: '1',
    tags: ['milkyway', 'night', 'stars'],
    linked_item_ids: ['1'],
    metadata: {
      camera: 'Canon EOS R5',
      lens: '24-70mm f/2.8',
      settings: 'f/8, 1/125s, ISO 200',
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    // file: "/placeholder.svg?height=600&width=800",
    file: '/yux-xiang-bAsOgzNy3XM-origin.jpg',
    album_id: '1',
    tags: ['urban', 'architecture', 'city', 'night'],
    linked_item_ids: ['1'],
    metadata: {
      camera: 'Canon EOS R5',
      lens: '24-70mm f/2.8',
      settings: 'f/8, 1/125s, ISO 200',
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    // file: "/placeholder.svg?height=600&width=800",
    file: '/tsuyoshi-kozu-9luf51j0R-0-origin.jpg',
    album_id: '1',
    tags: ['architecture', 'city'],
    linked_item_ids: ['1'],
    metadata: {
      camera: 'Canon EOS R5',
      lens: '24-70mm f/2.8',
      settings: 'f/8, 1/125s, ISO 200',
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];
