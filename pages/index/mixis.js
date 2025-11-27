import { listChat, fetchChatAPI, fetchChatMessageAPI, fetchChatAPIProcess, fetchChatMessageById, deleteChatMessageById } from '@/api'
const mixin = {
  data() {
    return {
      controller: new AbortController(),
      loading: false,
      chatData: [],
	    prompt: '',
      notGen: true
    }
  },
  // 监听选中信息刷新对话内容
  watch: {
    '$store.state.chat.active':  {
      handler(newVal) {
        console.log( 'thisthisthis')
        this.getChatByChatNumber(this.$store.state.chat.active).then((res) => {
  
          this.chatData = res;
          console.log(this.chatData, 'thisthisthis')
        });
      },
      immediate: true
     
    }
  },
  methods: {
    // 根据下标获取对话内容
    getChatByIndex(chatNumber, index) {
      return this.$store.dispatch('getChatByIndex', { chatNumber, index })
    },

    // 添加当前对话到缓存
    addChat(chatNumber, chat) {
      console.log(chat, 'addChatchat')
      this.$store.dispatch('addChat', { chatNumber, chat })
    },

    // 更新对话
    updateChat(chatNumber, index, chat) {
      this.$store.dispatch('updateChat', { chatNumber, index, chat })
    },

    // 更新对话部分数据及加载状态
    updateChatLoading(chatNumber, index, chat) {
      this.$store.dispatch('updateChatLoading', { chatNumber, index, chat })
    },
    // 停止输出
    handleStop() {
      if (this.loading) {
        this.controller.abort()
        this.loading = false
      }
    },
    // 发送消息
    handleEnter(event) {
      if (event.key === 'Enter' && event.ctrlKey) {
        event.preventDefault()
        this.handleSubmit()
      }
    },
    // 发送

    async handleSubmit(prompt = '', assistantId = '') {
		
		if(!this.$store.state.author.token) {
				  uni.navigateTo({
				  	url:'/pages/login/login'
				  })
		}
      let message = prompt
      console.log(this.$store.state)
      let chatNumber = this.$store.state.chat.active;
      if (this.loading) return
      // 没有选择助手的时候判断文字
      if (!assistantId) {
        if (!message || message.trim() === '') return
      }
      const chatData = {
        assistantId: assistantId,
        systemPrompt: message,
        prompt: message
      }
      // 创建会话

      if (!chatNumber) {
        const chatRes = await fetchChatAPI(chatData);
        chatNumber = chatRes.data.chatNumber;
        message = chatRes.data.prompt;
        if (assistantId) {
         this.prompt = chatRes.data.prompt;
        }
        this.$store.dispatch('setActive', chatNumber)
        await this.$nextTick();
      }
      const messageData = {
        chatNumber: chatNumber,
        model: this.$store.state.chat.model,
        systemPrompt: message,
        prompt: message
      }
      // 发送内容
      const messageRes = await fetchChatMessageAPI(messageData);
      // 流式响应
      this.onConversation(chatNumber, messageRes.data, message)
      this.notGen = false;
    },
    /** 
    * sse对话 
    */
    async onConversation(chatNumber, conversationId, prompt = '',type='',typeId='') {
      let message = prompt
      let self = this
      console.log(self,'self')
      this.controller = new AbortController()

      this.addChat(chatNumber, {
        conversationId: conversationId,
        dateTime: new Date().toLocaleString(),
        contentType: 'text',
        text: message,
        model: this.$store.state.chat.model,
        inversion: true,
        error: false,
        type: type,
        id: typeId
      })

      //scrollToBottom();

      this.loading = true
      this.prompt = '';

      this.addChat(chatNumber, {
        parentMessageId: conversationId,
        dateTime: new Date().toLocaleString(),
        contentType: 'text',
        text: '',
        images: [],
        model: this.$store.state.chat.model,
        loading: true,
        inversion: false,
        error: false,
      })


      try {
        let lastText = ''
        const fetchChatAPIOnce = async () => {
          await fetchChatAPIProcess({
            conversationId: conversationId,
            signal: this.controller.signal,
            onDownloadProgress: ({ event }) => {
              const xhr = event.target
              const { responseText } = xhr
              const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
              let chunk = responseText
              if (lastIndex !== -1) {
                chunk = responseText.substring(lastIndex)
              }
              try {
                const data = JSON.parse(chunk)
                console.info(data);
                console.log(JSON.stringify(self.chatData,self.chatData[self.chatData.length - 1]))
                self.notGen = false;
                self.updateChat(chatNumber, self.chatData.length - 1, {
                  conversationId: data.conversationId,
                  parentMessageId: conversationId,
                  dateTime: new Date().toLocaleString(),
                  contentType: data.contentType,
                  text: data.contentType == 'text' ? lastText + (data.content ?? '') : '',
                  images: data.contentType == 'image' && data.content ? data.content.map((d) => { return d.b64Image }) : [],
                  model: this.$store.state.chat.model,
                  inversion: false,
                  error: false,
                  loading: true,
                })
                self.$nextTick(() => {
                  self.$set(self.chatData, self.chatData.length - 1, self.chatData[self.chatData.length - 1])
                })
              } catch (error) {
                console.info("回复错误:", error);
              }
            },
          })
          self.updateChatLoading(chatNumber, self.chatData.length - 1, {
            loading: false,
          })
          self.$nextTick(() => {
            self.$set(self.chatData, self.chatData.length - 1, self.chatData[self.chatData.length - 1])
          })
        }
        await fetchChatAPIOnce();
      } catch (error) {
        const errorMessage = error?.message ?? t('common.wrong')
        if (error.message === 'canceled') {
          self.updateChatLoading(chatNumber, self.chatData.length - 1, {
            loading: false,
          })
          // scrollToBottomIfAtBottom()
          return
        }
        console.log(this.chatData, 'this.chatData')
        const currentChat = self.getChatByIndex(chatNumber, self.chatData.length - 1)

        if (currentChat?.text && currentChat.text !== '') {
          self.updateChatLoading(chatNumber, self.chatData.length - 1, {
            text: `${currentChat.text}\n[${errorMessage}]`,
            error: false,
            loading: false,
          })
          return
        }

        self.updateChat(chatNumber, self.chatData.length - 1, {
          dateTime: new Date().toLocaleString(),
          contentType: 'text',
          text: errorMessage,
          inversion: false,
          error: true,
          loading: false,
        })
        // scrollToBottomIfAtBottom()
      } finally {
        self.loading = false
      }
    },

    /** 重新回复 */
    async onRegenerate(messageId) {
      if (!messageId) return;
      fetchChatMessageById(messageId).then((res) => {
        this.prompt = res.data.content;
        this.handleSubmit(res.data.content);
      })

    },

    // 删除消息
    async handleDelete(index, messageId) {
      if (this.loading) return
      if (!messageId) return;

      this.$store.dispatch('deleteChatByUuid', { active: this.$store.state.chat.active, index: index })
      this.$store.dispatch('deleteChatByUuid', { active: this.$store.state.chat.active, index: index - 1 })

      await deleteChatMessageById(messageId);
      this.getChatByChatNumber(this.$store.state.chat.active).then((res) => {
  
        this.chatData = res;
        console.log(this.chatData, 'thisthisthis')
      });
    }
  }
}

export default mixin