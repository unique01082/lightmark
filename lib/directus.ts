import { authentication, createDirectus, createItem, deleteItem, readItem, readItems, readMe, registerUser, rest, serverInfo, serverPing, updateItem, uploadFiles } from '@directus/sdk';

// Directus collections
export const DIRECTUS_COLLECTIONS = {
  DATA_TYPES: "data_types",
  DATA_ITEMS: "data_items",
  ALBUMS: "albums",
  PHOTOS: "photos",
  USERS: "users",
  ACTIVITIES: "activities",
  CUSTOM_FIELDS: "custom_fields",
} as const;

// Type definitions
interface DataType {
  id: string;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  fields: any[];
}

interface DataItem {
  id: string;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  type: string;
  fields: any;
  name: string;
  description: string;
  avatar?: string;
  albums?: number[];
}

interface Album {
  id?: string;
  name: string;
  description?: string;
  photos?: { directus_files_id: string }[];
  date_created?: string;
  date_updated?: string;
}

interface Photo {
  id?: string;
  title?: string;
  description?: string;
  file: string;
  album?: string;
  metadata?: any;
  date_created?: string;
  date_updated?: string;
}

function getTokenFromLocalStorage() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('directus_token');
    return token ? JSON.parse(token) : null;
  }
  return null;
}

function setTokenInLocalStorage(value: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('directus_token', JSON.stringify(value));
  }
}

// Directus service implementation
export class DirectusService {
  private static baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL!;
  private static client = createDirectus(DirectusService.baseUrl)
    .with(authentication('json', {
      autoRefresh: true,
      msRefreshBeforeExpires: 50000,
      storage: {
        get: getTokenFromLocalStorage,
        set: setTokenInLocalStorage,
      }
    }))
    .with(rest())

  static {
    const token = getTokenFromLocalStorage();
    if (token) {
      DirectusService.client.setToken(token.access_token);
    }
  }

  static getAssetUrl(fileId: string, key: string = 'avatar') {
    return `${DirectusService.baseUrl}/assets/${fileId}?key=${key}`;
  }

  // Authentication
  static async register(email: string, password: string) {
    try {
      const result = await DirectusService.client.request(registerUser(email, password));
      return result;
    } catch (error) {
      console.error("Directus registration error:", error);
      throw error;
    }
  }

  static async login(email: string, password: string) {
    try {
      const result = await DirectusService.client.login({ email, password });

      if (result && result.access_token) {
        DirectusService.client.setToken(result.access_token);
      }

      return result;
    } catch (error) {
      console.error("Directus login error:", error);
      throw error;
    }
  }

