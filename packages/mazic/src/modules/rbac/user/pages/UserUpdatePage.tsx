import { usePageDetails } from '@mazic/hooks/usePageDetails'

import { UserForm } from '../components/UserForm'
import { useUpdateUser, useUserDetail } from '../hooks/useUserApis'
import { userSchema } from '../schemas/userSchema'

const UserUpdatePage = () => {
  const pageDetails = usePageDetails()
  const mutation = useUpdateUser(pageDetails.id)

  const { data } = useUserDetail(pageDetails.id)
  const _schema = userSchema.omit({ password: true, id: true })

  return (
    <UserForm
      schema={_schema}
      initialValues={data}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default UserUpdatePage
