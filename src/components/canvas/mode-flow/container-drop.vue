<template>
  <smooth-container
    @drop="drop"
    :group-name="groupName"
    class="ioc-flow-container-drop"
    :drop-placeholder="dropPlaceholder"
    :get-child-payload="getChildPayload"
    :should-accept-drop="shouldAcceptDrop"
  >
    <smooth-draggable
      :key="layer.id"
      v-for="layer in layers"
    >
      <container-render :layer="layer"/>
    </smooth-draggable>
  </smooth-container>
</template>
<script>
import { Container, Draggable } from 'vue-smooth-dnd'
import ContainerRender from './container-render'
export default {
  name: 'ioc-flow-container-drop',
  components: {
    SmoothContainer: Container,
    SmoothDraggable: Draggable,
    ContainerRender
  },
  inject: ['iocEditor'],
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
    },
    canDrop: {
      type: Function,
      default: () => true
    }
  },
  data () {
    return {
      dropPlaceholder: {
        showOnTop: false,
        className: 'drop-placeholder'
      }
    }
  },
  methods: {
    getChildPayload (index) {
      return this.layers[index]
    },
    shouldAcceptDrop (srcOptions, payload) {
      return this.canDrop && this.canDrop(this.groupName, payload)
    },
    drop (dropResult) {
      const { addedIndex, removedIndex, payload } = dropResult
      const isAdd = addedIndex !== null
      const isRemove = removedIndex !== null
      if (addedIndex !== removedIndex) {
        if (isAdd && isRemove) {
          // Tips 交换组件位置
          this.iocEditor.swapLayer(
            this.layers[addedIndex],
            this.layers[removedIndex]
          )
        } else if (isAdd) {
          // Tips 拖入组件
          this.iocEditor.addLayer({
            ...payload,
            pid: this.pid
          }, this.layers[addedIndex])
        } else if (isRemove) {
          // Tips 拖出组件
          this.iocEditor.removeLayer(this.layers[removedIndex])
        }
      }
    }
  }
}
</script>

<style scoped>
.ioc-flow-container-drop {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 120px;
}
</style>
