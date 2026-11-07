import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useMe } from '@/features/profile/hooks/useProfile';
import { meQueryKey } from '@/features/profile/hooks/useProfile';
import { clearAuth, getToken } from '@/lib/tokenStorage';
import { refreshAccessToken } from '@/lib/http';
import { useQueryClient } from '@tanstack/react-query';

export default function RequireAdmin() {
  const queryClient = useQueryClient();
  const me = useMe();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false);

  useEffect(() => {
    if (me.isError) {
      const status = (me.error as { status?: number })?.status;
      if (status === 401 && !isRefreshing && !hasAttemptedRefresh) {
        if (!getToken()) {
          window.location.assign('/login');
          return;
        }
        setIsRefreshing(true);
        setHasAttemptedRefresh(true);
        refreshAccessToken()
          .then(() => {
            queryClient.invalidateQueries({ queryKey: meQueryKey });
            setHasAttemptedRefresh(false);
          })
          .catch(() => {
            clearAuth();
            window.location.assign('/login');
          })
          .finally(() => setIsRefreshing(false));
      }
    }
  }, [me.isError, queryClient, isRefreshing, hasAttemptedRefresh]);

  if (me.isPending || isRefreshing) return <Spinner className="mx-auto mt-12" />;
  if (me.isError) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-12">
        <EmptyState icon={AlertCircle} title="Accès impossible à vérifier" description={me.error.message} />
      </div>
    );
  }
  if (!me.data || me.data.role !== 'ADMIN') return <Navigate to="/chat" replace />;
  return <Outlet />;
}
