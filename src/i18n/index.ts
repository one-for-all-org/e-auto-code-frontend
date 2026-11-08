import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fr from './locales/fr.json';
import mg from './locales/mg.json';

export type AppLanguage = 'fr' | 'en' | 'mg';

export function getAppLanguage(language = i18n.resolvedLanguage ?? i18n.language): AppLanguage {
  const code = language.toLowerCase().split('-')[0];
  return code === 'en' || code === 'mg' ? code : 'fr';
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      mg: { translation: mg },
    },
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en', 'mg'],
    load: 'languageOnly',
    defaultNS: 'translation',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  });

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = getAppLanguage(language);
});

document.documentElement.lang = getAppLanguage();

export default i18n;
