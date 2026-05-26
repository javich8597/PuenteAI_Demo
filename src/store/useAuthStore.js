import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// Usuario por defecto cuando no hay sesión activa
const defaultUser = null;

const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  isGuest: false,
  isAdmin: false,
  user: defaultUser,
  isLoading: true, // Para mostrar un spinner mientras Supabase comprueba la sesión
  onboardingAnswers: {},
  prioritizedCategories: [],

  setOnboardingData: (answers, priorities) => set({ onboardingAnswers: answers, prioritizedCategories: priorities }),

  initializeAuth: () => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      const state = get();
      // Si estamos en una sesión demo local, no la sobrescribimos
      if (state.user && (state.user.id === 'guest' || state.user.id.startsWith('admin-') || state.user.id.startsWith('demo-'))) {
        set({ isLoading: false });
        return;
      }

      if (session) {
        // Fetch profile data from our custom `profiles` table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({
          isAuthenticated: true,
          isLoading: false,
          user: {
            id: session.user.id,
            email: session.user.email,
            name: profile?.name || session.user.email.split('@')[0],
            avatar: profile?.avatar || '👤',
            role: profile?.role || 'user',
            seeds: profile?.seeds || 0
          },
          isAdmin: profile?.role === 'admin'
        });
      } else {
        set({
          isAuthenticated: false,
          isGuest: false,
          isAdmin: false,
          user: defaultUser,
          isLoading: false
        });
      }
    });
  },

  signUp: async (email, password, name, surname, phone, neighborhood, language, situation) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    
    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        { 
          id: data.user.id, 
          name: name, 
          surname: surname,
          phone: phone,
          neighborhood: neighborhood || null,
          language: language || null,
          situation: situation || null,
          avatar: name.charAt(0).toUpperCase() 
        }
      ]);
      if (profileError) console.error("Error creating profile:", profileError);

      // WORKAROUND PARA LA DEMO: 
      // Forzamos la sesión local para que el flujo de la demo no se rompa y entre a la app inmediatamente.
      set({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: name || 'Amiga',
          avatar: name ? name.charAt(0).toUpperCase() : '👤',
          role: 'user',
          seeds: 0
        }
      });
    }
  },

  signIn: async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Credenciales de administración para la demo (locales y ultra-robustas)
    if (cleanEmail === 'admin@demo.com' && password === 'admin123') {
      set({
        isAuthenticated: true,
        isGuest: false,
        isLoading: false,
        user: {
          id: 'admin-002',
          email: 'admin@demo.com',
          name: 'Admin',
          avatar: '👑',
          role: 'admin',
          seeds: 99
        },
        isAdmin: true
      });
      return;
    }
    
    if (cleanEmail === 'marta@puente.ai' && password === 'puente123') {
      set({
        isAuthenticated: true,
        isGuest: false,
        isLoading: false,
        user: {
          id: 'admin-001',
          email: 'marta@puente.ai',
          name: 'Marta',
          avatar: 'Ⓜ️',
          role: 'admin',
          seeds: 12
        },
        isAdmin: true
      });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Forzar actualización síncrona del estado para evitar race conditions en la UI
    if (data.session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      set({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: data.session.user.id,
          email: data.session.user.email,
          name: profile?.name || data.session.user.email.split('@')[0],
          avatar: profile?.avatar || '👤',
          role: profile?.role || 'user',
          seeds: profile?.seeds || 0
        },
        isAdmin: profile?.role === 'admin'
      });
    }
  },

  loginAsGuest: async () => {
    // For demo purposes, the guest mode is strictly local.
    // Supabase session remains null, allowing RestrictedRoute to catch it.
    set({
      isAuthenticated: false,
      isGuest: true,
      isAdmin: false,
      user: {
        id: 'guest',
        name: 'Invitada',
        avatar: '👤',
        role: 'guest',
        seeds: 0
      },
      isLoading: false
    });
  },

  loginAsAdmin: async () => {
    // For demo purposes, we log in as "Marta Tutora"
    const { error } = await supabase.auth.signInWithPassword({
      email: 'marta@puente.ai',
      password: 'puente123'
    });
    if (error) console.error("Admin login error:", error);
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({
      isAuthenticated: false,
      isGuest: false,
      isAdmin: false,
      user: defaultUser,
    });
  },

  updateProfile: async (data) => {
    const { user } = get();
    if (!user || user.id === 'guest' || user.id === 'admin-001') return;
    
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);
      
    if (!error) {
      set((state) => ({
        user: { ...state.user, ...data },
      }));
    }
  },
}));

export { useAuthStore };
export default useAuthStore;
