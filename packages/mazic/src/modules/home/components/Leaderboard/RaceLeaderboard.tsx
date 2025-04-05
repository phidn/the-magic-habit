import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Timer, Trophy } from 'lucide-react'

import { cn } from '@ui/utils'

import { useGetLeaderboard } from '../../apis'

interface Player {
  position: number
  previousPosition: number
  username: string
  avatar: string
  time: string
  bestLap: string
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

const players: Player[] = [
  {
    position: 1,
    previousPosition: 1,
    username: 'Username 1',
    avatar: '/placeholder.svg?height=32&width=32',
    time: '0:55.510',
    bestLap: '0:54.321',
    first: 1,
    second: 1,
    third: 1,
    totalRaces: 156,
    winRate: 42,
    sector1: 100,
    sector2: 98,
    sector3: 99,
    isLive: true,
  },
  {
    position: 2,
    previousPosition: 2,
    username: 'Username 2',
    avatar: '/placeholder.svg?height=32&width=32',
    time: '1:15.430',
    bestLap: '1:14.321',
    first: 0,
    second: 0,
    third: 0,
    totalRaces: 120,
    winRate: 20,
    sector1: 95,
    sector2: 92,
    sector3: 90,
    isLive: false,
  },
  {
    position: 3,
    previousPosition: 3,
    username: 'Username 3',
    avatar: '/placeholder.svg?height=32&width=32',
    time: '1:21.430',
    bestLap: '1:20.123',
    first: 0,
    second: 0,
    third: 0,
    totalRaces: 80,
    winRate: 10,
    sector1: 90,
    sector2: 88,
    sector3: 92,
    isLive: false,
  },
  {
    position: 4,
    previousPosition: 4,
    username: 'Username 4',
    avatar: '/placeholder.svg?height=32&width=32',
    time: '1:32.213',
    bestLap: '1:31.001',
    first: 0,
    second: 0,
    third: 1,
    totalRaces: 50,
    winRate: 5,
    sector1: 85,
    sector2: 80,
    sector3: 88,
    isLive: false,
  },
  {
    position: 5,
    previousPosition: 5,
    username: 'Username 5',
    avatar: '/placeholder.svg?height=32&width=32',
    time: '1:44.594',
    bestLap: '1:43.987',
    first: 0,
    second: 0,
    third: 0,
    totalRaces: 30,
    winRate: 3,
    sector1: 80,
    sector2: 78,
    sector3: 85,
    isLive: false,
  },
  {
    position: 6,
    previousPosition: 6,
    username: 'Username 6',
    avatar: '/placeholder.svg?height=32&width=32',
    time: '1:45.013',
    bestLap: '1:44.555',
    first: 0,
    second: 0,
    third: 0,
    totalRaces: 20,
    winRate: 2,
    sector1: 75,
    sector2: 70,
    sector3: 80,
    isLive: false,
  },
  {
    position: 7,
    previousPosition: 7,
    username: 'Username 7',
    avatar: '/placeholder.svg?height=32&width=32',
    time: '1:48.916',
    bestLap: '1:47.888',
    first: 0,
    second: 0,
    third: 0,
    totalRaces: 10,
    winRate: 1,
    sector1: 70,
    sector2: 68,
    sector3: 75,
    isLive: false,
  },
  {
    position: 8,
    previousPosition: 8,
    username: 'Username 8',
    avatar: '/placeholder.svg?height=32&width=32',
    time: '1:56.355',
    bestLap: '1:55.222',
    first: 0,
    second: 0,
    third: 0,
    totalRaces: 5,
    winRate: 0,
    sector1: 65,
    sector2: 60,
    sector3: 70,
    isLive: false,
  },
  {
    position: 9,
    previousPosition: 9,
    username: 'Username 9',
    avatar: '/placeholder.svg?height=32&width=32',
    time: '2:05.515',
    bestLap: '2:04.111',
    first: 0,
    second: 0,
    third: 0,
    totalRaces: 2,
    winRate: 0,
    sector1: 60,
    sector2: 58,
    sector3: 65,
    isLive: false,
  },
  {
    position: 10,
    previousPosition: 10,
    username: 'Username 10',
    avatar: '/placeholder.svg?height=32&width=32',
    time: '2:08.375',
    bestLap: '2:07.000',
    first: 0,
    second: 0,
    third: 0,
    totalRaces: 1,
    winRate: 0,
    sector1: 55,
    sector2: 50,
    sector3: 60,
    isLive: false,
  },
]

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
  const { data } = useGetLeaderboard()
  console.log('~ data:', data)

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive((prev) => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto mt-8">
      <div className="relative mb-4 flex items-center justify-between">
        <div className="absolute -skew-x-12 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold px-6 py-2 -left-2 shadow-lg">
          RACE RESULTS
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
              <th className="text-gray-700 p-4 text-right">TIME</th>
              <th className="text-gray-700 p-4 text-center">SECTORS</th>
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
                          <img
                            src={player.avatar || '/placeholder.svg'}
                            alt={player.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {player.isLive && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-800 font-medium">{player.username}</span>
                        <span className="text-gray-500 text-xs">Best: {player.bestLap}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-mono text-gray-800 font-bold">{player.time}</span>
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
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src={selectedPlayer.avatar || '/placeholder.svg'}
                  alt={selectedPlayer.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedPlayer.username}</h3>
                <p className="text-gray-600">Race Statistics</p>
              </div>
            </div>
            <div className="flex gap-4">
              <StatBadge label="Win Rate" value={`${selectedPlayer.winRate}%`} />
              <StatBadge label="Total Races" value={selectedPlayer.totalRaces} />
              <StatBadge label="Best Lap" value={selectedPlayer.bestLap} />
              <StatBadge label="Current" value={selectedPlayer.time} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
