import { Link } from 'react-router-dom'

import { Button, cn, MazicIcon } from '@mazic/ui'
import { CONFIG } from '@mazic/config/config'
import { useStore } from '@mazic/store/useStore'

import { Menu } from './Menu'
import { SidebarToggle } from './SidebarToggle'

interface SidebarProps {
  hideLogoText?: boolean
}

export const Sidebar = ({ hideLogoText = false }: SidebarProps) => {
  const sidebar = useStore((store) => store.sidebar)

  if (!sidebar) return null

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300',
        sidebar?.isOpen === false ? 'w-[90px]' : 'w-72'
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.toggle} />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            'transition-transform ease-in-out duration-300 mb-1',
            sidebar?.isOpen === false ? 'translate-x-1' : 'translate-x-0'
          )}
          variant="link"
          asChild
        >
          <Link to="/" className="flex items-center gap-2">
            <MazicIcon className="w-8 h-8 mr-1" />
            {!hideLogoText && (
              <h1
                className={cn(
                  'font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300',
                  sidebar?.isOpen === false
                    ? '-translate-x-96 opacity-0 hidden'
                    : 'translate-x-0 opacity-100'
                )}
              >
                {CONFIG.appName}
              </h1>
            )}
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  )
}
