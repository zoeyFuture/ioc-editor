<template>
  <div
    :class="{ 'empty': components.length === 0 }"
    class="ioc-container-drop"
    @dragover.stop.prevent
    @drop.stop.prevent="handleDrop"
  >
    <template v-if="components.length > 0">
      <container-operator
        v-for="component in components"
        :key="component.id"
        :component="component"
      >
        <container-render :component="component" />
      </container-operator>
    </template>

    <template v-else>
      <div class="empty">
        <i class="icon icon-editor-empty" />
        <label class="empty__tips">请从左侧拖入组件</label>
      </div>
    </template>
  </div>
</template>

<script>
import ContainerOperator from './container-operator'
import ContainerRender from './container-render'
export default {
  name: 'ioc-container-drop',

  components: {
    ContainerOperator,
    ContainerRender
  },

  props: {
    components: {
      type: Array,
      default: () => []
    },

    pid: {
      type: Number,
      default: () => undefined
    },

    group: {
      type: String,
      default: () => 'container'
    }
  },

  inject: [
    'canvasPosition',
    'iocEditor'
  ],

  computed: {
    isEmpty () {
      return this.components.length === 0
    },
    zIndex () {
      return this.components.length
    }
  },

  methods: {
    handleDrop (event) {
      const { pageX, pageY } = event
      const item = JSON.parse(event.dataTransfer.getData('item'))
      this.iocEditor.addComponent({
        ...item,
        pid: this.pid,
        zIndex: this.zIndex,
        position: {
          x: pageX - this.canvasPosition.x,
          y: pageY - this.canvasPosition.y - 54
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.ioc-container-drop {
  width: 100%;
  height: 100%;
  min-height: 120px;
}

.empty {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .icon {
    width: 156px;
    height: 100px;

    background-image: url('../../../assets/image/icon-editor-empty.png');
    background-position: center;
    background-size: cover;
  }

  &__tips {
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    margin-top: 20px;
  }
}
</style>
