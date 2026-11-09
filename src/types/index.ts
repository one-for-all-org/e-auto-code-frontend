export type User = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  roadRole: RoadRole;
  isOk: boolean;
  isBlocked: boolean;
  createdAt: number;
};

export type RoadRole = 'DRIVER' | 'PASSENGER' | 'PEDESTRIAN' | 'CITIZEN';

export type AuthResponse = {
  token: string;
  refreshToken: string;
  user: User;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};

export type Message = {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  attachmentName?: string | null;
  createdAt: number;
};

export type SendMessageResponse = {
  userMessage: Message;
  assistantMessage: Message;
};
