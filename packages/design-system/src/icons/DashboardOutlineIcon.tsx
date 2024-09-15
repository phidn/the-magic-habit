import { IconProps } from '../types'

export const DashboardOutlineIcon = (props: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <rect width={7} height={9} x={3} y={3} rx={1} />
        <rect width={7} height={5} x={14} y={3} rx={1} />
        <rect width={7} height={9} x={14} y={12} rx={1} />
        <rect width={7} height={5} x={3} y={16} rx={1} />
      </g>
    </svg>
  )
}
