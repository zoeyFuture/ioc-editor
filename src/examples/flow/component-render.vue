<template>
  <div class="render">
    <div class="render__header">
      {{component.title}}
    </div>
    <div class="render__content">
      {{component.content}}

      <template v-if="component.containerType > -1">
        <ioc-container-drop
          :pid="component.id"
          :group="`container${component.containerType}`"
          :can-drop="canDrop"
        />
      </template>

    </div>
  </div>
</template>
<script>

import IocContainerDrop from '@/packages/canvas/container-drop'
export default {
  name: 'screen-render',

  components: {
    IocContainerDrop
  },

  props: {
    component: {
      type: Object,
      require: true
    }
  },

  methods: {
    canDrop (group, component) {
      // group 表示当前容器分组
      // component 表示拖入的组件
      const { containerType = -1 } = component
      // 容器1可以放置任何容器和普通组件
      if (group === 'container1') {
        return true
      }
      // 容器2只能放置容器2、容器3和普通组件，不能放置容器1
      if (group === 'container2') {
        return containerType !== 1
      }
      // 容器3只能放置容器2、容器3和普通组件，不能放置容器1
      if (group === 'container3') {
        return containerType === -1
      }
      return true
    }
  }
}
</script>

<style scoped lang="less">
.render {
  width: 100%;
  min-height: 120px;
  display: flex;
  align-self: center;
  justify-content: flex-start;
  flex-direction: column;
  cursor: pointer;
  padding: 4px;
  background-color: #ffffff;

  &__header {
    width: 100%;
    height: 32px;
    line-height: 32px;
  }

  &__content {
    width: 100%;
    flex: 1;
  }
}
</style>
