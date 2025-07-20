import { InfoIcon } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@mazic/ui'

interface FormItemProps {
  label: string
  tooltip?: string
  col?: number
  required?: boolean
  hidden?: boolean
  children: React.ReactElement<{
    field: string
    disabled?: boolean
  }>
}

export const FormItem = ({
  label,
  tooltip,
  col = 4,
  required = false,
  hidden = false,
  children,
}: FormItemProps) => {
  if (hidden) return null

  return (
    <TooltipProvider delayDuration={0}>
      <div className={`mazic-col-${col}`}>
        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1">
          {label}
          {required && <span className="text-destructive">{' *'}</span>}
          {tooltip && (
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="w-3 h-3 ml-1" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {children}
      </div>
    </TooltipProvider>
  )
}
