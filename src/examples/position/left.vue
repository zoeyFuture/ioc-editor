<template>
  <ioc-editor-left>
    <div class="left">
      <ioc-draggable
        v-for="item in items"
        :key="item.id"
        :item="item"
        class="left-item"
      >
        {{item.title}}
      </ioc-draggable>
    </div>
  </ioc-editor-left>
</template>
<script>
import IocEditorLeft from '@/packages/left'
import IocDraggable from '@/packages/left/draggable'
export default {
  name: 'left',

  components: {
    IocEditorLeft,
    IocDraggable
  },

  data () {
    return {
      items: [
        {
          id: 1,
          title: '组件1',
          init: () => {
            return {
              title: '组件1',
              id: Date.now(),
              size: {
                width: 180,
                height: 180
              }
            }
          }
        },
        {
          id: 2,
          name: '组件2',
          title: '组件2',
          init: () => {
            return {
              title: '组件2',
              id: Date.now(),
              size: {
                width: 240,
                height: 200
              }
            }
          }
        },
        {
          id: 3,
          title: '组件3',
          init: () => {
            return {
              title: '组件3',
              id: Date.now(),
              size: {
                width: 320,
                height: 220
              }
            }
          }
        }
      ]
    }
  }
}
</script>

<style lang="less">
.left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 10px;

  .left-item {
    cursor: pointer;
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: 1px solid red;
    margin: 0 10px;
  }
}
</style>
