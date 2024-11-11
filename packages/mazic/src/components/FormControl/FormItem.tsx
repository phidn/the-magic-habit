import { cloneElement } from 'react'

import { usePageDetails } from '@mazic/hooks/usePageDetails'

interface FormItemProps {
  label: string
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
  col = 4,
  required = false,
  hidden = false,
  children,
}: FormItemProps) => {
  if (hidden) return null

  return (
    <div className={`mazic-col-${col}`}>
      <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1">
        {label}
        {required && <span className="text-destructive">{' *'}</span>}
      </div>
      {children}
    </div>
  )
}

export const FormItemEditable = ({ children, ...restProps }: FormItemProps) => {
  const { isView } = usePageDetails()
  const childrenEditable = cloneElement(children, { disabled: isView })
  return <FormItem {...restProps}>{childrenEditable}</FormItem>
}
