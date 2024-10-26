import { useFormContext } from 'react-hook-form'

import { FormInput, FormItem, FormSelect } from '@mazic/components/FormControl'
import { RESOURCES, useGetOptions, usePageDetails } from '@mazic/hooks'
import { optionSelected } from '@mazic/utils/form'

import { usePermissionByResource } from '../../hooks/usePermissionApis'

export const DetailForm = () => {
  const methods = useFormContext()
  const { isEdit } = usePageDetails()

  const { options: resourceOptions } = useGetOptions(RESOURCES.RESOURCE)
  const { options: actionOptions } = useGetOptions(RESOURCES.ACTION)
  const { actions: existActions } = usePermissionByResource({
    pageSize: -1,
    resource_id: methods.getValues('resource_id'),
  })

  const resourceActionsMap = new Map(
    resourceOptions.map((option) => [option.value, option.actions])
  )

  const _actionOptions = actionOptions.filter((option) => {
    if (isEdit && option.value === methods.watch('action_id')) {
      return true
    }
    if (existActions.includes(option.value)) {
      return false
    }
    const _actions = resourceActionsMap.get(methods.watch('resource_id'))
    return _actions?.includes(option.value)
  })

  return (
    <div className="mazic-row">
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
          afterChange={() => {
            methods.clearErrors('action_id')
            methods.setValue('action_id', null)
            methods.setValue('code', '')
          }}
        />
      </FormItem>
      <FormItem label="Action" required>
        <FormSelect
          field="action_id"
          options={_actionOptions}
          placeholder="Select action..."
          disabled={!methods.getValues('resource_id')}
          afterChange={(value) => {
            const resource = optionSelected(resourceOptions, methods.getValues('resource_id'))
            const action = optionSelected(actionOptions, value)
            if (resource?.code && action?.code) {
              methods.setValue('code', `${resource?.code}.${action?.code}`)
            }
          }}
        />
      </FormItem>
      <FormItem label="Code" required>
        <FormInput field="code" placeholder="Enter permission code..." disabled />
      </FormItem>
    </div>
  )
}
