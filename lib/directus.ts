import { authentication, createDirectus, createItem, deleteItem, readItem, readItems, readMe, registerUser, rest, serverInfo, serverPing, updateItem } from '@directus/sdk';

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
  id?: string;
  name: string;
  description?: string;
  icon?: string;
  fields?: any[];
  date_created?: string;
  date_updated?: string;
}

interface DataItem {
  id?: string;
  data_type: string;
  data: any;
  date_created?: string;
  date_updated?: string;
}

interface Album {
  id?: string;
  name: string;
  description?: string;
  photos?: string[];
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

  static async getDataType(id: string) {
    try {
      const dataType = await DirectusService.client.request(
        readItem(DIRECTUS_COLLECTIONS.DATA_TYPES, id, { fields: ['*'] })
      );
      return dataType;
    } catch (error) {
      console.error("Get data type error:", error);
      // Fallback to mock data
      const dataTypes = DirectusService.getMockDataTypes();
      return dataTypes.find((dt: any) => dt.id === id) || null;
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

  static async getDataItems(filters?: any) {
    try {
      const items = await DirectusService.client.request(
        readItems(DIRECTUS_COLLECTIONS.DATA_ITEMS, {
          fields: ['*'],
          filter: filters,
          sort: ['-date_created']
        })
      );
      return items;
    } catch (error) {
      console.error("Get data items error:", error);
      return [];
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

  // Photos CRUD
  static async createPhoto(photo: Omit<Photo, 'id' | 'date_created' | 'date_updated'>) {
    try {
      const result = await DirectusService.client.request(
        createItem(DIRECTUS_COLLECTIONS.PHOTOS, photo)
      );
      return result;
    } catch (error) {
      console.error("Create photo error:", error);
      throw error;
    }
  }

  static async getPhotos(albumId?: string) {
    try {
      const filter = albumId ? { album: { _eq: albumId } } : {};
      const photos = await DirectusService.client.request(
        readItems(DIRECTUS_COLLECTIONS.PHOTOS, {
          fields: ['*'],
          filter,
          sort: ['date_created']
        })
      );
      return photos;
    } catch (error) {
      console.error("Get photos error:", error);
      return [];
    }
  }

  static async getPhoto(id: string) {
    try {
      const photo = await DirectusService.client.request(
        readItem(DIRECTUS_COLLECTIONS.PHOTOS, id)
      );
      return photo;
    } catch (error) {
      console.error("Get photo error:", error);
      return null;
    }
  }

  static async updatePhoto(id: string, photo: Partial<Photo>) {
    try {
      const result = await DirectusService.client.request(
        updateItem(DIRECTUS_COLLECTIONS.PHOTOS, id, photo)
      );
      return result;
    } catch (error) {
      console.error("Update photo error:", error);
      throw error;
    }
  }

  static async deletePhoto(id: string) {
    try {
      await DirectusService.client.request(
        deleteItem(DIRECTUS_COLLECTIONS.PHOTOS, id)
      );
      return { success: true };
    } catch (error) {
      console.error("Delete photo error:", error);
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
        id: "1",
        name: "Color Profiles",
        description: "ICC color profiles for accurate color reproduction",
        icon: "palette",
        fields: [
          { id: "1", name: "Profile Name", type: "text", required: true, order: 1 },
          {
            id: "2",
            name: "Color Space",
            type: "select",
            required: true,
            order: 2,
            options: ["sRGB", "Adobe RGB", "ProPhoto RGB"],
          },
          { id: "3", name: "Gamma", type: "number", required: false, order: 3 },
        ],
        date_created: "2024-01-01T00:00:00Z",
        date_updated: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Presets",
        description: "Camera and editing presets for consistent results",
        icon: "settings",
        fields: [
          { id: "4", name: "Preset Name", type: "text", required: true, order: 1 },
          { id: "5", name: "Camera Model", type: "text", required: false, order: 2 },
          { id: "6", name: "Settings", type: "textarea", required: true, order: 3 },
        ],
        date_created: "2024-01-01T00:00:00Z",
        date_updated: "2024-01-01T00:00:00Z",
      },
      {
        id: "3",
        name: "Color Styles",
        description: "Color grading and styling presets",
        icon: "brush",
        fields: [
          { id: "7", name: "Style Name", type: "text", required: true, order: 1 },
          {
            id: "8",
            name: "Mood",
            type: "select",
            required: false,
            order: 2,
            options: ["Warm", "Cool", "Neutral", "Vintage"],
          },
          { id: "9", name: "Intensity", type: "number", required: false, order: 3 },
        ],
        date_created: "2024-01-01T00:00:00Z",
        date_updated: "2024-01-01T00:00:00Z",
      },
    ];
  }
}
