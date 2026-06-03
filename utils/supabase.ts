import { createClient } from '@supabase/supabase-js';

// Paste your actual values between the quotes below:
const supabaseUrl = 'https://xbgvlomusrcdxrnvawiv.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZ3Zsb211c3JjZHhybnZhd2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNDI1ODQsImV4cCI6MjA5NTgxODU4NH0.4VRUcQ04kw_zxl-nhsnRWvrwV2ps4L_kLfqXQYB0xZw';

// This safeguard prevents the app from crashing and tells us exactly what's wrong
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  throw new Error(`STOP HERE! Your URL is invalid because it does not start with https://. Right now it looks like: "${supabaseUrl}"`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);