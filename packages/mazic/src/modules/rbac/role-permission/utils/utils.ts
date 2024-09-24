import groupBy from 'lodash/groupBy'
import map from 'lodash/map'

import { TRole } from '@mazic/schemas/roleSchema'

import { TMatrix, TRolePermissionExtended } from '../types'

export const processRows = (data: TRolePermissionExtended[], roles: TRole[]): TMatrix[] => {
  const resourceRows = groupBy(data, (item) => item.resource_name)

  return map(resourceRows, (resourceRow, resourceName) => {
    const permissionRows = groupBy(resourceRow, (item) => item.permission_name)
    const children = map(permissionRows, (permissionRow, permissionName) => {
      const row: TMatrix = {
        resource_name: permissionName,
        children: [],
      }
      map(permissionRow, (item) => {
        row[item.role_key] = {
          id: item.id,
          permission_id: item.permission_id,
          role_id: item.role_id,
          is_access: item.is_access,
        }
      })
      return row
    })
    const row: TMatrix = { resource_name: resourceName, children }
    map(roles, ({ role_key }) => {
      row[role_key] = {
        is_access: children.every((child) => child[role_key]?.is_access === true),
      }
    })
    return row
  })
}

type RolePermissionRequest = {
  permission_id: string
  role_id: string
  is_access: boolean
}

export const extractPermissions = (data: TMatrix[]): RolePermissionRequest[] => {
  const permissions: RolePermissionRequest[] = []

  const extractFromChildren = (children: TMatrix[]) => {
    children.forEach((child) => {
      for (const [, details] of Object.entries(child)) {
        if (details.permission_id && details.is_access) {
          permissions.push({
            permission_id: details.permission_id,
            role_id: details.role_id,
            is_access: details.is_access,
          })
        }
      }
      if (child.children && child.children.length > 0) {
        extractFromChildren(child.children)
      }
    })
  }

  data.forEach((rolePermission) => {
    if (rolePermission.children && rolePermission.children.length > 0) {
      extractFromChildren(rolePermission.children)
    }
    for (const [, details] of Object.entries(rolePermission)) {
      if (details.permission_id && details.is_access) {
        permissions.push({
          permission_id: details.permission_id,
          role_id: details.role_id,
          is_access: details.is_access,
        })
      }
    }
  })

  return permissions
}
