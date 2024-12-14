import LogoImage from '../assets/logo.png'

interface MazicIconProps {
  className?: string
}

export const MazicIcon = ({ className }: MazicIconProps) => {
  return <img src={LogoImage} alt="Magic Habit Logo" className={className} />
}
