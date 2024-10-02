import { IconProps } from '../types'

export const DashboardIcon = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18px"
      height="18px"
      viewBox="0 0 50 50"
      {...props}
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4}>
        <path stroke="var(--green-500)" d="M31.25 18.75v22.917m-25-22.917h37.5z" />
        <path
          stroke="hsl(var(--primary))"
          d="M41.667 6.25H8.333c-1.15 0-2.083.933-2.083 2.083v33.334c0 1.15.933 2.083 2.083 2.083h33.334c1.15 0 2.083-.933 2.083-2.083V8.333c0-1.15-.933-2.083-2.083-2.083"
        />
      </g>
    </svg>
  )
}
