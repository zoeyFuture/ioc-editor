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
    canvas: {
      type: Object,
      default: () => ({
        size: {
          width: 1600,
          height: 900
        },
        color: 'black',
        backgroundColor: 'white'
      })
    },

    // 画布居中
    center: {
      type: Boolean,
      default: false
    },

    // 辅助线
    markLine: {
      type: Boolean,
      default: false
    },

    // 组件是否可拖拽
    componentDraggable: {
      type: Boolean,
      default: true
    },

    // 组件是否可操作
    componentOperation: {
      type: Boolean,
      default: true
    },

    // 空容器提示文案
    emptyPlaceholder: {
      type: String,
      default: '请从左侧组件库拖入组件'
    }
  },

  inject: ['mode'],

  provide () {
    return {
      center: this.center,
      markLine: this.markLine,
      emptyPlaceholder: this.emptyPlaceholder,
      componentRender: this.componentRender,
      componentDraggable: this.componentDraggable,
      componentOperation: this.componentOperation
    }
  }
}
</script>
