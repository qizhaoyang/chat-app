<template>
	<view class="me-wrapper pb-[20rpx]">
		<view style="height: 143px;" class="mb-[-70rpx] ">
			<view class="me-info mb-[-70rpx] overflow-visible">
				<view class="flex px-[50rpx] pb-[100rpx] justify-between pt-[40rpx] overflow-visible">
					<navigator url="/page/login/login" class="flex ">
						<view class="flex items-center " style="flex-direction: row;">
							<view class="u-avatar"
								style="height: 3.75rem; width: 3.75rem; flex: 0 0 3.75rem; background-color: transparent; border-radius: 500px;">
								<image class="u-avatar__img" src="/static/images/default_avatar.png"></image>
							</view>
							<view class="text-btn-text text-3xl ml-[20rpx]" v-if="!$store.state.author.token">
								未登录
							</view>
							<view class="text-btn-text ml-[20rpx]" v-else>
								<view class="flex items-center direction-row">
									<view class="text-2xl font-medium">{{$store.state.author.session && $store.state.author.session.name}}</view>
								
								</view>
							
							</view>
						</view>

					</navigator>
				</view>
			</view>
		</view>
		<view>
			<view class="me-vip mx-[20rpx] rounded-lg mb-[20rpx]">
				<view class="p-[30rpx] flex direction-row ">
					<view class="u-image"
						style="width: 2.5rem; height: 2.5rem; border-radius: 0px; overflow: visible; opacity: 1; transition: opacity 0.5s ease-in-out 0s; background-color: transparent;">
						<image src="/static/images/user_vip.png" class="u-image__image" style="border-radius: 0px;">
						</image>
					</view>
					<view class="flex justify-between w-full direction-row flex-shrink ">
						<view class="ml-[20rpx] flex flex-col justify-between">
							<view class="text-[32rpx] text-[#55300F] font-medium">开通会员</view>
							<view class="text-[24rpx] text-[#6A3D15]">畅享无限次数对话，享更多乐趣</view>
						</view>
						<view class="flex flex-col justify-center">
							<button size='mini'
								style="padding: 0px 0.75rem; height: 1.75rem; background: rgb(51, 51, 51); color: rgb(248, 197, 150); overflow: visible;" @click="xufei">立即续费</button>
						</view>
					</view>
				</view>
				<navigator url="/pages/recharge/recharge">
					<view class="bg-white rounded-lg flex p-[30rpx] pr-[24rpx] direction-row">
						<view class="flex-1">
							<view>剩余电量</view>
							<view class="flex mt-[20rpx]">
								<text class="text-primary">{{$store.state.author.session && $store.state.author.session.num}}
								</text>
							</view>
						</view>
						<view class="flex-1">
							<!-- <view>绘画余额</view>
							<view class="flex  mt-[20rpx]">
								<text class="text-primary">0次
								</text>
							</view> -->
						</view>
						<view class="text-muted flex">
							<u-icon name="arrow-right" size="30"></u-icon>
						</view>
					</view>
				</navigator>
			</view>
		</view>
		<view>
			<view class="my-service bg-white mx-[20rpx] mb-[20rpx] rounded-lg">
				<view class="flex flex-wrap pt-[40rpx] pb-[20rpx] direction-row">
					 <!-- <view class="flex flex-col items-center w-1/4 mb-[15px]">
						<view class="u-image"
							style="width: 1.625rem; height: 1.625rem; border-radius: 0px; overflow: visible; opacity: 1; transition: opacity 0.5s ease-in-out 0s; background-color: transparent;">
							<image class="u-image__image" src="/static/images/recharge.png"></image>
						</view>
						<view class="mt-[7px]">
							充值中心
						</view>
					</view> -->
					<view class="flex flex-col items-center w-1/4 mb-[15px]">
						<view class="u-image"
							style="width: 1.625rem; height: 1.625rem; border-radius: 0px; overflow: visible; opacity: 1; transition: opacity 0.5s ease-in-out 0s; background-color: transparent;" @click="xufei">
							<image class="u-image__image" src="/static/images/contact_service.png"></image>
						</view>
						<view class="mt-[7px]">
							联系客服
						</view>
					</view>
				 <view class="flex flex-col items-center w-1/4 mb-[15px]" @click="share">
						<view class="u-image"
							style="width: 1.625rem; height: 1.625rem; border-radius: 0px; overflow: visible; opacity: 1; transition: opacity 0.5s ease-in-out 0s; background-color: transparent;">
							<image class="u-image__image" src="/static/images/share.png"></image>
						</view>
						<view class="mt-[7px]">
							分享得电量
						</view>
					</view>
          <view class="flex flex-col items-center w-1/4 mb-[15px]" @click="logout">
						<view class="u-image"
							style="width: 1.625rem; height: 1.625rem; border-radius: 0px; overflow: visible; opacity: 1; transition: opacity 0.5s ease-in-out 0s; background-color: transparent;">
							<image class="u-image__image" src="/static/images/logout.png"></image>
						</view>
						<view class="mt-[7px]">
							退出登陆
						</view>
					</view>
				</view>
			</view>
		</view>
    <u-modal :show="show" :title="title" :content='content' :showConfirmButton="false" :closeOnClickOverlay="true" @close="show=false"></u-modal>
		<u-action-sheet :show="showModel" :actions="$store.state.chat.models" title="请选择模型" description=""
			@close="showModel = false" @select="modelSelect">
		</u-action-sheet>
	</view>
</template>

<script>
import {copyToClip} from '@/utils/copy'
	export default {
		data() {
			return {
				showModel: false,
				session: '',
        show: false,
        content: '客服微信：13021265855',
        title: '联系客服'
			};
		},
    onLoad() {
      const token = this.$store.state.author.token
      console.log(token,'tltlll')
      if(!token) {
        uni.navigateTo({
          url: '/pages/login/login'
        })
      }
    },
    onShow() {
      this.$store.dispatch('getSession')
    },
		methods: {
			modelSelect(value) {
				this.$store.dispatch('setModel', value.key)
			},
      xufei() {
        this.show = true
      },
      share() {
        copyToClip('https://www.gongyoulaowubang.cn/chat-mobile/#/pages/login/login?share=' + this.$store.state.author.session.id)
        uni.showToast({
          icon: 'none',
          title: '复制成功'
        })
      },
      logout() {
        this.$store.dispatch('removeToken')
        uni.showToast({
          icon: 'none',
          title: '退出成功'
        })
        uni.navigateTo({
		  	url:'/pages/login/login'
		  })
      }
      
		}
	}
</script>

<style lang="scss">
	.me-wrapper {
		.me-info {
			background: linear-gradient(90deg, var(--color-primary, #FFC244), var(--color-minor, #FFB814));
			background-repeat: no-repeat;
			background-position: bottom;
			background-size: 100%;
			overflow: visible !important;

			.u-avatar__img {
				width: 100%;
				height: 100%;
			}
		}

		.me-vip {
			background: linear-gradient(90deg, #ffe8cf 0%, #ffe8cf 20%, #e1ab7a 100%);

		}



	}
</style>