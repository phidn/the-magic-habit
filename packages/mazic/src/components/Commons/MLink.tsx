import { Link, LinkProps } from 'react-router-dom'

import { cn } from '@ui/utils'

export const MLink = (props: LinkProps) => {
  return (
    <Link
      {...props}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-transparent disabled:pointer-events-none disabled:opacity-50 text-primary underline-offset-4 hover:underline h-10 py-2 px-0',
        props.className
      )}
    >
      {props.children}
    </Link>
  )
}
