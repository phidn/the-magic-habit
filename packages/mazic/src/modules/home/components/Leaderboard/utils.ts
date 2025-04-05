export interface UserData {
  user_id: string
  full_name: string
  email: string
  avatar: string
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
    avatar: user.avatar || '/placeholder.svg?height=32&width=32',
    score: user.score,
    habits: user.habit_count,
    first: index === 0 ? 1 : 0,
    second: index === 1 ? 1 : 0,
    third: index === 2 ? 1 : 0,
    totalRaces: user.checkin_count,
    winRate: user.habit_count > 0 ? Math.round((user.checkin_count / user.habit_count) * 100) : 0,
    sector1: sectorBase + (Math.min(totalScore, 30) / 30) * 25, // Sectors are visualizations of progress
    sector2: sectorBase + (Math.min(user.habit_count * 10, 40) / 40) * 25,
    sector3: sectorBase + (Math.min(user.checkin_count, 50) / 50) * 25,
    isLive: index === 0, // Just mark top player as live
  }
}
