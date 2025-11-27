<template>
  <view class="safe-area-inset-bottom">
    <u-navbar
            title="创作"
            :autoBack="true"
        >
        </u-navbar>
    <view class="pt-[100rpx] pb-[120rpx]">
      <view class="px-[20rpx]" v-if="curModel">
        <view
          class="px-[30rpx] py-[24rpx] flex rounded-[14rpx] bg-white items-center direction-row"
        >
          <view
            class="u-image"
            style="
              width: 2.625rem;
              height: 2.625rem;
              border-radius: 0px;
              overflow: visible;
              opacity: 1;
              transition: opacity 0.5s ease-in-out 0s;
              background-color: transparent;
            "
          >
            <image
              :src="curModel.image"
              class="u-image__image"
              v-if="curModel && curModel.image"
            ></image>
          </view>
          <view class="flex-1 min-w-0 ml-[20rpx]">
            <view class="text-xl font-medium">
              {{ curModel.name }}
            </view>
            <view class="text-content line-clamp-2 text-xs mt-[10rpx]">
              {{ curModel.tips }}
            </view>
          </view>
        </view>
        <view class="px-[30rpx] py-[24rpx] rounded-[14rpx] bg-white mt-[20rpx]">
          <u--form
            ref="uForm"
            labelPosition="top"
            labelWidth="auto"
            :borderBottom="false"
          >
            <u-form-item
              :label="item.title"
              borderBottom
              v-for="(item, index) in curModel.elements"
              required
            >
              <u--input
                type="text"
                v-if="item.type == 'input'"
                :showWordLimit="true"
                class="widget-input w-full"
                :placeholder="item.placeholder || '请输入内容'"
                :maxlength="item.length"
                v-model:value="contentArray[index]"
              >
                <template slot="suffix">
                  <view class="text-xs text-muted ml-[20rpx]"> /{{ item.length }} </view>
                </template>
              </u--input>
              <u--input
                type="number"
                v-if="item.type == 'inputNumber'"
                class="widget-input w-full"
                :placeholder="`最多输入${item.length || 500}字`"
                v-model:value="contentArray[index]"
              />

              <u--textarea
                :placeholder="item.placeholder || '请输入...'"
                v-if="item.type == 'textarea'"
                :maxlength="item.length"
                class="widget-textarea w-full"
                height="120"
                v-model:value="contentArray[index]"
              >
              </u--textarea>
              <view v-if="item.type == 'radio'" class="radio-group">
                <view
                  class="radio-item"
                  v-for="option in item.options"
                  @click="changeOption(index, option, true)"
                  :class="{ 'radio-item--active': contentArray[index] == option }"
                >
                  {{ option }}
                </view>
              </view>
              <view v-if="item.type == 'checkbox'" class="radio-group">
                <view
                  class="radio-item"
                  v-for="option in item.options"
                  @click="changeOption(index, option)"
                  :class="{
                    'radio-item--active':
                      contentArray[index] && contentArray[index].includes(option),
                  }"
                >
                  {{ option }}
                </view>
              </view>
            </u-form-item>
          </u--form>
        </view>
      </view>
      <view>
        <view class="flex items-center px-[20rpx] py-[30rpx]">
          <view class="text-lg font-medium mr-auto"> 创作结果 </view>
          <!-- <view class="text-content">
              创作历史
            </view> -->
        </view>
      </view>
      <view class="flex flex-col justify-center items-center overflow-hidden">
        <view class="current-history w-full" v-if="!notGen">
          <view class="px-[20rpx] w-full">
            <scroll-view scroll-y="true" class="pb-[20rpx]">
              <view style="background-color: #fff; padding: 10px">
                <view class="chat-record mt-[20rpx] pb-[40rpx]">
                  <template v-for="(item, index) in chatData">
                    <view
                      class="chat-record-item w-full"
                      v-if="
                        index === chatData.length - 1 || index === chatData.length - 2
                      "
                    >
                      <view class="chat-record-item__left" v-if="!item.inversion">
                        <Avator
                          :model="item.model"
                          :inversion="item.inversion"
                          :loading="item.loading"
                        />
                        <view class="min-w-0 flex flex-col ml-2">
                          <view class="chat-record-item__left-content">
                            <view class="">
                              <view class="mb-[20rpx] last-of-type:mb-0">
                                <mpHtml
                                  :content="item.text"
                                  :selectable="true"
                                  :show-img-menu="true"
                                  :editable="true"
                                  :highlight="true"
                                  :markdown="true"
                                >
                                </mpHtml>
                                <u-loading-icon
                                  text="生成中..."
                                  textSize="28"
                                  textColor="black"
                                  color="black"
                                  style="justify-content: flex-start; color: black"
                                  v-if="item.loading"
                                ></u-loading-icon>
                                <view class="flex justify-end" v-else>
                                  <uni-tooltip content="刷新" placement="top"
                                    ><u-icon
                                      name="reload"
                                      size="40"
                                      class="mr-2"
                                      @click="onRegenerate(item.parentMessageId)"
                                    ></u-icon
                                  ></uni-tooltip>

                                  <uni-tooltip content="复制" placement="top"
                                    ><u-icon
                                      name="../../static/images/copy.png"
                                      size="40"
                                      class="mr-2"
                                      @click="copyText(item.text)"
                                    ></u-icon
                                  ></uni-tooltip>
                                  <uni-tooltip content="删除" placement="top"
                                    ><u-icon
                                      name="trash"
                                      size="40"
                                      @click="
                                        handleDelete(index + 1, item.conversationId)
                                      "
                                    ></u-icon
                                  ></uni-tooltip>
                                </view>
                              </view>
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                  </template>
                </view>
              </view>
            </scroll-view>
            <view class="" slot="bottom">
              <view class="send-area">
                <!-- <view class="float-btn">
									<view class="px-[20rpx] py-[10rpx] text-xs flex items-center">
										<u-icon name="play-circle"></u-icon>
										继续
									</view>
								</view> --><!--v-if-->
                <view class="mb-[20rpx] flex items-center">
                  <view class="flex items-center mr-auto"><!--v-if--><!--v-if--></view>
                  <view class="flex text-content items-center flex-none">
                    <view class="text-xs flex items-center" @click="prompt = ''">
                      <u-icon name="trash" class="mr-[4rpx]"></u-icon>

                      清空
                    </view>
                  </view>
                </view>
                <view class="send-area__content bg-page">
                  <view class="flex-1 min-w-0 relative"
                    ><!--v-if-->
                    <u--textarea
                      placeholder="请输入内容"
                      class="widget-textarea w-full"
                      auto-height
                      style="
                        padding: 0px;
                        border-color: rgb(220, 223, 230);
                        text-align: left;
                        min-height: 40px;
                      "
                      v-model="prompt"
                    ></u--textarea>
                  </view>
                  <view class="ml-[20rpx] my-[-12rpx]">
                    <view class="">
                      <u-button
                        type="primary"
                        style="
                          width: 4.125rem;
                          height: 1.625rem;
                          margin: 0px;
                          overflow: visible;
                        "
                        @click="handleSubmit(prompt)"
                      >
                        发送
                      </u-button>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="flex flex-col justify-center items-center pb-[200rpx]" v-if="notGen">
        <image
          src="@/static/images/create_record.png"
          alt=""
          class="w-[300rpx] h-[300rpx]"
        />
        <view class="my-[32rpx] font-medium"> AI创作结果会在显示这里，现在你只需要 </view>
        <view>
          <view class="text-content text-sm"> 1.填写越详细，结果越准确哦 </view>
          <view class="text-content text-sm"> 2.点击立即生成按钮，一般在10秒内搞定 </view>
        </view>
      </view>
    </view>

    <view class="h-[1px]" id="bottom-line"> </view>
    <view class="safe-area-inset-bottom fixed bottom-0 left-0 w-full bg-white z-10">
      <view class="p-[20rpx]">
        <view class="flex">
          <!-- <view class="w-[40%]">
            <u-button style="width: 100%; border: none; background: rgb(245, 245, 245); overflow: visible;">
              <u-icon name='trash'></u-icon>
              重置内容
            </u-button>
          </view> -->
          <view class="flex-1">
            <u-button
              type="primary"
              style="width: 100%; overflow: visible"
              @click="submit"
            >
              立即生成
            </u-button>
          </view>
        </view>
      </view>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import list from "@/static/list.js";
