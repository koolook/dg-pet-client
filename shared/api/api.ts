import axios, { AxiosAdapter, AxiosError } from 'axios'
// import { cacheAdapterEnhancer } from 'axios-extensions'

import { TOKEN_KEY } from '@shared/lib/hooks/useSession'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST_API,
  headers: {
    'Cache-Control': 'no-cache',
  },
  // adapter: cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter, {
  //   enabledByDefault: false,
  //   cacheFlag: 'useCache',
  // }),
  timeout: 22000,
  withCredentials: true,
})

api.interceptors.request.use((config: any) => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem(TOKEN_KEY)) {
      config.headers.Authorization = 'Bearer ' + localStorage.getItem(TOKEN_KEY)
    }

    if (localStorage.getItem('language')) {
      config.headers['accept-language'] = localStorage.getItem('language')
    }
  }
  return config
})

export const isApiError = (error: any): error is AxiosError => axios.isAxiosError(error)
