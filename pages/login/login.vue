<template>
	<view class="h-full flex flex-col">
		<view class="flex flex-col items-center pt-[160rpx] pb-[40rpx]">
			<image src="../../static/images/logo.png" mode=""
				class="w-[160rpx] h-[160rpx]"></image>
			<view class="text-[32rpx] font-medium my-[30rpx]">Coco AI</view>
			<view class="w-full px-[75rpx] pt-[60rpx]"><!--v-if-->
				<view>
					<view class="mb-[60rpx]">
						<u-form>
							<u-form-item borderBottom leftIcon="../../static/images/icon_mobile.png">
								<!-- <u-icon  size="40" name="/static/images/icon_mobile.png"></u-icon> -->
								<u--input border="none" class="flex-1"
									style="padding: 0px; border-color: rgb(220, 223, 230); text-align: left;"
									placeholder="请输入手机号码" v-model="loginValue.tel"></u--input>
							</u-form-item>
							<u-form-item borderBottom leftIcon="../../static/images/icon_password.png">
								<u--input border="none" class="flex-1" suffixIcon="eye"
									suffixIconStyle="color: #909399;font-size:20px"
									type="password"
									style="padding: 0px; border-color: rgb(220, 223, 230); text-align: left;"
									placeholder="请输入密码" v-model="loginValue.password"></u--input>
								<!-- <navigator url="pages/forget_pwd/forget_pwd?type=2">
									<view
										class="border-l border-solid border-0 border-light pl-3 text-muted leading-4 ml-3">
										忘记密码？
									</view>
								</navigator> -->
							</u-form-item>
						</u-form>

					</view>
					<view class="mb-[40rpx]">
						<view class="agreement">
							<view class="flex">
								<u-checkbox-group v-model="loginValue.checked">
									<u-checkbox  shape="circle"
										 size="24" label="" name="circle">
									</u-checkbox>
								</u-checkbox-group>
								<view class="text-xs flex"> 未注册手机号将自动注册。勾选即代表您阅读并同意</view>
                
							</view>
              <view class="flex"><view>
									<navigator url="/pages/content/content"
											class="text-primary">《用户协议》</navigator>
								</view> 和
								<view>
										<navigator url="/pages/yinsi/yinsi"
											class="text-primary">《隐私协议》</navigator>
								</view></view>
              
						</view>
					</view>
					<u-button type="primary" style="overflow: visible;" :loading="loading" loading-text="登录中..." @click="handleVerify"> 登 录 <!--v-if--></u-button>
					<!-- <view class="text-content flex justify-between mt-[40rpx]"> -->
						<!-- <view class="flex-1">
							<view> 手机验证码登录 </view>
						</view>
						<navigator url="/packages/pages/register/register?type=2" class="text-primary">注册账号</navigator>
					</view> -->
				</view><!--v-if-->
			</view>
			<a href="https://beian.miit.gov.cn/" target="_blank" style="position: fixed;bottom: 10px;left: 50%;transform: translateX(-50%);">冀ICP备2022029014号-3</a>
		</view>
		
	</view>
</template>

<script>
	import {
		fetchVerify
	} from '@/api'
	export default {
		data() {
			return {
				loading: false,
				loginValue: {
					tel: '',
					password: '',
					checked: ['circle'],
					loginType: 3
				},
        share: null
			}
		},
		onLoad(options) {
      const token = this.$store.state.author.token
      console.log(token,'tltlll')
      console.log(options,options.share,'optionsoptions')
      if(options.share) {
        this.share = options.share
      }
      console.log(this)
      if(token) {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
		},
		methods: {
			handleVerify() {
				console.log(this.loginValue.tel)
				if(!/^[1][3456789]\d{9}$/.test(this.loginValue.tel) || !this.loginValue.tel) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: 'none'
					})
					return
				}
				if(!this.loginValue.password) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
					return
				}
        if(!/^(?=^.*?[a-z])(?=^.*?\d).{6,32}$/.test(this.loginValue.password)) {
          uni.showToast({
						title: '请输入6-32位包含字母和数字的密码',
						icon: 'none'
					})
					return
        }
				console.log(this.loginValue.checked)
				if(!this.loginValue.checked[0]) {
					uni.showToast({
						title: '请勾选“用户协议与隐私政策”',
							icon: 'none'
					})
					return
				}
				this.loading = true
        console.log(this.share,this,'thosa')
				 fetchVerify({
					...this.loginValue,
					checked: true,
          code: this.share
				}).then(res => {
					console.log(res,'res')
					if (res.code === 200) {
						console.log(this.$store)
						this.$store.dispatch('setToken',res.data.token)
						uni.showToast({
							title: '登陆成功',
							icon:"success"
						})
						uni.switchTab({
							url: '/pages/index/index'
						})
					} else {
						uni.showToast({
							title: '登陆失败',
							icon:"error"
						})
					}
					this.loading = false
				})
			}
		}
	}
</script>

<style>
	uni-page-body {
		height: 100%;
		background-color: #fff;
	}
</style>