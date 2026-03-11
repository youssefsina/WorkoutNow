import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { userAPI } from "@/lib/api";
import type { User, Session, Subscription } from "@supabase/supabase-js";

// Module-level guards — survive React StrictMode double-mount
let _initPromise: Promise<void> | null = null;
let _authSubscription: Subscription | null = null;

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  cleanup: () => void;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
}

/**
 * Only update zustand when user identity actually changes.
 * Prevents cascading re-renders from onAuthStateChange firing
 * with new object references for the same user.
 */
function updateSessionIfChanged(
  set: (partial: Partial<AuthState>) => void,
  get: () => AuthState,
  newSession: Session | null
) {
  const current = get();
  const newUserId = newSession?.user?.id ?? null;
  const oldUserId = current.user?.id ?? null;
  const newEmail = newSession?.user?.email ?? null;
  const oldEmail = current.user?.email ?? null;
  const newToken = newSession?.access_token ?? null;
  const oldToken = current.session?.access_token ?? null;

  // Only update if something meaningful changed
  if (newUserId !== oldUserId || newEmail !== oldEmail || newToken !== oldToken) {
    set({ user: newSession?.user ?? null, session: newSession });
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    // If already initialized or in-progress, return the existing promise
    if (get().initialized) return;
    if (_initPromise) return _initPromise;

    _initPromise = (async () => {
      set({ loading: true });

      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        set({
          user: session?.user ?? null,
          session,
          loading: false,
          initialized: true,
        });

        // Listen for auth changes (only once)
        if (!_authSubscription) {
          const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
            // Skip INITIAL_SESSION — we already set state above
            if (_event === "INITIAL_SESSION") return;
            updateSessionIfChanged(set, get, newSession);
          });
          _authSubscription = data.subscription;
        }

        // Ensure user row exists in our DB
        if (session?.user) {
          try {
            await userAPI.ensure();
          } catch {
            // Non-critical
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        set({ loading: false, initialized: true });
      }
    })();

    return _initPromise;
  },

  cleanup: () => {
    if (_authSubscription) {
      _authSubscription.unsubscribe();
      _authSubscription = null;
    }
    _initPromise = null;
  },

  signUp: async (email, password, displayName) => {
    try {
      set({ loading: true });
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        set({ loading: false });
        return { error: error.message };
      }

      set({
        user: data.user,
        session: data.session,
        loading: false,
      });

      // Create user row in our DB
      if (data.session) {
        try {
          await userAPI.ensure();
          if (displayName) {
            await userAPI.updateProfile({ displayName });
          }
        } catch {
          // Non-critical
        }
      }

      return {};
    } catch (err: any) {
      set({ loading: false });
      return { error: err.message || "Sign up failed" };
    }
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true });
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ loading: false });
        return { error: error.message };
      }

      set({
        user: data.user,
        session: data.session,
        loading: false,
      });

      // Ensure user row
      try {
        await userAPI.ensure();
      } catch {
        // Non-critical
      }

      return {};
    } catch (err: any) {
      set({ loading: false });
      return { error: err.message || "Sign in failed" };
    }
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  setSession: (session) => {
    set({ user: session?.user ?? null, session });
  },
}));
