import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Appbar, List, ProgressBar } from 'react-native-paper'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation } from '@react-navigation/native'
import isEqual from 'lodash/isEqual'
import { z, ZodEffects, ZodObject } from 'zod'

import { MutationApiResponse } from '@mazic/shared'

import { TNavigationRoot } from '@/types/navigation'

interface FormContainerProps {
  children: React.ReactNode
  title?: string
  schema?: ZodObject<any> | ZodEffects<any>
  initialValues: any
  onSubmitForm: (values: any) => Promise<MutationApiResponse>
  isGoBack?: boolean
}

export const FormContainer = (props: FormContainerProps) => {
  const navigation = useNavigation<TNavigationRoot>()
  const {
    children,
    schema = z.object({}),
    initialValues,
    onSubmitForm,
    title,
    isGoBack = true,
  } = props
  const [formValues, setFormValues] = useState(initialValues)

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: initialValues,
  })
  const values = methods.watch()

  const onSave = () => {
    methods
      .handleSubmit(onSubmitForm)()
      .then(() => {
        setFormValues(values)
      })
  }

  const isFormDirty = !isEqual(formValues, values)

  return (
    <FormProvider {...methods}>
      <Appbar.Header elevated>
        {isGoBack && <Appbar.BackAction onPress={() => navigation.goBack()} />}
        <Appbar.Content title={title || ''} titleStyle={{ fontSize: 17 }} />
        <Appbar.Action icon="check" disabled={!isFormDirty} onPress={onSave} />
      </Appbar.Header>
      <ProgressBar indeterminate visible={methods.formState.isSubmitting} />
      <List.Section>{children}</List.Section>
    </FormProvider>
  )
}
