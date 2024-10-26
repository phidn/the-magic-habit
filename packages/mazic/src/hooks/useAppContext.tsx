import { useContext } from 'react'
import { createContext } from 'react'

import { useDeleteHabit, useListHabit } from '@mazic/modules/habit/hooks/apis'
import { getActivities } from '@mazic/modules/habit/utils/utils'
import { roleService } from '@mazic/modules/rbac/role/services/roleService'

export interface IAppContext {
  services: {
    roleService: typeof roleService
  }
  utils: {
    getActivities: typeof getActivities
  }
  hooks: {
    useDeleteHabit: typeof useDeleteHabit
    useListHabit: typeof useListHabit
  }
}

export const AppContext = createContext<IAppContext | null>(null)

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const appValue = {
    services: {
      roleService,
    },
    utils: {
      getActivities,
    },
    hooks: {
      useDeleteHabit,
      useListHabit,
    },
  }
  return <AppContext.Provider value={appValue}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const appContext = useContext(AppContext)

  if (!appContext) {
    throw new Error('useAppContext has to be used within <AppContext.Provider>')
  }

  return appContext
}
