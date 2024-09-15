import { useFormContext } from 'react-hook-form'

import { FormInput, FormItem, FormSelect } from '@mazic/components/FormControl'
import { useApis } from '@mazic/hooks/useApis'
import { dataToOptions, optionSelected } from '@mazic/utils/form'

export const DetailForm = () => {
  const methods = useFormContext()

  const { data: actionData } = useApis.action.list({ page: 1, pageSize: -1 })
  const { data: resourceData } = useApis.resource.list({ page: 1, pageSize: -1 })
  const actionOptions = dataToOptions({
    data: actionData || [],
    valueKey: 'id',
    labelKey: 'name',
    restKeys: ['code'],
  })
  const resourceOptions = dataToOptions({
    data: resourceData || [],
    valueKey: 'id',
    labelKey: 'name',
    restKeys: ['code'],
  })

  const triggerUpdateCode = () => {
    const resourceId = methods.getValues('resource_id')
    const actionId = methods.getValues('action_id')
    if (resourceId && actionId) {
      const resource = optionSelected(resourceOptions, resourceId)
      const action = optionSelected(actionOptions, actionId)
      methods.setValue('code', `${resource?.code}.${action?.code}`)
    }
  }

  return (
    <div className="mazic_row">
      <FormItem label="Name" required>
        <FormInput field="name" placeholder="Enter permission name..." />
      </FormItem>
      <FormItem label="Description" col={8}>
        <FormInput field="description" placeholder="Enter permission description..." />
      </FormItem>
      <FormItem label="Resource" required>
        <FormSelect
          field="resource_id"
          options={resourceOptions}
          placeholder="Select resource..."
          onChange={(value: string) => {
            methods.clearErrors('resource_id')
            methods.setValue('resource_id', value)
            triggerUpdateCode()
          }}
        />
      </FormItem>
      <FormItem label="Action" required>
        <FormSelect
          field="action_id"
          options={actionOptions}
          placeholder="Select action..."
          onChange={(value: string) => {
            methods.clearErrors('action_id')
            methods.setValue('action_id', value)
            triggerUpdateCode()
          }}
        />
      </FormItem>
      <FormItem label="Code" required>
        <FormInput field="code" placeholder="Enter permission code..." disabled />
      </FormItem>
    </div>
  )
}
