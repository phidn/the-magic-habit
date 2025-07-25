import { useState } from 'react'
import { Menu, UserIcon } from 'lucide-react'

import {
  ButtonLink,
  buttonVariants,
  LoginIcon,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@mazic/ui'
import Logo from '@mazic/components/Logo/Logo'
import { pathRoutes } from '@mazic/config/pathRoutes'
import { useStore } from '@mazic/store/useStore'

interface RouteProps {
  href: string
  label: string
}

const routeList: RouteProps[] = [
  {
    href: '#leaderboard',
    label: 'Leaderboard',
  },
  {
    href: '#features',
    label: 'Features',
  },
  {
    href: '#about',
    label: 'About',
  },
  {
    href: '#pricing',
    label: 'Pricing',
  },
]

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const currentUser = useStore((state) => state.currentUser)

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <Logo />
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu className="flex md:hidden h-5 w-5" onClick={() => setIsOpen(true)}>
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={'left'}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">Shadcn/React</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: 'ghost' })}
                    >
                      {label}
                    </a>
                  ))}
                  <ButtonLink
                    href={pathRoutes.home}
                    className={`w-[110px] border ${buttonVariants({
                      variant: 'secondary',
                    })}`}
                  >
                    <Logo hideText />
                    Login
                  </ButtonLink>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: 'ghost',
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            {!currentUser?.user?.id && (
              <ButtonLink
                href={pathRoutes.auth.login}
                className={`border ${buttonVariants({
                  variant: 'secondary',
                })}`}
              >
                <LoginIcon className="mr-2 w-4 h-4" />
                Login
              </ButtonLink>
            )}
            {currentUser?.user?.id && (
              <ButtonLink
                href={pathRoutes.dashboard}
                className={`border ${buttonVariants({
                  variant: 'secondary',
                })}`}
              >
                <UserIcon className="mr-2 w-4 h-4" />
                <span>Dashboard</span>
              </ButtonLink>
            )}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}
