<template>
  <mode-flow-container-drop
    :pid="pid"
    :layers="layers"
    :group-name="groupName"
    :can-drop="canDrop"
    v-if="mode === 'flow'"
  />
  <mode-position-container-drop
    v-else
    :pid="pid"
    :layers="layers"
    :group-name="groupName"
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
  inject: ['mode', 'iocEditor'],
  props: {
    pid: {
      type: [Number, String],
      default: () => undefined
    },
    groupName: {
      type: String,
      default: () => 'container'
    },
    page: {
      type: Array,
      default: () => ({})
    },
    canDrop: {
      type: Function,
      default: () => true
    }
  },
  computed: {
    layers () {
      return this.iocEditor.layers.filter(item => item.pid === this.pid)
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
