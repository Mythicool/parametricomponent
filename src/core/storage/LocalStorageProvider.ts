/**
 * Local Storage Provider
 * Implements storage interface using browser localStorage
 */

import { StorageProvider } from '../../types/parametric';

export class LocalStorageProvider implements StorageProvider {
  private prefix = 'parametric_';

  /**
   * Save data to localStorage
   */
  async save(key: string, data: any): Promise<void> {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(this.prefix + key, serialized);
    } catch (error) {
      throw new Error(`Failed to save to localStorage: ${error.message}`);
    }
  }

  /**
   * Load data from localStorage
   */
  async load(key: string): Promise<any> {
    try {
      const serialized = localStorage.getItem(this.prefix + key);
      if (serialized === null) {
        return null;
      }
      return JSON.parse(serialized);
    } catch (error) {
      throw new Error(`Failed to load from localStorage: ${error.message}`);
    }
  }

  /**
   * Delete data from localStorage
   */
  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      throw new Error(`Failed to delete from localStorage: ${error.message}`);
    }
  }

  /**
   * List all keys in localStorage with our prefix
   */
  async list(): Promise<string[]> {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.substring(this.prefix.length));
        }
      }
      return keys;
    } catch (error) {
      throw new Error(`Failed to list localStorage keys: ${error.message}`);
    }
  }

  /**
   * Clear all parametric data from localStorage
   */
  async clear(): Promise<void> {
    try {
      const keys = await this.list();
      keys.forEach(key => {
        localStorage.removeItem(this.prefix + key);
      });
    } catch (error) {
      throw new Error(`Failed to clear localStorage: ${error.message}`);
    }
  }

  /**
   * Get storage usage information
   */
  getStorageInfo(): { used: number; available: number } {
    let used = 0;
    
    try {
      // Calculate used space for parametric data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          const value = localStorage.getItem(key);
          if (value) {
            used += key.length + value.length;
          }
        }
      }

      // Estimate available space (localStorage typically has 5-10MB limit)
      const testKey = this.prefix + 'test_' + Date.now();
      let available = 0;
      
      try {
        const testData = 'x'.repeat(1024); // 1KB test
        let testSize = 1024;
        
        while (testSize < 10 * 1024 * 1024) { // Test up to 10MB
          try {
            localStorage.setItem(testKey, 'x'.repeat(testSize));
            localStorage.removeItem(testKey);
            available = testSize;
            testSize *= 2;
          } catch {
            break;
          }
        }
      } catch {
        available = 5 * 1024 * 1024; // Default estimate of 5MB
      }

      return { used, available };
    } catch (error) {
      return { used: 0, available: 5 * 1024 * 1024 };
    }
  }
}
