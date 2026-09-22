import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import th from './th.json'

const savedLng = localStorage.getItem('dpmboss.lang') ?? 'th'

void i18n.use(initReactI18next).init({
  resources: {
    th: { translation: th },
    en: { translation: en },
  },
  lng: savedLng,
  fallbackLng: 'th',
  interpolation: { escapeValue: false },
})

export default i18n
