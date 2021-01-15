<template>
  <mode-flow v-if="mode === 'flow'" :canvas="canvas">
    <slot />
  </mode-flow>
  <mode-position v-else :canvas="canvas">
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

    // 画布配置
    canvas: Object
  },

  inject: ['mode'],

  provide () {
    return {
      componentRender: this.componentRender
    }
  }

}
</script>
