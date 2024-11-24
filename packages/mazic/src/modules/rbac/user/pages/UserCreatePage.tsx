import { getDefaultsBySchema } from '@mazic/shared'

import { UserForm } from '../components/UserForm'
import { useCreateUser } from '../hooks/useUserApis'
import { userSchema } from '../schemas/userSchema'

const UserCreatePage = () => {
  const mutation = useCreateUser()

  return (
    <UserForm
      schema={userSchema}
      initialValues={getDefaultsBySchema(userSchema)}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default UserCreatePage
