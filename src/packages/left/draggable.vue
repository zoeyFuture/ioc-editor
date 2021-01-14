<template>
  <mode-flow-draggable
    v-if="mode === 'flow'"
    :item="item"
  >
    <slot />
  </mode-flow-draggable>
  <mode-position-draggable
    v-else
    :item="item"
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
    }
  },

  inject: ['mode', 'iocEditor']
}
</script>
