export type User = { id: string; name: string; email: string };

export type AuthResponse = { token: string; user: User };

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  fileName?: string | null;
  createdAt: string;
};

export type SendMessageResponse = {
  userMessage: Message;
  assistantMessage: Message;
};
