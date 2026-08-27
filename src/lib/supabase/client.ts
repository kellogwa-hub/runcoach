import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://hwmjyfcrozhylwuwoosp.supabase.co';

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3bWp5ZmNyb3poeWx3dXdvb3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0Nzc3NDEsImV4cCI6MjEwMzA1Mzc0MX0.DwufdZw4OvP1cS83V1lYfK7eIU3vdDBm4XarylOXgf0';

  client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return client;
}
