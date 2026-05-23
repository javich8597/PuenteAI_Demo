/**
 * useAppStore.js
 * ─────────────────────────────────────────────
 * Store global de la aplicación PuenteAI.
 * Maneja idioma, salida rápida y notificaciones.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set, get) => ({
      // ── Estado ──────────────────────────────

      /** Idioma activo: 'es' (castellano) o 'ca' (catalán) */
      language: 'es',

      /** Salida rápida – botón de emergencia visible en toda la app */
      showQuickExit: true,

      /** Notificaciones pendientes */
      notifications: [],

      /** Primer uso – para mostrar onboarding */
      isFirstVisit: true,

      // ── Acciones ────────────────────────────

      /**
       * Cambia el idioma de la interfaz.
       * @param {'es'|'ca'} lang
       */
      setLanguage: (lang) => set({ language: lang }),

      /**
       * Alterna entre castellano y catalán.
       */
      toggleLanguage: () => set((state) => ({ language: state.language === 'es' ? 'ca' : 'es' })),

      /**
       * Define la visibilidad del botón de salida rápida.
       */
      setShowQuickExit: (show) => set({ showQuickExit: show }),

      /**
       * Activa o desactiva el botón de salida rápida.
       */
      toggleQuickExit: () =>
        set((state) => ({ showQuickExit: !state.showQuickExit })),

      /**
       * Añade una notificación nueva.
       * @param {Object} notification - { id, type, title, message, timestamp, isRead }
       */
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              id: notification.id || `notif-${Date.now()}`,
              type: notification.type || 'info', // 'info' | 'success' | 'warning' | 'alert'
              title: notification.title,
              message: notification.message,
              timestamp: notification.timestamp || new Date().toISOString(),
              isRead: false,
            },
            ...state.notifications,
          ],
        })),

      /**
       * Marca una notificación como leída.
       * @param {string} id
       */
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),

      /**
       * Limpia todas las notificaciones.
       */
      clearNotifications: () => set({ notifications: [] }),

      /**
       * Marca que el usuario ya completó el onboarding.
       */
      completeOnboarding: () => set({ isFirstVisit: false }),
    }),
    {
      name: 'puente-app', // clave en localStorage
      version: 1,
      partialize: (state) => ({
        language: state.language,
        showQuickExit: state.showQuickExit,
        isFirstVisit: state.isFirstVisit,
      }),
    }
  )
);
export { useAppStore };
export default useAppStore;
