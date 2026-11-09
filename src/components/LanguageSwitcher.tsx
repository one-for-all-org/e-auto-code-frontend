import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { FR, GB, MG } from 'country-flag-icons/react/3x2';
import { useTranslation } from 'react-i18next';
import { getAppLanguage, type AppLanguage } from '@/i18n';

const languages = [
  { code: 'fr', Flag: FR },
  { code: 'en', Flag: GB },
  { code: 'mg', Flag: MG },
] as const satisfies readonly { code: AppLanguage; Flag: typeof FR }[];

export function LanguageSwitcher({ menuMode = false }: { menuMode?: boolean }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const activeLanguage = getAppLanguage(i18n.resolvedLanguage ?? i18n.language);
  const active = languages.find(({ code }) => code === activeLanguage) ?? languages[0];
  const ActiveFlag = active.Flag;

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [open]);

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    let nextIndex: number | undefined;
    if (event.key === 'ArrowDown') nextIndex = (index + 1) % items.length;
    if (event.key === 'ArrowUp') nextIndex = (index - 1 + items.length) % items.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = items.length - 1;
    if (event.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
    }
    if (nextIndex !== undefined) {
      event.preventDefault();
      items[nextIndex]?.focus();
    }
  };

  return (
    <div ref={containerRef} className={`relative${menuMode ? ' w-full' : ''}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={t('common.language')}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => containerRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus());
          }
        }}
        className={`inline-flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-medium text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring${menuMode ? ' w-full justify-start' : ''}`}
      >
        <ActiveFlag aria-hidden="true" className="h-4 w-6 rounded-sm object-cover" />
        <span className={menuMode ? 'flex-1 text-left' : 'hidden sm:inline'}>{t(`common.languages.${active.code}`)}</span>
        {!menuMode && <Languages aria-hidden="true" className="h-4 w-4 sm:hidden" />}
        <ChevronDown aria-hidden="true" className={menuMode ? 'h-4 w-4' : 'hidden h-4 w-4 sm:block'} />
      </button>
      {open && (
        <div
          role="menu"
          aria-label={t('common.language')}
          onKeyDown={handleMenuKeyDown}
          className="absolute right-0 z-50 mt-2 min-w-44 rounded-lg border border-border bg-card p-1 shadow-lg"
        >
          {languages.map(({ code, Flag }) => (
            <button
              key={code}
              type="button"
              role="menuitem"
              lang={code}
              aria-current={activeLanguage === code ? 'true' : undefined}
              onClick={() => {
                void i18n.changeLanguage(code);
                setOpen(false);
                triggerRef.current?.focus();
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
            >
              <Flag aria-hidden="true" className="h-4 w-6 rounded-sm object-cover" />
              <span className="flex-1">{t(`common.languages.${code}`)}</span>
              {activeLanguage === code && <Check aria-hidden="true" className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
