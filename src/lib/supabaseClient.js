import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase config:', {
  url: supabaseUrl,
  key: supabaseAnonKey ? 'present' : 'missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  // Non-fatal warning to help local setup
  // eslint-disable-next-line no-console
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Add them to your .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

console.log('Supabase client created:', supabase);

// Upload a file to Supabase Storage and return its public URL
export async function uploadFile(file, bucket = 'job-attachments') {
  try {
    if (!file) {
      return { publicURL: null, error: { message: 'No file provided' } };
    }

    // Create unique file path to avoid collisions
    const safeName = String(file.name || 'file')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 180); // keep within practical length
    const filePath = `public/${Date.now()}-${safeName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || undefined,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return { publicURL: null, error: uploadError };
    }

    const { data: publicData, error: publicError } = supabase.storage
      .from(bucket)
      .getPublicUrl(uploadData?.path || filePath);

    if (publicError) {
      console.error('Supabase getPublicUrl error:', publicError);
      return { publicURL: null, error: publicError };
    }

    return { publicURL: publicData?.publicUrl || null, error: null };
  } catch (e) {
    console.error('Unexpected uploadFile error:', e);
    return { publicURL: null, error: { message: e.message } };
  }
}
