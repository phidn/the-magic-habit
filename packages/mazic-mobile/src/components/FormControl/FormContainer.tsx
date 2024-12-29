import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { StyleProp, ViewStyle } from 'react-native'
import { Appbar, List, ProgressBar, useTheme } from 'react-native-paper'
import { zodResolver } from '@hookform/resolvers/zod'
import isEqual from 'lodash/isEqual'
import { z, ZodEffects, ZodObject } from 'zod'

import { MutationApiResponse } from '@mazic/shared'

interface FormContainerProps {
  children: React.ReactNode
  title?: string
  schema?: ZodObject<any> | ZodEffects<any>
  initialValues: any
  style?: StyleProp<ViewStyle>
  elevated?: boolean
  isNoDirty?: boolean
  onSubmitForm: (values: any) => Promise<MutationApiResponse>
  onDeleteForm?: () => void
  onGoBack?: () => void
}

export const FormContainer = (props: FormContainerProps) => {
  const {
    children,
    schema = z.object({}),
    initialValues,
    onSubmitForm,
    onDeleteForm,
    title,
    onGoBack,
    style,
    elevated = true,
    isNoDirty = false,
  } = props
  const [formValues, setFormValues] = useState(initialValues)
  const { colors } = useTheme()

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

  const isFormDirty = !isEqual(formValues, values) || isNoDirty
  const saveDisabled = !isFormDirty

  return (
    <FormProvider {...methods}>
      <Appbar.Header elevated={elevated}>
        {onGoBack && <Appbar.BackAction onPress={() => onGoBack?.()} />}
        <Appbar.Content title={title || ''} titleStyle={{ fontSize: 17 }} />
        {onDeleteForm && <Appbar.Action icon="delete" onPress={onDeleteForm} />}
        <Appbar.Action
          icon="check"
          color={!saveDisabled ? colors.primary : undefined}
          disabled={saveDisabled}
          onPress={onSave}
        />
      </Appbar.Header>
      <ProgressBar indeterminate visible={methods.formState.isSubmitting} />
      <List.Section style={style}>{children}</List.Section>
    </FormProvider>
  )
}
