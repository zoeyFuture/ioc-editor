<template>
  <div class="ioc-canvas-mask">
    <div class="ioc-canvas">
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

  inject: ['iocEditor'],

  computed: {
    components () {
      return this.iocEditor.components.filter(item => item.pid === this.pid)
    }
  }
}
</script>
<style scoped>
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
}

.ioc-canvas {
  position: relative;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 375px;
  height: 100%;
  max-height: 680px;
  overflow: auto;
}

::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}
</style>
