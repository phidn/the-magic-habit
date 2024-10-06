import { IconProps } from '../types'

export const ToDoIcon = (props: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <rect width={6} height={6} x={3} y={5} rx={1} />
        <path d="m3 17l2 2l4-4m4-9h8m-8 6h8m-8 6h8" />
      </g>
    </svg>
  )
}
