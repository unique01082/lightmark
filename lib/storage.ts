// Local storage utilities for data persistence
export class LocalStorage {
  private static prefix = "lightmark_"

  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.prefix + key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value))
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key)
    } catch (error) {
      console.error("Failed to remove from localStorage:", error)
    }
  }

  static clear(): void {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(this.prefix))
        .forEach((key) => localStorage.removeItem(key))
    } catch (error) {
      console.error("Failed to clear localStorage:", error)
    }
  }

  // Export all data
  static exportData(): string {
    const data: Record<string, any> = {}
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => {
        try {
          data[key.replace(this.prefix, "")] = JSON.parse(localStorage.getItem(key) || "")
        } catch {
          // Skip invalid JSON
        }
      })
    return JSON.stringify(data, null, 2)
  }

  // Import data
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      Object.entries(data).forEach(([key, value]) => {
        this.set(key, value)
      })
      return true
    } catch {
      return false
    }
  }
}
