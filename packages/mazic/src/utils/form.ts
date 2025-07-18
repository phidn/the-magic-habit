import React from 'react'
import { z } from 'zod'

import { getShapeBySchema } from '@mazic/shared'

export const getRequiredFields = (schema: z.ZodObject<any>) => {
  const shape = schema.shape
  const requiredFields: string[] = []

  for (const key in shape) {
    if (!shape[key].isOptional()) {
      requiredFields.push(key)
    }
  }

  return requiredFields
}

export const isValidSection = (
  values: any,
  schema: z.ZodObject<any> | z.ZodEffects<any>,
  fields?: string[]
) => {
  if (fields?.length) {
    const shape = getShapeBySchema(schema) as Record<string, z.ZodTypeAny>
    for (const key of fields) {
      const field = shape[key]
      if (field?.isOptional?.() || field?.isNullable?.()) {
        continue
      }
      if (values[key] === undefined || values[key] === null || values[key] === '') {
        return false
      }
    }
  }

  return true
}

type TBaseOption = {
  value: any
  label: string
}

export const dataToOptions = <
  T,
  VK extends keyof T,
  LK extends keyof T,
  RK extends keyof T = never,
>({
  data,
  valueKey = 'id' as VK,
  labelKey = 'name' as LK,
  restKeys = [] as RK[],
}: {
  data: T[]
  valueKey?: VK
  labelKey?: LK
  restKeys?: RK[]
}): (TBaseOption & Pick<T, RK>)[] => {
  return (data || []).map((item) => {
    const option: TBaseOption = {
      label: String(item[labelKey]),
      value: item[valueKey],
    }

    const rest: Pick<T, RK> = restKeys.reduce(
      (acc, key) => {
        acc[key] = item[key]
        return acc
      },
      {} as Pick<T, RK>
    )

    return { ...option, ...rest }
  })
}

export const optionSelected = <T extends { value: any }>(
  options: T[],
  value: any
): T | undefined => {
  return options.find((option) => option?.value === value)
}

export const extractFields = (jsxRender: (props?: any) => JSX.Element): string[] => {
  const jsxELement = jsxRender()
  const fieldNames: string[] = []
  const traverse = (nodes: React.ReactNode) => {
    React.Children.forEach(nodes, (child) => {
      if (React.isValidElement(child)) {
        if (child.props.field) {
          fieldNames.push(child.props.field)
        }
        if (child.props.children) {
          traverse(child.props.children)
        }
      }
    })
  }
  traverse(jsxELement)
  return fieldNames
}
