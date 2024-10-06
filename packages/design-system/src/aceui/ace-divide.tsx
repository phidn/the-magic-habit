import { cn } from '@/utils/cn'

interface DivideProps {
  className?: string
}

export const AceDivide = ({ className = 'my-4' }: DivideProps) => {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent h-[1px] w-full',
        className
      )}
    />
  )
}
