import { Navigate, Outlet } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useMe } from '@/features/profile/hooks/useProfile';

export default function RequireAdmin() {
  const me = useMe();
  if (me.isPending) return <Spinner className="mx-auto mt-12" />;
  if (me.isError) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-12">
        <EmptyState icon={AlertCircle} title="Accès impossible à vérifier" description={me.error.message} />
      </div>
    );
  }
  if (me.data.role !== 'ADMIN') return <Navigate to="/chat" replace />;
  return <Outlet />;
}
