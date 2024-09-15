import { useLocation, useParams } from 'react-router-dom'

export interface PageDetails {
  id: string
  resourceId: string
  isView: boolean
  isEditView: boolean
  isEdit: boolean
  isAddView: boolean
  isAdd: boolean
}

export const usePageDetails = (): PageDetails => {
  const { id } = useParams()
  const { pathname } = useLocation()
  const _isView = pathname.includes('/detail/') || pathname.includes('/view/')

  return {
    id: id || '',
    resourceId: id || '',
    isView: _isView,
    isEditView: !!id,
    isEdit: !!id,
    isAddView: !id,
    isAdd: !id,
  }
}
