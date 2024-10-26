import { ProfileForm } from '../components/ProfileForm/ProfileForm'
import { useProfile, useUpdateProfile } from '../hooks/useUserApis'
import { profileSchema } from '../schemas/profileSchema'

const UserProfilePage = () => {
  const mutation = useUpdateProfile()
  const { data } = useProfile()

  return (
    <ProfileForm
      schema={profileSchema}
      initialValues={data}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default UserProfilePage
