import http from '@mazic/utils/http'

export const entryService = {
  getOptions: <T = any>(resource: string) => http.get<T>(`/v1/entry/options?resource=${resource}`),
  uploadFile: <T = any>(formData: FormData) =>
    http.post<T>('/v1/entry/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}
