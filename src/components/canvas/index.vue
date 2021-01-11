<template>
  <mode-flow v-if="mode === 'flow'" :page="page">
    <slot></slot>
  </mode-flow>
  <mode-position v-else :page="page">
    <slot></slot>
  </mode-position>
</template>
<script>
import ModeFlow from './mode-flow'
import ModePosition from './mode-position'
export default {
  name: 'ioc-canvas',
  components: {
    ModeFlow,
    ModePosition
  },
  inject: ['mode'],
  provide () {
    return {
      render: this.render
    }
  },
  props: {
    page: {
      type: Object,
      default: () => ({})
    },
    render: {
      type: String,
      default: () => 'render'
    }
  }
}
</script>
