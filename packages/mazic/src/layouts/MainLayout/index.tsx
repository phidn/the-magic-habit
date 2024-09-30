import { useEffect } from 'react'
import { useIsFetching } from '@tanstack/react-query'
import { toast, Toaster } from 'sonner'

import { useStore } from '@mazic/store/useStore'
import { cn } from '@mazic/utils/cn'

import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

interface ContentLayoutProps {
  title: string
  children: React.ReactNode
}

const ContentLayout = ({ title, children }: ContentLayoutProps) => {
  return (
    <div>
      <Navbar title={title} />
      <div className="max-w-[1200px] w-full mx-auto p-6">{children}</div>
    </div>
  )
}

export const MainLayout = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const isOpen = useStore((store) => store.sidebar.isOpen)

  return (
    <div>
      <Sidebar />
      <main
        className={cn(
          'min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-slate-950 transition-[margin-left] ease-in-out duration-300',
          !isOpen ? 'lg:ml-[90px]' : 'lg:ml-72'
        )}
      >
        <ContentLayout title={title}>{children}</ContentLayout>
      </main>
      <footer
        className={cn(
          'transition-[margin-left] ease-in-out duration-300',
          !isOpen ? 'lg:ml-[90px]' : 'lg:ml-72'
        )}
      >
        <Footer />
      </footer>
    </div>
  )
}
