import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { meQueryKey } from '@/features/profile/hooks/useProfile';
import { login, register, logout, forgotPassword, resetPassword } from '@/features/auth/api/authApi';
import { clearAuth, getRefreshToken, getToken, setRefreshToken, setToken } from '@/lib/tokenStorage';
import { refreshAccessToken } from '@/lib/http';
import { toast } from '@/lib/toast';
import { useTranslation } from 'react-i18next';

export function useLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: ({ token, refreshToken, user }) => {
      setToken(token);
      setRefreshToken(refreshToken);
      queryClient.setQueryData(meQueryKey, user);
      toast('success', t('auth.login.success'));
      navigate('/chat', { replace: true });
    },
    onError: () => toast('error', t('auth.login.invalidCredentials')),
  });
}

export function useRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: ({ token, refreshToken, user }) => {
      setToken(token);
      setRefreshToken(refreshToken);
      queryClient.setQueryData(meQueryKey, user);
      toast('success', t('auth.register.success'));
      navigate('/chat', { replace: true });
    },
    onError: () => toast('error', t('auth.register.error')),
  });
}

export function useLogout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return async () => {
    if (!window.confirm(t('common.logoutConfirm'))) {
      return;
    }
    try {
      await logout();
    } catch {
      // ignore errors during logout
    }
    clearAuth();
    queryClient.clear();
    toast('info', t('auth.logoutSuccess'));
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
