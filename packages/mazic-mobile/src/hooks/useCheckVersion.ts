import React from 'react'
import { Platform } from 'react-native'
import ReactNativeBlobUtil from 'react-native-blob-util'
import hotUpdate from 'react-native-ota-hot-update'
import { toast } from 'sonner-native'

import { CONFIG } from '@/config/config'

export const useCheckVersion = () => {
  const startUpdate = async (url: string, version: number, loadingToastId: number | string) => {
    hotUpdate.downloadBundleUri(ReactNativeBlobUtil, url, version, {
      updateSuccess: async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000))
        toast.dismiss(loadingToastId)
        toast.success('Update completed successfully! Restarting the app...')
      },
      updateFail: async (message?: string) => {
        await new Promise((resolve) => setTimeout(resolve, 3000))
        toast.dismiss(loadingToastId)
        console.log('Update failed:', message)
      },
      restartAfterInstall: true,
    })
  }
  const onCheckVersion = () => {
    fetch(`${CONFIG.otaUpdate}?t=${Date.now()}`).then(async (data) => {
      const result = await data.json()
      const currentVersion = await hotUpdate.getCurrentVersion()
      console.log('onCheckVersion', { result, currentVersion })
      if (result?.version > currentVersion) {
        const toastId = toast.loading('A new version is available. Downloading...', {
          position: 'top-center',
          duration: Infinity,
        })
        startUpdate(
          Platform.OS === 'ios' ? result?.downloadIosUrl : result?.downloadAndroidUrl,
          result.version,
          toastId,
        )
      }
    })
  }

  React.useEffect(() => {
    onCheckVersion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
