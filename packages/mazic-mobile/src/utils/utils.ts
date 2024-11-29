import { LogBox } from 'react-native'
import Toast from 'react-native-toast-message'

import { i18nInstance } from './language'

export const skipError = () => {
  if (__DEV__) {
    const ignoreMsg = [
      'A props object containing a "key" prop is being spread into JSX',
      'Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.',
      'You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc',
    ]

    const warn = console.warn
    console.warn = (...arg) => {
      for (const warning of ignoreMsg) {
        if (arg?.[0]?.includes?.(warning)) {
          return
        }
      }
      warn(...arg)
    }
    const error = console.error
    console.error = (...arg) => {
      for (const err of ignoreMsg) {
        if (arg?.[0]?.includes?.(err)) {
          return
        }
      }
      error(...arg)
    }
    LogBox.ignoreLogs(ignoreMsg)
  }
}

export const getAsset = (assetKey: string) => {
  switch (assetKey) {
    case 'Bell_1_short':
      return require('@/assets/soundsv2/Bell_1_short.mp3')
    case 'Bell_1_long':
      return require('@/assets/soundsv2/Bell_1_long.mp3')

    case 'Bell_2_short':
      return require('@/assets/soundsv2/Bell_2_short.mp3')
    case 'Bell_2_long':
      return require('@/assets/soundsv2/Bell_2_long.mp3')

    case 'Bell_A_short':
    case 'Bell_A_long':
      return require('@/assets/soundsv2/Bell_A.mp3')

    case 'Bell_Meditation_Cleaned_short':
      return require('@/assets/soundsv2/Bell_Meditation_Cleaned_short.mp3')
    case 'Bell_Meditation_Cleaned_long':
      return require('@/assets/soundsv2/Bell_Meditation_Cleaned_long.mp3')

    case 'Bell_Meditation_short':
      return require('@/assets/soundsv2/Bell_Meditation_short.mp3')
    case 'Bell_Meditation_long':
      return require('@/assets/soundsv2/Bell_Meditation_long.mp3')

    case 'Meditation_Bowls_short':
    case 'Meditation_Bowls_long':
      return require('@/assets/soundsv2/Meditation_Bowls.mp3')

    case 'Singing_bowl_hit_1_short':
      return require('@/assets/soundsv2/Singing_bowl_hit_1_short.mp3')
    case 'Singing_bowl_hit_1_long':
      return require('@/assets/soundsv2/Singing_bowl_hit_1_long.mp3')

    case 'Singing_bowl_hit_2_short':
      return require('@/assets/soundsv2/Singing_bowl_hit_2_short.mp3')
    case 'Singing_bowl_hit_2_long':
      return require('@/assets/soundsv2/Singing_bowl_hit_2_long.mp3')

    case 'Singing_bowl_hit_3_short':
      return require('@/assets/soundsv2/Singing_bowl_hit_3_short.mp3')
    case 'Singing_bowl_hit_3_long':
      return require('@/assets/soundsv2/Singing_bowl_hit_3_long.mp3')

    case 'Singing_Bowl_Male_Frequency_short':
      return require('@/assets/soundsv2/Singing_Bowl_Male_Frequency_short.mp3')
    case 'Singing_Bowl_Male_Frequency_long':
      return require('@/assets/soundsv2/Singing_Bowl_Male_Frequency_long.mp3')

    case 'Singing_Bowl_short':
      return require('@/assets/soundsv2/Singing_Bowl_short.mp3')
    case 'Singing_Bowl_long':
      return require('@/assets/soundsv2/Singing_Bowl_long.mp3')

    case 'Singing_Bowl_Tibetan_short':
    case 'Singing_Bowl_Tibetan_long':
      return require('@/assets/soundsv2/Singing_Bowl_Tibetan.mp3')
  }

  console.log('getAsset error', assetKey)
  return null
}

// WARNING: This is not a drop in replacement solution and
export const isNumber = (a: any) => typeof a === 'number'

export const range = (start: number, end?: number, increment?: number) => {
  const isEndDef = typeof end !== 'undefined'
  const _end = isEndDef ? end : start
  start = isEndDef ? start : 0

  if (typeof increment === 'undefined') {
    increment = Math.sign(_end - start)
  }

  const length = Math.abs((_end - start) / (increment || 1))

  const { result: finalResult } = Array.from({ length }).reduce(
    ({ result: innerResult, current }) => ({
      result: [...innerResult, current],
      current: current + increment,
    }),
    { current: start, result: [] },
  )

  return finalResult
}

export const roundNumber = (number: number, decimal_places = 0) => {
  const places = 10 ** decimal_places
  const result = Math.round(number * places) / places
  return result
}

// console.log(roundNearest5(13)); // 👉️ 15
// console.log(roundNearest5(-12)); // 👉️ -10
export const roundNearest = (num: number, numNearest = 5) => {
  return Math.round(num / numNearest) * numNearest
}

/**
 *
 * Getting a random integer between two values, inclusive
 */
export const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const capitalize = (str: string) => {
  return `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`
}

export const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(() => resolve(null), time))
}

export const getAlphaByPercent = (percent: number) => {
  if (percent > 0 && percent < 40) return 0.4
  if (percent >= 40 && percent < 60) return 0.6
  if (percent >= 60 && percent < 80) return 0.8
  if (percent >= 80) return 1
  return 0
}

export const getAlphaByLevel = (level: number) => {
  if (level <= 1) return 0.4
  if (level === 2) return 0.6
  if (level === 3) return 0.8
  if (level >= 4) return 1
  return 0
}

export const showToast = {
  error: (message: string) => {
    Toast.show({
      type: 'error',
      text1: message || i18nInstance.t('Common.error.wrong'),
      visibilityTime: 7000,
    })
  },
  success: (message: string) => {
    Toast.show({ type: 'success', text1: message, visibilityTime: 7000 })
  },
  saved: () => {
    Toast.show({ type: 'success', text1: i18nInstance.t('Common.saved'), visibilityTime: 7000 })
  },
}
