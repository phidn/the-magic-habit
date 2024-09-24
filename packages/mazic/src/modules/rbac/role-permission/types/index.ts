export type TRolePermission = {
  id: string
  role_id: string
  role_name: string
  role_key: string
  permission_id: string
  permission_name: string
  resource_id: string
  resource_name: string
  action_id: string
  is_access: boolean
}

export type TRolePermissionExtended = TRolePermission & {
  permission_key: string
  resource_key: string
}

export type TMatrix = {
  id?: string
  permission_id?: string
  role_id?: string
  resource_name: string
  [key: string]: any
  children: TMatrix[]
}

export type TRolePermissionReq = {
  role_id: string
  permission_id: string
  is_access: boolean
}
