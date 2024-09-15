import { CompanyIcon, DashboardIcon, GuardIcon } from '@mazic-design-system'

import { Menus } from '@mazic/types/menu'

export const MENUS: Menus = {
  DASHBOARD: {
    href: '/',
    label: 'Dashboard',
    icon: DashboardIcon,
    submenus: [],
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
  COMPANY_SETTING: {
    href: '/#',
    label: 'Company Setting',
    icon: CompanyIcon,
    submenus: [
      {
        href: '/close-reason',
        label: 'Close reason',
      },
    ],
  },
}
