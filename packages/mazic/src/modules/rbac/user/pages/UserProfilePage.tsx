import { ProfileForm } from '../components/ProfileForm/ProfileForm'
import { useUserApis } from '../hooks/useUserApis'
import { profileSchema } from '../schemas/profileSchema'

const UserProfilePage = () => {
  const mutation = useUserApis.updateProfile()
  const { data } = useUserApis.profile()

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
