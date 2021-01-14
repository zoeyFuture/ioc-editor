<template>
  <div
    :style="operatorStyle"
    :class="{
      'select': isSelect,
      'multi-select': isMultiSelect
    }"
    class="ioc-container-operator"
    @mousedown.stop="handleMouseDown"
    @click.stop
    @contextmenu.stop.prevent
  >
    <div
      v-for="resizePoint in resizePoints"
      :key="resizePoint"
      :class="resizePoint"
      :style="getResizePointStyle(resizePoint)"
      class="ioc-container-operator__point"
      @mousedown.stop.prevent="handleResizePointMouseDown($event, resizePoint)"
    >
    </div>
    <div class="ioc-container-operator__header">
      <Tooltip
        v-for="option in operatorOptions"
        :key="option.value"
        :title="option.label"
      >
        <div class="item" @click.stop="handleOperator(option.value)">
          <i :class="`iconfont icon-level-${option.value}`"/>
        </div>
      </Tooltip>
      <Tooltip title="删除">
        <div class="item" @click.stop="handleDelete">
          <i class="iconfont icon-layer-delete"/>
        </div>
      </Tooltip>
    </div>
    <div class="ioc-container-operator__content">
      <slot/>
    </div>
  </div>

</template>

<script>
import { Tooltip } from 'ant-design-vue'
export default {
  name: 'ioc-container-operator',

  components: {
    Tooltip
  },

  props: {
    component: {
      type: Object,
      default: () => ({})
    }
  },

  inject: ['iocEditor'],

  data () {
    return {
      resizePoints: ['t', 'r', 'b', 'l', 'lt', 'rt', 'lb', 'rb'],
      pointDirection: { t: 'n', b: 's', l: 'w', r: 'e' },
      operatorOptions: [
        { label: '置底', value: 'bottom' },
        { label: '置顶', value: 'top' },
        { label: '上移一层', value: 'up' },
        { label: '下移一层', value: 'down' }
      ]
    }
  },

  computed: {
    serialComponentLevels () {
      return this.iocEditor.components.map(({ id, zIndex }) => ({ id, zIndex })).sort((a, b) => a.zIndex - b.zIndex)
    },

    isSelect () {
      const { id } = this.component
      return this.iocEditor.select === id
    },

    isMultiSelect () {
      const { id } = this.component
      const { multiSelect } = this.iocEditor
      return multiSelect.length > 1 && multiSelect.includes(id)
    },

    operatorStyle () {
      const {
        id,
        zIndex,
        position: {
          x, y
        },
        size: {
          width,
          height
        },
        fullscreen = false
      } = this.component
      const { multiSelectInfo } = this.iocEditor

      // 如果是多选，则取用多选信息中的 位置和尺寸
      if (this.isMultiSelect) {
        const { position } = multiSelectInfo[id]
        return {
          top: `${position.y}px`,
          left: `${position.x}px`,
          width: width + 'px',
          height: height + 'px',
          zIndex
        }
      }
      // 是否全屏
      if (fullscreen) {
        return {
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          zIndex
        }
      }
      return {
        left: x + 'px',
        top: y + 'px',
        width: width + 'px',
        height: height + 'px',
        zIndex
      }
    }
  },
  methods: {
    getResizePointStyle (resizePoint) {
      // 匹配点的鼠标朝向
      return {
        cursor: `${resizePoint.split('').reverse().map(d => this.pointDirection[d]).join('')}-resize`
      }
    },

    handleSelect () {
      const { id } = this.component
      const { keyCode, multiSelect } = this.iocEditor

      // 按下 Ctrl 表示多选
      if (keyCode === 91) {
        console.log('includes:', id, multiSelect.includes(id), JSON.stringify(multiSelect))
        if (multiSelect.includes(id)) {
          // 已选中则取消选择
          this.iocEditor.removeMultiSelect(id)
        } else {
          // 未选中设置选择
          this.iocEditor.addMultiSelect(id)
        }
      } else {
        // 默认点击选中
        this.iocEditor.setSelect(id)
      }
    },

    handleOperator (operator) {
      const { id } = this.component
      const sourceIndex = this.serialComponentLevels.findIndex(item => id === item.id)
      const backupSerialComponentLevels = this.serialComponentLevels.slice()
      const source = this.serialComponentLevels[sourceIndex]

      let needUpdateLevel = false
      switch (operator) {
        case 'top': {
          // 置顶
          if (sourceIndex < this.serialComponentLevels.length - 1) {
            needUpdateLevel = true
            backupSerialComponentLevels.splice(sourceIndex, 1)
            backupSerialComponentLevels.push(source)
          }
          break
        }
        case 'bottom': {
          // 置底
          if (sourceIndex > 0) {
            needUpdateLevel = true
            backupSerialComponentLevels.splice(sourceIndex, 1)
            backupSerialComponentLevels.unshift(source)
          }
          break
        }
        case 'up': {
          // 上移
          if (sourceIndex < this.serialComponentLevels.length - 1) {
            needUpdateLevel = true
            backupSerialComponentLevels[sourceIndex] = this.serialComponentLevels[sourceIndex + 1]
            backupSerialComponentLevels[sourceIndex + 1] = source
          }
          break
        }
        case 'down': {
          // 下移
          if (sourceIndex > 0) {
            needUpdateLevel = true
            backupSerialComponentLevels[sourceIndex] = this.serialComponentLevels[sourceIndex - 1]
            backupSerialComponentLevels[sourceIndex - 1] = source
          }
          break
        }
      }
      if (needUpdateLevel) {
        const newLevel = backupSerialComponentLevels.map((item, zIndex) => ({ ...item, zIndex }))
          .reduce((result, { id, zIndex }) => {
            result[id] = zIndex
            return result
          }, {})

        this.iocEditor.setPrev() // 更新备份
        this.iocEditor.resetComponentsLevels(newLevel)
      }
    },
    handleDelete () {
      this.iocEditor.removeComponent(this.component.id)
    },
    handleMouseDown (event) {
      this.handleSelect()
      const { position: { x, y } } = this.component
      const mouseMove = (mouseMoveEvent) => {
        const offsetX = mouseMoveEvent.pageX - event.pageX
        const offsetY = mouseMoveEvent.pageY - event.pageY
        this.iocEditor.updateComponent(
          {
            ...this.component,
            position: {
              x: x + offsetX,
              y: y + offsetY
            }
          }
        )
        this.$nextTick(() => {
          // 触发元素移动事件，用于显示标线、吸附功能
          // 后面两个参数代表鼠标移动方向
          this.$eventBus.$emit('mouseMove', this.$el, offsetY > 0, offsetX > 0)
        })
      }
      const mouseUp = () => {
        this.$eventBus.$emit('mouseUp')
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseUp)
      }
      // 鼠标移动的时候，绑定一次 mousemove 事件，用于保存上一次的组件状态
      document.addEventListener('mousemove', this.iocEditor.setPrev, { once: true })
      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', mouseUp)
    },

    handleResizePointMouseDown (event, resizePoint) {
      const { position: { x, y }, size: { width, height } } = this.component
      const mouseMove = (mouseMoveEvent) => {
        // x轴和y轴的偏移量
        const offsetX = mouseMoveEvent.pageX - event.pageX
        const offsetY = mouseMoveEvent.pageY - event.pageY

        const newPosition = { x, y }
        const newSize = { width, height }
        switch (resizePoint) {
          case 't': {
            newPosition.y = y + offsetY
            newSize.height = height - offsetY
            break
          }
          case 'r': {
            newSize.width = width + offsetX
            break
          }
          case 'b': {
            newSize.height = height + offsetY
            break
          }
          case 'l': {
            newPosition.x = x + offsetX
            newSize.width = width - offsetX
            break
          }
          case 'lt': {
            newPosition.x = x + offsetX
            newPosition.y = y + offsetY
            newSize.width = width - offsetX
            newSize.height = height - offsetY
            break
          }
          case 'rt': {
            newPosition.y = y + offsetY
            newSize.width = width + offsetX
            newSize.height = height - offsetY
            break
          }
          case 'lb': {
            newPosition.x = x + offsetX
            newSize.width = width - offsetX
            newSize.height = height + offsetY
            break
          }
          case 'rb': {
            newSize.width = width + offsetX
            newSize.height = height + offsetY
            break
          }
        }
        this.iocEditor.updateComponent(
          {
            ...this.component,
            position: newPosition,
            size: newSize
          }
        )
      }
      const mouseUp = () => {
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseUp)
      }
      // 鼠标移动的时候，绑定一次 mousemove 事件，用于保存上一次的组件状态
      document.addEventListener('mousemove', this.iocEditor.setPrev, { once: true })
      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', mouseUp)
    }
  }
}
</script>

