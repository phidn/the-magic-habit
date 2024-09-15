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
}

export type MenuItem = Menu | Submenu

export type Group = {
  groupLabel: string
  menus: Menu[]
}

export type MenuList = {
  menuList: Group[]
}

export type Menus = {
  [key: string]: Menu
}
