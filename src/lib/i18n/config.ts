import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enUS from './locales/en-US.json';
import idID from './locales/id-ID.json';
import esES from './locales/es-ES.json';
import frFR from './locales/fr-FR.json';
import deDE from './locales/de-DE.json';
import jaJP from './locales/ja-JP.json';
import koKR from './locales/ko-KR.json';
import zhCN from './locales/zh-CN.json';
import ptBR from './locales/pt-BR.json';
import itIT from './locales/it-IT.json';
import nlNL from './locales/nl-NL.json';
import ruRU from './locales/ru-RU.json';
import arSA from './locales/ar-SA.json';
import trTR from './locales/tr-TR.json';
import plPL from './locales/pl-PL.json';
import svSE from './locales/sv-SE.json';
import noNO from './locales/no-NO.json';
import daDK from './locales/da-DK.json';
import fiFI from './locales/fi-FI.json';
import csCZ from './locales/cs-CZ.json';

export const resources = {
  'en-US': { translation: enUS },
  'id-ID': { translation: idID },
  'es-ES': { translation: esES },
  'fr-FR': { translation: frFR },
  'de-DE': { translation: deDE },
  'ja-JP': { translation: jaJP },
  'ko-KR': { translation: koKR },
  'zh-CN': { translation: zhCN },
  'pt-BR': { translation: ptBR },
  'it-IT': { translation: itIT },
  'nl-NL': { translation: nlNL },
  'ru-RU': { translation: ruRU },
  'ar-SA': { translation: arSA },
  'tr-TR': { translation: trTR },
  'pl-PL': { translation: plPL },
  'sv-SE': { translation: svSE },
  'no-NO': { translation: noNO },
  'da-DK': { translation: daDK },
  'fi-FI': { translation: fiFI },
  'cs-CZ': { translation: csCZ },
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