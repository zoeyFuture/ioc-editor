<template>
  <div :style="multiSelectStyle" class="ioc-container-multi-select">
    <div class="ioc-container-multi-select__operation">
      <div class="cancel" @click.stop.prevent="handleCancel">
        取消
      </div>
      <div class="align">
        <Tooltip
          v-for="option in alignOptions"
          :key="option.value"
          :title="option.label"
        >
          <div class="item">
            <i :class="`iconfont icon-align-${option.value}`" @click.stop.prevent="handleAlign($event, option.value)"/>
          </div>
        </Tooltip>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
import { Tooltip } from 'ant-design-vue'
export default {
  name: 'ioc-container-multi-select',
  components: {
    Tooltip
  },

  inject: ['iocEditor'],

  data () {
    return {
      align: 'none',
      alignOptions: [
        { label: '左对齐', value: 'left' },
        { label: '右对齐', value: 'right' },
        { label: '垂直居中', value: 'vertical-center' },
        { label: '水平居中', value: 'horizontal-center' },
        { label: '顶对齐', value: 'top' },
        { label: '底对齐', value: 'bottom' }
        // { label: '纵向均分', value: 'vertical-split' },
        // { label: '横向均分', value: 'horizontal-split' }
      ]
    }
  },
  computed: {
    isMultiSelect () {
      return this.iocEditor.multiSelect.length > 1
    },

    multiSelectPosition () {
      const { components, multiSelect } = this.iocEditor
      if (this.isMultiSelect) {
        const { x, y } = components.filter(component => multiSelect.includes(component.id))
          .map(component => {
            const { position: { x, y }, size: { width, height } } = component
            // 返回选中组件的左上角和右下角的坐标
            return [{ x, y }, { x: x + width, y: y + height }]
          })
          .reduce(({ x, y }, [lt, rb]) => {
            return {
              x: x.concat([lt.x, rb.x]),
              y: y.concat([lt.y, rb.y])
            }
          }, { x: [], y: [] })

        // 找到最小左上角和最大右下角的坐标
        const [minX, maxX] = minAndMax(x)
        const [minY, maxY] = minAndMax(y)

        return {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
          border: '1px solid green'
        }
      }
      return {}
    },

    multiSelectStyle () {
      if (this.isMultiSelect) {
        const { x, y, width, height } = this.multiSelectPosition
        return {
          visibility: 'visible',
          top: `${y}px`,
          left: `${x}px`,
          width: `${width}px`,
          height: `${height}px`
        }
      }
      return {
        visibility: 'hidden'
      }
    }
  },

  created () {
    this.monitor()
  },

  methods: {
    monitor () {
      window.addEventListener('keydown', this.handleWindowKeydown)
      window.addEventListener('keyup', this.handleWindowKeyUp)
      document.addEventListener('click', this.handleClick)

      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('keydown', this.handleWindowKeydown)
        window.removeEventListener('keyup', this.handleWindowKeyUp)
        document.removeEventListener('click', this.handleClick)
      })
    },

    handleWindowKeydown ({ keyCode }) {
      this.iocEditor.setKeyCode(keyCode)
    },

    handleWindowKeyUp () {
      this.iocEditor.setKeyCode()
    },

    handleClick () {
      // 同步布局信息到组件列表
      this.isMultiSelect && this.iocEditor.syncMultiSelectInfo()
    },

    handleCancel () {
      this.iocEditor.setMultiSelect()
    },

    handleAlign (event, align) {
      const { multiSelect, multiSelectInfo } = this.iocEditor
      const [first, ...rest] = multiSelect
      const { id, position: { x }, size: { width } } = multiSelectInfo[first]

      // 重新计算位置位置关系
      let newPositions = []
      switch (align) {
        case 'left': {
          // 左对齐
          const targetLeft = x
          newPositions = rest.map(d => {
            const { id, position, size } = multiSelectInfo[d]
            return {
              id,
              position: {
                x: targetLeft,
                y: position.y
              },
              size
            }
          })
          break
        }
        case 'right': {
          // 右对齐
          const targetRight = x + width
          newPositions = rest.map(d => {
            const { id, position, size } = multiSelectInfo[d]
            return {
              id,
              position: {
                x: targetRight - size.width,
                y: position.y
              },
              size
            }
          })
          break
        }
        case 'vertical-center': {
          // 垂直居中对齐：X坐标不变，纵坐标：YCenter - height / 2
          const { y, height } = this.multiSelectPosition
          const targetVerticalCenter = y + height / 2
          newPositions = multiSelect.map(d => {
            const { id, position, size } = multiSelectInfo[d]
            return {
              id,
              position: {
                x: position.x,
                y: targetVerticalCenter - size.height / 2
              },
              size
            }
          })
          break
        }
        case 'vertical-split': {
          // 纵向均分：X坐标不变
          const { y, height } = this.multiSelectPosition
          const splitHeight = height / (multiSelect.length - 1)
          newPositions = multiSelect.map((d, index) => {
            const { id, position, size } = multiSelectInfo[d]
            if (index === 0) {
              return {
                id,
                position: {
                  x: position.x,
                  y: y
                },
                size
              }
            }
            if (index === multiSelect.length - 1) {
              return {
                id,
                position: {
                  x: position.x,
                  y: y + height - size.height
                },
                size
              }
            }
            return {
              id,
              position: {
                x: position.x,
                y: y + splitHeight * index - size.height / 2
              },
              size
            }
          })
          break
        }
        case 'horizontal-center': {
          // 水平居中：Y坐标不变，XCenter - width / 2
          const { x, width } = this.multiSelectPosition
          const targetHorizontalCenter = x + width / 2
          newPositions = multiSelect.map(d => {
            const { id, position, size } = multiSelectInfo[d]
            return {
              id,
              position: {
                x: targetHorizontalCenter - size.width / 2,
                y: position.y
              },
              size
            }
          })
          break
        }
        case 'horizontal-split': {
          // 横向均分：Y坐标不变
          const { x, width } = this.multiSelectPosition
          const splitWidth = width / (multiSelect.length - 1)
          newPositions = multiSelect.map((d, index) => {
            const { id, position, size } = multiSelectInfo[d]
            if (index === 0) {
              return {
                id,
                position: {
                  x: x,
                  y: position.y
                },
                size
              }
            }
            if (index === multiSelect.length - 1) {
              return {
                id,
                position: {
                  x: x + width - size.width,
                  y: position.y
                },
                size
              }
            }
            if (![0, multiSelect.length - 1].includes(index)) {
              return {
                id,
                position: {
                  x: x + splitWidth * index - size.width / 2,
                  y: position.y
                },
                size
              }
            }
            return multiSelectInfo[d]
          })
          break
        }
        case 'top': {
          // 顶部对齐
          const { y } = this.multiSelectPosition
          const targetY = y
          newPositions = multiSelect.map(d => {
            const { id, position, size } = multiSelectInfo[d]
            return {
              id,
              position: {
                x: position.x,
                y: targetY
              },
              size
            }
          })
          break
        }
        case 'bottom': {
          // 底部对齐
          const { y, height } = this.multiSelectPosition
          const targetY = y + height
          newPositions = multiSelect.map(d => {
            const { id, position, size } = multiSelectInfo[d]
            return {
              id,
              position: {
                x: position.x,
                y: targetY - size.height
              },
              size
            }
          })
          break
        }
      }
      const result = newPositions.reduce((result, layoutLayer) => {
        result[layoutLayer.id] = layoutLayer
        return result
      }, {
        [id]: multiSelectInfo[id]
      })
      this.iocEditor.setMultiSelectInfo(result)
    }
  }
}

const minAndMax = (values = []) => {
  return values.reduce((result, item) => {
    if (item < result[0]) {
      result[0] = item
    }
    if (item > result[1]) {
      result[1] = item
    }
    return result
  }, [values[0], values[1]])
}
</script>

<style scoped lang="less">
@activeColor: #2266FF;
.ioc-container-multi-select {
  position: absolute;
  border-radius: 2px;
  background-color: transparent;
  border: 1px solid @activeColor;

  &__operation {
    position: absolute;
    z-index: 998;
    top: -32px;
    left: -1px;
    width: calc(100% + 2px);
    height: 32px;
    display: flex;
    padding: 0 4px;
    align-items: center;
    justify-content: space-between;
    border: 1px solid @activeColor;
    pointer-events: auto !important;
    color: currentColor;
    .cancel {
      cursor: pointer;
    }
    .align {
      display: flex;
      align-items: center;
      .item {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        .iconfont {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
