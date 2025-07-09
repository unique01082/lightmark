import type { DataType, DataItem, Album, Photo } from "./types"

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

export function validateDataType(dataType: Partial<DataType>): void {
  if (!dataType.name?.trim()) {
    throw new ValidationError("Name is required", "name")
  }

  if (dataType.name.length > 100) {
    throw new ValidationError("Name must be less than 100 characters", "name")
  }

  if (dataType.description && dataType.description.length > 500) {
    throw new ValidationError("Description must be less than 500 characters", "description")
  }

  // Validate fields
  if (dataType.fields) {
    dataType.fields.forEach((field, index) => {
      if (!field.name?.trim()) {
        throw new ValidationError(`Field ${index + 1} name is required`, `fields.${index}.name`)
      }

      if (!field.field_type) {
        throw new ValidationError(`Field ${index + 1} type is required`, `fields.${index}.field_type`)
      }

      if ((field.field_type === "dropdown" || field.field_type === "radio") && !field.options?.options?.length) {
        throw new ValidationError(`Field ${index + 1} must have options`, `fields.${index}.options`)
      }
    })
  }
}

export function validateDataItem(item: Partial<DataItem>, dataType: DataType): void {
  if (!item.title?.trim()) {
    throw new ValidationError("Title is required", "title")
  }

  if (item.title.length > 200) {
    throw new ValidationError("Title must be less than 200 characters", "title")
  }

  if (item.description && item.description.length > 1000) {
    throw new ValidationError("Description must be less than 1000 characters", "description")
  }

  // Validate custom fields
  if (item.custom_values && dataType.fields) {
    dataType.fields.forEach((field) => {
      const value = item.custom_values![field.name]

      if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
        throw new ValidationError(`${field.name} is required`, `custom_values.${field.name}`)
      }

      if (value) {
        switch (field.field_type) {
          case "number":
            if (isNaN(Number(value))) {
              throw new ValidationError(`${field.name} must be a number`, `custom_values.${field.name}`)
            }
            break
          case "link":
            try {
              new URL(value)
            } catch {
              throw new ValidationError(`${field.name} must be a valid URL`, `custom_values.${field.name}`)
            }
            break
          case "dropdown":
          case "radio":
            if (field.options?.options && !field.options.options.includes(value)) {
              throw new ValidationError(
                `${field.name} must be one of: ${field.options.options.join(", ")}`,
                `custom_values.${field.name}`,
              )
            }
            break
        }
      }
    })
  }
}

export function validateAlbum(album: Partial<Album>): void {
  if (!album.name?.trim()) {
    throw new ValidationError("Album name is required", "name")
  }

  if (album.name.length > 100) {
    throw new ValidationError("Album name must be less than 100 characters", "name")
  }

  if (!album.author?.trim()) {
    throw new ValidationError("Author is required", "author")
  }

  if (album.link) {
    try {
      new URL(album.link)
    } catch {
      throw new ValidationError("Link must be a valid URL", "link")
    }
  }

  if (album.description && album.description.length > 1000) {
    throw new ValidationError("Description must be less than 1000 characters", "description")
  }
}

export function validatePhoto(photo: Partial<Photo>): void {
  if (!photo.file?.trim()) {
    throw new ValidationError("Photo file is required", "file")
  }

  if (photo.tags && photo.tags.some((tag) => !tag.trim())) {
    throw new ValidationError("Tags cannot be empty", "tags")
  }
}
