declare module '*.svg' {
  import React from 'react'
  import { SvgProps } from 'react-native-svg'
  const content: React.FC<SvgProps>
  export default content
}

declare module '@env' {
  export const API_URL: string
  export const DOMAIN: string
  export const OTA_UPDATE: string
  export const OTA_VERSION: string
}
