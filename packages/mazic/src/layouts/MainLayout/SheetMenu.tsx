import { Link } from 'react-router-dom'
import { MenuIcon } from 'lucide-react'

import { Button, MazicIcon, Sheet, SheetContent, SheetHeader, SheetTrigger } from '@mazic/ui'

import { PATH_ROUTE } from '@mazic/config/config'

import { Menu } from './Menu'

export const SheetMenu = () => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button className="flex justify-center items-center pb-2 pt-1" variant="link" asChild>
            <Link to={PATH_ROUTE.dashboard} className="flex items-center gap-2">
              <MazicIcon className="w-6 h-6 mr-1" />
              <h1 className="font-bold text-lg">Brand</h1>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  )
}
