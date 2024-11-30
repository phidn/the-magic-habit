import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { THabit } from '@mazic/shared'

/**
 * When adding a new screen, add it here and in the screens object in the config file
 * config/config.ts
 */
export type RootStackNavigator = {
  BottomTabNavigator: undefined
  BottomNavigator: undefined
  LanguageSettingScreen: undefined
  SignUpScreen: undefined
  LoginScreen: undefined
  ForgotPassword: undefined
  MeditateScreen: {
    duration: number
    interval: number
    countInterval: number
    bellId: string
    bellVolume: number
  }
  HabitUpdateScreen: {
    habit: THabit
  }
  HabitCreateScreen: undefined
  HabitListScreen: undefined
  TimelineJournalScreen: undefined
  SettingsScreen: undefined
}

export type TNavigationRoot = NativeStackNavigationProp<RootStackNavigator>

export type TScreen = {
  [K in keyof RootStackNavigator]: K
}
