import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { Button } from '@mazic/ui'
import { FormEditor, FormItem } from '@mazic/components/FormControl'
import { usePageDetails } from '@mazic/hooks'

import { EQ_CHECK_IN_TEMPLATE } from '../../utils/utils'

export const JournalForm = () => {
  const methods = useFormContext()
  const { isEdit } = usePageDetails()
  const initId = methods.getValues('id')

  const [editorKey, setEditorKey] = useState(0)

  useEffect(() => {
    if (isEdit && initId && editorKey === 0) {
      setEditorKey(editorKey + 1)
    }
  }, [isEdit, initId, editorKey])

  return (
    <div className="mazic-row">
      <blockquote className="mb-4 border-l-2 pl-6 italic">
        This is a journal template that will appear when you check in. You can use it to guide your
        writing or reflection. If you don’t want to use it, just leave it empty.
      </blockquote>
      <FormItem label="Template" col={12} tooltip="Template">
        <FormEditor field="template" editorKey={editorKey} />
      </FormItem>
      <div className="mazic-col-12 flex justify-end mt-6 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            methods.setValue('template', EQ_CHECK_IN_TEMPLATE.lite)
            setEditorKey((prev) => prev + 1)
          }}
        >
          eq lite
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            methods.setValue('template', EQ_CHECK_IN_TEMPLATE.reflection)
            setEditorKey((prev) => prev + 1)
          }}
        >
          eq reflection
        </Button>
      </div>
    </div>
  )
}
