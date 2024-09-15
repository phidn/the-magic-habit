import { useActionApis } from '@mazic/modules/rbac/action/hooks/useActionApis'
import { useResourceApis } from '@mazic/modules/rbac/resource/hooks/useResourceApis'

const useApis = {
  action: useActionApis,
  resource: useResourceApis,
}

export { useApis }
