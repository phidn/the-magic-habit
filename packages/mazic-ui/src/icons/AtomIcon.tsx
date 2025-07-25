import { IconProps } from '../types'

export const AtomIcon = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18px"
      height="18px"
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="hsl(var(--primary))"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.7}
      >
        <circle cx={12} cy={12} r={1} stroke="var(--green-500)" />
        <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9c-4.54-4.52-9.87-6.54-11.9-4.5c-2.04 2.03-.02 7.36 4.5 11.9c4.54 4.52 9.87 6.54 11.9 4.5" />
        <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9c-2.03-2.04-7.36-.02-11.9 4.5c-4.52 4.54-6.54 9.87-4.5 11.9c2.03 2.04 7.36.02 11.9-4.5" />
      </g>
    </svg>
  )
}
