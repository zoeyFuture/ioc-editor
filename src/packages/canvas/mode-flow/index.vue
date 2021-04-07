<template>
  <div class="ioc-canvas-mask">
    <div :style="canvasStyle" class="ioc-canvas">
      <slot>
        <container-drop :components="components"/>
      </slot>
    </div>
  </div>
</template>

<script>
import ContainerDrop from './container-drop'
export default {
  name: 'ioc-canvas-mode-flow',

  components: {
    ContainerDrop
  },

  props: {
    canvas: {
      type: Object,
      default: () => ({})
    }
  },

  inject: ['iocEditor'],

  computed: {
    canvasStyle () {
      const {
        color,
        backgroundColor,
        backgroundImage,
        size = {}
      } = this.canvas
      const { width, height } = size
      return {
        color,
        backgroundColor,
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${backgroundImage})`
      }
    },

    components () {
      return this.iocEditor.components.filter(item => item.pid === this.pid)
    }
  }
}
</script>
<style scoped lang="less">
.ioc-canvas-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 900;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(229, 233, 237);

  .ioc-canvas {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 375px;
    height: 100%;
    max-height: 680px;
    overflow: auto;
    background-size: cover;
    background-position: center;
  }
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}

</style>
