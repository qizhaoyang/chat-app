import axios, { type AxiosResponse } from 'axios'
import store from '@/store/index.js'
const service = axios.create({
  baseURL: 'https://www.gongyoulaowubang.cn/chat-master',
})

service.interceptors.request.use(
  (config) => {
	  console.log((store as any).state,'(store as any).state')
    const token = (store as any).state.author.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers['client-id'] = `app`
    return config
  }, (error) => {
    return Promise.reject(error.response)
  },
)

/** 全局返回 */
service.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
    if (response.status === 200) {
      return response
    }
    throw new Error(response.status.toString())
  }, (error) => {
    return Promise.reject(error)
  },
)
export default service