import { To, useLocation } from 'react-router-dom'

import { AtomIcon, DashboardIcon, EditUserIcon, GuardIcon } from '@mazic/ui'

import { pathRoutes } from '@mazic/config/pathRoutes'
import { PERMISSIONS } from '@mazic/config/permissions'
import { useStore } from '@mazic/store/useStore'
import { Menu, MenuList, Submenu, TMenuItem, TMenus } from '@mazic/types/menu'

export const MENUS: TMenus = {
  DASHBOARD: {
    href: pathRoutes.dashboard,
    label: 'Dashboard',
    icon: DashboardIcon,
  },
  HABIT_CREATE: {
    href: pathRoutes.habit.create,
    label: 'Create habit',
    icon: AtomIcon,
  },
  PROFILE: {
    href: pathRoutes.user.profile,
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
          getMenuItem(MENUS.DASHBOARD, permissionMap.has(PERMISSIONS.dashboard.view)),
          getMenuItem(MENUS.HABIT_CREATE, permissionMap.has(PERMISSIONS.habit.create)),
          getMenuItem(MENUS.PROFILE, permissionMap.has(PERMISSIONS.profile.save)),
        ],
      },
      {
        groupLabel: '',
        menus: [getMenuWithSubmenus(MENUS.SYSTEM)],
        isAccess: permissionMap.has(PERMISSIONS.administration.all_actions),
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
