import { ApiError } from '@/lib/errors';
import type { AuthResponse, Conversation, Message, SendMessageResponse, User } from '@/types';

type MockCall = { method: 'GET' | 'POST' | 'PATCH' | 'DELETE'; path: string; body?: unknown; token: string | null };
type StoredUser = User & { password: string };
type StoredConversation = Conversation & { userId: string };

const DEFAULT_TITLE = 'Nouvelle conversation';

const users: StoredUser[] = [];
const sessions = new Map<string, string>();
const conversations: StoredConversation[] = [];
let messages: Message[] = [];

const delay = () => new Promise((resolve) => setTimeout(resolve, 400));
const now = () => new Date().toISOString();
const uid = () => crypto.randomUUID();
const toUser = ({ id, name, email }: StoredUser): User => ({ id, name, email });

function findUser(userId: string): StoredUser {
  const user = users.find((u) => u.id === userId);
  if (!user) throw new ApiError('Session expirée, reconnectez-vous', 401);
  return user;
}

function openSession(user: StoredUser): AuthResponse {
  const token = uid();
  sessions.set(token, user.id);
  return { token, user: toUser(user) };
}

function requireConversation(userId: string, id: string): StoredConversation {
  const conversation = conversations.find((c) => c.id === id && c.userId === userId);
  if (!conversation) throw new ApiError('Conversation introuvable', 404);
  return conversation;
}

function mockAnswer(question: string, fileName?: string): string {
  const attachment = fileName ? `\n\nJ'ai bien reçu le fichier **${fileName}**.` : '';
  return `## Réponse à votre question

Vous avez demandé : *${question || 'votre fichier'}*

### Les points essentiels

- À Madagascar, on roule **à droite**.
- Au carrefour, respectez la **priorité à droite** sauf signalisation contraire.
- Obéissez toujours aux feux et aux panneaux.

| Élément | À retenir |
| --- | --- |
| Circulation | Roulez à droite |
| Feux | Rouge : arrêt, vert : passage libre |

> Mode démonstration : cette réponse est simulée.${attachment}`;
}

function authRoute<T>(action: string | undefined, body: Record<string, string>): T {
  if (action === 'register') {
    if (users.some((u) => u.email === body.email)) throw new ApiError('Cet email est déjà utilisé', 409);
    const user: StoredUser = { id: uid(), name: body.name, email: body.email, password: body.password };
    users.push(user);
    return openSession(user) as T;
  }
  if (action === 'login') {
    const user = users.find((u) => u.email === body.email && u.password === body.password);
    if (!user) throw new ApiError('Email ou mot de passe incorrect', 401);
    return openSession(user) as T;
  }
  throw new ApiError('Introuvable', 404);
}

function listConversations(userId: string): Conversation[] {
  return conversations
    .filter((c) => c.userId === userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function createConversation(userId: string): Conversation {
  const timestamp = now();
  const conversation: StoredConversation = {
    id: uid(),
    userId,
    title: DEFAULT_TITLE,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  conversations.push(conversation);
  return conversation;
}

function renameConversation(userId: string, id: string, title: string): Conversation {
  const conversation = requireConversation(userId, id);
  conversation.title = title.trim() || DEFAULT_TITLE;
  return conversation;
}

function deleteConversation(userId: string, id: string): void {
  const conversation = requireConversation(userId, id);
  conversations.splice(conversations.indexOf(conversation), 1);
  messages = messages.filter((m) => m.conversationId !== id);
}

function listMessages(userId: string, id: string): Message[] {
  requireConversation(userId, id);
  return messages.filter((m) => m.conversationId === id);
}

function postMessage(userId: string, id: string, form: FormData): SendMessageResponse {
  const conversation = requireConversation(userId, id);
  const content = String(form.get('content') ?? '').trim();
  const file = form.get('file');
  const fileName = file instanceof File ? file.name : undefined;
  if (!content && !fileName) throw new ApiError('Le message est vide', 400);

  const timestamp = now();
  const userMessage: Message = { id: uid(), conversationId: id, role: 'user', content, fileName, createdAt: timestamp };
  const assistantMessage: Message = {
    id: uid(),
    conversationId: id,
    role: 'assistant',
    content: mockAnswer(content, fileName),
    createdAt: timestamp,
  };
  messages.push(userMessage, assistantMessage);

  if (conversation.title === DEFAULT_TITLE) {
    conversation.title = (content || fileName || DEFAULT_TITLE).slice(0, 40);
  }
  conversation.updatedAt = timestamp;
  return { userMessage, assistantMessage };
}

export async function mockRequest<T>({ method, path, body, token }: MockCall): Promise<T> {
  await delay();
  const [root, id, sub] = path.split('/').filter(Boolean);
  const data = (body ?? {}) as Record<string, string>;

  if (root === 'auth') return authRoute<T>(id, data);

  const userId = token ? sessions.get(token) : undefined;
  if (!userId) throw new ApiError('Session expirée, reconnectez-vous', 401);

  if (root === 'me') {
    if (method === 'GET') return toUser(findUser(userId)) as T;
    const user = findUser(userId);
    if (data.name) user.name = data.name;
    if (data.password) user.password = data.password;
    return toUser(user) as T;
  }

  if (root === 'conversations') {
    if (!id) {
      return (method === 'GET' ? listConversations(userId) : createConversation(userId)) as T;
    }
    if (sub === 'messages') {
      return (method === 'GET' ? listMessages(userId, id) : postMessage(userId, id, body as FormData)) as T;
    }
    if (method === 'DELETE') return deleteConversation(userId, id) as T;
    return renameConversation(userId, id, data.title ?? '') as T;
  }

  throw new ApiError('Introuvable', 404);
}
