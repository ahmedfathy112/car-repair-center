// utils/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create Supabase client with custom options
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to initialize auth state change listener
export const initializeAuthListener = (store) => {
  return supabase.auth.onAuthStateChange((event) => {
    console.log("Auth state changed:", event);

    if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
      // Session is handled by checkUserSession thunk
      store.dispatch({ type: "auth/sessionUpdated" });
    } else if (event === "SIGNED_OUT") {
      store.dispatch({ type: "auth/clearCredentials" });
    }
  });
};

export default supabase;
