import { forwardRef, LegacyRef } from 'react'
import { Link, LinkProps, To } from 'react-router-dom'

import { MENUS } from '@mazic/config/menus'
import { useStore } from '@mazic/store/useStore'
import { MenuItem, Menus } from '@mazic/types/menu'

const findMenuByHref = (menus: Menus, targetHref: To): MenuItem => {
  for (const key in menus) {
    if (menus[key].href === targetHref) {
      return menus[key]
    }

    if (menus[key].submenus && menus[key].submenus.length > 0) {
      const found = menus[key].submenus.find((submenu) => submenu.href === targetHref)
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

export const MenuLink = forwardRef(
  ({ to, children, ...restProps }: LinkProps, ref?: LegacyRef<HTMLAnchorElement>) => {
    const { setOpenItem } = useStore().sidebar

    const onClick = () => {
      const menu = findMenuByHref(MENUS, to)
      if (menu) {
        setOpenItem(menu)
      }
    }

    return (
      <Link {...restProps} to={to} onClick={onClick} ref={ref}>
        {children}
      </Link>
    )
  }
)
