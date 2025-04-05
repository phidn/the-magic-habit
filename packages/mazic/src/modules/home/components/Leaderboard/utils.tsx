import { MagicWandIcon } from '@radix-ui/react-icons'

import quotes from './quotes.json'

export interface UserData {
  user_id: string
  full_name: string
  email: string
  avatar: string
  bio: string
  habit_count: number
  checkin_count: number
  rank: number
  score: number
}

export interface Player {
  position: number
  previousPosition: number
  username: string
  avatar: string
  bio: React.ReactNode
  score: number
  habits: number
  first: number
  second: number
  third: number
  totalRaces: number
  winRate: number
  sector1: number
  sector2: number
  sector3: number
  isLive?: boolean
}

// Helper function to transform API data to Player format
export const transformUserDataToPlayer = (userData: UserData[], index: number): Player => {
  const user = userData[index]
  const totalScore = user.score || 1
  const sectorBase = 75

  return {
    position: index + 1,
    previousPosition: index + 1,
    username: user.full_name,
    avatar: user.avatar,
    bio: user.bio || (
      <span className="flex items-center gap-2">
        <MagicWandIcon className="w-4 h-4" />
        {quotes[Math.floor(Math.random() * quotes.length)].quote}
      </span>
    ),
    score: user.score,
    habits: user.habit_count,
    first: user.habit_count || 0,
    second: index === 1 ? 1 : 0,
    third: index === 2 ? 1 : 0,
    totalRaces: user.checkin_count,
    winRate: user.habit_count > 0 ? Math.round((user.checkin_count / user.habit_count) * 100) : 0,
    sector1: sectorBase + (Math.min(totalScore, 30) / 30) * 25,
    sector2: sectorBase + (Math.min(user.habit_count * 10, 40) / 40) * 25,
    sector3: sectorBase + (Math.min(user.checkin_count, 50) / 50) * 25,
    isLive: index === 0,
  }
}
