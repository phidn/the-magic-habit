import { API_URL, DOMAIN, OTA_UPDATE, OTA_VERSION } from '@env'

import { TScreen } from '@/types/navigation'

export const CONFIG = {
  appNameShort: 'Magic Habit',
  appName: 'The Magic Habit',
  appPackageName: 'com.magichabit.prod',
  supportEmail: 'hello.themagiclife@gmail.com',
  apiURL: API_URL,
  domain: DOMAIN,
  otaUpdate: OTA_UPDATE,
  otaVersion: +OTA_VERSION,
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

export const privacyPolicyLink = 'https://phidndev.notion.site/Privacy-Policy-15595d03523b8040ac54f3d677872256'
export const termsAndConditionsLink = 'https://phidndev.notion.site/Terms-Conditions-15595d03523b800e96c3d3a95ab14f97'

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
  BottomNavigator: 'BottomNavigator',
  LanguageSettingScreen: 'LanguageSettingScreen',
  MeditateScreen: 'MeditateScreen',
  SignUpScreen: 'SignUpScreen',
  LoginScreen: 'LoginScreen',
  ForgotPassword: 'ForgotPassword',
  HabitUpdateScreen: 'HabitUpdateScreen',
  HabitCreateScreen: 'HabitCreateScreen',
  HabitListScreen: 'HabitListScreen',
  SettingsScreen: 'SettingsScreen',
  TimelineJournalScreen: 'TimelineJournalScreen',
}
