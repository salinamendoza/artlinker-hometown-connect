// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ttakdeoaumokcdueyoeq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0YWtkZW9hdW1va2NkdWV5b2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NzYxODMsImV4cCI6MjA1MTQ1MjE4M30.n23xuoATrcyI6MOwb1o0Pc4DoHF3imat6EWiV3hnI-w";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);