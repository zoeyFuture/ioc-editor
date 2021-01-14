<template>
  <ioc-editor
    mode="position"
    v-model="screen"
  >
    <template #header>
      <div class="header">
        <Button @click="handleReset">
          清空画布
        </Button>
        <Button :disabled="!screen.iocEditor.canUndo" @click="screen.iocEditor.undo()">
          撤销
        </Button>
        <Button :disabled="!screen.iocEditor.canRedo" @click="screen.iocEditor.redo()">
          恢复
        </Button>

        <div class="item">
          画布大小:
          <InputNumber v-model="page.size.width"/> *
          <InputNumber v-model="page.size.height"/>
        </div>
      </div>
    </template>
    <template #editor-left>
      <Left />
    </template>
    <template #editor-center>
      <ioc-canvas :component-render="componentRender" :page="page"/>
    </template>
    <template #editor-right>
      <Right />
    </template>
  </ioc-editor>
</template>

<script>
import NP from 'number-precision'
import { Modal, Button, InputNumber } from 'ant-design-vue'
import IocEditor from '@/packages/editor'
import IocCanvas from '@/packages/canvas'
import Left from './left'
import Right from './right'
import ComponentRender from './component-render'
export default {
  name: 'screen',

  components: {
    Button,
    InputNumber,
    IocEditor,
    IocCanvas,
    Left,
    Right
  },

  data () {
    return {
      componentRender: ComponentRender, // 组件渲染
      screen: {
        components: [],
        iocEditor: {}
      },
      page: {
        title: '绝对布局 - 中屏页面',
        size: {
          width: 1200,
          height: 680
        }
      }
    }
  },

  computed: {
    routeInfo () {
      return JSON.parse(localStorage.screenInfo || '{}')
    }
  },

  created () {
    document.title = '中屏可视化'
  },

  methods: {
    handleReset () {
      Modal.confirm({
        title: '确认恢复初始吗？',
        content: '将恢复到上次保存后的状态',
        onOk: () => {
          // 更新组件列表
          this.screen.iocEditor.setComponents([])
        }
      })
    },

    handleSelect (id) {
      // 选中某个组件
      this.screen.iocEditor.setSelect(id)
    },

    handleScale ({ key }) {
      if (key === -1) {
        // 适配屏幕
        this.screen.iocEditor.adaptScreen()
      } else {
        this.screen.iocEditor.setScale(key)
      }
    },

    handleIncreaseScale () {
      this.screen.iocEditor.setScale(NP.minus(this.screen.iocEditor.scale, 0.1))
    },

    handleDecreaseScale () {
      this.screen.iocEditor.setScale(NP.plus(this.screen.iocEditor.scale, 0.1))
    },

    handleSave () {

    }
  }
}
</script>

<style scoped lang="less">
.header {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;

  .ant-btn,
  .item {
    margin: 0 10px;
  }
}
</style>
