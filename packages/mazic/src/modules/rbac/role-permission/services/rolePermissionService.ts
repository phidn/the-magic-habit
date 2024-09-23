import http from '@mazic/utils/http'

import { TRolePermissionReq } from '../types/RolePermissionType'

export const rolePermissionService = {
  query: <T = any>() => http.get<T>('/roles-permissions'),
  upsert: <T = any>(payload: TRolePermissionReq[]) => http.put<T>('/roles-permissions', payload),
  listRoles: <T = any>() => http.get<T>('/roles'),
}
