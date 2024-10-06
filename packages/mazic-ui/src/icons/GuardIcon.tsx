import { IconProps } from '../types'

export const GuardIcon = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18px"
      height="18px"
      viewBox="0 0 18 18"
      {...props}
    >
      <g fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="hsl(var(--primary))" d="m8 1l6.5 2l-1 9.5L8 15l-5.5-2.5l-1-9.5z" />
        <path stroke="var(--green-500)" d="m4.5 10.5l3.5-7l3.5 7m-5.796-2h4.635" />
      </g>
    </svg>
  )
}
