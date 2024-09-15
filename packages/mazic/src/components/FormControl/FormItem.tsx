import { cloneElement } from 'react'

import { Label } from '@mazic-design-system'

import { usePageDetails } from '@mazic/hooks/usePageDetails'

interface FormItemProps {
  label: string
  col?: number
  required?: boolean
  children: React.ReactElement<{
    field: string
    disabled?: boolean
  }>
}

export const FormItem = ({ label, col = 4, required = false, children }: FormItemProps) => {
  const { field } = children.props
  return (
    <div className={`mazic_col_${col}`}>
      <Label htmlFor={field}>
        {label}
        {required && <span className="text-destructive">{' *'}</span>}
      </Label>
      {children}
    </div>
  )
}

export const FormItemEditable = ({ children, ...restProps }: FormItemProps) => {
  const { isView } = usePageDetails()
  const childrenEditable = cloneElement(children, { disabled: isView })
  return <FormItem {...restProps}>{childrenEditable}</FormItem>
}
