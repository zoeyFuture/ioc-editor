<template>
  <mode-flow-draggable
    v-if="mode === 'flow'"
    :item="item"
    :draggable="draggable"
  >
    <slot />
  </mode-flow-draggable>
  <mode-position-draggable
    v-else
    :item="item"
    :draggable="draggable"
  >
    <slot />
  </mode-position-draggable>
</template>

<script>
import ModeFlowDraggable from './mode-flow/draggable'
import ModePositionDraggable from './mode-position/draggable'
export default {
  name: 'ioc-draggable',

  components: {
    ModeFlowDraggable,
    ModePositionDraggable
  },

  props: {
    item: {
      type: Object,
      require: true
    },

    draggable: {
      type: Boolean,
      default: () => true
    }
  },

  inject: ['mode', 'iocEditor']
}
</script>
