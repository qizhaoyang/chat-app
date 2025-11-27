<template>
  <view class="h-full flex flex-col">
    <view class="flex-1 min-h-0 bg-white">
      <view class="chat-scroll-view h-full flex flex-col">
        <view class="flex-1 min-h-0">
          <z-paging use-chat-record-mode>
            <view class="" slot="top">
              <!-- <view class="bg-primary flex px-[20rpx] items-center py-[16rpx]"> -->
              <!-- <view class="flex-1 line-clamp-1 min-w-0 text-btn-text">
                  关注公众号，下次访问不迷路！
                </view> -->
              <!-- <navigator url="">
                  <u-button shape='circle' type="primary" style="height: 1.875rem; overflow: visible;">立刻关注</u-button>
                </navigator>
                <view class="text-btn-text ml-[10rpx]">
                  <u-icon name="close"></u-icon>
                </view>
              </view> -->
              <view class="bg-[#333] text-white flex items-center px-[20rpx] py-[24rpx]">
                <u-icon
                  name="list"
                  style="font-size: 1.25rem; font-weight: normal; top: 0px"
                  color="#fff"
                  @click="showHistory"
                ></u-icon>
                <view class="flex-1 line-clamp-1 ml-[20rpx]">
                  {{ curModel ? curModel.name : "" }}
                </view>
                <view class="text-xs flex items-center" @click="setActive('')">
                  <u-icon name="plus-circle" class="mr-[8rpx]" color="#fff"></u-icon>
                  新建
                </view>
              </view>
              <!-- <view class="px-[20rpx] py-[15rpx] text-sm flex items-center bg-white">
                <view class="flex-none mr-[20rpx]">
                  <view class="flex items-center">
                    <u-button
                      :plain="true"
                      type="primary"
                      style="height: 1.875rem; overflow: visible"
                      >月度会员</u-button
                    >
                  </view>
                </view>
              </view> -->
            </view>
            <scroll-view scroll-y="true" class="pb-[20rpx]">
              <view style="transform: scaleY(-1)">
                <view class="chat-record mt-[20rpx] pb-[40rpx]">
                  <view class="chat-record-item" v-for="(item, index) in chatData">
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
                                    @click="handleDelete(index + 1, item.conversationId)"
                                  ></u-icon
                                ></uni-tooltip>
                              </view>
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                    <view class="chat-record-item__right" v-else>
                      <Avator
                        :model="item.model"
                        :inversion="item.inversion"
                        :loading="item.loading"
                      />
                      <view class="min-w-0 flex flex-col mr-2">
                        <view class="chat-record-item__right-content">
                          <view class="">
                            <view class="mb-[20rpx] last-of-type:mb-0">
                              <mpHtml
                                :selectable="true"
                                :show-img-menu="true"
                                :content="item.text"
                                :editable="true"
                                :highlight="true"
                                :markdown="true"
                              >
                              </mpHtml>
                              <u-loading-icon
                                text="生成中..."
                                textSize="28"
                                textColor="white"
                                color="white"
                                style="justify-content: flex-start; color: white"
                                v-if="item.loading"
                              ></u-loading-icon>
                              <!-- <view class="flex justify-end">
                                  <u-icon name="reload"></u-icon>
                                  <u-icon name="@/static/images/copy.png"></u-icon>
                                  <u-icon name="trash"></u-icon>
                                </view> -->
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
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
          </z-paging>
        </view>
      </view>
    </view>

    <u-popup :show="historyShow" @close="close" mode="left">
      <view class="flex flex-col h-full relative z-[9999]">
        <view class="px-[20rpx] py-[20rpx]">
          <u-button type="primary" size="small" @click="setActive('')">
            + 新建会话
          </u-button>
        </view>
        <view class="min-h-0" style="height: calc(100% - 60px)">
          <scroll-view scroll-y="true" class="h-full w-[600rpx] pb-10">
            <view class="px-[20rpx]">
              <view v-for="item in dataSources">
                <view
                  class="px-[20rpx] h-[80rpx] flex items-center rounded-[8rpx] mb-[20rpx] cursor-pointer bg-page"
                  @click="setActive(item.chatNumber)"
                >
                  <u-icon name="chat"></u-icon>
                  <view class="ml-[20rpx] flex-1 min-w-0">
                    <view class="line-clamp-1">
                      {{ item.title }}
                    </view>
                  </view>

                  <view class="cursor-pointer mr-[12rpx] flex h-full">
                    <u-icon
                      name="trash"
                      @click.native.stop="handleDeleteMsg(item.chatNumber)"
                    ></u-icon>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </u-popup>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import mpHtml from "mp-html/dist/uni-app/components/mp-html/mp-html";
import { listChat, removeChat, fetchChatMessageAPI } from "@/api";
import { mapMutations, mapGetters, mapActions } from "vuex";
import mixis from "./mixis.js";
import chat from "../../store/chat.js";
import { copyToClip } from "@/utils/copy";
import Avator from "./components/Avator.vue";
export default {
  components: {
    mpHtml,
    Avator,
  },
  mixins: [mixis],
  data() {
    return {
      title: "Hello",
      dataSources: [],
      historyShow: false,
    };
  },
  computed: {
    ...mapGetters(["getChatByChatNumber"]),
    curModel: function () {
      return (
        this.dataSources.find((item) => item.key === this.$store.state.chat.model) || null
      );
    },
  },
  onLoad(options) {
    console.log(options, "111 console.log(options)");
    this.$store.dispatch("setActive", "");
  },
  onShow(options) {
    console.log(options, " console.log(options)");
    console.log(this.$store);
    if (this.$store.state.chat.curAssistant) {
      const obj = JSON.parse(JSON.stringify(this.$store.state.chat.curAssistant));
      this.$store.dispatch("setActive", "");
      this.$store.dispatch("setCurAssistant", null);

      this.handleSubmit("", obj.id);
    }else {
      this.setActive('')
    }
    console.log(this.$store.state);
  },
  methods: {
    /** 删除会话 */

    handleDeleteMsg(chatNumber) {
      removeChat(chatNumber).then((res) => {
        if (res.code === 200) {
          this.showHistory();
          this.setActive("", true);
          this.$refs.uToast.show({ message: "删除成功" });
        } else {
          this.$refs.uToast.show({ message: res.msg });
        }
      });
    },
    showHistory() {
      this.historyShow = true;
      listChat().then((res) => {
        this.dataSources = res.data.filter((item) => !item.type);
      });
    },

    close() {
      console.log(333);
      this.historyShow = false;
    },
    setActive(chatNumber, bol) {
      if (!this.$store.state.author.token) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
      }
      this.$store.dispatch("setActive", chatNumber);
      if (!bol) {
        this.close();
      }
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
<style lang="scss">
uni-page-body {
  background-color: #fff;
  font-size: 0.875rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: Source Han Sans CN, Helvetica Neue, Arial, sans-serif;
  height: 100%;
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
