import { MapPinCheckInsideIcon } from 'lucide-react'

import { AtomIcon, DashboardIcon, EditUserIcon, GuardIcon, PlusCircledIcon } from '@mazic/ui'
import { pathRoutes } from '@mazic/config/pathRoutes'
import { TMenus } from '@mazic/types/menu'

export const menusConfig: TMenus = {
  DASHBOARD: {
    href: pathRoutes.dashboard,
    label: 'Dashboard',
    icon: DashboardIcon,
  },
  DAILY: {
    href: pathRoutes.daily,
    label: 'Daily Check-in',
    icon: () => <MapPinCheckInsideIcon className="text-green-500 w-5" />,
  },
  HABIT_MANAGEMENT: {
    href: pathRoutes.habit.list,
    label: 'Habit Management',
    icon: AtomIcon,
  },
  HABIT_CREATE: {
    href: pathRoutes.habit.create,
    label: 'Create habit',
    icon: PlusCircledIcon,
  },
  PROFILE: {
    href: pathRoutes.user.profile,
    label: 'User Settings',
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
