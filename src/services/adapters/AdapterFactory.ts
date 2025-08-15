import { DatabaseAdapter } from '../interfaces/DatabaseAdapter';
import { SupabaseAdapter } from './SupabaseAdapter';
import { LocalStorageAdapter } from './LocalStorageAdapter';

export type AdapterType = 'localStorage' | 'supabase' | 'firebase' | 'pocketbase';

export class AdapterFactory {
  static createAdapter(type: AdapterType): DatabaseAdapter {
    switch (type) {
      case 'localStorage':
        return new LocalStorageAdapter();
      
      case 'supabase':
        try {
          const adapter = new SupabaseAdapter();
          // Test connection asynchronously (don't block initialization)
          adapter.initialize().catch(error => {
            console.warn('⚠️ Supabase connection test failed during initialization:', error);
          });
          return adapter;
        } catch (error) {
          console.warn('❌ Failed to create Supabase adapter, falling back to localStorage:', error);
          return new LocalStorageAdapter();
        }
      
      case 'firebase':
        // TODO: Implement Firebase adapter
        console.warn('Firebase adapter not implemented yet, falling back to localStorage');
        return new LocalStorageAdapter();
      
      case 'pocketbase':
        // TODO: Implement PocketBase adapter
        console.warn('PocketBase adapter not implemented yet, falling back to localStorage');
        return new LocalStorageAdapter();
      
      default:
        console.warn(`Unknown adapter type: ${type}, falling back to localStorage`);
        return new LocalStorageAdapter();
    }
  }

  static getAdapterFromEnv(): DatabaseAdapter {
    // Use process.env for Node.js environment, import.meta.env for browser
    const adapterType = ((typeof process !== 'undefined' && process.env)
      ? process.env.VITE_DATABASE_ADAPTER || 'localStorage'
      : (typeof import.meta !== 'undefined' && import.meta.env)
        ? import.meta.env.VITE_DATABASE_ADAPTER || 'localStorage'
        : 'localStorage') as AdapterType;
    return this.createAdapter(adapterType);
  }
}
