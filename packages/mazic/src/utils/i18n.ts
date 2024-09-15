import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'

import { translations } from '@mazic/translations'

const resources = {
  en: {
    translation: translations.en,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export { i18n }
