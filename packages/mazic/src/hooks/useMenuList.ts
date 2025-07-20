import { To, useLocation } from 'react-router-dom'

import { menusConfig } from '@mazic/config/menusConfig'
import { PERMISSIONS } from '@mazic/config/permissions'
import { useStore } from '@mazic/store/useStore'
import { Menu, MenuList, Submenu, TMenuItem } from '@mazic/types/menu'

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
          getMenuItem(menusConfig.DASHBOARD, permissionMap.has(PERMISSIONS.dashboard.view)),
          getMenuItem(menusConfig.DAILY, permissionMap.has(PERMISSIONS.dashboard.view)),
          getMenuItem(menusConfig.HABIT_MANAGEMENT, permissionMap.has(PERMISSIONS.habit.view)),
          getMenuItem(menusConfig.HABIT_CREATE, permissionMap.has(PERMISSIONS.habit.create)),
          getMenuItem(menusConfig.PROFILE, permissionMap.has(PERMISSIONS.profile.save)),
        ],
      },
      {
        groupLabel: '',
        menus: [getMenuWithSubmenus(menusConfig.SYSTEM)],
        isAccess: permissionMap.has(PERMISSIONS.administration.all_actions),
      },
    ],
  }
}

export const findMenuByHref = (targetHref: To): TMenuItem => {
  for (const key in menusConfig) {
    if (menusConfig[key].href === targetHref) {
      return menusConfig[key]
    }

    if (menusConfig[key].submenus && menusConfig[key].submenus.length > 0) {
      const found = menusConfig[key].submenus.find((submenu) => submenu.href === targetHref)
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
