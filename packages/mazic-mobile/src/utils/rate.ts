/**
 * https://github.com/KjellConnelly/react-native-rate
 */
import { Linking, NativeModules, Platform } from 'react-native'

const AppleNativePrefix = 'itms-apps://itunes.apple.com/app/id'
const GooglePrefix = 'https://play.google.com/store/apps/details?id='
const AmazonPrefix = 'amzn://apps/android?p='

export enum AndroidMarket {
  Google = 1,
  Amazon = 2,
  Other = 3,
}

const noop = () => {}

interface RateOptions {
  AppleAppID?: string
  GooglePackageName?: string
  AmazonPackageName?: string
  OtherAndroidURL?: string
  preferredAndroidMarket?: AndroidMarket
  preferInApp?: boolean
  openAppStoreIfInAppFails?: boolean
  inAppDelay?: number
  fallbackPlatformURL?: string
  [key: string]: any
}

export default class Rate {
  static filterOptions(inputOptions: RateOptions): RateOptions {
    const options: RateOptions = {
      AppleAppID: '',
      GooglePackageName: '',
      AmazonPackageName: '',
      OtherAndroidURL: '',
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: false,
      openAppStoreIfInAppFails: true,
      inAppDelay: 3.0,
      fallbackPlatformURL: '',
    }
    Object.keys(inputOptions).forEach((key) => {
      options[key] = inputOptions[key]
    })
    return options
  }

  static rate(
    inputOptions: RateOptions,
    callback: (response: boolean, error?: string) => void = noop,
  ) {
    const { RNRate } = NativeModules
    const options = Rate.filterOptions(inputOptions)

    if (Platform.OS === 'ios') {
      options.AppleNativePrefix = AppleNativePrefix
      RNRate.rate(options, (response: boolean, error?: string) => {
        callback(response, error)
      })
    } else if (Platform.OS === 'android') {
      if (options.preferredAndroidMarket === AndroidMarket.Google) {
        if (options.preferInApp) {
          RNRate.rate(options, (response: boolean, error?: string) => {
            if (!response) {
              if (options.openAppStoreIfInAppFails) {
                Rate.openURL(GooglePrefix + options.GooglePackageName, callback)
              } else {
                callback(false, error)
              }
            } else {
              callback(response, error)
            }
          })
        } else {
          Rate.openURL(GooglePrefix + options.GooglePackageName, callback)
        }
      } else if (options.preferredAndroidMarket === AndroidMarket.Amazon) {
        Rate.openURL(AmazonPrefix + options.AmazonPackageName, callback)
      } else if (options.preferredAndroidMarket === AndroidMarket.Other) {
        if (options.OtherAndroidURL) {
          Rate.openURL(options.OtherAndroidURL, callback)
        } else {
          callback(false, 'OtherAndroidURL is not defined')
        }
      }
    } else {
      if (options.fallbackPlatformURL) {
        Rate.openURL(options.fallbackPlatformURL, callback)
      } else {
        callback(false, 'fallbackPlatformURL is not defined')
      }
    }
  }

  static openURL(url: string, callback: (supported: boolean) => void = noop) {
    Linking.canOpenURL(url).then((supported) => {
      callback(supported)
      if (supported) {
        Linking.openURL(url)
      }
    })
  }
}
