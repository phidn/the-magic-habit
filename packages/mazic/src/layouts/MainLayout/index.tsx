import { cn } from '@mazic/ui'
import { useStore } from '@mazic/store/useStore'

import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
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
        <div>
          <Navbar />
          <div className="max-w-[1200px] w-full mx-auto p-6">{children}</div>
        </div>
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
