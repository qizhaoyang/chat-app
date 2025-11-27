/*
 * @Description: 
 * @Author: qi zhaoyang
 * @Date: 2024-03-29 11:22:35
 * @LastEditTime: 2024-04-02 10:30:04
 * @LastEditors: qi zhaoyang
 * @FilePath: \chat\chat-phone\utils\storage\index.js
 */


export function createLocalStorage(options) {
  const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7

  const { expire } = Object.assign({ expire: DEFAULT_CACHE_TIME }, options)

  function set(key, data) {
    const storageData = {
      data,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
    }

    const json = JSON.stringify(storageData)
    window.localStorage.setItem(key, json)
  }

  function get(key) {
    const json = window.localStorage.getItem(key)
    if (json) {
      let storageData

      try {
        storageData = JSON.parse(json)
      }
      catch {
        // Prevent failure
      }

      if (storageData) {
        const { data, expire } = storageData
        if (expire === null || expire >= Date.now())
          return data
      }

      remove(key)
      return null
    }
  }

  function remove(key) {
    window.localStorage.removeItem(key)
  }

  function clear() {
    window.localStorage.clear()
  }

  return { set, get, remove, clear }
}

export const ls = createLocalStorage()

export const ss = createLocalStorage({ expire: null })
