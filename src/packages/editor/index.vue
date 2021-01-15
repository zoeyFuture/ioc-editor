<template>
  <div class="ioc-editor">
    <div class="ioc-editor__header">
      <slot name="header" />
    </div>
    <div class="ioc-editor__content">
      <slot name="left" />
      <slot name="canvas">
        <ioc-canvas />
      </slot>
      <slot name="right" />
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import NP from 'number-precision'
import Canvas from '../canvas'
export default {
  name: 'ioc-editor',

  components: {
    IocCanvas: Canvas
  },

  model: {
    prop: 'editor',
    event: 'change'
  },

  props: {
    // 画布模式：flow position
    mode: {
      type: String,
      require: true
    },

    // 是否启用辅助线
    enableMarkLine: {
      type: Boolean,
      default: () => false
    },

    editor: {
      type: Object,
      default: () => ({})
    }
  },

  provide () {
    return {
      iocEditor: this,
      mode: this.mode,
      selectComponent: this.selectComponent,
      enableMarkLine: this.enableMarkLine,
      updateComponent: this.updateComponent
    }
  },

  data () {
    return {
      scale: 1, // 缩放比例
      keyCode: undefined,
      past: [], // 上一步
      future: [], // 下一步
      components: [],
      select: undefined,
      multiSelect: [],
      multiSelectInfo: {}
    }
  },

  watch: {
    multiSelect (multiSelect) {
      if (this.mode === 'position') {
        this.multiSelectInfo = multiSelect.reduce((result, id) => {
          const component = this.components.find(item => id === item.id)
          if (component) {
            const { id, position: { x, y }, size: { width, height } } = component
            result[id] = {
              id,
              position: { x, y },
              size: { width, height }
            }
          }
          return result
        }, {})
      }
    },

    editor (newEditor) {
      this.components = newEditor.components || []
    }
  },

  computed: {
    canUndo () {
      return this.past.length > 0
    },
    canRedo () {
      return this.future.length > 0
    },
    selectComponent () {
      if (this.select) {
        return this.components.find(component => component.id === this.select)
      }
      return undefined
    }
  },

  mounted () {
    this.emitChange()
    // this.adaptScreen()
  },

  methods: {
    emitChange () {
      this.$emit('change', {
        components: this.components,
        iocEditor: this
      })
    },
    // 适配屏幕
    adaptScreen (screenWidth = 1920, screenHeight = 1200) {
      const clientWidth = document.body.clientWidth
      const clientHeight = document.body.clientHeight
      const widthScale = NP.divide(clientWidth, screenWidth)
      const heightScale = NP.divide(clientHeight, screenHeight)
      const scale = NP.round(widthScale > heightScale ? heightScale : widthScale, 1)
      this.setScale(scale)
    },
    setKeyCode (keyCode) {
      this.keyCode = keyCode
    },
    setScale (scale) {
      this.scale = scale
    },
    setSelect (id) {
      this.select = id
    },
    setMultiSelect (multiSelect = []) {
      this.multiSelect = multiSelect
    },
    addMultiSelect (id) {
      if (this.select && !this.multiSelect.includes(this.select)) {
        this.multiSelect.push(this.select)
      }

      if (!this.multiSelect.includes(id)) {
        this.multiSelect.push(id)
      }
    },
    removeMultiSelect (id) {
      this.multiSelect = this.multiSelect.filter(item => item !== id)
    },
    setMultiSelectInfo (multiSelectInfo) {
      this.multiSelectInfo = multiSelectInfo
    },

    syncMultiSelectInfo () {
      this.setPrev()
      this.components.forEach(component => {
        const info = this.multiSelectInfo[component.id]
        if (info) {
          component.position = info.position
        }
      })
      // 清空数据
      this.multiSelect = []
      this.multiSelectInfo = {}
    },

    setComponents (components = []) {
      this.components = cloneDeep(components)
      this.emitChange()
    },

    addComponent (component, source) {
      this.setPrev()
      if (source) {
        const sourceIndex = this.components.findIndex(component => component.id === source.id)
        if (sourceIndex > -1) {
          this.components.splice(sourceIndex, 0, component)
        }
      } else {
        this.components.push(component)
      }
      this.emitChange()
      this.setSelect(component.id)
      this.setMultiSelect([component.id])
    },

    removeComponent (id) {
      this.setPrev() // 备份数据
      const index = this.components.findIndex(component => component.id === id)
      if (index > -1) {
        if (this.select === id) {
          this.select = undefined
        }
        this.components[index] = this.components[this.components.length - 1]
        this.components.length -= 1
        // 按照 zIndex 排序，并重置 zIndex 值
        this.components.sort((a, b) => a.zIndex - b.zIndex).forEach((component, index) => {
          component.zIndex = index
        })
        this.emitChange()
      }
    },

    swapComponent (source, target) {
      this.setPrev()
      const sourceIndex = this.components.findIndex(component => component.id === source.id)
      const targetIndex = this.components.findIndex(component => component.id === target.id)
      if (sourceIndex > -1 && targetIndex > -1) {
        this.components.splice(sourceIndex, 1, target)
        this.components.splice(targetIndex, 1, source)
        this.emitChange()
      }
    },

    // TODO splice  this.$set 的区别
    // 通过下标配置为什么自动设置成响应式

    updateComponent (component) {
      const index = this.components.findIndex(item => item.id === component.id)
      if (index > -1) {
        this.$set(this.components, index, component)
        this.emitChange(this.components)
      }
    },

    updateComponentPosition (id, position) {
      const target = this.components.find(item => item.id === id)
      if (target) {
        target.position.x = position.x
        target.position.y = position.y
        this.emitChange(this.components)
      }
    },

    updateComponentSize (id, size) {
      const target = this.components.find(item => item.id === id)
      if (target) {
        target.size.width = size.width
        target.size.height = size.height
        this.emitChange(this.components)
      }
    },

    resetComponentsLevels (levels) {
      this.components.forEach(component => {
        component.zIndex = levels[component.id]
      })
      this.emitChange()
    },

    // 保存上一步
    setPrev () {
      if (this.past.length === 20) {
        this.past.shift()
      }
      this.past.push(JSON.stringify(this.components))
    },

    // 获取上一步
    getPrev () {
      if (this.past.length > 0) {
        this.components = JSON.parse(this.past.pop())
        this.emitChange()
      }
    },
    // 保存下一步
    setNext () {
      this.future.unshift(JSON.stringify(this.components))
    },
    // 获取下一步
    getNext () {
      if (this.future.length > 0) {
        this.components = JSON.parse(this.future.shift())
        this.emitChange()
      }
    },
    // 上一步
    undo  () {
      this.setNext()
      this.getPrev()
    },
    // 下一步
    redo () {
      this.setPrev()
      this.getNext()
    }
  }
}
</script>

<style lang="less">
.ioc-editor {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  &__header {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #FFFFFF;
    box-shadow: 0 2px 4px #0000001A;
  }
  &__content {
    width: 100%;
    flex: 1;
    position: relative;
  }
}
</style>
