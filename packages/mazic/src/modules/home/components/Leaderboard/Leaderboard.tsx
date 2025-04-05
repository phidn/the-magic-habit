import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Timer, Trophy } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@mazic/ui'

import { cn } from '@ui/utils'

import { useGetLeaderboard } from '../../apis'

import { Player, transformUserDataToPlayer } from './utils'

function MedalIcon({ position }: { position: number }) {
  if (position > 3) return null

  const colors = {
    1: 'text-yellow-400',
    2: 'text-slate-400',
    3: 'text-amber-700',
  }

  return <Trophy className={`w-4 h-4 ${colors[position as keyof typeof colors]} animate-pulse`} />
}

function PerformanceIndicator({
  previousPosition,
  currentPosition,
}: {
  previousPosition: number
  currentPosition: number
}) {
  if (previousPosition === currentPosition) return null

  const isImproved = currentPosition < previousPosition

  return (
    <div
      className={`flex items-center gap-1 text-xs ${isImproved ? 'text-green-500' : 'text-red-500'}`}
    >
      {isImproved ? '▲' : '▼'}
      <span>{Math.abs(previousPosition - currentPosition)}</span>
    </div>
  )
}

function StatBadge({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center bg-gray-100 px-2 py-1 rounded">
      <span className="text-xs text-gray-600">{label}</span>
      <span className="text-sm font-bold text-gray-800">{value}</span>
    </div>
  )
}

export default function RaceLeaderboard() {
  const { data: leaderboardData } = useGetLeaderboard()
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (leaderboardData && leaderboardData.length > 0) {
      const sortedData = [...leaderboardData].sort((a, b) => b.score - a.score)
      const transformedPlayers = sortedData.map((_, index) =>
        transformUserDataToPlayer(sortedData, index)
      )
      setPlayers(transformedPlayers)
      if (transformedPlayers.length > 0 && !selectedPlayer) {
        setSelectedPlayer(transformedPlayers[0])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaderboardData])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive((prev) => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto pt-4" id="leaderboard">
      <div className="relative mb-4 flex items-center justify-between">
        <div className="absolute -skew-x-12 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold px-6 py-2 -left-2 shadow-lg">
          LEADERBOARD
        </div>
        <div className={cn('flex items-center gap-4 ml-auto opacity-0', isLive && 'opacity-1')}>
          <div className="flex items-center gap-2 bg-red-500/20 text-red-500 px-3 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gradient-to-b from-white to-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-gray-700 w-24 p-4 text-left">POS</th>
              <th className="text-gray-700 p-4 text-left">PLAYER</th>
              <th className="text-gray-700 p-4 text-right">SCORE</th>
              <th className="text-gray-700 p-4 text-center">PROGRESS</th>
              <th className="text-gray-700 p-4 text-center w-32">STATS</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {players.map((player) => (
                <motion.tr
                  key={player.position}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`group relative cursor-pointer
                    ${player.position === 6 ? 'bg-yellow-500/10' : ''}
                    ${selectedPlayer?.position === player.position ? 'bg-gray-100' : ''}
                    hover:bg-gray-100 transition-colors`}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <td className="relative p-4">
                    <div className="flex items-center gap-2">
                      <MedalIcon position={player.position} />
                      <span className="text-gray-800 font-bold">{player.position}</span>
                      <PerformanceIndicator
                        previousPosition={player.previousPosition}
                        currentPosition={player.position}
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                          <Avatar>
                            <AvatarImage src={player.avatar} alt={player.username} />
                            <AvatarFallback>{player.username.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                        </div>
                        {player.isLive && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-800 font-medium">{player.username}</span>
                        <span className="text-gray-500 text-xs">{player.bio}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-mono text-gray-800 font-bold whitespace-nowrap">
                      {player.score} pts
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 justify-center">
                      {[player.sector1, player.sector2, player.sector3].map((sector, i) => (
                        <div
                          key={i}
                          className="h-1.5 w-8 rounded-full"
                          style={{
                            background: `linear-gradient(90deg, rgb(${(255 * (100 - sector)) / 100}, ${(255 * sector) / 100}, 0) 0%, rgb(${(255 * (100 - sector)) / 100}, ${(255 * sector) / 100}, 0) ${sector}%, transparent ${sector}%)`,
                          }}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-4">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-800">{player.first}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-800">{player.winRate}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="w-4 h-4 text-green-500" />
                        <span className="text-gray-800">{player.totalRaces}</span>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {selectedPlayer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-white rounded-lg p-4 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={selectedPlayer.avatar} alt={selectedPlayer.username} />
                <AvatarFallback>{selectedPlayer.username.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedPlayer.username}</h3>
                <p className="text-gray-600">Performance Statistics</p>
              </div>
            </div>
            <div className="flex gap-4">
              <StatBadge label="Win Rate" value={`${selectedPlayer.winRate}%`} />
              <StatBadge label="Total Check-ins" value={selectedPlayer.totalRaces} />
              <StatBadge label="Habits" value={selectedPlayer.habits} />
              <StatBadge label="Score" value={`${selectedPlayer.score} pts`} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
