import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getToken } from '@/lib/tokenStorage';

export default function RequireAuth() {
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = getToken();
    setOk(!!token);
    setChecked(true);
  }, []);

  if (!checked) return null;
  return ok ? <Outlet /> : <Navigate to="/login" replace />;
}
