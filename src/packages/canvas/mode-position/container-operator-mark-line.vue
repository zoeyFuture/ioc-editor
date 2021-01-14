<template>
  <div class="ioc-container-mark-line">
    <div
      v-for="line in lines"
      :key="line"
      v-show="linesStatus[line]"
      :class="line.includes('x') ? 'x' : 'y'"
      :style="`background-color: ${enableMarkLine ? '#59c7f9': 'transparent'}`"
      class="line"
      :ref="line"
    />
  </div>
</template>

<script>
export default {
  name: 'ioc-container-mark-line',

  inject: [
    'enableMarkLine',
    'iocEditor'
  ],

  data () {
    return {
      offset: 3, // 默认自动吸附偏移量
      lines: [
        'xt', 'xc', 'xb', // y轴辅助线：左、中、右
        'yl', 'yc', 'yr' // x轴辅助线：左、中、右
      ],
      linesStatus: {
        // y轴辅助线状态：左、中、右
        xt: false,
        xc: false,
        xb: false,
        // x轴辅助线：左、中、右
        yl: false,
        yc: false,
        yr: false
      },
      canvas: null
    }
  },

  mounted () {
    this.canvas = document.querySelector('.ioc-canvas')
    this.$eventBus.$on('mouseMove', (dragNode, isDownward, isRightward) => {
      if (dragNode) {
        this.showLine(dragNode, isDownward, isRightward)
      }
    })
    this.$eventBus.$on('mouseUp', () => {
      this.hideLine()
    })
  },
  methods: {
    hideLine () {
      Object.keys(this.linesStatus).forEach(line => {
        this.linesStatus[line] = false
      })
    },
    showLine (dragNode, isDownward, isRightward) {
      const lines = this.$refs
      const canvasReact = this.canvas.getBoundingClientRect()
      const components = document.querySelectorAll('.ioc-container-operator')
      const dragNodeRectInfo = this.getNodeRelativePosition(dragNode)
      const dragNodeHalfWidth = dragNodeRectInfo.width / 2
      const dragNodeHalfHeight = dragNodeRectInfo.height / 2
      this.hideLine()

      // 组件边界检测
      components.forEach(node => {
        if (node === dragNode) return
        const { top, height, bottom, left, width, right } = this.getNodeRelativePosition(node)
        const nodeHalfWidth = width / 2
        const nodeHalfHeight = height / 2
        const componentBoundaryCheck = {
          y: [
            {
              // top - top
              isNearly: this.isNearly(dragNodeRectInfo.top, top),
              lineNode: lines.xt[0],
              line: 'xt',
              dragShift: top,
              lineShift: top
            },
            {
              // top - center
              isNearly: this.isNearly(dragNodeRectInfo.top, top + nodeHalfHeight),
              lineNode: lines.xc[0],
              line: 'xc',
              dragShift: top + nodeHalfHeight,
              lineShift: top + nodeHalfHeight
            },
            {
              // top - bottom
              isNearly: this.isNearly(dragNodeRectInfo.top, bottom),
              lineNode: lines.xb[0],
              line: 'xb',
              dragShift: bottom,
              lineShift: bottom
            },
            {
              // center - top
              isNearly: this.isNearly(dragNodeRectInfo.top + dragNodeHalfHeight, top),
              lineNode: lines.xt[0],
              line: 'xt',
              dragShift: top - dragNodeHalfHeight,
              lineShift: top
            },
            {
              // center - center
              isNearly: this.isNearly(dragNodeRectInfo.top + dragNodeHalfHeight, top + nodeHalfHeight),
              lineNode: lines.xc[0],
              line: 'xc',
              dragShift: top + nodeHalfHeight - dragNodeHalfHeight,
              lineShift: top + nodeHalfHeight
            },
            {
              // center - bottom
              isNearly: this.isNearly(dragNodeRectInfo.top + dragNodeHalfHeight, bottom),
              lineNode: lines.xb[0],
              line: 'xb',
              dragShift: bottom - dragNodeHalfHeight,
              lineShift: bottom
            },
            {
              // bottom - top
              isNearly: this.isNearly(dragNodeRectInfo.bottom, top),
              lineNode: lines.xt[0],
              line: 'xt',
              dragShift: top - dragNodeRectInfo.height,
              lineShift: top
            },
            {
              // bottom - center
              isNearly: this.isNearly(dragNodeRectInfo.bottom, top + nodeHalfHeight),
              lineNode: lines.xc[0],
              line: 'xc',
              dragShift: top + nodeHalfHeight - dragNodeRectInfo.height,
              lineShift: top + nodeHalfHeight
            },
            {
              // bottom - bottom
              isNearly: this.isNearly(dragNodeRectInfo.bottom, bottom),
              lineNode: lines.xb[0],
              line: 'xb',
              dragShift: bottom - dragNodeRectInfo.height,
              lineShift: bottom
            }
          ],
          x: [
            {
              // left - left
              isNearly: this.isNearly(dragNodeRectInfo.left, left),
              lineNode: lines.yl[0],
              line: 'yl',
              dragShift: left,
              lineShift: left
            },
            {
              // left - center
              isNearly: this.isNearly(dragNodeRectInfo.left, left + nodeHalfWidth),
              lineNode: lines.yc[0],
              line: 'yc',
              dragShift: left + nodeHalfWidth,
              lineShift: left + nodeHalfWidth
            },
            {
              // left - right
              isNearly: this.isNearly(dragNodeRectInfo.left, right),
              lineNode: lines.yr[0],
              line: 'yr',
              dragShift: right,
              lineShift: right
            },
            {
              // center - left
              isNearly: this.isNearly(dragNodeRectInfo.left + dragNodeHalfWidth, left),
              lineNode: lines.yl[0],
              line: 'yl',
              dragShift: left - dragNodeHalfWidth,
              lineShift: left
            },
            {
              // center - center
              isNearly: this.isNearly(dragNodeRectInfo.left + dragNodeHalfWidth, left + nodeHalfWidth),
              lineNode: lines.yc[0],
              line: 'yc',
              dragShift: left + nodeHalfWidth - dragNodeHalfWidth,
              lineShift: left + nodeHalfWidth
            },
            {
              // center - right
              isNearly: this.isNearly(dragNodeRectInfo.left + dragNodeHalfWidth, right),
              lineNode: lines.yr[0],
              line: 'yr',
              dragShift: right - dragNodeHalfWidth,
              lineShift: right
            },
            {
              // right - left
              isNearly: this.isNearly(dragNodeRectInfo.right, left),
              lineNode: lines.yl[0],
              line: 'yl',
              dragShift: left - dragNodeRectInfo.width,
              lineShift: left
            },
            {
              // right - center
              isNearly: this.isNearly(dragNodeRectInfo.right, left + nodeHalfWidth),
              lineNode: lines.yc[0],
              line: 'yc',
              dragShift: left + nodeHalfWidth - dragNodeRectInfo.width,
              lineShift: left + nodeHalfWidth
            },
            {
              // right - right
              isNearly: this.isNearly(dragNodeRectInfo.right, right),
              lineNode: lines.yr[0],
              line: 'yr',
              dragShift: right - dragNodeRectInfo.width,
              lineShift: right
            }
          ]
        }

        const needToShow = []
        // x 轴的位置检测
        componentBoundaryCheck.x.forEach((item) => {
          if (!item.isNearly) return
          if (item.lineNode) {
            item.lineNode.style.left = `${item.lineShift}px`
          }
          const { id, position: { y } } = this.iocEditor.selectComponent
          this.iocEditor.updateComponentPosition(id, { x: item.dragShift, y })
          needToShow.push(item.line)
        })
        // y 轴的位置检测
        componentBoundaryCheck.y.forEach((item) => {
          if (!item.isNearly) return
          if (item.lineNode) {
            item.lineNode.style.top = `${item.lineShift}px`
          }
          const { id, position: { x } } = this.iocEditor.selectComponent
          this.iocEditor.updateComponentPosition(id, { x, y: item.dragShift })
          needToShow.push(item.line)
        })

        if (needToShow.length) {
          this.setMarkLineStatus(needToShow, isDownward, isRightward)
        }
      })

      // 画布边界检测
      const canvasBoundaryCheck = {
        y: [
          {
            // top - top
            isNearly: this.isNearly(dragNodeRectInfo.top, 0),
            lineNode: lines.xt[0], // xt
            line: 'xt',
            dragShift: 0,
            lineShift: 0
          },
          {
            // bottom - bottom
            isNearly: this.isNearly(dragNodeRectInfo.bottom, canvasReact.height),
            lineNode: lines.xb[0], // xt
            line: 'xb',
            dragShift: canvasReact.height - dragNodeRectInfo.height,
            lineShift: canvasReact.height // 辅助线的 y 坐标
          }
        ],
        x: [
          // 检测与边框的位置关系
          {
            // left - left
            isNearly: this.isNearly(dragNodeRectInfo.left, 0),
            lineNode: lines.yl[0],
            line: 'yl',
            dragShift: 0,
            lineShift: 0
          },
          {
            // right - right
            isNearly: this.isNearly(dragNodeRectInfo.right, canvasReact.width),
            lineNode: lines.yr[0],
            line: 'yr',
            dragShift: canvasReact.width - dragNodeRectInfo.width,
            lineShift: canvasReact.width
          }]
      }

      const needToShow = []
      // x 轴的位置检测
      canvasBoundaryCheck.x.forEach((item) => {
        if (!item.isNearly) return
        if (item.lineNode) {
          item.lineNode.style.left = `${item.lineShift}px`
        }
        const { id, position: { y } } = this.iocEditor.selectComponent
        this.iocEditor.updateComponentPosition(id, { x: item.dragShift, y })
        needToShow.push(item.line)
      })
      // y 轴的位置检测
      canvasBoundaryCheck.y.forEach((item) => {
        if (!item.isNearly) return
        if (item.lineNode) {
          item.lineNode.style.top = `${item.lineShift}px`
        }
        const { id, position: { x } } = this.iocEditor.selectComponent
        this.iocEditor.updateComponentPosition(id, { x, y: item.dragShift })
        needToShow.push(item.line)
      })

      if (needToShow.length) {
        this.setMarkLineStatus(needToShow, isDownward, isRightward)
      }
    },

    setMarkLineStatus (needToShow, isDownward, isRightward) {
      if (isRightward) {
        // 向右移动
        if (needToShow.includes('yr')) {
          this.linesStatus.yr = true
        } else if (needToShow.includes('yc')) {
          this.linesStatus.yc = true
        } else if (needToShow.includes('yl')) {
          this.linesStatus.yl = true
        }
      } else {
        if (needToShow.includes('yl')) {
          this.linesStatus.yl = true
        } else if (needToShow.includes('yc')) {
          this.linesStatus.yc = true
        } else if (needToShow.includes('yr')) {
          this.linesStatus.yr = true
        }
      }

      if (isDownward) {
        // 向下移动
        if (needToShow.includes('xb')) {
          this.linesStatus.xb = true
        } else if (needToShow.includes('xc')) {
          this.linesStatus.xc = true
        } else if (needToShow.includes('xt')) {
          this.linesStatus.xt = true
        }
      } else {
        if (needToShow.includes('xt')) {
          this.linesStatus.xt = true
        } else if (needToShow.includes('xc')) {
          this.linesStatus.xc = true
        } else if (needToShow.includes('xb')) {
          this.linesStatus.xb = true
        }
      }
    },

    // 两个数值的绝对值是否小于设定的阈值
    isNearly (dragValue, targetValue) {
      return Math.abs(dragValue - targetValue) <= this.offset
    },

    getNodeRelativePosition (node) {
      const canvasRect = this.canvas.getBoundingClientRect()
      let { top, height, bottom, left, width, right } = node.getBoundingClientRect()
      left -= canvasRect.left
      top -= canvasRect.top
      right = left + width
      bottom = top + height
      return { top, height, bottom, left, width, right }
    }
  }
}
</script>

<style scoped lang="less">
.ioc-container-mark-line {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: -1;

  .line {
    background: #59c7f9;
    position: absolute;
    z-index: 10000;
    &.x {
      width: 100%;
      height: 1px;
    }
    &.y {
      width: 1px;
      height: 100%;
    }
  }
}
</style>
