import { Ellipsis, LucideIcon } from 'lucide-react'

import {
  Button,
  cn,
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@mazic/ui'
import { BuyMeCoffee } from '@mazic/components'
import { MenuLink } from '@mazic/components/Commons'
import { useMenuList } from '@mazic/hooks/useMenuList'

import { CollapseMenuButton } from './CollapseMenuButton'

interface MenuProps {
  isOpen: boolean | undefined
}

export const Menu = ({ isOpen }: MenuProps) => {
  const { menuList } = useMenuList()

  const renderIcon = (Icon: LucideIcon | React.ReactNode) => {
    if (typeof Icon === 'function') {
      return <Icon size={18} />
    }
    return Icon
  }

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="pt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px-4px)] lg:min-h-[calc(100vh-32px-40px-32px-4px)] items-start space-y-1 px-2">
          {menuList.map(
            ({ groupLabel, menus, isAccess }, index) =>
              isAccess !== false && (
                <li className={cn('w-full', groupLabel ? 'pt-5' : '')} key={index}>
                  {(isOpen && groupLabel) || isOpen === undefined ? (
                    <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                      {groupLabel}
                    </p>
                  ) : !isOpen && isOpen !== undefined && groupLabel ? (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger className="w-full">
                          <div className="w-full flex justify-center items-center">
                            <Ellipsis className="h-5 w-5" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{groupLabel}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <p className="pb-2"></p>
                  )}
                  {menus.map(({ href, label, icon: Icon, active, submenus, isAccess }, index) => {
                    if (isAccess === false) return null
                    return !submenus?.length ? (
                      <div className="w-full" key={index}>
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={active ? 'secondary' : 'ghost'}
                                className="w-full justify-start h-10 mb-1"
                                asChild
                              >
                                <MenuLink to={href}>
                                  <span className={cn(isOpen === false ? '' : 'mr-4')}>
                                    <Icon size={18} />
                                  </span>
                                  <p
                                    className={cn(
                                      'max-w-[200px] truncate',
                                      isOpen === false
                                        ? '-translate-x-96 opacity-0'
                                        : 'translate-x-0 opacity-100'
                                    )}
                                  >
                                    {label}
                                  </p>
                                </MenuLink>
                              </Button>
                            </TooltipTrigger>
                            {isOpen === false && (
                              <TooltipContent side="right">{label}</TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : (
                      <div className="w-full" key={index}>
                        <CollapseMenuButton
                          renderIcon={() => renderIcon(Icon)}
                          label={label}
                          active={Boolean(active)}
                          submenus={submenus}
                          isOpen={isOpen}
                        />
                      </div>
                    )
                  })}
                </li>
              )
          )}
          {isOpen && (
            <li className="w-full grow flex items-end">
              <BuyMeCoffee />
            </li>
          )}
        </ul>
      </nav>
    </ScrollArea>
  )
}