import mixis from "../index/mixis";
import {
  listChat,
  fetchChatAPI,
  fetchChatMessageAPI,
  deleteChatMessageById,
} from "@/api";
import { mapMutations, mapGetters, mapActions } from "vuex";
import Avator from "../index/components/Avator.vue";
import mpHtml from "mp-html/dist/uni-app/components/mp-html/mp-html";
import { copyToClip } from "@/utils/copy";
export default {
  components: {
    mpHtml,
    Avator,
  },
  data() {
    return {
      list: list,
      curModel: null,
      content: "",
      repalceArray: [],
      contentArray: [],
      curContent: null,
    };
  },
  mixins: [mixis],
  watch: {
    curModel: function (newVal) {
      if (newVal) {
        const length = newVal.content.split("${").length;
        const regex = /\$\{.*?\}/g;
        const placeholders = newVal.content.match(regex);
        this.repalceArray = placeholders;
        this.contentArray = Array(this.repalceArray.length).fill(null);
      }
    },
  },
  computed: {
    ...mapGetters(["getChatByChatNumber"]),
  },
  onLoad: async function (option) {
    await this.listChatApi();
    console.log(this.$store);
    this.setActive("");
    this.setCurModel(option.id);
  },
  beforeDestroy() {
    this.setActive("");
  },
  methods: {
    async setCurModel(id) {
      this.list.forEach(async (item) => {
        item.model.forEach((model) => {
          if (model.id == id) {
            this.curModel = model;
          }
        });
      });
      let chatObj = this.dataSources.find((item) => item.typeId == this.curModel.id);
      let chatNumber = chatObj ? chatObj.chatNumber : "";
      console.log(this.dataSources, this.curModel, chatObj, "chatNumber");
      this.setActive(chatNumber);
    },
    generaMsg() {
      let content = this.curModel.content;
      let messages = [...this.curModel.elements];
      if (this.curModel.id == 1) {
        messages.forEach((item, index) => {
          item.content = this.contentArray[index];
        });
        if (messages[1]) {
          messages = messages.sort((a, b) => a.sort - b.sort);
        }
        console.log(messages, "sort");
        this.repalceArray.forEach((item, index) => {
          if (index <= 2) {
            content = content.replaceAll(item, messages[0].content || "");
          } else {
            content = content.replaceAll(item, messages[1].content || "");
          }
        });
      } else {
        messages.forEach((item, index) => {
          item.content = this.contentArray[index];
        });
        if (messages[1]) {
          messages.sort((a, b) => a.sort - b.sort);
        }
        this.repalceArray.forEach((item, index) => {
          if (content.indexOf(item)) {
            content = content.replaceAll(item, messages[index].content || "");
          }
        });
      }
      console.log(content, " content");
      this.handleSubmit(content);
    },
    async listChatApi() {
      await listChat().then((res) => {
        this.dataSources = res.data.filter((item) => item.type === "creation");
        console.log(this.dataSources);
      });
    },
    setActive(chatNumber) {
      this.$store.dispatch("setActive", chatNumber);
    },
    async handleSubmit(prompt = "", assistantId = "") {
      let message = prompt;
      console.log(this.$store.state);
      let chatNumber = this.$store.state.chat.active;
      if (this.loading) return;
      // 没有选择助手的时候判断文字
      if (!assistantId) {
        if (!message || message.trim() === "") return;
      }
      const chatData = {
        assistantId: assistantId,
        systemPrompt: message,
        prompt: message,
        type: "creation",
        typeId: this.curModel.id.toString(),
      };
      // 创建会话
      if (!chatNumber) {
        const chatRes = await fetchChatAPI(chatData);
        chatNumber = chatRes.data.chatNumber;
        message = chatRes.data.prompt;
        if (assistantId) {
          // this.prompt = chatRes.data.prompt;
        }
        this.$store.dispatch("setActive", chatNumber);
        await this.$nextTick();
      }
      const messageData = {
        chatNumber: chatNumber,
        model: this.$store.state.chat.model,
        systemPrompt: message,
        prompt: message,
        type: "creation",
        typeId: this.curModel.id.toString(),
      };
      // 发送内容
      const messageRes = await fetchChatMessageAPI(messageData);
      // 流式响应
      this.onConversation(chatNumber, messageRes.data, prompt,"creation",
        this.curModel.id.toString());
    },
    validateRequire() {
      const requiredIndexs = [];
      this.curModel.elements.forEach((item, index) => {
        if (item.required) {
          requiredIndexs.push(index);
        }
      });
      let flag = true;
      console.log(this.contentArray);
      this.contentArray.forEach((item, index) => {
        if (requiredIndexs.includes(index) && (!item || item.length == 0)) {
          flag = false;
        }
      });
      if (!flag) {
        uni.showToast({
          title: "请输入必填项",
          icon: "error",
        });
      }
      return flag;
    },
    // 触发选择助手
    submit() {
      if (!this.validateRequire()) return;

      this.generaMsg();
      // console.log(curContent.value)
      // if(curContent.value.chatNumber) {
      // handleDeleteDebounce(curContent.value.chatNumber)
      // }
    },
    changeOption(index, option, isSigle) {
      if (isSigle) {
        this.contentArray.splice(index, 1, option);
        return;
      }
      console.log(this.contentArray);
      if (!this.contentArray[index]) {
        this.$set(this.contentArray, index, [option]);
      } else if (this.contentArray[index].includes(option)) {
        const idx = this.contentArray[index].findIndex((item) => item == option);
        this.contentArray[index].splice(idx, 1);
      } else {
        this.contentArray[index].push(option);
      }
      console.log(this.contentArray[index]);
    },
    /** 删除会话 */
    // 删除消息
    async handleDelete(index, messageId) {
      if (this.loading) return;
      if (!messageId) return;

      this.$store.dispatch("deleteChatByUuid", {
        active: this.$store.state.chat.active,
        index: index,
      });
      this.$store.dispatch("deleteChatByUuid", {
        active: this.$store.state.chat.active,
        index: index - 1,
      });

      await  deleteChatMessageById(messageId);
      this.notGen = true;
      this.getChatByChatNumber(this.$store.state.chat.active).then((res) => {
        this.chatData = res;
        console.log(this.chatData, "thisthisthis");
      });
    },
    handleDeleteMsg(chatNumber) {
      removeChat(chatNumber).then((res) => {
        console.log(res, "res");
        if (res.code === 200) {
          this.listChatApi();
          uni.showToast({
            title: "删除成功",
            icon: "none",
          });
          this.notGen = true;
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    async copyText(text) {
      console.log(text);
      await copyToClip(text);
      this.$refs.uToast.show({ message: "复制成功" });
    },
  },
};
</script>
<style>
@import url("../../static/chat-sroll.css");
</style>
<style lang="scss" scoped>
.widget-input {
  border-radius: 0.3125rem;
  padding: 0.3125rem 0.625rem;
  flex: 1;
  display: flex;
  align-items: center;
  background-color: var(--color-bg, #f6f6f6);
}

.widget-textarea {
  border-radius: 0.3125rem;
  padding: 0.3125rem 0.625rem;
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  background-color: var(--color-bg, #f6f6f6);
}

::v-deep .u-textarea__count {
  background-color: transparent !important;
}

::v-deep .radio-group {
  display: flex;
  flex-wrap: wrap;

  .radio-item {
    line-height: 2.25rem;
    height: 2.25rem;
    margin-bottom: 0.625rem;
    margin-right: 0.625rem;
    border-radius: 0.4375rem;
    padding: 0 0.9375rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    background-color: var(--color-bg, #f6f6f6);
    color: var(--color-main);
  }

  .radio-item--active {
    background-color: var(--color-primary-light-9, rgb(255, 250, 237));
    color: var(--color-primary, #1890ff);
  }
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

::v-deep .u-textarea {
  background-color: transparent !important;
  border: 0px !important;

  &::after {
    border: 0px;
  }
}

::v-deep .uni-textarea-wrapper {
  height: 100%;
}

::v-deep .u-popup__content {
  height: 100%;
}

::v-deep .uni-tooltip-popup {
  white-space: nowrap;
}
</style>
