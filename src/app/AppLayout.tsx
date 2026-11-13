import { useState } from 'react';
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  CircleHelp,
  LogOut,
  MessageSquare,
  Signpost,
  Shield,
  Home,
  BookOpenCheck,
  Settings,
} from "lucide-react";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { LogoutConfirm } from "@/features/auth/components/LogoutConfirm";
import { Toaster } from "@/components/ui/Toaster";
import { getToken } from "@/lib/tokenStorage";
import { useMe } from "@/features/profile/hooks/useProfile";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg px-2.5 text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 ${
    isActive
      ? "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200"
      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-100"
  }`;

function initials(name?: string) {
  return (name ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?';
}

export default function AppLayout() {
  const { t } = useTranslation();
  const logout = useLogout();
  const token = getToken();
  const me = useMe();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <Toaster />
      <header className="z-50 w-full shrink-0 border-b border-border bg-card">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-1 sm:gap-3">
            <Link
              to="/"
              className="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Signpost size={17} />
              </span>
              <span className="hidden min-w-0 truncate text-sm font-semibold text-foreground sm:block">
                {t("common.brand")}
              </span>
            </Link>
            {token ? (
              <>
                <NavLink to="/chat" className={navClass} aria-label={t("common.nav.chat")}>
                  <MessageSquare size={18} />
                  <span className="hidden md:inline">{t("common.nav.chat")}</span>
                </NavLink>
                <NavLink to="/good-practices" className={navClass} aria-label={t("common.nav.goodPractices")}>
                  <BookOpenCheck size={18} />
                  <span className="hidden md:inline">{t("common.nav.goodPractices")}</span>
                </NavLink>
                {me.data?.role === "ADMIN" && (
                  <NavLink to="/admin" className={navClass} aria-label={t("common.nav.admin")}>
                    <Shield size={18} />
                    <span className="hidden md:inline">{t("common.nav.admin")}</span>
                  </NavLink>
                )}
              </>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <LanguageSwitcher />
            {token && (
              <details className="group relative">
                <summary
                  aria-label={t("common.nav.profile")}
                  className="flex h-9 cursor-pointer list-none items-center gap-1.5 rounded-lg px-1.5 text-sm font-medium text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-2 [&::-webkit-details-marker]:hidden"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {initials(me.data?.name)}
                  </span>
                  <span className="hidden max-w-36 truncate sm:block">
                    {me.data?.name ?? t("common.nav.profile")}
                  </span>
                </summary>
                <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-border bg-card p-2 shadow-float">
                  <div className="border-b border-border px-3 py-2">
                    <p className="truncate text-sm font-semibold text-foreground">{me.data?.name}</p>
                    <p className="truncate text-xs text-stone-500">{me.data?.email}</p>
                  </div>
                  <NavLink
                    to="/profile"
                    onClick={(event) =>
                      event.currentTarget
                        .closest("details")
                        ?.removeAttribute("open")
                    }
                    className={({ isActive }) =>
                      cn(navClass({ isActive }), "mt-1 w-full justify-start")
                    }
                  >
                    <Settings size={16} />
                    <span>{t("common.nav.profile")}</span>
                  </NavLink>
                  <NavLink
                    to="/help"
                    onClick={(event) =>
                      event.currentTarget
                        .closest("details")
                        ?.removeAttribute("open")
                    }
                    className={({ isActive }) =>
                      cn(navClass({ isActive }), "mt-1 w-full justify-start")
                    }
                  >
                    <CircleHelp size={16} />
                    {t("common.nav.help")}
                  </NavLink>
                  <div className="mt-1 border-t border-border pt-1">
                    <LanguageSwitcher menuMode />
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.currentTarget
                        .closest("details")
                        ?.removeAttribute("open");
                      setLogoutConfirmOpen(true);
                    }}
                    className="mt-1 flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-100"
                  >
                    <LogOut size={16} />
                    {t("common.nav.logout")}
                  </button>
                </div>
              </details>
            )}
          </div>
        </div>
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>

      <LogoutConfirm
        open={logoutConfirmOpen}
        onConfirm={logout}
        onCancel={() => setLogoutConfirmOpen(false)}
      />

    </div>
  );
}
