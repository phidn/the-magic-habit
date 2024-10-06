import { To, useLocation } from 'react-router-dom'

import { AtomIcon, DashboardIcon, GuardIcon } from '@mazic/ui'

import { permissionsConfig } from '@mazic/shared'

import { useStore } from '@mazic/store/useStore'
import { Menu, MenuList, Submenu, TMenuItem, TMenus } from '@mazic/types/menu'

export const MENUS: TMenus = {
  DASHBOARD: {
    href: '/',
    label: 'Dashboard',
    icon: DashboardIcon,
  },
  HABIT: {
    href: '/habit',
    label: 'All Habits',
    icon: AtomIcon,
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

export const useMenuList = (): MenuList => {
  const { pathname } = useLocation()
  const currentUser = useStore((state) => state.currentUser)
  const permissionMap = new Map((currentUser?.permissions || []).map((p) => [p.code, p]))
  const isSystemAccess = permissionMap.has(permissionsConfig.administration.all_actions)

  const getMenuItem = <T extends Menu | Submenu>(menu: T): T => ({
    ...menu,
    active: pathname === menu.href || pathname.startsWith(`${menu.href}/`),
  })

  const getMenuWithSubmenus = (menu: Menu): Menu => {
    const submenus = menu.submenus?.map(getMenuItem)
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
        menus: [getMenuItem(MENUS.DASHBOARD), getMenuItem(MENUS.HABIT)],
      },
      {
        groupLabel: 'System',
        menus: [getMenuWithSubmenus(MENUS.SYSTEM)],
        is_access: isSystemAccess,
      },
    ].filter((group) => group?.is_access !== false),
  }
}
