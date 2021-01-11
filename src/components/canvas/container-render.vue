<template>
  <mode-flow-container-render :layer="layer" v-if="mode === 'flow'"/>
  <mode-position-container-render :layer="layer" v-else />
</template>
<script>
import ModeFlowContainerRender from './mode-flow/container-render'
import ModePositionContainerRender from './mode-position/container-render'
export default {
  name: 'ioc-container-render',
  components: {
    ModeFlowContainerRender,
    ModePositionContainerRender
  },
  inject: ['mode'],
  props: {
    layer: {
      type: Object,
      require: true
    }
  }
}
</script>
