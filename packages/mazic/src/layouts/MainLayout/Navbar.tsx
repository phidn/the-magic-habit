import { useStore } from '@mazic/store/useStore'

import { SheetMenu } from './SheetMenu'
import { ThemeToggle } from './ThemeToggle'
import { UserNav } from './UserNav'

interface NavbarProps {
  title: string
}

export const Navbar = ({ title }: NavbarProps) => {
  const { openItem } = useStore().sidebar

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{openItem?.label || title}</h1>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
