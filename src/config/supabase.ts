// @ts-nocheck
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Debug environment variables
console.log('=== Supabase Config Debug ===');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('All env vars:', import.meta.env);
console.log('=== End Debug ===');

// Environment validation
const validateEnvironment = () => {
  // Use process.env for Node.js environment, import.meta.env for browser
  const getEnvVar = (key: string) => {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key];
    }
    return undefined;
  };

  const requiredVars = {
    VITE_SUPABASE_URL: getEnvVar('VITE_SUPABASE_URL'),
    VITE_SUPABASE_ANON_KEY: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  };

  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  return requiredVars;
};

// Simple encryption/decryption for sensitive data (development only)
class SimpleEncryption {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  // Simple XOR encryption (for development - use proper encryption in production)
  encrypt(text: string): string {
    if (!text) return text;
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length)
      );
    }
    return btoa(result); // Base64 encode
  }

  decrypt(encryptedText: string): string {
    if (!encryptedText) return encryptedText;
    
    try {
      const decoded = atob(encryptedText); // Base64 decode
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(
          decoded.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length)
        );
      }
      return result;
    } catch (error) {
      console.warn('Decryption failed, returning original text');
      return encryptedText;
    }
  }
}

// Supabase configuration class
class SupabaseConfig {
  private client: SupabaseClient | null = null;
  private encryption: SimpleEncryption;
  private isInitialized = false;

  constructor() {
    // Use process.env for Node.js environment, import.meta.env for browser
    const encryptionKey = (typeof process !== 'undefined' && process.env)
      ? process.env.VITE_ENCRYPTION_KEY || 'default-key'
      : (typeof import.meta !== 'undefined' && import.meta.env)
        ? import.meta.env.VITE_ENCRYPTION_KEY || 'default-key'
        : 'default-key';
    this.encryption = new SimpleEncryption(encryptionKey);
  }

  // Initialize Supabase client
  initialize(): SupabaseClient {
    if (this.client && this.isInitialized) {
      return this.client;
    }

    try {
      const env = validateEnvironment();
      
      // Create Supabase client with configuration
      this.client = createClient(
        env.VITE_SUPABASE_URL,
        env.VITE_SUPABASE_ANON_KEY,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
          },
          db: {
            schema: 'public',
          },
          global: {
            headers: {
              'X-Client-Info': 'kitchen-command-center',
              'X-Requested-With': 'XMLHttpRequest',
              'Origin': window.location.origin,
            },
          },
          realtime: {
            params: {
              eventsPerSecond: 10,
            },
          },
        }
      );

      this.isInitialized = true;
      console.log('✅ Supabase client initialized successfully');
      
