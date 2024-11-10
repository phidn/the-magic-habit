import { API_URL, DOMAIN } from '@env'

import { TScreen } from '@/types/navigation'

export const CONFIG = {
  appNameShort: 'Magic Habit',
  appName: 'The Magic Habit',
  apiURL: API_URL,
  domain: DOMAIN,
  TIME: {
    DD_MM_YYYY: 'DD/MM/YYYY',
  },
}

export const storageKeys = {
  appStorage: 'appStorage',
  appLanguage: 'appLanguage',
  token: {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
  },
}

export const admobId = 'ca-app-pub-1040556008280910~5322812586'
export const admobBannerId = 'ca-app-pub-1040556008280910/4693161152'

export const privacyPolicyLink =
  'https://phidev.notion.site/Privacy-Policy-750786e461c341cbba51a0a0fa4e3f11'
export const termsAndConditionsLink =
  'https://phidev.notion.site/Terms-Conditions-93c1d5cfd8c74149bd183ce2ee135eb3'

export const revenueCatApiKey = 'goog_lfrHjtpKlamGDZLjBzJFYdKLQUy'

export const soundKeys = [
  'Bell_1',
  'Bell_2',
  'Bell_A',
  'Bell_Meditation_Cleaned',
  'Bell_Meditation',
  'Meditation_Bowls',
  'Singing_bowl_hit_1',
  'Singing_bowl_hit_2',
  'Singing_bowl_hit_3',
  'Singing_Bowl_Male_Frequency',
  'Singing_Bowl',
  'Singing_Bowl_Tibetan',
]

export const screens: TScreen = {
  BottomTabNavigator: 'BottomTabNavigator',
  LanguageSettingScreen: 'LanguageSettingScreen',
  MeditateScreen: 'MeditateScreen',
  SignUpScreen: 'SignUpScreen',
  LoginScreen: 'LoginScreen',
  ForgotPassword: 'ForgotPassword',
}
