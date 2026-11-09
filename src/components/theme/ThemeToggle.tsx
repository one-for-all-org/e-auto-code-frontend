import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTheme } from './useTheme';
import { useTranslation } from 'react-i18next';

export function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  return (
    <Button
      type="button"
      variant="ghost"
      size={showLabel ? 'md' : 'icon'}
      onClick={toggleTheme}
      aria-label={isDark ? t('common.theme.light') : t('common.theme.dark')}
      title={isDark ? t('common.theme.light') : t('common.theme.dark')}
      className={showLabel ? 'w-full justify-start' : undefined}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      {showLabel && <span>{isDark ? t('common.theme.light') : t('common.theme.dark')}</span>}
    </Button>
  );
}