<style lang="less">
@pointSize: 6px;
.ioc-container-operator {
  position: absolute;
  z-index: 900;
  width: 100%;
  height: 100%;
  border: 1px solid currentColor;

  &__header {
    position: absolute;
    top: -32px;
    right: 0;
    width: auto;
    height: 32px;
    line-height: 32px;
    align-items: center;
    justify-content: space-between;
    z-index: 999;
    display: none;
    //display: flex;

    .item {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .icon {
        width: 18px;
        height: 18px;
        color: black;
      }
    }
  }
  &__point {
    position: absolute;
    width: @pointSize;
    height: @pointSize;
    border-radius: 50%;
    background-color: currentColor;
    z-index: 9999;
    display: none;

    &.l {
      top: calc(50% - @pointSize/2);
      left: calc(-@pointSize/2);
    }
    &.r {
      top: calc(50% - @pointSize/2);
      right: calc(-@pointSize/2);
    }
    &.t {
      top: calc(-@pointSize/2);
      left: calc(50% - @pointSize/2);
    }
    &.b {
      bottom: calc(-@pointSize/2);
      left: calc(50% - @pointSize/2);
    }
    &.lt {
      top: calc(-@pointSize/2);
      left: calc(-@pointSize/2);
    }
    &.rt {
      top: calc(-@pointSize/2);
      right: calc(-@pointSize/2);
    }
    &.lb {
      left: calc(-@pointSize/2);
      bottom: calc(-@pointSize/2);
    }
    &.rb {
      right: calc(-@pointSize/2);
      bottom: calc(-@pointSize/2);
    }
  }
  &:hover,
  &.select {
    z-index: 999 !important;
    border: 1px solid #2266FF;
  }
  &.select {
    .ioc-container-operator__header,
    .ioc-container-operator__point {
      display: flex;
    }
  }
  &.multi-select {
    .ioc-container-operator__header,
    .ioc-container-operator__point {
      display: none !important;
    }
  }
  &__content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
