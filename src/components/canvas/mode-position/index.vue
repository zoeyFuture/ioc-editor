<template>
  <div
    class="editor-mask"
    @contextmenu.prevent
    @mousedown="handleMouseDown"
    @contextmenu="handleContextMenu"
  >
    <div
      class="editor"
      :style="style"
      @click="handleClick"
    >
      <div class="editor__title">
        <slot name="title">
          {{page.title}}
        </slot>
      </div>
      <container-drop />
      <container-multi-select />
    </div>
  </div>
</template>

<script>
import ContainerDrop from '../container-drop'
import ContainerMultiSelect from './container-multi-select'
export default {
  name: 'ioc-canvas-mode-position',
  components: {
    ContainerDrop,
    ContainerMultiSelect
  },
  inject: [
    'iocEditor'
  ],
  provide () {
    return {
      mode: 'mode-position',
      canvasPosition: this.canvasPosition
    }
  },
  props: {
    page: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      canvasPosition: {
        x: 300 + 30,
        y: 30
      },
      keyCode: undefined,
      layoutLayers: [],
      layoutLayersInfo: {}
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
    }
  },
  methods: {
    handleContextMenu (event) {
      event.preventDefault()
      event.stopPropagation()
      // this.$contextMenu && this.$contextMenu([
      //   {
      //     value: 'clear',
      //     label: '清空数据'
      //   }
      // ]).register(this.handleOption).show(event)
    },
    handleOption (key) {
      if (key === 'clear') {
        this.iocEditor.clearLayers()
      }
    },
    handleMouseDown (event) {
      // this.$contextMenu().close()
      event.stopPropagation()
      const { x, y } = this.canvasPosition
      const move = (moveEvent) => {
        const movementX = moveEvent.pageX - event.pageX
        const movementY = moveEvent.pageY - event.pageY
        this.canvasPosition.x = x + movementX
        this.canvasPosition.y = y + movementY
      }
      const up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },
    handleClick () {
      this.iocEditor.setActive()
    }
  }
}
</script>
<style scoped lang="less">
@navigationBarHeight: 64px;
.editor-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 900;
  background-color: rgb(229, 233, 237);
  overflow: hidden;

  .editor {
    position: relative;
    box-sizing: border-box;
    background-color: #fff;
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
