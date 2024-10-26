import { useMemo } from 'react'

import { useAppContext } from '@mazic/hooks'

import { ProfileForm } from '../components/ProfileForm/ProfileForm'
import { useProfile, useUpdateProfile } from '../hooks/useUserApis'
import { profileSchema } from '../schemas/profileSchema'

const UserProfilePage = () => {
  const { hooks } = useAppContext()
  const { data: profile } = useProfile()
  const { data: habitList } = hooks.useListHabit({ pageSize: -1 })

  const mutation = useUpdateProfile()

  const [initialValues, habitData] = useMemo(() => {
    const _initialValues = {
      ...profile,
      ...(profile?.setting || {}),
    }
    if (profile?.setting?.habit_orders) {
      const habit_orders = profile.setting.habit_orders.split('|')
      const habitData = (habitList || []).sort(
        (a, b) => habit_orders.indexOf(a.id) - habit_orders.indexOf(b.id)
      )
      return [_initialValues, habitData]
    }
    return [_initialValues, habitList]
  }, [profile, habitList])

  return (
    <ProfileForm
      schema={profileSchema}
      initialValues={initialValues}
      habitData={habitData}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default UserProfilePage
