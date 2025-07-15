export interface DataType {
  id: string
  user_created: string
  date_created: string
  user_updated: string
  date_updated: string
  name: string
  slug: string
  description: string
  icon?: string
  fields: CustomField[]
}

export interface CustomField {
  id: string
  name: string
  type: "string" | "number" | "link" | "datetime" | "image" | "video" | "file" | "tags" | "dropdown" | "radio" | "multiple-dropdown"
  required: boolean
  settings?: {
    options?: string[]
  }
}

export interface DataItem {
  id: string
  user_created: string
  date_created: string
  user_updated: string
  date_updated: string
  type: string
  fields: Record<string, any>
  name: string
  description: string
  avatar?: string
  albums?: number[]
}

export interface Album {
  id: string
  name: string
  author: string
  links: { url: string, type: string }[];
  description: string
  avatar?: string
  photos: string[]
  items: string[]
  date_created: string
  date_updated: string
}

export interface Photo {
  id: string
  file: string
  album_id?: string
  tags: string[]
  items: string[]
  metadata: Record<string, any>
  date_created: string
  date_updated: string
}

export interface User {
  id: string
  email: string
  role: "admin" | "viewer"
  preferences: Record<string, any>
  date_created: string
  date_updated: string
}
