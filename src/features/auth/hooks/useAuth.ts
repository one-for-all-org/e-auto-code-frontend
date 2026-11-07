import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { meQueryKey } from '@/features/profile/hooks/useProfile';
import { login, register, logout, forgotPassword, resetPassword } from '@/features/auth/api/authApi';
import { clearAuth, getRefreshToken, getToken, setRefreshToken, setToken } from '@/lib/tokenStorage';
import { refreshAccessToken } from '@/lib/http';
import { toast } from '@/lib/toast';

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: ({ token, refreshToken, user }) => {
      setToken(token);
      setRefreshToken(refreshToken);
      queryClient.setQueryData(meQueryKey, user);
      toast('success', 'Connexion réussie');
      navigate('/chat', { replace: true });
    },
    onError: () => toast('error', 'Identifiants invalides'),
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: ({ token, refreshToken, user }) => {
      setToken(token);
      setRefreshToken(refreshToken);
      queryClient.setQueryData(meQueryKey, user);
      toast('success', 'Compte créé avec succès');
      navigate('/chat', { replace: true });
    },
    onError: () => toast('error', 'Impossible de créer le compte'),
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return async () => {
    try {
      await logout();
    } catch {
      // ignore errors during logout
    }
    clearAuth();
    queryClient.clear();
    toast('info', 'Déconnecté');
    navigate('/login', { replace: true });
  };
}

export function useRefresh() {
  return useMutation({
    mutationFn: refreshAccessToken,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

export function isAuthenticated() {
  return !!getToken() || !!getRefreshToken();
}
