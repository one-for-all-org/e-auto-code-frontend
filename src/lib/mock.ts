import { ApiError } from '@/lib/errors';
import i18n, { getAppLanguage } from '@/i18n';
import type { AuthResponse, Conversation, Message, SendMessageResponse, User } from '@/types';

type MockCall = { method: 'GET' | 'POST' | 'PATCH' | 'DELETE'; path: string; body?: unknown; token: string | null };
type StoredUser = User & { password: string };
type StoredConversation = Conversation & { userId: string; isUntitled: boolean };

const users: StoredUser[] = [];
const sessions = new Map<string, string>();
const conversations: StoredConversation[] = [];
let messages: Message[] = [];

const delay = () => new Promise((resolve) => setTimeout(resolve, 400));
const now = () => Date.now();
const uid = () => crypto.randomUUID();
const toUser = ({ id, name, email, role, isOk, isBlocked, createdAt }: StoredUser): User => ({ id, name, email, role, isOk, isBlocked, createdAt });

function findUser(userId: string): StoredUser {
  const user = users.find((u) => u.id === userId);
  if (!user) throw new ApiError(i18n.t('common.errors.sessionExpired'), 401);
  return user;
}

function openSession(user: StoredUser): AuthResponse {
  const token = uid();
  const refreshToken = uid();
  sessions.set(token, user.id);
  return { token, refreshToken, user: toUser(user) };
}

function requireConversation(userId: string, id: string): StoredConversation {
  const conversation = conversations.find((c) => c.id === id && c.userId === userId);
  if (!conversation) throw new ApiError(i18n.t('common.errors.conversationNotFound'), 404);
  return conversation;
}

function mockAnswer(question: string, fileName: string | undefined, lang: ReturnType<typeof getAppLanguage>): string {
  const translate = i18n.getFixedT(lang);
  const t = (key: string, options?: Record<string, string>) => translate(key, options ?? {});
  const attachment = fileName ? `\n\n${t('chat.demo.fileReceived', { fileName })}` : '';
  return [
    `## ${t('chat.demo.answerTitle')}`,
    '',
    t('chat.demo.questionIntro', { question: question || t('chat.demo.fileFallback') }),
    '',
    `### ${t('chat.demo.keyPoints')}`,
    '',
    `- ${t('chat.demo.rightSide')}`,
    `- ${t('chat.demo.priority')}`,
    `- ${t('chat.demo.signals')}`,
    '',
    `| ${t('chat.demo.tableItem')} | ${t('chat.demo.tableRemember')} |`,
    '| --- | --- |',
    `| ${t('chat.demo.traffic')} | ${t('chat.demo.driveRight')} |`,
    `| ${t('chat.demo.lights')} | ${t('chat.demo.lightRules')} |`,
    '',
    `> ${t('chat.demo.simulated')}${attachment}`,
  ].join('\n');
}

function authRoute<T>(action: string | undefined, body: Record<string, string>): T {
  if (action === 'register') {
    if (users.some((u) => u.email === body.email)) throw new ApiError(i18n.t('common.errors.emailInUse'), 409);
    const user: StoredUser = { id: uid(), name: body.name, email: body.email, password: body.password, role: 'USER', isOk: false, isBlocked: false, createdAt: now() };
    users.push(user);
    return openSession(user) as T;
  }
  if (action === 'login') {
    const user = users.find((u) => u.email === body.email && u.password === body.password);
    if (!user) throw new ApiError(i18n.t('common.errors.invalidCredentials'), 401);
    return openSession(user) as T;
  }
  throw new ApiError(i18n.t('common.errors.notFound'), 404);
}

function listConversations(userId: string): Conversation[] {
  return conversations
    .filter((c) => c.userId === userId)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

function createConversation(userId: string): Conversation {
  const timestamp = now();
  const conversation: StoredConversation = {
    id: uid(),
    userId,
    title: i18n.t('history.newConversation'),
    createdAt: timestamp,
    updatedAt: timestamp,
    isUntitled: true,
  };
  conversations.push(conversation);
  return conversation;
}

function renameConversation(userId: string, id: string, title: string): Conversation {
  const conversation = requireConversation(userId, id);
  conversation.title = title.trim() || i18n.t('history.newConversation');
  conversation.isUntitled = !title.trim();
  conversation.updatedAt = now();
  return conversation;
}

function deleteConversation(userId: string, id: string): void {
  const conversation = requireConversation(userId, id);
  conversations.splice(conversations.indexOf(conversation), 1);
  messages = messages.filter((m) => m.conversationId !== id);
}

function listMessages(userId: string, id: string): Message[] {
  requireConversation(userId, id);
  return messages.filter((m) => m.conversationId === id).sort((a, b) => a.createdAt - b.createdAt);
}

function postMessage(userId: string, id: string, form: FormData): SendMessageResponse {
  const conversation = requireConversation(userId, id);
  const content = String(form.get('content') ?? '').trim();
  const file = form.get('file');
  const fileName = file instanceof File ? file.name : undefined;
  if (!content && !fileName) throw new ApiError(i18n.t('common.errors.emptyMessage'), 400);

  const timestamp = now();
  const userMessage: Message = { id: uid(), conversationId: id, role: 'user', content, attachmentName: fileName ?? null, createdAt: timestamp };
  const assistantMessage: Message = {
    id: uid(),
    conversationId: id,
    role: 'assistant',
    content: mockAnswer(content, fileName, getAppLanguage(String(form.get('lang') ?? 'fr'))),
    attachmentName: null,
    createdAt: timestamp,
  };
  messages.push(userMessage, assistantMessage);

  if (conversation.isUntitled) {
    conversation.title = (content || fileName || i18n.t('history.newConversation')).slice(0, 40);
    conversation.isUntitled = false;
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
  if (!userId) throw new ApiError(i18n.t('common.errors.sessionExpired'), 401);

  if (root === 'me') {
    if (method === 'GET') return { success: true, data: { user: toUser(findUser(userId)) }, message: i18n.t('profile.title') } as T;
    const user = findUser(userId);
    if (data.name) user.name = data.name;
    if (data.password) user.password = data.password;
    return { success: true, data: { user: toUser(user) }, message: i18n.t('profile.updated') } as T;
  }

  if (root === 'admin' && id === 'users') {
    if (method === 'GET') return { users: users.map(toUser) } as T;
    throw new ApiError(i18n.t('common.errors.notFound'), 404);
  }

  if (root === 'admin' && id === 'lessons' && sub === 'analyze' && method === 'POST') {
    const form = body as FormData;
    const file = form.get('file');
    const question = String(form.get('question') ?? '').trim();
    if (!(file instanceof File) || !question) throw new ApiError(i18n.t('common.errors.selectFileAndQuestion'), 400);
    return {
      success: true,
      data: { answer: mockAnswer(question, file.name, getAppLanguage()) },
      message: i18n.t('chat.demo.responseGenerated'),
    } as T;
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

  throw new ApiError(i18n.t('common.errors.notFound'), 404);
}
