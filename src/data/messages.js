export const mockConversations = [
  {
    id: 'conv-1',
    type: 'direct',
    participants: [{ id: 'user-2', name: 'Laura P.', avatar: 'L' }],
    lastMessage: '¡Hola! Sí, el centro cívico abre a las 9.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // hace 5 min
    unread: 2,
  },
  {
    id: 'conv-2',
    type: 'group',
    name: 'Madres de Sants 🏘️',
    participants: [
      { id: 'user-3', name: 'Diana R.', avatar: 'D' },
      { id: 'user-4', name: 'Marta G.', avatar: 'M' },
    ],
    lastMessage: 'Diana: ¿Alguien sabe de pediatras por la zona?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // hace 2 horas
    unread: 0,
  },
  {
    id: 'conv-3',
    type: 'direct',
    participants: [{ id: 'user-5', name: 'Asesora MUSA', avatar: '🛡️', role: 'MUSA' }],
    lastMessage: 'Tu consulta ha sido validada. Aquí tienes los pasos.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // hace 1 día
    unread: 0,
  }
];

export const mockMessages = {
  'conv-1': [
    {
      id: 'msg-1',
      senderId: 'me',
      text: '¿Sabes a qué hora abre el centro cívico para el empadronamiento?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      isRead: true,
      isOwn: true,
    },
    {
      id: 'msg-2',
      senderId: 'user-2',
      text: '¡Hola! Sí, el centro cívico abre a las 9.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      isRead: true,
      isOwn: false,
    }
  ]
};
