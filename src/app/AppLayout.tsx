import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogOut, MessageSquare, Signpost, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLogout } from '@/features/auth/hooks/useAuth';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
    isActive ? 'bg-teal-50 text-teal-800' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
  }`;

export default function AppLayout() {
  const logout = useLogout();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/chat" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white shadow-sm">
              <Signpost size={18} />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-stone-900">Code de la route</span>
              <span className="flex items-center gap-1.5 text-xs text-stone-500">
                <span className="h-1 w-3 rounded-full bg-amber-400" />
                Madagascar
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/chat" className={navClass}>
              <MessageSquare size={16} />
              Chat
            </NavLink>
            <NavLink to="/profile" className={navClass}>
              <User size={16} />
              Profil
            </NavLink>
            <Button variant="ghost" size="sm" onClick={logout} aria-label="Déconnexion">
              <LogOut size={16} />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
