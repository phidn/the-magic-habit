import { useMutation } from '@tanstack/react-query'

import { entryService } from '@mazic/services/entryService'
import { ApiResponse } from '@mazic/types'

export const useUploadFile = () => {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return entryService.uploadFile<ApiResponse<string>>(formData)
    },
  })
}
