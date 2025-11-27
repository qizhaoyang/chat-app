import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import uView from '@/uni_modules/uview-ui'
import Vuex from 'vuex'
import store from './store/index.js'
// 如此配置即可
uni.$u.config.unit = 'rpx'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.use(uView)
Vue.use(Vuex)
const app = new Vue({
  ...App,
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif