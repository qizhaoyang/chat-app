<!--
 * @Description: 
 * @Author: qi zhaoyang
 * @Date: 2024-03-28 14:58:51
 * @LastEditTime: 2024-04-09 15:42:40
 * @LastEditors: qi zhaoyang
 * @FilePath: \chat\chat-phone\pages\creation\creation.vue
-->
<template>
  <view class="creation h-full">
    <view class="flex-1 min-h-0">
      <scroll-view scroll-y="true" class="h-full">
      <view class="py-[14rpx] px-[30rpx]">
        <view class="u-search" style="margin: 0px;">
          <view class="u-content"
            style="background-color: rgb(255, 255, 255); border-radius: 3.125rem; height: 2.25rem;">
            <view class="u-icon-wrap">
              <u-icon type="search" size="20"></u-icon>
            </view>
            <input type="text" class="uni-input" placeholder="请输入关键词搜索" v-model="searchVal" />
          </view>
        </view>
      </view>
      <view class="px-[30rpx]">
        <u-tabs :list="tabs" lineWidth="20" lineHeight="7" :lineColor="`url(${lineBg}) 100% 100%`" :activeStyle="{
              color: '#303133',
              fontWeight: 'bold',
              transform: 'scale(1.05)'
            }" :inactiveStyle="{
              color: '#606266',
              transform: 'scale(1)'
            }" @click="tabClick"></u-tabs>
        <template v-if="curList.length">
          <view class="w-full px-[10rpx] mb-[20rpx]" v-for="model in curList" @click="navigat(model)">
            <view class="rounded-[16rpx] py-[24rpx] h-full w-full">
              <navigator url="pages/create/create?id=40">
                <view class="flex w-full direction-row">
                  <view class="u-image flex-none"
                    style="width: 2.375rem; height: 2.375rem; border-radius: 0px; overflow: visible; opacity: 1; transition: opacity 0.5s ease-in-out 0s; background-color: transparent;">
                    <image :src="model.image" class="u-image__image"></image>
                  </view>
                  <view class="ml-[14rpx] flex flex-col justify-around min-w-0 flex-1">
                    <view class="font-medium text-[30rpx]">{{ model.name }}</view>
                    <view class="text-[24rpx] text-[#666666] truncate"><text class="truncate">{{ model.tips }}</text>
                    </view>
                  </view>
                </view>
              </navigator>
            </view>
          </view>
        </template>
        <u-empty mode="list" class="w-full h-full px-[10rpx] mb-[20rpx]" icon="http://cdn.uviewui.com/uview/empty/list.png" text="暂无内容">
        </u-empty>
      </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import list from '@/static/list.js'
const lineBg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII=";
export default {
  data() {
    return {
      list: list,
      lineBg: lineBg,
      modelId: -1,
      searchVal: '',
      
    };
  },
  computed: {
    tabs: function () {
      let list = [{ id: -1, name: '全部' }]
      return list.concat(this.list.map(item => {
        return { id: item.id, name: item.name }
      }))
    },
    curList: function () {
      if (this.modelId === -1) {
        return this.list.map((item) => item.model).flat().filter(item => {
          if (this.searchVal) {
            return item.name.includes(this.searchVal)
          } else {
            return true
          }
        })
      } else {
        return this.list.find((item) => item.id == this.modelId).model.filter(item => {
          if (this.searchVal) {
            return item.name.includes(this.searchVal)
          } else {
            return true
          }
        })
      }
    },
  },
  
  methods: {
    navigat(model) {
      uni.navigateTo({
        url: `/pages/create/create?id=${model.id}`
      })
    },
    tabClick(item) {
      this.modelId = item.id
    }
  }
}
</script>

<style lang="scss">
.creation {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(44.7deg, #eaffff 0%, #faf6ff 50%, #f2f3ff 63%, #eaffff 100%);
  background-size: cover;

  .u-search {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
    flex-direction: row;

    .u-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 0.5625rem;
      flex: 1;
    }
  }
}
uni-page-body {
		height: 100%;
		background-color: #fff;
	}
</style>