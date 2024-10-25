import omitBy from 'lodash/omitBy'

import { TObjectAny } from '@mazic/types'
import http from '@mazic/utils/http'

export const entryService = {
  getOptions: <T = any>(resource: string, params?: TObjectAny) => {
    const query = new URLSearchParams(omitBy(params, (x) => x === '')).toString()
    return http.get<T>(`/global/options?resource=${resource}${query ? `&${query}` : ''}`)
  },
  uploadFile: <T = any>(formData: FormData) =>
    http.post<T>('/files/upload-s3', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}
