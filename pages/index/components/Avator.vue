<!--
 * @Description: 
 * @Author: qi zhaoyang
 * @Date: 2024-04-02 14:59:33
 * @LastEditTime: 2024-06-19 15:34:57
 * @LastEditors: qi zhaoyang
 * @FilePath: \chat\chat-phone\pages\index\components\Avator.vue
-->
<template>
 <div class="avatar" v-if="inversion">
    <img :src="avatar" alt="" style="width: 32px;height: 32px;border-radius: 50%;">
 </div>
 <div v-else class="text-[28px] dark:text-white" :class="[loading ? 'rotate-center' : '']">
  <img :src="logo" alt="" style="width: 32px;height: 32px;border-radius: 50%;">
  
 </div>
</template>
<script>
import defaultAvatar from '@/static/images/avatar.png'
import logo from '@/static/images/logo.png'
export default {
  props: ['inversion','loading','model'],
  data() {
    return {

    }
  },
  computed: {
    avatar: function() {
      return this.$store.state.author.session && this.$store.state.author.session.avatar ? this.$store.state.author.session.avatar : defaultAvatar
    },
    logo:function() {
      return logo
    }
  },
  onLoad() {

  }
}
</script>
<style lang="scss" scoped>
.rotate-center {
  -webkit-animation: rotate-center 1.5s linear infinite;
  animation: rotate-center 1.5s linear infinite;
}

/**
 * ----------------------------------------
 * animation rotate-center
 * ----------------------------------------
 */
@-webkit-keyframes rotate-center {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes rotate-center {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>