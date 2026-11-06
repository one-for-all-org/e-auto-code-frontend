import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe, updateMe } from '@/features/profile/api/profileApi';

export const meQueryKey = ['me'] as const;

export function useMe() {
  return useQuery({ queryKey: meQueryKey, queryFn: getMe });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (user) => queryClient.setQueryData(meQueryKey, user),
  });
}
