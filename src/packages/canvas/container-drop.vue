<template>
  <mode-flow-container-drop
    v-if="mode === 'flow'"
    :pid="pid"
    :group="group"
    :components="components"
    :can-drop="canDrop"
  />
  <mode-position-container-drop
    v-else
    :pid="pid"
    :group="group"
    :components="components"
  />
</template>
<script>
import ModeFlowContainerDrop from './mode-flow/container-drop'
import ModePositionContainerDrop from './mode-position/container-drop'
export default {
  name: 'ioc-container-drop',

  components: {
    ModeFlowContainerDrop,
    ModePositionContainerDrop
  },

  props: {
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

  inject: ['mode', 'iocEditor'],

  computed: {
    components () {
      return this.iocEditor.components.filter(item => item.pid === this.pid)
    }
  }
}
</script>

<style>
.layer-container {
  width: 100%;
  height: 100%;
  min-height: 120px;
}
.drop-placeholder {
  border: 1px dotted blue;
  box-sizing: border-box;
  background-color: grey;
  opacity: .6;
  border-radius: 2px;
  padding-bottom: 20px;
}
</style>
