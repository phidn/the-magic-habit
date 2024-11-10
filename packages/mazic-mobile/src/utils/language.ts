import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'
import AsyncStorage from '@react-native-async-storage/async-storage'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import i18n, { InitOptions, ModuleType } from 'i18next'

import 'dayjs/locale/vi'
import 'dayjs/locale/en'

import en from '../translations/en.json'
import vi from '../translations/vi.json'
dayjs.extend(localeData)

import { storageKeys } from '@/config/config'

type Language = {
  name: string
  code: string
}

const availableLanguages: Language[] = [
  { name: 'Vietnamese', code: 'vi' },
  { name: 'English', code: 'en' },
]

const availableCodes: string[] = availableLanguages.map((language) => language.code)

const getLanguageName = (code?: string): string => {
  const language = availableLanguages.find((x) => x.code === code)
  if (language) return language.name
  return ''
}

const commons: Record<string, any> = {
  en,
  vi,
}

type ResourceTranslation = {
  translation: Record<string, any>
}

const resources: Record<string, ResourceTranslation> = {}

type TimeTranslation = {
  'Time.monthNames': string
  'Time.monthNamesShort': string
  'Time.dayNames': string
  'Time.dayNamesShort': string
}

const times: Record<string, TimeTranslation> = {}

availableCodes.forEach((code) => {
  dayjs.locale(code)
  times[code] = {
    'Time.monthNames': dayjs().localeData().months().join('_'),
    'Time.monthNamesShort': dayjs().localeData().monthsShort().join('_'),
    'Time.dayNames': dayjs().localeData().weekdays().join('_'),
    'Time.dayNamesShort': dayjs().localeData().weekdaysShort().join('_'),
  }
})

availableCodes.forEach((code) => {
  const translation = { ...commons[code], ...(times[code] || times.en) }
  resources[code] = { translation }
})

type LanguageDetector = {
  type: ModuleType
  async: boolean
  init: () => void
  detect: (callback: (language: string) => void) => Promise<void>
  cacheUserLanguage: (language: string) => Promise<void>
}

const languageDetector: LanguageDetector = {
  type: 'languageDetector' as ModuleType,
  async: true,
  init: () => {},

  detect: async function (callback: (language: string) => void) {
    try {
      const language = await AsyncStorage.getItem(storageKeys.appLanguage)
      if (language) {
        return callback(language)
      } else {
        throw new Error('No language is set, choosing the best available or English as fallback')
      }
    } catch (error) {
      console.log('languageDetector detect error', error)
      const bestLanguage = RNLocalize.findBestAvailableLanguage(availableCodes)
      return callback(bestLanguage?.languageTag || 'en')
    }
  },

  cacheUserLanguage: async function (language: string) {
    try {
      await AsyncStorage.setItem(storageKeys.appLanguage, language)
    } catch (error) {
      console.log('languageDetector cacheUserLanguage error', error)
    }
  },
}

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  } as InitOptions)

const i18nInstance = i18n

type LanguageObject = {
  [key: string]: string | LanguageObject
}

type LanguageKeys<T> = {
  [K in keyof T]: T[K] extends LanguageObject ? LanguageKeys<T[K]> : string
}

const createLanguageKeys = <T extends LanguageObject>(obj: T, parentKey = ''): LanguageKeys<T> => {
  const result: any = {}

  Object.keys(obj).forEach((key) => {
    const newKey = parentKey ? `${parentKey}:${key}` : key
    if (typeof obj[key] === 'object') {
      result[key] = createLanguageKeys(obj[key] as LanguageObject, newKey)
    } else {
    }
    result[key] = newKey
  })

  return result as LanguageKeys<T>
}

const languageKeys = createLanguageKeys(en)

export {
  times,
  resources,
  getLanguageName,
  availableLanguages,
  availableCodes,
  i18nInstance,
  languageKeys,
}
