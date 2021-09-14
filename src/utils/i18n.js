import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import I18NextXhrBackend from 'i18next-xhr-backend';

import enUS from 'locales/en-US/translation.json';

const resources = { 'en-US': enUS };

i18n
  // load translation using http -> see /public/locales
  .use(I18NextXhrBackend)
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to the react-i18next components.
  .use(initReactI18next)
  // init i18next
  .init({
    fallbackLng: 'en-US',

    debug: false,
    keySeparator: false,
    // saveMissing: true, // send not translated keys to endpoint
    resources,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },

    // defaultNS: ['common'],
    //
    // ns: ['common'],
    // nsSeparator: '.',

    backend: {
      // for all available options read the backend's repository readme file
      // loadPath: '/assets/locales/{{lng}}/{{ns}}.json'
    },

    // special options for react-i18next
    react: {
      useSuspense: false
    }
  }).then();

export default i18n;
