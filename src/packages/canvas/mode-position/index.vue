<template>
  <div
    class="ioc-canvas-mask"
    @contextmenu.prevent
    @mousedown.stop="handleMouseDown"
  >
    <div
      id="ioc-canvas"
      :style="canvasStyle"
      class="ioc-canvas"
      @click="handleClick"
    >
      <div class="ioc-canvas__title">
        <slot name="title">
          {{canvas.title}}
        </slot>
      </div>
      <container-drop :components="components"/>
      <container-multi-select />
      <container-operator-mark-line v-if="markLine"/>
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
    canvas: {
      type: Object,
      default: () => ({})
    }
  },

  inject: [
    'iocEditor',
    'center',
    'markLine'
  ],

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

  watch: {
    center: {
      handler (val) {
        if (val) {
          const { size: { width = 1600, height = 900 } } = this.canvas
          this.canvasPosition = {
            x: window.innerWidth / 2 - width / 2,
            y: window.innerHeight / 2 - height / 2
          }
        }
      },
      immediate: true
    }
  },

  computed: {
    canvasStyle () {
      const { scale } = this.iocEditor
      const { x, y } = this.canvasPosition
      const {
        color = 'white',
        backgroundImage,
        backgroundColor = 'gray',
        size = {}
      } = this.canvas
      const { width = 1600, height = 900 } = size
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
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    -moz-transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
    -o-transform-origin: 0 0;
    background-size:100% 100%;
    background-repeat:no-repeat;
    background-position:center;

    &__title {
      width: 100%;
      height: 20px;
      line-height: 20px;
      color: currentColor;
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
