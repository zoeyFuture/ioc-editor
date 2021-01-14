<template>
  <div
    class="ioc-canvas-mask"
    @contextmenu.prevent
    @mousedown.stop="handleMouseDown"
  >
    <div
      :style="style"
      class="ioc-canvas"
      @click="handleClick"
    >
      <div class="ioc-canvas__title">
        <slot name="title">
          {{page.title}} ({{canvasPosition.x}},{{canvasPosition.y}})
        </slot>
      </div>
      <container-drop :components="components"/>
      <container-multi-select />
      <container-operator-mark-line/>
    </div>
  </div>
</template>

<script>
import ContainerDrop from '../container-drop'
import ContainerMultiSelect from './container-multi-select'
import ContainerOperatorMarkLine from './container-operator-mark-line'
export default {
  name: 'ioc-canvas-mode-position',

  components: {
    ContainerDrop,
    ContainerMultiSelect,
    ContainerOperatorMarkLine
  },

  props: {
    page: {
      type: Object,
      default: () => ({})
    }
  },

  inject: ['iocEditor'],

  provide () {
    return {
      mode: 'position',
      canvasPosition: this.canvasPosition
    }
  },

  data () {
    return {
      canvasPosition: {
        x: 300 + 30,
        y: 30
      }
    }
  },

  computed: {
    style () {
      const { scale } = this.iocEditor
      const { x, y } = this.canvasPosition
      const { color, backgroundImage, backgroundColor, size: { width, height } } = this.page
      return {
        color,
        top: `${y}px`,
        left: `${x}px`,
        backgroundColor,
        width: `${width}px`,
        height: `${height}px`,
        transform: `scale(${scale},${scale})`,
        backgroundImage: `url(${backgroundImage})`
      }
    },

    components () {
      return this.iocEditor.components.filter(item => item.pid === this.pid)
    }
  },

  methods: {
    handleMouseDown (event) {
      const { x, y } = this.canvasPosition
      const mouseMove = (mouseMoveEvent) => {
        const movementX = mouseMoveEvent.pageX - event.pageX
        const movementY = mouseMoveEvent.pageY - event.pageY
        this.canvasPosition.x = x + movementX
        this.canvasPosition.y = y + movementY
      }
      const mouseUp = () => {
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseUp)
      }
      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', mouseUp)
    },

    handleClick () {
      this.iocEditor.setSelect()
    }
  }
}
</script>
<style scoped lang="less">
@navigationBarHeight: 64px;
.ioc-canvas-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 900;
  background-color: rgb(229, 233, 237);
  overflow: hidden;

  .ioc-canvas {
    position: relative;
    box-sizing: border-box;
    background-color: #fff;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    -moz-transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
    -o-transform-origin: 0 0;
    width: 1920px;
    height: 100%;

    &__title {
      width: 100%;
      height: 20px;
      line-height: 20px;
      color: #0000004D;
      font-size: 14px;
      background-color: transparent;
      position: absolute;
      top: -24px;
      left: 0;
    }

    &__title {
      width: 100%;
      height: 20px;
      line-height: 20px;
      color: #0000004D;
      font-size: 14px;
      background-color: transparent;
      position: absolute;
      top: -24px;
      left: 0;
    }

    &__content {
      width: 100%;
      height: 100%;
      background: transparent;

      .empty {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .icon {
          width: 156px;
          height: 100px;
        }

        label {
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
