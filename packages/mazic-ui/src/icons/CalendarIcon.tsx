import { IconProps } from '../types'

export const CalendarIcon = (props: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path d="M8 2v4m8-4v4" />
        <rect width={18} height={18} x={3} y={4} rx={2} />
        <path d="M3 10h18" />
      </g>
    </svg>
  )
}
