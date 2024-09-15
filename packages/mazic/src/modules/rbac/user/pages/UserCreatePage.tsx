import { getDefaultsBySchema } from '@mazic/utils/form'

import { UserForm } from '../components/UserForm'
import { useUserApis } from '../hooks/useUserApis'
import { userSchema } from '../schemas/userSchema'

const UserCreatePage = () => {
  const mutation = useUserApis.create()

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
