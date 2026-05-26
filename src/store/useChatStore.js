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
    let { data, error } = await supabase
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
      data = [];
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
    // 1. Inyección local inmediata (Optimistic UI para demo)
    const newMsgLocal = {
      id: 'local-' + Date.now(),
      senderId: 'me',
      senderName: 'Tú',
      text: text,
      timestamp: new Date().toISOString(),
      isOwn: true,
      isRead: true
    };
    
    set((s) => {
      const msgs = { ...s.messages };
      if (!msgs[convId]) msgs[convId] = [];
      msgs[convId] = [...msgs[convId], newMsgLocal];
      
      let convExists = false;
      const convs = s.conversations.map(c => {
        if (c.id === convId) {
          convExists = true;
          return { ...c, lastMessage: text, lastMessageTime: new Date().toISOString() }
        }
        return c;
      });

      if (!convExists) {
        let newConvName = 'Chat';
        if (convId.startsWith('group-')) {
          newConvName = 'Grupo Temático';
        }
        convs.unshift({
          id: convId,
          name: newConvName,
          lastMessage: text,
          lastMessageTime: new Date().toISOString(),
          unread: 0,
          isGroup: convId.startsWith('group-')
        });
      }
      
      return { messages: msgs, conversations: convs };
    });

    // 2. Auto-respuesta simulada para mejorar realismo
    setTimeout(() => {
      set((s) => {
        const msgs = { ...s.messages };
        if (!msgs[convId]) msgs[convId] = [];
        let senderName = 'Marta (Madre Tutora)';
        if (convId.startsWith('group-')) {
          senderName = 'Usuaria de la comunidad';
        }

        msgs[convId] = [...msgs[convId], {
          id: 'auto-' + Date.now(),
          senderId: convId.startsWith('group-') ? 'user-123' : convId,
          senderName: senderName,
          text: 'Entiendo perfectamente tu situación. Estoy aquí para apoyarte. Cuéntame un poco más para ver cómo podemos enfocarlo.',
          timestamp: new Date().toISOString(),
          isOwn: false,
          isRead: true
        }];
        
        const convs = s.conversations.map(c => 
          c.id === convId 
            ? { ...c, lastMessage: 'Entiendo perfectamente tu situación...', lastMessageTime: new Date().toISOString() } 
            : c
        );
        
        return { messages: msgs, conversations: convs };
      });
    }, 2500);

    // 3. Guardado real en Supabase (si falla, no rompe la demo gracias a la inyección local)
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const newMessage = {
        sender_id: session.user.id,
        receiver_id: convId,
        content: text
      };
      await supabase.from('chat_messages').insert([newMessage]);
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
