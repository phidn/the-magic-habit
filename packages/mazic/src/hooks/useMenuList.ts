import { To, useLocation } from 'react-router-dom'

import { AtomIcon, DashboardIcon, EditUserIcon, GuardIcon } from '@mazic/ui'

import { permissionsConfig } from '@mazic/shared'

import { habitPaths } from '@mazic/modules/habit'
import { userPaths } from '@mazic/modules/rbac/user'
import { useStore } from '@mazic/store/useStore'
import { Menu, MenuList, Submenu, TMenuItem, TMenus } from '@mazic/types/menu'

export const MENUS: TMenus = {
  DASHBOARD: {
    href: '/',
    label: 'Dashboard',
    icon: DashboardIcon,
  },
  HABIT_CREATE: {
    href: habitPaths.create,
    label: 'Create habit',
    icon: AtomIcon,
  },
  PROFILE: {
    href: userPaths.profile,
    label: 'Profile',
    icon: EditUserIcon,
  },
  SYSTEM: {
    href: '/#',
    label: 'Administration',
    icon: GuardIcon,
    submenus: [
      {
        href: '/user',
        label: 'User',
      },
      {
        href: '/roles-permissions',
        label: 'Roles & Permissions',
      },
      {
        href: '/role',
        label: 'Role',
      },
      {
        href: '/permission',
        label: 'Permission',
      },
      {
        href: '/resource',
        label: 'Resource',
      },
      {
        href: '/action',
        label: 'Action',
      },
    ],
  },
}

export const useMenuList = (): MenuList => {
  const { pathname } = useLocation()
  const currentUser = useStore((state) => state.currentUser.user)
  const permissionMap = new Map((currentUser?.permissions || []).map((p) => [p.code, p]))

  const getMenuItem = <T extends Menu | Submenu>(menu: T, isAccess = true): T => {
    return {
      ...menu,
      active: pathname === menu.href || pathname.startsWith(`${menu.href}/`),
      isAccess: !!isAccess,
    }
  }

  const getMenuWithSubmenus = (menu: Menu): Menu => {
    const submenus = menu.submenus?.map((submenu) => getMenuItem(submenu))
    const active =
      submenus?.some((submenu) => submenu.active) ||
      pathname === menu.href ||
      pathname.startsWith(`${menu.href}/`)
    return { ...menu, submenus, active }
  }

  return {
    menuList: [
      {
        groupLabel: '',
        menus: [
          getMenuItem(MENUS.DASHBOARD, permissionMap.has(permissionsConfig.dashboard.view)),
          getMenuItem(MENUS.HABIT_CREATE, permissionMap.has(permissionsConfig.habit.create)),
          getMenuItem(MENUS.PROFILE, permissionMap.has(permissionsConfig.profile.save)),
        ],
      },
      {
        groupLabel: '',
        menus: [getMenuWithSubmenus(MENUS.SYSTEM)],
        isAccess: permissionMap.has(permissionsConfig.administration.all_actions),
      },
    ],
  }
}

export const findMenuByHref = (targetHref: To): TMenuItem => {
  for (const key in MENUS) {
    if (MENUS[key].href === targetHref) {
      return MENUS[key]
    }

    if (MENUS[key].submenus && MENUS[key].submenus.length > 0) {
      const found = MENUS[key].submenus.find((submenu) => submenu.href === targetHref)
      if (found) {
        return found
      }
    }
  }
  return {
    label: '',
    href: targetHref.toString(),
  }
}
