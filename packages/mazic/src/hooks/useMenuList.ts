import { useLocation } from 'react-router-dom'

import { MENUS } from '@mazic/config/menus'
import { Menu, MenuList, Submenu } from '@mazic/types/menu'

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
