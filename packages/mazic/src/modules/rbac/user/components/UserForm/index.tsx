import { useTranslation } from 'react-i18next'

import { FormCheckbox, FormControl } from '@mazic/components/FormControl'
import { usePageDetails } from '@mazic/hooks'
import { IFormProps } from '@mazic/types'

import { detailFields } from '../../schemas/userSchema'

import { DetailForm } from './DetailForm'
import { RoleForm } from './RoleForm'

export const UserForm = (props: IFormProps) => {
  const { t } = useTranslation()
  const { isAdd } = usePageDetails()
  const formSections = [
    {
      title: 'User Details',
      elementRender: () => <DetailForm />,
      fields: isAdd ? detailFields : detailFields.filter((field) => field !== 'password'),
    },
    {
      title: 'User Roles',
      elementRender: () => <RoleForm />,
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
