import { To, useLocation } from 'react-router-dom'

import { DashboardIcon, GuardIcon } from '@mazic-design-system'

import { Menu, MenuList, Submenu, TMenuItem, TMenus } from '@mazic/types/menu'

export const MENUS: TMenus = {
  DASHBOARD: {
    href: '/',
    label: 'Dashboard',
    icon: DashboardIcon,
    submenus: [
      {
        href: '/habits',
        label: 'Habit',
      },
    ],
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
        groupLabel: 'CRM',
        menus: [getMenuItem(MENUS.DASHBOARD)],
      },
      {
        groupLabel: 'System',
        menus: [getMenuWithSubmenus(MENUS.SYSTEM)],
      },
    ],
  }
}
