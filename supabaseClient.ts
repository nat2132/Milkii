import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lftzrhwuesnkvgalqqdy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdHpyaHd1ZXNua3ZnYWxxcWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MTk0ODEsImV4cCI6MjA1OTQ5NTQ4MX0.Fermq2_ZBMMr6Q_C8nSHsO87RlQf0iwdMIQxkQOxI9g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
