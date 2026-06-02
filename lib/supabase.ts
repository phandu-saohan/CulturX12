import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ayvnxquhmbyvljfmsdtq.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_VWe1bP7wYNktlq-9j7Djag_uiV5SjW3';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Deep merges target (defaults) and source (fetched data) to ensure no fields are missing.
 */
function deepMerge(target: any, source: any): any {
  if (target === null || target === undefined) return source;
  if (source === null || source === undefined) return target;

  if (typeof target !== 'object' || typeof source !== 'object') {
    return source;
  }

  if (Array.isArray(target) || Array.isArray(source)) {
    return source;
  }

  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    if (sourceVal !== undefined) {
      if (sourceVal === null) {
        result[key] = null;
      } else if (typeof sourceVal === 'object' && target[key] !== undefined && target[key] !== null) {
        result[key] = deepMerge(target[key], sourceVal);
      } else {
        result[key] = sourceVal;
      }
    }
  }
  return result;
}

/**
 * Fetches state from Supabase table 'culturx_store'.
 * If the table does not exist or fails, falls back to localStorage or default value.
 */
export async function fetchStateFromSupabase<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const { data, error } = await supabase
      .from('culturx_store')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      // If table doesn't exist, this is predictable, so we log instructions for user
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        console.warn(`[Supabase] Table 'culturx_store' not found or empty. Using LocalStorage fallback for '${key}'.`);
      } else {
        console.error(`[Supabase] Error retrieving '${key}':`, error);
      }
      return getLocalFallback(key, defaultValue);
    }

    if (data && data.value) {
      // Sync local storage as cache
      try {
        localStorage.setItem(`culturx_cache_${key}`, JSON.stringify(data.value));
      } catch (e) {
        console.error(e);
      }
      return deepMerge(defaultValue, data.value) as T;
    }

    return getLocalFallback(key, defaultValue);
  } catch (e) {
    console.error(`[Supabase] General exception fetching '${key}':`, e);
    return getLocalFallback(key, defaultValue);
  }
}

/**
 * Saves state to Supabase table 'culturx_store'.
 * Synthesizes upsert operations. Falls back to localStorage if table doesn't exist.
 */
export async function saveStateToSupabase<T>(key: string, value: T): Promise<boolean> {
  // First, save locally as reliable backup / cache
  try {
    localStorage.setItem(`culturx_cache_${key}`, JSON.stringify(value));
    localStorage.setItem(getLegacyKey(key), JSON.stringify(value));
  } catch (e) {
    console.error("Local storage sync error:", e);
  }

  try {
    const { error } = await supabase
      .from('culturx_store')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) {
      console.error(`[Supabase] Failed to persist '${key}' in DB (falling back to LocalStorage):`, error);
      return false;
    }
    console.log(`[Supabase] Successfully synchronized '${key}' with remote database.`);
    return true;
  } catch (e) {
    console.error(`[Supabase] General exception persisting '${key}':`, e);
    return false;
  }
}

// Helpers for fallback
function getLegacyKey(key: string): string {
  switch (key) {
    case 'site_data': return 'culturx_site_data_v2';
    case 'bookings': return 'culturx_bookings';
    case 'enquiries': return 'culturx_enquiries';
    case 'orders': return 'culturx_orders';
    case 'articles': return 'culturx_articles';
    default: return `culturx_${key}`;
  }
}

function getLocalFallback<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const cached = localStorage.getItem(`culturx_cache_${key}`) || localStorage.getItem(getLegacyKey(key));
    if (cached) {
      const parsed = JSON.parse(cached);
      return deepMerge(defaultValue, parsed) as T;
    }
  } catch (e) {
    console.error(e);
  }
  return defaultValue;
}
