import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { THabit } from '@mazic/shared'

export type RootStackNavigator = {
  BottomTabNavigator: undefined
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
}

export type TNavigationRoot = NativeStackNavigationProp<RootStackNavigator>

export type TScreen = {
  [K in keyof RootStackNavigator]: K
}
