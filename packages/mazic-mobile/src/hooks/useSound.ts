import { useEffect, useState } from 'react'
import Sound from 'react-native-sound'

import { getAsset } from '@/utils/utils'

type PlaybackInstanceType = Sound | null

const useSound = () => {
  const [playbackInstance, setPlaybackInstance] = useState<PlaybackInstanceType>(null)

  useEffect(() => {
    Sound.setCategory('Playback')
  }, [])

  const playAsync = (
    soundFile: string,
    volume: number = 1,
    interrupt: boolean = false,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Release playback instance if it exists
      if (interrupt && playbackInstance) {
        release()
      }

      const whoosh = new Sound(soundFile, (error) => {
        if (error) {
          console.log('Failed to load the sound', error)
          reject(error)
          return
        }

        console.log('Loaded, duration in seconds', whoosh.getDuration())
        whoosh.setVolume(volume)
        setPlaybackInstance(whoosh)

        whoosh.play((success) => {
          if (success) {
            console.log('Finished playing')
          } else {
            console.log('Playback failed due to audio decoding errors')
          }
          if (interrupt) {
            release()
          }
          resolve()
        })
      })
    })
  }

  const play = async (
    soundFile: string,
    volume: number = 1,
    numberOfLoops: number = 1,
  ): Promise<void> => {
    for (let i = 0; i < numberOfLoops; i++) {
      await playAsync(soundFile, volume, numberOfLoops === i + 1)
    }
  }

  const playLongBell = async (bellId: string, bellVolume: number): Promise<void> => {
    await play(getAsset(`${bellId}_long`), bellVolume)
  }

  const playShortBell = async (
    bellId: string,
    bellVolume: number,
    number: number = 1,
  ): Promise<void> => {
    await play(getAsset(`${bellId}_short`), bellVolume, number)
  }

  const release = (): void => {
    if (playbackInstance) {
      playbackInstance.release()
      setPlaybackInstance(null)
    }
    console.log('>>> Released playback')
  }

  return { play, playLongBell, playShortBell, release }
}

export default useSound
