<template>
  <mode-flow-draggable :item="item" v-if="mode === 'flow'">
    <slot></slot>
  </mode-flow-draggable>
  <mode-position-draggable :item="item" v-else >
    <slot></slot>
  </mode-position-draggable>
</template>

<script>
import ModeFlowDraggable from './mode-flow/draggable'
import ModePositionDraggable from './mode-position/draggable'
export default {
  name: 'ioc-draggable',
  inject: ['mode', 'iocEditor'],
  components: {
    ModeFlowDraggable,
    ModePositionDraggable
  },
  props: {
    item: {
      type: Object,
      require: true
    }
  }
}
</script>
