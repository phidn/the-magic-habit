import { useState } from 'react'
import { PaginationState } from '@tanstack/react-table'

import { IPaginationApi } from '../types'

export const usePaginationState = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const paginationApi: IPaginationApi = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
  }

  return { pagination, setPagination, paginationApi }
}
