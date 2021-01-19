<template>
  <ioc-editor-left>
    <div class="left">
      <div clas="group">
        <div class="group__header">
          容器
        </div>
        <div class="group__content">
          <ioc-draggable
            v-for="(container, i) in containers"
            :key="i"
            :item="container"
          >
            <div class="material">
              {{container.title}}
            </div>
          </ioc-draggable>
        </div>
      </div>
      <div clas="group">
        <div class="group__header">
          组件
        </div>
        <div class="group__content">
          <ioc-draggable
            v-for="item in items"
            :key="item.id"
            :item="item"
            class="material"
          >
            {{item.title}}
          </ioc-draggable>
        </div>
      </div>
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
      containers: [
        {
          title: '容器1',
          content: '容器1可以拖入任何容器',
          containerType: 1
        },
        {
          title: '容器2',
          content: '容器2只能拖入容器2和容器3',
          containerType: 2
        },
        {
          title: '容器3',
          content: '容器3只能拖入组件',
          containerType: 3
        }
      ],
      items: [
        {
          title: '组件1',
          content: '哈哈哈，我是组件1'
        },
        {
          title: '组件2',
          content: '哈哈哈，我是组件2'
        },
        {
          title: '组件3',
          content: '哈哈哈，我是组件3',
          init: () => {
            return {
              title: '组件3',
              id: Date.now(),
              content: '哈哈哈，我是初始化之后的组件3'
            }
          }
        }
      ]
    }
  }
}
</script>

<style scoped lang="less">
.left {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding: 20px 10px;

  .group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    margin: 10px 0;

    &__header {
      height: 32px;
      line-height: 32px;
    }
    &__content {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;

      .material {
        cursor: pointer;
        color: white;
        width: 72px;
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        background-color: gray;
      }
    }
  }

}
</style>
