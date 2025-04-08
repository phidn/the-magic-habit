import { useFormContext } from 'react-hook-form'

import { cn, FormMessage, MinimalTiptapEditor, TooltipProvider } from '@mazic/ui'

interface FormEditorProps {
  field: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  className?: string
  disabled?: boolean
  afterChange?: (value: any) => void
  editorKey?: number
}

const FormEditor = ({ field, afterChange, editorKey }: FormEditorProps) => {
  const methods = useFormContext()
  const { error } = methods.getFieldState(field, methods.formState)

  const value = methods.watch(field)

  return (
    <>
      <TooltipProvider>
        <MinimalTiptapEditor
          key={editorKey}
          autofocus
          editable
          throttleDelay={0}
          className={cn('h-full min-h-56 w-full rounded-xl', {
            'border-destructive focus-within:border-destructive': error,
          })}
          editorContentClassName="overflow-auto h-full flex grow"
          output="html"
          editorClassName="focus:outline-none px-5 py-4 h-full grow"
          value={value}
          onChange={(value) => {
            methods.setValue(field, value)
            afterChange?.(value)
          }}
        />
      </TooltipProvider>
      {error && <FormMessage>{error?.message}</FormMessage>}
    </>
  )
}

FormEditor.displayName = 'FormEditor'

export { FormEditor }
