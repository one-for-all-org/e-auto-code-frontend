import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createUser,
  askGeminiAboutFile,
  deleteLesson,
  deleteUser,
  listLessons,
  listUsers,
  updateLesson,
  updateUser,
  uploadLesson,
} from '@/features/admin/api/adminApi';

export const usersKey = ['admin-users'] as const;
export const lessonsKey = ['admin-lessons'] as const;

export function useListUsers() {
  return useQuery({ queryKey: usersKey, queryFn: listUsers });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKey }),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: Parameters<typeof updateUser>[1] }) =>
      updateUser(userId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKey }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKey }),
  });
}

export function useListLessons() {
  return useQuery({ queryKey: lessonsKey, queryFn: listLessons });
}

export function useUploadLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadLesson,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: lessonsKey }),
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLesson,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: lessonsKey }),
  });
}

export function useAskGeminiAboutFile() {
  return useMutation({ mutationFn: askGeminiAboutFile });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLesson,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: lessonsKey }),
  });
}
