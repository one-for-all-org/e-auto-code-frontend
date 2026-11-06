import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { meQueryKey } from '@/features/profile/hooks/useProfile';
import { login, register } from '@/features/auth/api/authApi';
import { clearToken, setToken } from '@/lib/tokenStorage';

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: ({ token, user }) => {
      setToken(token);
      queryClient.setQueryData(meQueryKey, user);
      navigate('/chat', { replace: true });
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: ({ token, user }) => {
      setToken(token);
      queryClient.setQueryData(meQueryKey, user);
      navigate('/chat', { replace: true });
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return () => {
    clearToken();
    queryClient.clear();
    navigate('/login', { replace: true });
  };
}
