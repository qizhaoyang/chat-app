import {
	fetchSession,
	userInfo
} from '@/api'

import { ss } from '@/utils/storage/index.js'

const LOCAL_NAME = 'SECRET_TOKEN'

export function getToken() {
  return ss.get(LOCAL_NAME)
}

export function setToken(token) {
  return ss.set(LOCAL_NAME, token)
}

export function removeToken() {
  return ss.remove(LOCAL_NAME)
}
export default {
	state: {
		token: getToken(),
		session: null
	},
	mutations: {
		setToken(state,token) {
			state.token = token
			setToken(token)
		},
		setSession(state,session) {
			state.session = session
		},
    clearToken(state) {
      state.token = ''
			
    }
	},
	actions: {
		async getSession({commit}) {
			try {
				const res = await fetchSession()
				if (res.code === 200) {
					commit('setSession', res.data)
				}
				return Promise.resolve(res)
			} catch (error) {
				return Promise.reject(error)
			}
		},
		
		setToken({commit,dispatch},token) {
			commit('setToken',token)
      dispatch('getSession')
		},

		removeToken({commit}) {
			commit('clearToken')
			removeToken()
		},
		
	}
}