<!--
 * @Description: 
 * @Author: qi zhaoyang
 * @Date: 2024-03-28 14:58:21
 * @LastEditTime: 2024-06-18 18:16:40
 * @LastEditors: qi zhaoyang
 * @FilePath: \chat\chat-phone\App.vue
-->
<script>
import { fetchModel } from '@/api'

export default {
  onLaunch: function () {
    this.setModel()
  },
  onShow: function () {
    this.setModel()
    console.log(this.$route,'dsfdfd')
    // if(this.$route.path != '/pages/login/login') {
    //   this.$store.dispatch('getSession')
    // }
	  
  },
  watch: {
    '$store.state.author.token': function(newVal) {
      this.setModel()
    }
  },
  onHide: function () {
    console.log('App Hide')
  },
  methods: {
    setModel() {
      if(!this.$store.state.author.token) return
      if (!this.$store.state.chat.model) {
        fetchModel().then((res) => {
          console.log(res,'options33333')
          const options = res.data.map(model => {
            const option = {
              label: model.name,
              key: model.model,
              name: model.name,
              props: {}
            }
            if (option.key === this.$store.state.chat.model) {
              option.props = {
                style: { backgroundColor: theme.value == 'light' ? '#F3F3F5' : '#767C82' }
              }
            }
            return option;
          })
        
            this.$store.dispatch('setModel', options[0].key)
            this.$store.dispatch('setModels', options)
          
        })
      }
    }
  }
}
</script>

<style>
@import url("static/global.css");
/*每个页面公共css */
</style>
