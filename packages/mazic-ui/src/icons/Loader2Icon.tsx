import { IconProps } from '../types'

export const Loader2Icon = (props: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <rect width={24} height={24} fill="none" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 1 1-6.219-8.56"
      />
    </svg>
  )
}
