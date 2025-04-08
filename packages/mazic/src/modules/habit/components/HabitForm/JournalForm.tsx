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
      <FormItem label="Template" col={12}>
        <FormEditor field="template" editorKey={editorKey} />
      </FormItem>
      <div className="mazic-col-12 flex justify-end mt-6">
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
