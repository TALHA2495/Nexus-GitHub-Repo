import { Message, ChatConversation } from '../types';

export const messages: Message[] = [
  // Conversation between Sarah (e1) and Michael (i1)
  {
    id: 'm1',
    senderId: 'e1',
    receiverId: 'i1',
    content: 'Thanks for connecting. Id love to discuss how our AI platform can revolutionize financial analytics for SMBs.',
    timestamp: '2023-08-15T10:15:00Z',
    isRead: true
  },
  {
    id: 'm2',
    senderId: 'i1',
    receiverId: 'e1',
    content: 'Im interested in learning more about your tech stack and ML models. Are you available for a call this week?',
    timestamp: '2023-08-15T10:30:00Z',
    isRead: true
  },
  {
    id: 'm3',
    senderId: 'e1',
    receiverId: 'i1',
    content: 'Absolutely! I can walk you through our technology and current traction. How does Thursday at 2pm PT work?',
    timestamp: '2023-08-15T10:45:00Z',
    isRead: true
  },
  {
    id: 'm4',
    senderId: 'i1',
    receiverId: 'e1',
    content: 'Thursday works great. Ill send a calendar invite. Looking forward to it!',
    timestamp: '2023-08-15T11:00:00Z',
    isRead: false
  },

  // Conversation between Maya (e3) and Jennifer (i2)
  {
    id: 'm5',
    senderId: 'i2',
    receiverId: 'e3',
    content: 'I saw your pitch for HealthPulse and Im intrigued by your approach to mental healthcare accessibility.',
    timestamp: '2023-08-16T09:00:00Z',
    isRead: true
  },
  {
    id: 'm6',
    senderId: 'e3',
    receiverId: 'i2',
    content: 'Thank you, Jennifer! Mental health services need to be more accessible, especially in underserved communities.',
    timestamp: '2023-08-16T09:15:00Z',
    isRead: true
  },
  {
    id: 'm7',
    senderId: 'i2',
    receiverId: 'e3',
    content: 'I completely agree. Could you share more about your user acquisition strategy and current metrics?',
    timestamp: '2023-08-16T09:30:00Z',
    isRead: false
  },

  // Conversation between David (e2) and Robert (i3)
  {
    id: 'm8',
    senderId: 'e2',
    receiverId: 'i3',
    content: 'Hello Robert, I noticed you invest in healthcare. While GreenLife is focused on sustainable packaging, we have some applications in medical supplies.',
    timestamp: '2023-08-17T14:00:00Z',
    isRead: true
  },
  {
    id: 'm9',
    senderId: 'i3',
    receiverId: 'e2',
    content: 'Interesting crossover, David. Id be interested in learning more about your biodegradable materials and how they could be used in healthcare.',
    timestamp: '2023-08-17T15:30:00Z',
    isRead: true
  },
  {
    id: 'm10',
    senderId: 'e2',
    receiverId: 'i3',
    content: 'Great! Weve been developing materials that can safely package medical devices while being eco-friendly. Our tests show 40% less environmental impact.',
    timestamp: '2023-08-17T16:45:00Z',
    isRead: false
  }
];

// Helper function to get messages between two users
export const getMessagesBetweenUsers = (user1Id: string, user2Id: string): Message[] => {
  return messages.filter(
    message => 
      (message.senderId === user1Id && message.receiverId === user2Id) || 
      (message.senderId === user2Id && message.receiverId === user1Id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Helper function to get conversations for a user
export const getConversationsForUser = (userId: string): ChatConversation[] => {
  // Get unique conversation partners
  const conversationPartners = new Set<string>();
  
  messages.forEach(message => {
    if (message.senderId === userId) {
      conversationPartners.add(message.receiverId);
    }
    if (message.receiverId === userId) {
      conversationPartners.add(message.senderId);
    }
  });
  
  // Create conversation objects
  return Array.from(conversationPartners).map(partnerId => {
    const conversationMessages = getMessagesBetweenUsers(userId, partnerId);
    const lastMessage = conversationMessages[conversationMessages.length - 1];
    
    return {
      id: `conv-${userId}-${partnerId}`,
      participants: [userId, partnerId],
      lastMessage,
      updatedAt: lastMessage?.timestamp || new Date().toISOString()
    };
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

// Helper function to send a new message
export const sendMessage = (newMessage: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Message => {
  const message: Message = {
    ...newMessage,
    id: `m${messages.length + 1}`,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  
  messages.push(message);
  return message;
};