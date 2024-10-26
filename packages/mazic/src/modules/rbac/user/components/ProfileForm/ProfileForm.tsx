import { FormControl } from '@mazic/components/FormControl'
import { IFormProps } from '@mazic/types'
import { THabit } from '@mazic/types/modules'

import { dashboardSettingsFields, detailFields } from '../../schemas/profileSchema'

import { DashboardSettings } from './DashboardSettings'
import { ProfileDetail } from './ProfileDetail'

interface IProps extends IFormProps {
  habitData: THabit[]
}

export const ProfileForm = (props: IProps) => {
  const formSections = [
    {
      title: 'User Details',
      elementRender: () => <ProfileDetail />,
      fields: detailFields,
    },
    {
      title: 'Dashboard Settings',
      elementRender: () => <DashboardSettings habitData={props.habitData} />,
      fields: dashboardSettingsFields,
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