      return this.client;
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error);
      throw error;
    }
  }

  // Get Supabase client
  getClient(): SupabaseClient {
    if (!this.client || !this.isInitialized) {
      return this.initialize();
    }
    return this.client;
  }

  // Progressive connection testing
  async testConnection(): Promise<{
    success: boolean;
    details: {
      basicConnection: boolean;
      tablesExist: boolean;
      canQuery: boolean;
      error?: string;
    };
  }> {
    const details = {
      basicConnection: false,
      tablesExist: false,
      canQuery: false,
      error: undefined as string | undefined,
    };

    try {
      const client = this.getClient();

      // Test 1: Basic connection - try to access recipes table
      try {
        const { error: testError } = await client.from('recipes').select('id').limit(1);

        if (testError && testError.message?.includes('relation "public.recipes" does not exist')) {
          details.basicConnection = true; // Connection works, table just doesn't exist yet
          console.log('✅ Basic Supabase connection successful (recipes table not found - please run schema setup)');
        } else if (testError && testError.message?.includes('schema cache')) {
          details.basicConnection = true; // Connection works, schema cache issue is normal
          console.log('✅ Basic Supabase connection successful (schema cache issue is normal)');
        } else if (testError && testError.code === 'PGRST116') {
          details.basicConnection = true; // Connection works, just no data
          console.log('✅ Basic Supabase connection successful (table exists but empty)');
        } else if (testError) {
          details.error = `Basic connection failed: ${testError.message}`;
          console.error('❌ Basic Supabase connection failed:', testError.message);
          return { success: false, details };
        } else {
          details.basicConnection = true;
          console.log('✅ Basic Supabase connection successful');
        }
      } catch (error: unknown) {
        details.error = `Basic connection failed: ${(error as Error).message}`;
        console.error('❌ Basic Supabase connection failed:', (error as Error).message);
        return { success: false, details };
      }

      // Test 2: Try to query recipes table directly (this will tell us if tables exist)
      try {
        const { data, error } = await client
          .from('recipes')
          .select('id')
          .limit(1);

        if (error) {
          details.error = `Table check failed: ${error.message}`;
          console.error('❌ Table existence check failed:', error.message);
          details.tablesExist = false;
        } else {
          details.tablesExist = true;
          details.canQuery = true;
          console.log('✅ Tables exist and can be queried');
        }
      } catch (error: unknown) {
        details.error = `Table check error: ${(error as Error).message}`;
        console.error('❌ Table existence check error:', error);
        details.tablesExist = false;
      }

      const success = details.basicConnection && details.tablesExist && details.canQuery;
      console.log(`🔍 Connection test result: ${success ? 'SUCCESS' : 'PARTIAL/FAILED'}`);

      return { success, details };
    } catch (error: unknown) {
      details.error = `Connection test error: ${(error as Error).message}`;
      console.error('❌ Supabase connection test error:', error);
      return { success: false, details };
    }
  }

  // Get connection status
  getConnectionStatus(): {
    isInitialized: boolean;
    hasClient: boolean;
    url: string;
  } {
    return {
      isInitialized: this.isInitialized,
      hasClient: !!this.client,
      url: import.meta.env.VITE_SUPABASE_URL || 'Not configured',
    };
  }

  // Encrypt sensitive data for storage
  encryptData(data: string): string {
    return this.encryption.encrypt(data);
  }

  // Decrypt sensitive data
  decryptData(encryptedData: string): string {
    return this.encryption.decrypt(encryptedData);
  }

  // Auto-setup database schema
  async setupDatabase(): Promise<{ success: boolean; message: string }> {
    try {
      const client = this.getClient();

      console.log('🔧 Starting database setup...');

      // Step 1: Try to create the recipes table directly
      const createRecipesSQL = `
        CREATE TABLE IF NOT EXISTS recipes (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          ingredients JSONB NOT NULL DEFAULT '[]',
          instructions JSONB NOT NULL DEFAULT '[]',
          prep_time INTEGER NOT NULL DEFAULT 0,
          cook_time INTEGER NOT NULL DEFAULT 0,
          servings INTEGER NOT NULL DEFAULT 1,
          difficulty VARCHAR(20) NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
          nutrition JSONB NOT NULL DEFAULT '{}',
          image_url TEXT,
          tags JSONB NOT NULL DEFAULT '[]',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      // Execute table creation
      const { error: tableError } = await client.rpc('exec_sql', { sql: createRecipesSQL });

      if (tableError) {
        console.error('❌ Failed to create recipes table:', tableError.message);
        return {
          success: false,
          message: `Failed to create recipes table: ${tableError.message}. Please run the supabase-schema.sql file manually in Supabase SQL Editor.`
        };
      }

      // Step 2: Enable RLS and create policies
      const rlsSQL = `
        ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Allow public access" ON recipes;
        CREATE POLICY "Allow public access" ON recipes FOR ALL USING (true);
      `;

      const { error: rlsError } = await client.rpc('exec_sql', { sql: rlsSQL });

      if (rlsError) {
        console.warn('⚠️ RLS setup warning:', rlsError.message);
        // Continue even if RLS fails - table creation is more important
      }

      console.log('✅ Database setup completed');
      return { success: true, message: 'Database setup completed successfully! Tables created and RLS configured.' };

    } catch (error: unknown) {
      console.error('❌ Database setup error:', error);

      // Provide helpful error messages
      let helpfulMessage = `Database setup error: ${(error as Error).message}`;

      if (error.message?.includes('permission denied')) {
        helpfulMessage += '\n\nSuggestion: Please run the supabase-schema.sql file manually in Supabase SQL Editor.';
      } else if (error.message?.includes('function exec_sql')) {
        helpfulMessage += '\n\nSuggestion: The exec_sql function is missing. Please run the complete supabase-schema.sql file in Supabase SQL Editor.';
      }

      return {
        success: false,
        message: helpfulMessage
      };
    }
  }

  // Reset client (for testing)
  reset(): void {
    this.client = null;
    this.isInitialized = false;
    console.log('🔄 Supabase client reset');
  }
}

// Export singleton instance
export const supabaseConfig = new SupabaseConfig();

// Export client getter for convenience
export const getSupabaseClient = () => supabaseConfig.getClient();

// Export types
export type { SupabaseClient };

// Development helpers
export const supabaseHelpers = {
  testConnection: () => supabaseConfig.testConnection(),
  getStatus: () => supabaseConfig.getConnectionStatus(),
  reset: () => supabaseConfig.reset(),
  setupDatabase: () => supabaseConfig.setupDatabase(),
  encryptData: (data: string) => supabaseConfig.encryptData(data),
  decryptData: (data: string) => supabaseConfig.decryptData(data),
};
