import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enUS from './locales/en-US.json';
import idID from './locales/id-ID.json';
import esES from './locales/es-ES.json';

export const resources = {
  'en-US': { translation: enUS },
  'id-ID': { translation: idID },
  'es-ES': { translation: esES },
} as const;

// Only initialize if we're on the client side
if (typeof window !== 'undefined') {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en-US',
      fallbackLng: 'en-US',
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;