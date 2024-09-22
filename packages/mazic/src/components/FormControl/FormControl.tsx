import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, ZodObject } from 'zod'

import { usePageDetails } from '@mazic/hooks'
import { useUploadFile } from '@mazic/hooks/useUploadFile'
import { MutationApiResponse } from '@mazic/types'
import { isValidSectionV2 } from '@mazic/utils/form'

import { FormHeader, TFormHeaderTitle } from './FormHeader'
import { FormOutline } from './FormOutline'
import { FormSections } from './FormSections'

export interface FormControlProps {
  formTitle?: string
  formOutlineTitle?: string
  formSections: {
    id?: string
    title: string
    elementRender: () => JSX.Element
    fields?: string[]
    isValid?: boolean
    enabled?: boolean
  }[]
  schema?: ZodObject<any>
  initialValues: any
  onSubmitForm: (values: any) => MutationApiResponse | Promise<MutationApiResponse>
  isCreatedAndReset?: boolean

  isPendingSubmit?: boolean
  refreshData?: () => void
  isHasFile?: boolean
}

export const FormControl: React.FC<FormControlProps> = (props) => {
  const {
    schema = z.object({}),
    initialValues,
    formSections,
    formTitle,
    formOutlineTitle,
    onSubmitForm,
    isPendingSubmit = false,
    refreshData,
    isCreatedAndReset,
    isHasFile,
  } = props
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const pageDetails = usePageDetails()

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: initialValues,
  })

  console.log('>> Form values', methods.watch())
  // console.log('>> Form errors', methods.formState.errors)

  const _formSections = formSections.map((section, idx) => {
    return {
      ...section,
      id: section.id || `section-${idx}`,
      enabled: typeof section.enabled === 'undefined' ? true : section.enabled,
      isValid: isValidSectionV2(methods.watch(), schema, section.fields),
    }
  })

  const isValidForm = _formSections.every((section) => section.isValid)

  const uploadFile = useUploadFile()

  const onSubmit = methods.handleSubmit(async () => {
    try {
      const values = methods.getValues() as any
      if (isHasFile) {
        for (const key in values) {
          const _value = values[key]
          if (_value instanceof File) {
            const { data } = await uploadFile.mutateAsync(_value)
            if (data) {
              methods.setValue(key, data.data)
              values[key] = data.data
            }
          }
        }
      }

      const { data } = await onSubmitForm(values)
      if (pageDetails.isEditView && typeof refreshData === 'function') {
        refreshData()
      }
      if (pageDetails.isAddView) {
        if (isCreatedAndReset) {
          return methods.reset(initialValues)
        }
        if (typeof data?.data === 'string' && data?.data) {
          navigate(pathname.replace('/new', `/edit/${data.data}`), { replace: true })
        }
      }
    } catch (error) {
      console.log('~ onSubmit error:', error)
    }
  })

  const _defaultTitle: TFormHeaderTitle = {
    text: initialValues?.status,
    variant: initialValues?.status === 'enabled' ? 'default' : 'destructive',
    hidden: pageDetails.isAddView || typeof initialValues?.status !== 'string',
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <FormHeader
          pageDetails={pageDetails}
          title={formTitle}
          titleBadge={_defaultTitle}
          isPending={isPendingSubmit}
          initialValues={initialValues}
          isValidForm={isValidForm}
        />
        <div className="mazic_row">
          <div className="mazic_col_9">
            <FormSections sections={_formSections} />
          </div>
          <div className="mazic_col_3">
            <FormOutline
              formSections={_formSections}
              formTitle={formOutlineTitle ? `${formOutlineTitle} Information` : 'Information'}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
