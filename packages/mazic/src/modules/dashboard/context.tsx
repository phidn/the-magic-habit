import React, { createContext, ReactNode, useContext, useState } from 'react'

interface PageState {
  modal: {
    open: boolean
  }
}

interface PageContextProps extends PageState {
  setPageState: React.Dispatch<React.SetStateAction<PageState>>
  setModal: (open: boolean) => void
}

const PageContext = createContext<PageContextProps | undefined>(undefined)

export const PageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pageState, setPageState] = useState<PageState>({
    modal: {
      open: false,
    },
  })

  const setModal = (open: boolean) => {
    setPageState((prevState) => ({
      ...prevState,
      modal: {
        open,
      },
    }))
  }

  const value: PageContextProps = {
    ...pageState,
    setPageState,
    setModal,
  }

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>
}

export const usePageContext = (): PageContextProps => {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error('usePageContext must be used within a PageProvider')
  }
  return context
}

export const withPageProvider = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => (
    <PageProvider>
      <Component {...props} />
    </PageProvider>
  )
}
