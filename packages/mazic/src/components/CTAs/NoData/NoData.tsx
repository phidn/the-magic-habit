import { Button } from '@mazic/ui'

interface Props {
  title: string | React.ReactNode
  description: string | React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export const NoData = ({ title, description, action }: Props) => {
  return (
    <div className="container flex flex-col md:flex-row md:space-x-12 relative h-[calc(100vh_-_160px)]">
      <div className=" md:w-2/3 lg:shrink-0 xl:w-1/2 h-full flex flex-col items-start justify-center">
        <h3 className="mb-3 text-4xl font-semibold md:mb-4 md:text-5xl lg:mb-6">{title}</h3>
        <p className="mb-8 text-muted-foreground lg:text-lg">{description}</p>
        {action && <Button onClick={action.onClick}>{action.label}</Button>}
      </div>
      <div className="relative h-auto w-full max-w-md md:max-w-xl lg:max-w-full lg:mt-auto xl:max-w-full overflow-hidden">
        <div className="relative aspect-[8/5] size-full min-h-64">
          <div className="absolute right-0 top-0 z-40 flex aspect-[3/5] w-3/5 -translate-x-[24%] translate-y-[24%] -rotate-[30deg] justify-center text-clip rounded-3xl bg-background shadow-lg shadow-foreground/20 md:max-xl:-translate-x-[8%] md:max-xl:translate-y-[16%]" />
          <div className="absolute right-0 top-0 z-40 flex aspect-[3/5] w-3/5 -translate-x-[16%] translate-y-[8%] -rotate-[15deg] justify-center text-clip rounded-3xl bg-background shadow-xl shadow-foreground/20 md:max-xl:-translate-x-[6%] md:max-xl:translate-y-[6%]" />
          <div className="absolute right-0 top-0 z-40 flex aspect-[3/5] w-3/5 items-center justify-center text-clip rounded-3xl bg-background shadow-2xl shadow-foreground/20 overflow-x-hidden" />
        </div>
      </div>
    </div>
  )
}
