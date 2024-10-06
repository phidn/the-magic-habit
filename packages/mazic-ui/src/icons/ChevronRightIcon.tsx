import { IconProps } from '../types'

export const ChevronRightIcon = (props: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <rect width={24} height={24} fill="none" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m9 18l6-6l-6-6"
      />
    </svg>
  )
}
