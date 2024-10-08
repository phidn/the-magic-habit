export type Submenu = {
  href: string
  label: string
  active?: boolean
}

export type Menu = {
  href: string
  label: string
  active?: boolean
  icon?: any
  submenus?: Submenu[]
  isAccess?: boolean
}

export type TMenuItem = Menu | Submenu

export type Group = {
  groupLabel: string
  menus: Menu[]
  isAccess?: boolean
}

export type MenuList = {
  menuList: Group[]
}

export type TMenus = {
  [key: string]: Menu
}