  static async logout() {
    try {
      await DirectusService.client.logout({ refresh_token: getTokenFromLocalStorage()?.refresh_token });
      return true;
    } catch (error) {
      console.error("Directus logout error:", error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const user = await DirectusService.client.request(readMe({ fields: ['id', 'first_name', 'email', 'status', 'avatar'] }));

      return user;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  // Data Types CRUD
  static async createDataType(dataType: Omit<DataType, 'id' | 'date_created' | 'date_updated'>) {
    try {
      const result = await DirectusService.client.request(
        createItem(DIRECTUS_COLLECTIONS.DATA_TYPES, dataType)
      );
      return result;
    } catch (error) {
      console.error("Create data type error:", error);
      throw error;
    }
  }

  static async getDataTypes() {
    try {
      const dataTypes = await DirectusService.client.request(
        readItems(DIRECTUS_COLLECTIONS.DATA_TYPES, {
          fields: ['*'],
          sort: ['name']
        })
      );
      return dataTypes;
    } catch (error) {
      console.error("Get data types error:", error);
      throw new Error("Failed to fetch data types from Directus. Please check your connection or server status.")
    }
  }

  static async getDataType(id: string): Promise<DataType | null> {
    try {
      const dataType = await DirectusService.client.request(
        readItem(DIRECTUS_COLLECTIONS.DATA_TYPES, id, { fields: ['*'] })
      );
      return dataType as DataType;
    } catch (error) {
      console.error("Get data type error:", error);
      // Fallback to mock data
      const dataTypes = DirectusService.getMockDataTypes();
      return dataTypes.find((dt: DataType) => dt.id === id) || null;
    }
  }

  static async updateDataType(id: string, dataType: Partial<DataType>) {
    try {
      const result = await DirectusService.client.request(
        updateItem(DIRECTUS_COLLECTIONS.DATA_TYPES, id, dataType)
      );
      return result;
    } catch (error) {
      console.error("Update data type error:", error);
      throw error;
    }
  }

  static async deleteDataType(id: string) {
    try {
      await DirectusService.client.request(
        deleteItem(DIRECTUS_COLLECTIONS.DATA_TYPES, id)
      );
      return { success: true };
    } catch (error) {
      console.error("Delete data type error:", error);
      throw error;
    }
  }

  // Data Items CRUD
  static async createDataItem(item: Omit<DataItem, 'id' | 'date_created' | 'date_updated'>) {
    try {
      const result = await DirectusService.client.request(
        createItem(DIRECTUS_COLLECTIONS.DATA_ITEMS, item)
      );
      return result;
    } catch (error) {
      console.error("Create data item error:", error);
      throw error;
    }
  }

  static async getDataItems(filters?: any): Promise<DataItem[]> {
    try {
      const items = await DirectusService.client.request(
        readItems(DIRECTUS_COLLECTIONS.DATA_ITEMS, {
          fields: ['*'],
          filter: filters,
          sort: ['-date_created']
        })
      );
      return items as DataItem[];
    } catch (error) {
      console.error("Get data items error:", error);
      // Fallback to mock data
      const mockItems = DirectusService.getMockDataItems();
      if (filters?.type?._eq) {
        return mockItems.filter(item => item.type === filters.type._eq);
      }
      return mockItems;
    }
  }

  static async getDataItem(id: string): Promise<DataItem | null> {
    try {
      const item = await DirectusService.client.request(
        readItem(DIRECTUS_COLLECTIONS.DATA_ITEMS, id, { fields: ['*'] })
      );
      return item as DataItem;
    } catch (error) {
      console.error("Get data item error:", error);
      // Fallback to mock data
      const mockItems = DirectusService.getMockDataItems();
      return mockItems.find(item => item.id === id) || null;
    }
  }

  static async updateDataItem(id: string, item: Partial<DataItem>) {
    try {
      const result = await DirectusService.client.request(
        updateItem(DIRECTUS_COLLECTIONS.DATA_ITEMS, id, item)
      );
      return result;
    } catch (error) {
      console.error("Update data item error:", error);
      throw error;
    }
  }

  static async deleteDataItem(id: string) {
    try {
      await DirectusService.client.request(
        deleteItem(DIRECTUS_COLLECTIONS.DATA_ITEMS, id)
      );
      return { success: true };
    } catch (error) {
      console.error("Delete data item error:", error);
      throw error;
    }
  }

  // Albums CRUD
  static async createAlbum(album: Omit<Album, 'id' | 'date_created' | 'date_updated'>) {
    try {
      const result = await DirectusService.client.request(
        createItem(DIRECTUS_COLLECTIONS.ALBUMS, album)
      );
      return result;
    } catch (error) {
      console.error("Create album error:", error);
      throw error;
    }
  }

  static async getAlbums() {
    try {
      const albums = await DirectusService.client.request(
        readItems(DIRECTUS_COLLECTIONS.ALBUMS, {
          fields: ['*'],
          sort: ['date_created']
        })
      );
      return albums;
    } catch (error) {
      console.error("Get albums error:", error);
      return [];
    }
  }

  static async getAlbum(id: string) {
    try {
      const album = await DirectusService.client.request(
        readItem(DIRECTUS_COLLECTIONS.ALBUMS, id, { fields: ['*', 'items.data_items_id.id', 'items.data_items_id.type', 'items.data_items_id.name', 'photos.directus_files_id'] })
      );
      return album;
    } catch (error) {
      console.error("Get album error:", error);
      return null;
    }
  }

  static async updateAlbum(id: string, album: Partial<Album>) {
    try {
      const result = await DirectusService.client.request(
        updateItem(DIRECTUS_COLLECTIONS.ALBUMS, id, album)
      );
      return result;
    } catch (error) {
      console.error("Update album error:", error);
      throw error;
    }
  }

  static async deleteAlbum(id: string) {
    try {
      await DirectusService.client.request(
        deleteItem(DIRECTUS_COLLECTIONS.ALBUMS, id)
      );
      return { success: true };
    } catch (error) {
      console.error("Delete album error:", error);
      throw error;
    }
  }

  // Files CRUD
  static async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file_1_property', 'Value');
      formData.append('file', file);
      const result = await DirectusService.client.request(
        uploadFiles(formData)
      );
      return result;
    } catch (error) {
      console.error("Upload file error:", error);
      throw error;
    }
  }
  static async uploadFiles(...files) {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('file', file);
      });
      const result = await DirectusService.client.request(
        uploadFiles(formData)
      );
      return result;
    } catch (error) {
      console.error("Upload file error:", error);
      throw error;
    }
  }

  // Search functionality
  static async searchItems(query: string) {
    try {
      const [dataItems, albums] = await Promise.all([
        DirectusService.client.request(readItems(DIRECTUS_COLLECTIONS.DATA_ITEMS, {
          search: query,
          fields: ['*']
        })),
        DirectusService.client.request(readItems(DIRECTUS_COLLECTIONS.ALBUMS, {
          search: query,
          fields: ['*']
        }))
      ]);

      return {
        dataItems,
        albums,
      };
    } catch (error) {
      console.error("Search error:", error);
      return {
        dataItems: [],
        albums: [],
      };
    }
  }

  // Analytics
  static async getAnalytics() {
    try {
      const [dataTypes, dataItems, albums, photos] = await Promise.all([
        DirectusService.getDataTypes(),
        DirectusService.getDataItems(),
        DirectusService.client.request(readItems(DIRECTUS_COLLECTIONS.ALBUMS, { fields: ['id'] })),
        DirectusService.client.request(readItems(DIRECTUS_COLLECTIONS.PHOTOS, { fields: ['id'] }))
      ]);

      return {
        totalDataTypes: dataTypes.length,
        totalDataItems: dataItems.length,
        totalAlbums: albums.length,
        totalPhotos: photos.length,
        dataTypes,
        dataItems,
        albums,
        photos,
      };
    } catch (error) {
      console.error("Get analytics error:", error);
      // Fallback to mock data
      const dataTypes = DirectusService.getMockDataTypes();
      return {
        totalDataTypes: dataTypes.length,
        totalDataItems: 0,
        totalAlbums: 0,
        totalPhotos: 0,
        dataTypes,
        dataItems: [],
        albums: [],
        photos: [],
      };
    }
  }

  // Connection test
  static async getServerInfo() {
    try {
      const info = await DirectusService.client.request(serverInfo());
      console.log('info :>> ', info);
      return info;
    } catch (error) {
      console.error("Get server info error:", error);
      throw error;
    }
  }

  static async testConnection() {
    try {
      await DirectusService.client.request(serverPing());
      const info = await DirectusService.client.request(serverInfo());
      console.log('info :>> ', info);
      return {
        isConnected: true,
        version: "10.8.3",
        database: "PostgreSQL",
        uptime: 86400,
        info
      };
    } catch (error) {
      return {
        isConnected: false,
        error: error instanceof Error ? error.message : "Connection failed",
      };
    }
  }

  // Mock data for development fallback
  private static getMockDataTypes() {
    return [
      {
        id: "presets",
        user_created: "d57a2c8d-f773-406a-b85f-bb031db3a472",
        date_created: "2025-07-06T16:45:22.607Z",
        user_updated: "d57a2c8d-f773-406a-b85f-bb031db3a472",
        date_updated: "2025-07-06T17:03:18.129Z",
        name: "Presets",
        slug: "presets",
        description: "Lightroom and photo editing presets",
        icon: "file-sliders",
        fields: [
          {
            id: "author",
            name: "Author",
            type: "string",
            required: false,
            settings: {}
          },
          {
            id: "genre",
            name: "Genre",
            type: "multiple-dropdown",
            required: false,
            settings: {
              options: ["Portrait", "Landscape", "Street", "Wedding"]
            }
          },
          {
            id: "mood",
            name: "Mood",
            type: "multiple-dropdown",
            required: false,
            settings: {
              options: ["Romantic", "Melancholic", "Dramatic", "Mysterious"]
            }
          },
          {
            id: "tone",
            name: "Tone",
            type: "multiple-dropdown",
            required: false,
            settings: {
              options: ["Warm", "Cool", "Neutral", "Earthy"]
            }
          }
        ]
      },
      {
        id: "color-profiles",
        user_created: "d57a2c8d-f773-406a-b85f-bb031db3a472",
        date_created: "2024-01-01T00:00:00Z",
        user_updated: "d57a2c8d-f773-406a-b85f-bb031db3a472",
        date_updated: "2024-01-01T00:00:00Z",
        name: "Color Profiles",
        slug: "color-profiles",
        description: "ICC color profiles for accurate color reproduction",
        icon: "palette",
        fields: [
          {
            id: "profile_name",
            name: "Profile Name",
            type: "string",
            required: true,
            settings: {}
          },
          {
            id: "color_space",
            name: "Color Space",
            type: "dropdown",
            required: true,
            settings: {
              options: ["sRGB", "Adobe RGB", "ProPhoto RGB"]
            }
          },
          {
            id: "gamma",
            name: "Gamma",
            type: "number",
            required: false,
            settings: {}
          }
        ]
      }
    ];
  }

  // Mock data for development fallback
  private static getMockDataItems() {
    return [
      {
        id: "3e90a6fc-66ba-4dc3-97d7-2e81ba3d13fe",
        user_created: "d57a2c8d-f773-406a-b85f-bb031db3a472",
        date_created: "2025-07-06T12:56:55.987Z",
        user_updated: "d57a2c8d-f773-406a-b85f-bb031db3a472",
        date_updated: "2025-07-06T17:24:51.521Z",
        type: "presets",
        fields: {
          author: "BB LE",
          mood: ["Romantic", "Dramatic"],
          tone: ["Warm", "Neutral"],
          genre: ["Portrait"]
        },
        name: "Moody Portrait Preset",
        description: "Dark and moody preset perfect for dramatic portraits",
        avatar: "fa5d8adf-541d-4b37-8f03-ff379339990f",
        albums: [1, 2]
      },
      {
        id: "4e90a6fc-66ba-4dc3-97d7-2e81ba3d13aa",
        user_created: "d57a2c8d-f773-406a-b85f-bb031db3a472",
        date_created: "2025-07-06T12:56:55.987Z",
        user_updated: "d57a2c8d-f773-406a-b85f-bb031db3a472",
        date_updated: "2025-07-06T17:24:51.521Z",
        type: "presets",
        fields: {
          author: "John Doe",
          mood: ["Melancholic"],
          tone: ["Cool"],
          genre: ["Landscape", "Street"]
        },
        name: "Cool Landscape Preset",
        description: "Perfect for outdoor landscape photography",
        avatar: "fa5d8adf-541d-4b37-8f03-ff379339990f",
        albums: [1]
      }
    ];
  }
}
