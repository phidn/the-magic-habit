import { z } from 'zod'

export const permissionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
})

export type TPermissionCreate = z.infer<typeof permissionSchema>
export type TPermission = TPermissionCreate & { id: string }
