import { Fragment, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormMessage } from '@mazic/ui'

import { ImageUpload } from '../ImageUpload'

interface FormImageProps extends React.InputHTMLAttributes<HTMLInputElement> {
  field: string
  type?: React.HTMLInputTypeAttribute
  validation?: any
  placeholder?: string
  className?: string
  disabled?: boolean
  afterChange?: (value: any) => void
}

const FormImage = ({ field, validation }: FormImageProps) => {
  const methods = useFormContext()
  const { error } = methods.getFieldState(field, methods.formState)
  useEffect(() => {
    methods.register(field, validation)
  }, [methods, field, validation])

  const onUpload = (
    file: File,
    onProgress: (progress: number) => void,
    onComplete: (imageUrl: string) => void
  ): Promise<string> => {
    return new Promise((resolve) => {
      const fakeUploadTime = 1000
      let progress = 0

      const interval = setInterval(() => {
        progress += 10
        onProgress(progress)

        if (progress >= 100) {
          clearInterval(interval)
          onProgress(100)
          methods.clearErrors(field)
          methods.setValue(field, file)
          const imageUrl = URL.createObjectURL(file)
          onComplete(imageUrl)
          resolve(imageUrl)
        }
      }, fakeUploadTime / 10)
    })
  }

  const onRemove = () => {
    methods.setValue(field, null)
    methods.clearErrors(field)
  }

  return (
    <Fragment>
      <ImageUpload
        id={`upload_${field}`}
        onUpload={onUpload}
        onRemove={onRemove}
        imageUrl={methods.watch(field) || ''}
      />
      {error && <FormMessage>{error?.message}</FormMessage>}
    </Fragment>
  )
}

FormImage.displayName = 'FormImage'

export { FormImage }
