/*
 * @Description: 
 * @Author: qi zhaoyang
 * @Date: 2024-04-01 16:39:45
 * @LastEditTime: 2024-04-01 16:45:36
 * @LastEditors: qi zhaoyang
 * @FilePath: \chat-phone\store\prompt.js
 */
import { ss } from '@/utils/storage'

const LOCAL_NAME = 'promptStore'



export function getLocalPromptList() {
  const promptStore = ss.get(LOCAL_NAME)
  return promptStore ?? { promptList: [] }
}

export function setLocalPromptList(promptStore){
  ss.set(LOCAL_NAME, promptStore)
}

export default {
 state: getLocalPromptList(),
 mutations: {
  updatePromptList(state,promptList) {
    this.state = {
      ...this.state,
      ...promptList
    }
  }
 },
 actions: {
  updatePromptList({commit},promptList) {
    commit('updatePromptList',promptList)
    setLocalPromptList({promptList})
  },
  getLocalPromptList({state}) {
    return state
  }
 }
}