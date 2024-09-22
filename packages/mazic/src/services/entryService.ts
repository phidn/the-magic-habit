import http from '@mazic/utils/http'

export const entryService = {
  getOptions: <T = any>(resource: string) => http.get<T>(`/global/options?resource=${resource}`),
  uploadFile: <T = any>(formData: FormData) =>
    http.post<T>('/global/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}
