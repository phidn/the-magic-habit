import { z } from 'zod'

import { roleSchema } from '../validations/role'

export type TRoleCreate = z.infer<typeof roleSchema>
export type TRole = TRoleCreate & {
  id: string
  role_key: string
}
