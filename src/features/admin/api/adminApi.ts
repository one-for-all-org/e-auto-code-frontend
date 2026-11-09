import { request } from '@/lib/http';
import type { User } from '@/types';

export type Lesson = {
  id: string;
  originalName: string;
  resourceUrl: string | null;
  mimeType: string;
  fileSize: number;
  createdAt: number;
  updatedAt: number;
};

export const listUsers = async () => {
  const res = await request<{ success: boolean; data: { users: User[] }; message: string }>('/admin/users');
  return res.data.users;
};

export const createUser = async (input: { name: string; email: string; password: string; role?: 'USER' | 'ADMIN' }) => {
  const res = await request<{ success: boolean; data: { user: User }; message: string }>('/admin/users', {
    method: 'POST',
    body: input,
  });
  return res.data.user;
};

export const updateUser = async (
  userId: string,
  input: { name?: string; password?: string; role?: 'USER' | 'ADMIN'; isOk?: boolean; isBlocked?: boolean }
) => {
  const res = await request<{ success: boolean; data: { user: User }; message: string }>(`/admin/users/${userId}`, {
    method: 'PATCH',
    body: input,
  });
  return res.data.user;
};

export const deleteUser = async (userId: string) =>
  request<{ success: boolean; data: { id: string }; message: string }>(`/admin/users/${userId}`, { method: 'DELETE' }).then(
    (res) => res.data.id
  );

export const listLessons = async () => {
  const res = await request<{ success: boolean; data: { lessons: Lesson[] }; message: string }>('/admin/lessons');
  return res.data.lessons;
};

export const uploadLesson = async (input: { file: File; resourceUrl?: string | null }) => {
  const body = new FormData();
  body.append('file', input.file);
  if (input.resourceUrl) body.append('resourceUrl', input.resourceUrl);
  const res = await request<{ success: boolean; data: { lesson: Lesson }; message: string }>('/admin/lessons', {
    method: 'POST',
    body,
  });
  return res.data.lesson;
};

export const updateLesson = async (input: { lessonId: string; file?: File; resourceUrl?: string | null }) => {
  const body = new FormData();
  if (input.file) body.append('file', input.file);
  if (input.resourceUrl) body.append('resourceUrl', input.resourceUrl);
  const res = await request<{ success: boolean; data: { lesson: Lesson }; message: string }>(`/admin/lessons/${input.lessonId}`, {
    method: 'PATCH',
    body,
  });
  return res.data.lesson;
};

export const askGeminiAboutFile = async (input: { file: File; question: string }) => {
  const body = new FormData();
  body.append('file', input.file);
  body.append('question', input.question);
  const res = await request<{ success: boolean; data: { answer: string }; message: string }>(
    '/admin/lessons/analyze',
    { method: 'POST', body },
  );
  return res.data.answer;
};

export const deleteLesson = async (lessonId: string) =>
  request<{ success: boolean; data: { id: string }; message: string }>(`/admin/lessons/${lessonId}`, {
    method: 'DELETE',
  }).then((res) => res.data.id);
