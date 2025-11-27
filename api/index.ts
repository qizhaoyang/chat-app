import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post, get, del, put } from '@/utils/request/index.ts'

// 获取配置信息
export function fetchChatConfig() {
  return get({
    url: '/app/api/config',
  })
}

// 登录
export function fetchVerify(data: object) {
  return get({
    url: '/app/api/oauth/token',
    data,
  })
}

// 获取用户信息
export function fetchSession() {
  return get({
    url: '/app/user',
  })
}

// 获取用户可用模型信息
export function fetchModel() {
  return get({
    url: '/app/user/model',
  })
}

// 修改个人信息
export function updateUser(data: object) {
  return put({
    url: '/app/user',
    data: data
  })
}

// 开启上下文
export function updateContext(data: object) {
  return put({
    url: '/app/user/context',
    data: data
  })
}

// 修改密码
export function updatePassword(data: object) {
  return put({
    url: '/app/user/password/update',
    data: data
  })
}

// 获取会话列表
export function listChat() {
  return get({
    url: '/app/chat',
  })
}

// 获取会话内容
export function listChatMessage(data: object) {
  return get({
    url: '/app/chat/message',
    data
  })
}

// 删除会话列表
export function removeChat(chatNumber: string) {
  return del({
    url: '/app/chat/' + chatNumber,
  })
}

// 获取助手分类
export function listAssistantType() {
  return get({
    url: '/app/api/assistant/type',
  })
}

// 根据分类获取助手
export function listAssistantByType(data: {current: number,size: number,typeId: number}) {
  return get({
    url: '/app/api/assistant',
    data
  })
}

// 随机获取助手
export function listAssistantRandom() {
  return get({
    url: '/app/api/assistant/random',
  })
}

// 创建对话
export function fetchChatAPI(data:any) {
  return post({
    url: '/app/chat',
    data: data
  })
}

// 发送内容
export function fetchChatMessageAPI(data:any) {
  return post({
    url: '/app/chat/message',
    data: data
  })
}

// 根据消息id获取当前内容
export function fetchChatMessageById(messageId: string) {
  return get({
    url: '/app/chat/message/' + messageId,
  })
}

// 根据消息id获取当前内容
export function deleteChatMessageById(messageId: string) {
  return del({
    url: '/app/chat/message/' + messageId,
  })
}

// 流式响应聊天
export function fetchChatAPIProcess(
  params: {
    conversationId: string
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  },
) {

  let data: Record<string, any> = {
    conversationId: params.conversationId
  }

  return get({
    url: '/app/chat/completions',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}
