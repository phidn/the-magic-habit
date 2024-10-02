import { FieldValues, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

export type TZodAny = {
  [key: string]: z.ZodTypeAny
}

export interface IOption {
  label?: string
  renderLabel?: () => JSX.Element
  value: any
  code?: string
  icon?: React.ComponentType<{ className?: string }>
  enableCount?: boolean
  disabled?: boolean
  [key: string]: any
}

export type TMethods = UseFormReturn<FieldValues, any, undefined>
export interface IMethodsProps {
  methods: TMethods
}

export interface IFormSection {
  id?: string
  title?: string
  elementRender: () => JSX.Element
  fields?: string[]
  isValid?: boolean
  enabled?: boolean
}
