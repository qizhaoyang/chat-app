import type { AxiosProgressEvent, AxiosResponse, GenericAbortSignal } from 'axios'

import request from './axios'
import store from '@/store/index.js'
console.log(store)
export interface HttpOption {
  url: string
  data?: any
  method?: string
  headers?: any
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  signal?: GenericAbortSignal
  beforeRequest?: () => void
  afterRequest?: () => void
}

export interface Response<T = any> {
  code: number
  msg: string | ''
  data: T
}

function http<T = any>( { url, data, method, headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,) {
  const successHandler = (res: AxiosResponse<Response<T>>) => {

    if (res.data.code === 200) {
      return res.data;
    } else if (res.data.code === 400) {
		uni.showToast({
			title: res.data.msg,
			icon: 'error'
		})
      return Promise.reject(new Error(res.data.msg))
    } else if (res.data.code === 401) {
       (store as any).dispatch('removeToken');
      // window.location.reload()
      uni.navigateTo({
      	url:'/pages/login/login'
      })
      return Promise.reject(new Error(res.data.msg))
    } else if (res.data.code === 403) {
      uni.showToast({
      	title: res.data.msg,
      	icon: 'error'
      })
      return Promise.reject(new Error(res.data.msg))
    } else if (res.data.code === 404) {
      uni.showToast({
      	title: res.data.msg,
      	icon: 'error'
      });
      return Promise.reject(new Error(res.data.msg))
    } else if (res.data.code === 500) {
     uni.showToast({
     	title: res.data.msg,
     	icon: 'error'
     })
      return Promise.reject(new Error(res.data.msg))
    } else if (res.data.code === 600) {
      uni.showToast({
      	title: res.data.msg,
      	icon: 'error'
      })
      return Promise.reject(new Error(res.data.msg))
    } else {
      return res.data;
    }
  }

  const failHandler = (error: Response<Error>) => {
    afterRequest?.()
	uni.showToast({
		title: '服务器连接中，请稍后再试～',
		icon: 'none'
	})
    throw new Error(error?.msg || 'Error')
  }

  beforeRequest?.()

  method = method || 'GET'

  const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})
  if (method === 'GET') {
    return request.get(url, { params, signal, onDownloadProgress }).then(successHandler, failHandler);
  } else if (method === 'POST') {
    return request.post(url, params, { headers, signal, onDownloadProgress }).then(successHandler, failHandler)
  } else if (method === 'DELETE') {
    return request.delete(url, { params, signal, onDownloadProgress }).then(successHandler, failHandler);
  } else if (method === 'PUT') {
    return request.put(url, params, { headers, signal, onDownloadProgress }).then(successHandler, failHandler)
  } else {
    return request.post(url, params, { headers, signal, onDownloadProgress }).then(successHandler, failHandler)
  }

}

export function get<T = any>(
  { url, data, method = 'GET', onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function del<T = any>(
  { url, data, method = 'DELETE', onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function post<T = any>(
  { url, data, method = 'POST', headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    headers,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function put<T = any>(
  { url, data, method = 'PUT', headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    headers,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export default post
