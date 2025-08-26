import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cpqbkuwtycuuwswvmdac.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwcWJrdXd0eWN1dXdzd3ZtZGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNjI1NjUsImV4cCI6MjA3MDczODU2NX0.b1twkOMuquVNAM_RpoQzyN0DqmOVSFENuzAn4yHKccE";

export const supabase = createClient(supabaseUrl, supabaseKey);
