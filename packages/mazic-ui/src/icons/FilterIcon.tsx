import { IconProps } from '../types'

export const FilterIcon = (props: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M22 3H2l8 9.46V19l4 2v-8.54z"
      />
    </svg>
  )
}
