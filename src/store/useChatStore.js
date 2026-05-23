/**
 * useChatStore.js
 * ─────────────────────────────────────────────
 * Store de mensajería para PuenteAI.
 * Gestiona conversaciones directas y grupales.
 */

import { create } from 'zustand';
import { mockConversations, mockMessages } from '../data/messages';

const useChatStore = create((set, get) => ({
  // ── Estado ──────────────────────────────

  /** Lista de conversaciones (directas y de grupo) */
  conversations: mockConversations,

  /** ID de la conversación activa */
  activeConversation: null,

  /** Mapa: conversationId → array de mensajes */
  messages: mockMessages,

  // ── Acciones ────────────────────────────

  /**
   * Establece la conversación activa y la marca como leída.
   * @param {string} id - ID de la conversación
   */
  setActiveConversation: (id) => {
    set({ activeConversation: id });
    // Marcar como leída automáticamente al abrir
    get().markAsRead(id);
  },

  /**
   * Envía un mensaje a una conversación.
   * @param {string} convId - ID de la conversación
   * @param {string} text - Texto del mensaje
   */
  sendMessage: (convId, text) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'Tú',
      text,
      timestamp: new Date().toISOString(),
      isRead: true,
      isOwn: true,
    };

    set((state) => {
      // Añadir mensaje al mapa
      const convMessages = state.messages[convId] || [];
      const updatedMessages = {
        ...state.messages,
        [convId]: [...convMessages, newMessage],
      };

      // Actualizar último mensaje en la conversación
      const updatedConversations = state.conversations.map((conv) =>
        conv.id === convId
          ? {
              ...conv,
              lastMessage: text,
              lastMessageTime: newMessage.timestamp,
            }
          : conv
      );

      return {
        messages: updatedMessages,
        conversations: updatedConversations,
      };
    });
  },

  /**
   * Marca todos los mensajes de una conversación como leídos.
   * @param {string} convId - ID de la conversación
   */
  markAsRead: (convId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === convId ? { ...conv, unread: 0 } : conv
      ),
      messages: {
        ...state.messages,
        [convId]: (state.messages[convId] || []).map((msg) => ({
          ...msg,
          isRead: true,
        })),
      },
    })),

  /**
   * Obtiene el número total de mensajes no leídos.
   * @returns {number}
   */
  getTotalUnread: () => {
    const { conversations } = get();
    return conversations.reduce((total, conv) => total + (conv.unread || 0), 0);
  },
}));

export default useChatStore;
