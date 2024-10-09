import { IconProps } from '../types'

export const EditUserIcon = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.2em"
      height="1.2em"
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="hsl(var(--primary))"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.05"
      >
        <path d="M11.5 15H7a4 4 0 0 0-4 4v2m18.378-4.374a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
        <circle cx={10} cy={7} r={4} />
      </g>
    </svg>
  )
}
