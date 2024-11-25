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

export const privacyPolicyLink = ''
export const termsAndConditionsLink = ''

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
  HabitUpdateScreen: 'HabitUpdateScreen',
  HabitCreateScreen: 'HabitCreateScreen',
  HabitListScreen: 'HabitListScreen',
}
