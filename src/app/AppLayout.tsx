import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogOut, MessageSquare, Signpost, User, Shield, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { Toaster } from '@/components/ui/Toaster';
import { getToken } from '@/lib/tokenStorage';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useMe } from '@/features/profile/hooks/useProfile';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 sm:px-3 ${
    isActive ? 'bg-teal-50 text-teal-800' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
  }`;

export default function AppLayout() {
  const logout = useLogout();
  const token = getToken();
  const me = useMe();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Toaster />
      <header className="sticky top-0 z-50 w-full shrink-0 border-b border-stone-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-3 py-2 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-0">
          <Link to="/" className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white shadow-sm">
              <Signpost size={18} />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-semibold text-stone-900">Code de la route</span>
              <span className="flex items-center gap-1.5 text-xs text-stone-500">
                <span className="h-1 w-3 rounded-full bg-amber-400" />
                Madagascar
              </span>
            </span>
          </Link>
          <nav aria-label="Navigation principale" className="flex w-full items-center justify-between gap-1 sm:w-auto sm:justify-start">
            <NavLink to="/" className={navClass} aria-label="Accueil">
              <Home size={18} />
              <span className="hidden sm:inline">Accueil</span>
            </NavLink>
            {token ? (
              <>
                <NavLink to="/chat" className={navClass} aria-label="Chat">
                  <MessageSquare size={18} />
                  <span className="hidden sm:inline">Chat</span>
                </NavLink>
                <NavLink to="/profile" className={navClass} aria-label="Profil">
                  <User size={18} />
                  <span className="hidden sm:inline">Profil</span>
                </NavLink>
              </>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 px-0 sm:w-auto sm:px-3"
              onClick={logout}
              aria-label={token ? 'Déconnexion' : 'Connexion'}
              disabled={!token}
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">{token ? 'Déconnexion' : 'Connexion'}</span>
            </Button>
            {token && me.data?.role === 'ADMIN' && (
              <NavLink to="/admin" className={navClass} aria-label="Admin">
                <Shield size={18} />
                <span className="hidden sm:inline">Admin</span>
              </NavLink>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
