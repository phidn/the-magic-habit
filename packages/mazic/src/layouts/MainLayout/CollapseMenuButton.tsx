import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu'
import { ChevronDown, Dot, LucideIcon } from 'lucide-react'

import {
  Button,
  cn,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@mazic/ui'
import { MenuLink } from '@mazic/components/Commons'

type Submenu = {
  href: string
  label: string
  active?: boolean
}

interface CollapseMenuButtonProps {
  renderIcon: () => React.ReactNode
  label: string
  active: boolean
  submenus: Submenu[]
  isOpen: boolean | undefined
}

export const CollapseMenuButton = ({
  renderIcon,
  label,
  active,
  submenus,
  isOpen,
}: CollapseMenuButtonProps) => {
  const isSubmenuActive = submenus.some((submenu) => submenu.active)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive)

  return isOpen ? (
    <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed} className="w-full">
      <CollapsibleTrigger className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1" asChild>
        <Button variant={active ? 'secondary' : 'ghost'} className="w-full justify-start h-10">
          <div className="w-full items-center flex justify-between">
            <div className="flex items-center">
              <span className="mr-4">{renderIcon()}</span>
              <p
                className={cn(
                  'max-w-[150px] truncate',
                  isOpen ? 'translate-x-0 opacity-100' : '-translate-x-96 opacity-0'
                )}
              >
                {label}
              </p>
            </div>
            <div
              className={cn(
                'whitespace-nowrap',
                isOpen ? 'translate-x-0 opacity-100' : '-translate-x-96 opacity-0'
              )}
            >
              <ChevronDown size={18} className="transition-transform duration-200" />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {submenus.map(({ href, label, active }, index) => (
          <Button
            key={index}
            variant={active ? 'secondary' : 'ghost'}
            className="w-full justify-start h-10 mb-1"
            asChild
          >
            <MenuLink to={href}>
              <span className="mr-4 ml-2">
                <Dot size={18} />
              </span>
              <p
                className={cn(
                  'max-w-[170px] truncate',
                  isOpen ? 'translate-x-0 opacity-100' : '-translate-x-96 opacity-0'
                )}
              >
                {label}
              </p>
            </MenuLink>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={active ? 'secondary' : 'ghost'}
                className="w-full justify-start h-10 mb-1"
              >
                <div className="w-full items-center flex justify-between">
                  <div className="flex items-center">
                    <span className={cn(isOpen === false ? '' : 'mr-4')}>{renderIcon()}</span>
                    <p
                      className={cn(
                        'max-w-[200px] truncate',
                        isOpen === false ? 'opacity-0' : 'opacity-100'
                      )}
                    >
                      {label}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" alignOffset={2}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="right" sideOffset={25} align="start">
        <DropdownMenuLabel className="max-w-[190px] truncate">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {submenus.map(({ href, label }, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link className="cursor-pointer" to={href}>
              <p className="max-w-[180px] truncate">{label}</p>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuArrow className="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
