export interface DataType {
  id: string
  name: string
  slug: string
  description: string
  avatar?: string
  fields: CustomField[]
  created_at: string
  updated_at: string
}

export interface CustomField {
  id: string
  name: string
  field_type: "string" | "number" | "link" | "datetime" | "image" | "video" | "file" | "tags" | "dropdown" | "radio"
  options?: { options?: string[] }
  required: boolean
  order: number
}

export interface DataItem {
  id: string
  type_id: string
  slug: string
  title: string
  description: string
  avatar?: string
  custom_values: Record<string, any>
  gallery: string[]
  linked_album_ids: string[]
  created_at: string
  updated_at: string
}

export interface Album {
  id: string
  name: string
  slug: string
  author: string
  link: string
  description: string
  cover_image?: string
  photo_ids: string[]
  linked_item_ids: string[]
  created_at: string
  updated_at: string
}

export interface Photo {
  id: string
  file: string
  album_id?: string
  tags: string[]
  linked_item_ids: string[]
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  role: "admin" | "viewer"
  preferences: Record<string, any>
  created_at: string
  updated_at: string
}
