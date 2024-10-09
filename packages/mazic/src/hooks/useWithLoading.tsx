import { Spinner } from '@mazic/ui'

interface WithLoadingProps {
  isLoading: boolean
  loadingSize?: 'small' | 'medium' | 'large'
  children: React.ReactNode
}

export const useWithLoading = ({
  isLoading,
  loadingSize = 'small',
  children,
}: WithLoadingProps) => {
  return isLoading ? <Spinner size={loadingSize} /> : children
}
