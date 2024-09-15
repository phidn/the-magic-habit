import http from '@mazic/utils/http'

import { TCloseReason, TCloseReasonCreate, TSearchParamsSchema } from '../schemas/closeReasonSchema'

export const closeReasonService = {
  query: <T = any>(params: TSearchParamsSchema) => http.get<T>('/v1/close-reasons', { params }),
  get: <T = any>(id: string) => http.get<T>('/v1/close-reasons/' + id),
  create: <T = any>(payload: TCloseReasonCreate) => http.post<T>('/v1/close-reasons', payload),
  update: <T = any>(id: string, payload: TCloseReason) =>
    http.put<T>('/v1/close-reasons/' + id, payload),
  delete: <T = any>(id: string) => http.delete<T>('/v1/close-reasons/' + id),
}
