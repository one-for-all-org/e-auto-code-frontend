import { Link, NavLink, Outlet } from "react-router-dom";
import {
  ChevronDown,
  CircleHelp,
  LogOut,
  MessageSquare,
  Signpost,
  UserCircle,
  Shield,
  Home,
  BookOpenCheck,
} from "lucide-react";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { Toaster } from "@/components/ui/Toaster";
import { getToken } from "@/lib/tokenStorage";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useMe } from "@/features/profile/hooks/useProfile";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 sm:px-3 ${
    isActive
      ? "bg-teal-50 text-teal-800"
      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
  }`;

export default function AppLayout() {
  const { t } = useTranslation();
  const logout = useLogout();
  const token = getToken();
  const me = useMe();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Toaster />
      <header className="sticky top-0 z-50 w-full shrink-0 border-b border-stone-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-3 py-2 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-0">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white shadow-sm">
              <Signpost size={18} />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-semibold text-stone-900">
                {t("common.brand")}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-stone-500">
                <span className="h-1 w-3 rounded-full bg-amber-400" />
                {t("common.madagascar")}
              </span>
            </span>
          </Link>
          <nav
            aria-label={t("common.mainNavigation")}
            className="flex w-full min-w-0 flex-wrap items-center justify-between gap-1 sm:w-auto sm:flex-nowrap sm:justify-start"
          >
            <NavLink
              to="/"
              className={navClass}
              aria-label={t("common.nav.home")}
            >
              <Home size={18} />
              <span className="hidden sm:inline">{t("common.nav.home")}</span>
            </NavLink>
            {token ? (
              <>
                <NavLink
                  to="/chat"
                  className={navClass}
                  aria-label={t("common.nav.chat")}
                >
                  <MessageSquare size={18} />
                  <span className="hidden sm:inline">
                    {t("common.nav.chat")}
                  </span>
                </NavLink>
                <NavLink
                  to="/good-practices"
                  className={navClass}
                  aria-label={t("common.nav.goodPractices")}
                >
                  <BookOpenCheck size={18} />
                  <span className="hidden sm:inline">
                    {t("common.nav.goodPractices")}
                  </span>
                </NavLink>
              </>
            ) : null}
            {token && me.data?.role === "ADMIN" && (
              <NavLink
                to="/admin"
                className={navClass}
                aria-label={t("common.nav.admin")}
              >
                <Shield size={18} />
                <span className="hidden sm:inline">
                  {t("common.nav.admin")}
                </span>
              </NavLink>
            )}
            {token && (
              <details className="group relative">
                <summary
                  aria-label={t("common.nav.profile")}
                  className="flex h-9 max-w-40 cursor-pointer list-none items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 sm:max-w-56 sm:px-3 [&::-webkit-details-marker]:hidden"
                >
                  <UserCircle size={18} className="shrink-0" />
                  <span className="truncate">
                    {me.data?.name ?? t("common.nav.profile")}
                  </span>
                  <ChevronDown
                    size={14}
                    className="shrink-0 transition-transform group-open:rotate-180"
                  />
                </summary>
                <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-stone-200 bg-white p-2 shadow-lg">
                  <div className="border-b border-stone-100 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-stone-900">
                      {me.data?.name}
                    </p>
                    <p className="truncate text-xs text-stone-500">
                      {me.data?.email}
                    </p>
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
                    <UserCircle size={16} />
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
                  <div className="mt-1 border-t border-stone-100 pt-1">
                    <LanguageSwitcher menuMode />
                    <ThemeToggle showLabel />
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.currentTarget
                        .closest("details")
                        ?.removeAttribute("open");
                      void logout();
                    }}
                    className="mt-1 flex h-9 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  >
                    <LogOut size={16} />
                    {t("common.nav.logout")}
                  </button>
                </div>
              </details>
            )}
            {!token && (
              <>
                <LanguageSwitcher />
                <ThemeToggle />
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
