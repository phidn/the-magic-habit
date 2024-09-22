import { useTranslation } from 'react-i18next'

import { FormCheckbox, FormControl } from '@mazic/components/FormControl'
import { IFormProps } from '@mazic/types'
import { extractFields } from '@mazic/utils/form'

import { DetailForm } from './DetailForm'
import { RoleForm } from './RoleForm'

export const UserForm = (props: IFormProps) => {
  const { t } = useTranslation()
  const formSections = [
    {
      title: 'User Details',
      elementRender: () => <DetailForm />,
      fields: extractFields(DetailForm),
    },
    {
      title: 'User Roles',
      elementRender: () => <RoleForm />,
      fields: extractFields(RoleForm),
    },
    {
      title: 'User Status',
      elementRender: () => <FormCheckbox field="verified" title={t('form.verified')} />,
    },
  ]

  return (
    <FormControl
      isHasFile
      formTitle="User"
      formSections={formSections}
      schema={props.schema}
      initialValues={props.initialValues}
      onSubmitForm={props.onSubmitForm}
      isPendingSubmit={props.isPendingSubmit}
    />
  )
}
