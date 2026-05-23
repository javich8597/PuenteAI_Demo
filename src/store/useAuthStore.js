/**
 * useAuthStore.js
 * ─────────────────────────────────────────────
 * Store de autenticación para PuenteAI.
 * Gestiona sesión de usuario, modo invitado y modo admin.
 * Persiste en localStorage para mantener sesión entre recargas.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Usuario por defecto cuando no hay sesión activa
const defaultUser = null;

// Perfil de invitado (acceso limitado)
const guestUser = {
  id: 'guest',
  name: 'Invitado/a',
  avatar: '👤',
  timeInBarcelona: '',
  categories: [],
  points: 0,
  badges: [],
  joinedAt: new Date().toISOString(),
};

// Perfil de administrador
const adminUser = {
  id: 'admin-001',
  name: 'Admin PuenteAI',
  avatar: '🛡️',
  timeInBarcelona: '',
  categories: [],
  points: 0,
  badges: ['admin'],
  joinedAt: '2024-01-01T00:00:00.000Z',
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── Estado ──────────────────────────────
      isAuthenticated: false,
      isGuest: false,
      isAdmin: false,
      user: defaultUser,

      // ── Acciones ────────────────────────────

      /**
       * Inicia sesión con un objeto de usuario completo.
       * @param {Object} user - Datos del usuario autenticado
       */
      login: (user) =>
        set({
          isAuthenticated: true,
          isGuest: false,
          isAdmin: false,
          user: {
            id: user.id,
            name: user.name,
            avatar: user.avatar || user.name.charAt(0).toUpperCase(),
            timeInBarcelona: user.timeInBarcelona || '',
            neighborhood: user.neighborhood || '',
            categories: user.categories || [],
            points: user.points || 0,
            badges: user.badges || [],
            bio: user.bio || '',
            joinedAt: user.joinedAt || new Date().toISOString(),
          },
        }),

      /**
       * Entra como invitado con funcionalidad limitada.
       */
      loginAsGuest: () =>
        set({
          isAuthenticated: true,
          isGuest: true,
          isAdmin: false,
          user: { ...guestUser, joinedAt: new Date().toISOString() },
        }),

      /**
       * Entra como administrador.
       */
      loginAsAdmin: () =>
        set({
          isAuthenticated: true,
          isGuest: false,
          isAdmin: true,
          user: { ...adminUser },
        }),

      /**
       * Cierra sesión y limpia el estado.
       */
      logout: () =>
        set({
          isAuthenticated: false,
          isGuest: false,
          isAdmin: false,
          user: defaultUser,
        }),

      /**
       * Actualiza campos del perfil del usuario actual.
       * @param {Object} data - Campos a actualizar
       */
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : state.user,
        })),
    }),
    {
      name: 'puente-auth', // clave en localStorage
      version: 1,
    }
  )
);
export { useAuthStore };
export default useAuthStore;
