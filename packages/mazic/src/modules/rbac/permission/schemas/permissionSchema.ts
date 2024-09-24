import { z } from 'zod'

import { CONFIG } from '@mazic/config/config'

const detailSection = {
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  resource_id: z.string().min(1, 'Resource is required'),
  action_id: z.string().min(1, 'Action is required'),
}

export const detailFields = Object.keys(detailSection)

export const permissionSchema = z.object({
  ...detailSection,
  is_active: z.boolean().default(true),
})

export type TPermissionCreate = z.infer<typeof permissionSchema>
export type TPermission = TPermissionCreate & { id: string }

export const filterSchema = {
  page: z.coerce.number().default(CONFIG.pagination.page),
  pageSize: z.coerce.number().default(CONFIG.pagination.pageSize),
  sort: z.string().optional(),
  search: z.string().optional(),
  is_active: z.string().optional(),
  resource_id: z.string().optional(),
}
