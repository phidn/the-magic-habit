import { Trophy } from 'lucide-react'

interface MedalIconProps {
  position: number
}

export function MedalIcon({ position }: MedalIconProps) {
  if (position > 3) return null

  const colors = {
    1: 'text-yellow-400',
    2: 'text-slate-400',
    3: 'text-amber-700',
  }

  return <Trophy className={`w-4 h-4 ${colors[position as keyof typeof colors]} animate-pulse`} />
}
