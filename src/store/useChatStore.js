import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: {},
  isLoading: false,

  fetchMessages: async () => {
    set({ isLoading: true });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      set({ isLoading: false });
      return;
    }
    const myId = session.user.id;

    // Fetch all messages where I am sender or receiver
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        id,
        content,
        created_at,
        sender_id,
        receiver_id,
        sender:profiles!chat_messages_sender_id_fkey(id, name, avatar),
        receiver:profiles!chat_messages_receiver_id_fkey(id, name, avatar)
      `)
      .or(`sender_id.eq.${myId},receiver_id.eq.${myId}`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      set({ isLoading: false });
      return;
    }

    const conversationsMap = new Map();
    const messagesMap = {};

    data.forEach(msg => {
      const isOwn = msg.sender_id === myId;
      const otherUser = isOwn ? msg.receiver : msg.sender;
      const otherId = otherUser?.id;

      if (!otherId) return;

      if (!messagesMap[otherId]) {
        messagesMap[otherId] = [];
      }

      messagesMap[otherId].push({
        id: msg.id,
        senderId: isOwn ? 'me' : otherId,
        senderName: isOwn ? 'Tú' : otherUser.name,
        text: msg.content,
        timestamp: msg.created_at,
        isOwn,
        isRead: true 
      });

      // Update conversation latest info
      conversationsMap.set(otherId, {
        id: otherId,
        name: otherUser.name,
        avatar: otherUser.avatar,
        lastMessage: msg.content,
        lastMessageTime: msg.created_at,
        unread: 0,
        isGroup: false,
      });
    });

    // Add a hardcoded "Madre Tutora" conversation if empty for demo purposes
    if (conversationsMap.size === 0) {
      const dummyId = 'admin-001';
      conversationsMap.set(dummyId, {
        id: dummyId,
        name: 'Marta (Madre Tutora)',
        avatar: '👩',
        lastMessage: '¡Hola! ¿En qué te puedo ayudar hoy?',
        lastMessageTime: new Date().toISOString(),
        unread: 1,
        isGroup: false
      });
      messagesMap[dummyId] = [{
        id: 'welcome',
        senderId: dummyId,
        senderName: 'Marta (Madre Tutora)',
        text: '¡Hola! ¿En qué te puedo ayudar hoy?',
        timestamp: new Date().toISOString(),
        isOwn: false,
        isRead: false
      }];
    }

    set({
      conversations: Array.from(conversationsMap.values()).sort((a,b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)),
      messages: messagesMap,
      isLoading: false
    });
  },

  setActiveConversation: (id) => {
    set({ activeConversation: id });
    get().markAsRead(id);
  },

  sendMessage: async (convId, text) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const newMessage = {
      sender_id: session.user.id,
      receiver_id: convId,
      content: text
    };

    const { error } = await supabase.from('chat_messages').insert([newMessage]);
    if (!error) {
      // Optimistic update
      get().fetchMessages();
    }
  },

  markAsRead: (convId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === convId ? { ...conv, unread: 0 } : conv
      )
    })),

  getTotalUnread: () => {
    const { conversations } = get();
    return conversations.reduce((total, conv) => total + (conv.unread || 0), 0);
  },

  subscribeToMessages: () => {
    const channel = supabase.channel('chat_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, () => {
        get().fetchMessages();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    }
  }
}));

export default useChatStore;
