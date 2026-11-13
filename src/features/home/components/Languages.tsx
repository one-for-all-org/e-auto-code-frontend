import { useTranslation } from 'react-i18next';
import { FR, GB, MG } from 'country-flag-icons/react/3x2';

const languageFlags = [
  { code: 'fr', Flag: FR },
  { code: 'en', Flag: GB },
  { code: 'mg', Flag: MG },
] as const;

export function Languages() {
  const { t } = useTranslation();

  return (
    <section className="bg-teal-50 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t('home.languagesText')}</h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {languageFlags.map(({ code, Flag }) => (
            <span key={code} lang={code} className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <Flag aria-hidden="true" className="h-5 w-7 rounded-sm object-cover" />
              {t(`common.languages.${code}`)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
