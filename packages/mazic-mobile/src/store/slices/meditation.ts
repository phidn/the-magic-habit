import produce from 'immer'

import { ImmerStateCreator } from '@/types/types'

// Prepare Slice
interface Prepare {
  duration: number
  interval: number
  bellId: string
  bellVolume: number
}

export interface PrepareSlice {
  prepare: Prepare
  setPrepare: (payload: Partial<Prepare>) => void
}

interface SessionLogs {
  logs: string[]
}

interface Sessions {
  [date: string]: SessionLogs
}

// Meditation Slice
export interface MeditationSlice {
  isShowCountdown: boolean
  setIsShowCountdown: (isShowCountdown: boolean) => void
}

export interface SessionSlice {
  sessions: Sessions
  setSessions: (sessions: Sessions) => void
  setSessionLogs: (date: string, duration: number, started: string, ended: string) => void
  clearSession: () => void
}

export const prepareSlice: ImmerStateCreator<PrepareSlice> = (set) => ({
  prepare: {
    duration: 60 * 30, // 30 minutes
    interval: 60 * 5, // 5 minutes
    bellId: 'Bell_1',
    bellVolume: 0.5,
  },
  setPrepare: (payload) => {
    set((state) => {
      state.prepare = { ...state.prepare, ...payload }
    })
  },
})

export const meditationSlice: ImmerStateCreator<MeditationSlice> = (set) => ({
  isShowCountdown: true,
  setIsShowCountdown: (isShowCountdown) => set({ isShowCountdown }),
})

export const sessionSlice: ImmerStateCreator<SessionSlice> = (set) => ({
  sessions: {},
  setSessions: (sessions) => set({ sessions }),
  setSessionLogs: (date, duration, started, ended) =>
    set(
      produce((state) => {
        if (!state.sessions[date]?.logs) {
          state.sessions[date] = { logs: [] }
        }
        state.sessions[date].logs.push([duration, started, ended].join('|'))
      }),
    ),
  clearSession: () => set({ sessions: {} }),
})
