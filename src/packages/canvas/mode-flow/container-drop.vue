<template>
  <smooth-container
    :group-name="group"
    :drop-placeholder="dropPlaceholder"
    :get-child-payload="getComponent"
    :should-accept-drop="handleAcceptDrop"
    class="ioc-flow-container-drop"
    @drop="handleDrop"
  >
    <smooth-draggable
      v-for="component in components"
      :key="component.id"
    >
      <container-render :component="component"/>
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
    },

    canDrop: {
      type: Function,
      default: () => () => true
    }
  },

  inject: ['iocEditor'],

  data () {
    return {
      dropPlaceholder: {
        showOnTop: false,
        className: 'drop-placeholder'
      }
    }
  },

  methods: {
    getComponent (index) {
      return this.components[index]
    },

    handleAcceptDrop (srcOptions, source) {
      return this.canDrop && this.canDrop(this.group, source)
    },

    handleDrop (dropResult) {
      const { addedIndex, removedIndex, payload } = dropResult
      const isAddComponent = addedIndex !== null
      const isRemoveComponent = removedIndex !== null
      if (addedIndex !== removedIndex) {
        if (isAddComponent && isRemoveComponent) {
          // 交换组件
          this.iocEditor.swapComponent(
            this.components[addedIndex],
            this.components[removedIndex]
          )
        } else if (isAddComponent) {
          // 放置组件
          this.iocEditor.addComponent(
            {
              ...payload,
              pid: this.pid
            },
            this.components[addedIndex]
          )
        } else if (isRemoveComponent) {
          // 移出组件
          this.iocEditor.removeComponent(this.components[removedIndex].id)
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
