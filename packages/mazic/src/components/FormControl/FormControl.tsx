import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, ZodEffects, ZodObject } from 'zod'

import { MutationApiResponse } from '@mazic/shared'
import { usePageDetails } from '@mazic/hooks'
import { useUploadFile } from '@mazic/hooks/useUploadFile'
import { IFormSection } from '@mazic/types/form'
import { isValidSection } from '@mazic/utils/form'

import { FormHeader } from './FormHeader'
import { FormOutline } from './FormOutline'
import { FormSections } from './FormSections'

export interface FormControlProps {
  formTitle?: string | React.ReactNode
  formOutlineTitle?: string
  formSections: IFormSection[]
  schema?: ZodObject<any> | ZodEffects<any>
  initialValues: any
  onSubmitForm: (values: any) => Promise<MutationApiResponse>
  isReset?: boolean
  navigateTo?: string

  isPendingSubmit?: boolean
  refreshData?: () => void
  isHasFile?: boolean
}

export const FormControl = (props: FormControlProps) => {
  const {
    schema = z.object({}),
    initialValues,
    formSections,
    formTitle,
    formOutlineTitle,
    onSubmitForm,
    isPendingSubmit = false,
    refreshData,
    isReset,
    isHasFile,
    navigateTo = '',
  } = props
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const pageDetails = usePageDetails()

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: initialValues,
  })

  // console.log('>>> FormControl errors:', methods.formState.errors)
  // console.log('>>> FormControl values:', methods.watch())

  const _formSections = formSections.map((section, idx) => {
    const validFunc = section.validFunc || isValidSection
    return {
      ...section,
      id: section.id || `section-${idx}`,
      enabled: typeof section.enabled === 'undefined' ? true : section.enabled,
      isValid: validFunc(methods.watch(), schema, section.fields),
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

      const result = await onSubmitForm(values)
      if (pageDetails.isEditView && typeof refreshData === 'function') {
        refreshData()
      }
      if (pageDetails.isAddView) {
        if (navigateTo) {
          return navigate(navigateTo)
        }
        if (isReset) {
          return methods.reset(initialValues)
        }
        const _id = result?.data?.data?.id
        if (typeof _id === 'string' && _id) {
          navigate(pathname.replace('/new', `/edit/${_id}`), { replace: true })
        }
      }
    } catch (error) {
      // console.log('~ onSubmit error:', error)
    }
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <FormHeader
          pageDetails={pageDetails}
          title={formTitle}
          isPending={isPendingSubmit}
          initialValues={initialValues}
          isValidForm={isValidForm}
        />
        <div className="mazic-row">
          <div className="mazic-col-9">
            <FormSections sections={_formSections} />
          </div>
          <div className="mazic-col-3">
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
