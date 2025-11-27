/*
 * @Description: 
 * @Author: qi zhaoyang
 * @Date: 2024-04-01 10:20:13
 * @LastEditTime: 2024-06-18 17:45:49
 * @LastEditors: qi zhaoyang
 * @FilePath: \chat\chat-phone\store\chat.js
 */
import { ss } from '@/utils/storage'
import {listChatMessage} from '@/api'
const LOCAL_NAME = 'chatStorage'

export function defaultState() {
  const chatNumber = ''
  return {
    active: chatNumber,
    model: 'QIANWEN',
    models: [],
    usingContext: true,
    chat: [],
	curAssistant: ''
  }
}

export function getLocalState() {
  console.log(ss.get(LOCAL_NAME),'ss.get(LOCAL_NAME)')
  const localState = ss.get(LOCAL_NAME) || []
  console.log(defaultState(),localState,'3333')
  return { ...defaultState(), ...localState }
}

export function setLocalState(state) {
  ss.set(LOCAL_NAME, state)
}

export default {
  state: getLocalState(),
  getters: {
    getChatByChatNumber(state) {
      const chatState = state.chat
    
      return async (chatNumber) => {
        
        if (!chatNumber) {
          return [];
        }
        let res = await listChatMessage ({ chatNumber });
        const chatData = res.data.map(item => {
          let data = {
            conversationId: item.messageId,
            parentMessageId: item.parentMessageId,
            dateTime: item.createTime,
            contentType: item.contentType,
            text: item.contentType == 'text' ? item.content : '',
            images: item.contentType == 'image' && item.content ? JSON.parse(item.content).map((d) => { return d.b64Image }) : [],
            model: item.model,
            inversion: item.role == 'user' ? true : false,
            error: false,
            loading: false
          }
          return data;
        });
        const index = chatState.findIndex(item => item.chatNumber === chatNumber);
        if (index !== -1) {
          chatState[index].data = chatData;
        } else {
          chatState.push({ chatNumber, data: chatData })
        }
        return chatState.find(item => item.chatNumber === chatNumber)?.data ?? []
      }
    }
  },
  actions: {
    // 设置是否开启上下文
    setUsingContext({dispatch,commit},context) {
     
      commit('setUsingContext',context)
      dispatch('recordState')
    },
    // 设置激活对话框
    async setActive({dispatch,commit},chatNumber) {
      commit('setActive',chatNumber)
      dispatch('recordState')
    },
    // 设置使用模型
    async setModel({dispatch,commit},model) {
      commit('setModel',model)
      dispatch('recordState')
    
    },
    // 根据索引获取当前信息
    getChatByIndex({dispatch,commit,state},{chatNumber, index}) {
      console.log(state,'state')
      const chatState = state.chat
      if (!chatNumber || chatNumber === '') {
        if (chatState.length) return chatState[0].data[index]
        return null
      }
      console.log()
      const chatIndex = chatState.findIndex(item => item.chatNumber === chatNumber)
      if (chatIndex !== -1) {
        return chatState[chatIndex].data[index]
      }
      return null
    },

    // 缓存中添加对话内容
    addChat({dispatch,commit,state},{chatNumber, chat}) {
      const chatState = state.chat
      const index = chatState.findIndex(item => item.chatNumber === chatNumber)
      console.log(index, chatState,'chatState')
      if (index !== -1) {
        chatState[index].data.push(chat)
        commit('addChat',chatState)
        
      } else {
        chatState.push({ chatNumber, data: [chat] })
        commit('addChat',chatState)
      }
    
      dispatch('recordState')
    },

    // 缓存中修改对话内容
    updateChat({dispatch,commit,state},{chatNumber, index, chat}) {
      const chatState = state.chat
      const chatIndex = chatState.findIndex(item => item.chatNumber === chatNumber)
      console.log(index, chatState,'updateChat')
      if (chatIndex !== -1) {
        chatState[chatIndex].data[index] = chat
        commit('updateChat',chatState)
      } else {
        chatState.push({ chatNumber, data: [chat] })
        commit('updateChat',chatState)
      }
      dispatch('recordState')
    },

    // 修改缓存中部分数据，加载状态
    updateChatLoading({dispatch,commit,state},{chatNumber, index, chat}) {
      const chatState = state.chat
      console.log(index,'updateChatLoading')
      const chatIndex = chatState.findIndex(item => item.chatNumber === chatNumber)
      if (chatIndex !== -1) {
        chatState[chatIndex].data[index] = { ...chatState[chatIndex].data[index], ...chat }
        dispatch('recordState')
      }
    },

    // 删除当前记录
    deleteChatByUuid({dispatch,commit,state},{chatNumber, index}) {
      const chatState = state.chat
      if (!chatNumber || chatNumber === '') {
        if (chatState.length) {
          chatState[0].data.splice(index, 1)
          dispatch('recordState')
        }
        return
      }
      const chatIndex = chatState.findIndex(item => item.chatNumber === chatNumber)
      if (chatIndex !== -1) {
        chatState[chatIndex].data.splice(index, 1)
        dispatch('recordState')
      }
    },

    // 清空当前对话内容
    clearChatByUuid({dispatch,commit,state},chatNumber) {
      const chatState = state.chat
      if (!chatNumber || chatNumber === '') {
        if (chatState.length) {
          chatState[0].data = []
          dispatch('recordState')
        }
        return
      }

      const index = chatState.findIndex(item => item.chatNumber === chatNumber)
      if (index !== -1) {
        chatState[index].data = []
        dispatch('recordState')
      }
    },

    async reloadRoute({dispatch,commit,state},chatNumber) {
      dispatch('recordState')
      await router.push({ name: 'Chat', params: { chatNumber } })
    },

    recordState({state}) {
      console.log(state,'state')
      setLocalState(state)
    },
    setModels({commit,dispatch},models) {
      commit('setModels',models)
      dispatch('recordState')
    },
	setCurAssistant({commit,dispatch},model) {
		   commit('setCurAssistant',model)
	}
  },
  mutations: {
    setUsingContext(state,context) {
      state.context = context
    },
    setActive(state,active) {
      state.active = active
    },
    setModel(state,model){
      state.model = model
    },
    addChat(state,chat) {
      console.log(chat,'addChat')
      state.chat = chat
    },
    updateChat(state,chat) {
      state.chat = chat
      console.log(chat,'updateChat')
    },
    setModels(state,models) {
      state.models = models
    },
	setCurAssistant(state,model) {
		state.curAssistant = model
	}
  }
}