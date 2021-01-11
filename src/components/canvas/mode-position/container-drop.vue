<template>
  <div
    @drop="drop"
    @dragover="dragOver"
    :group-name="groupName"
    class="ioc-container-drop"
    :class="{ 'empty': layers.length === 0 }"
  >
    <template v-if="layers.length > 0">
      <container-operator
        :layer="layer"
        :key="layer.id"
        v-for="layer in layers"
      >
        <container-render :layer="layer" />
      </container-operator>
    </template>
    <template v-else>
      <div class="empty">
        <i class="icon icon-editor-empty" />
        <label>请从左侧拖入控件来创建图层</label>
      </div>
    </template>
  </div>
</template>
<script>
import ContainerRender from '../container-render'
import ContainerOperator from './container-operator'
export default {
  name: 'ioc-container-drop',
  components: {
    ContainerRender,
    ContainerOperator
  },
  inject: [
    'iocEditor',
    'canvasPosition'
  ],
  props: {
    layers: {
      type: Array,
      default: () => []
    },
    pid: {
      type: Number,
      default: () => undefined
    },
    groupName: {
      type: String,
      default: () => 'container'
    }
  },
  methods: {
    drop (event) {
      event.preventDefault()
      event.stopPropagation()
      const { pageX, pageY } = event
      const item = JSON.parse(event.dataTransfer.getData('item'))
      this.iocEditor.addLayer({
        ...item,
        pid: this.pid,
        zIndex: this.iocEditor.layers.length,
        position: {
          x: pageX - this.canvasPosition.x,
          y: pageY - this.canvasPosition.y - 54
        }
      })
    },
    dragOver (event) {
      event.preventDefault()
      event.stopPropagation()
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

  label {
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    margin-top: 20px;
  }
}
</style>
