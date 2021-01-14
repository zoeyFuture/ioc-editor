<template>
  <mode-flow
    v-if="mode === 'flow'"
    :page="page"
  >
    <slot />
  </mode-flow>
  <mode-position
    v-else
    :page="page"
  >
    <slot />
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
  props: {
    // 自定义的渲染组件
    componentRender: {
      type: Object,
      require: true
    },

    page: {
      type: Object,
      default: () => ({})
    }
  },

  inject: ['mode'],

  provide () {
    return {
      componentRender: this.componentRender
    }
  }

}
</script>
