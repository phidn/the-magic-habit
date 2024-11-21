import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { List } from 'react-native-paper'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, ZodEffects, ZodObject } from 'zod'

interface FormContainerProps {
  children: React.ReactNode
  schema?: ZodObject<any> | ZodEffects<any>
  initialValues: any
}

export const FormContainer = (props: FormContainerProps) => {
  const { children, schema = z.object({}), initialValues } = props
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: initialValues,
  })

  return (
    <FormProvider {...methods}>
      <List.Section>{children}</List.Section>
    </FormProvider>
  )
}
