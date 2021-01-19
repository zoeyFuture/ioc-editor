<template>
  <ioc-editor
    mode="position"
    v-model="screen"
    :enableMarkLine="true"
  >
    <template #header>
      <div class="header">
        <Button type="primary" @click="$emit('change', 'flow')">
          切换流式布局
        </Button>
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
          <InputNumber v-model="canvas.size.width"/> *
          <InputNumber v-model="canvas.size.height"/>
        </div>
        <Button @click="handleSave">
          保存
        </Button>
      </div>
    </template>
    <template #left>
      <Left />
    </template>
    <template #center>
      <ioc-canvas :component-render="componentRender" :canvas="canvas"/>
    </template>
    <template #right>
      <Right />
    </template>
  </ioc-editor>
</template>

<script>
import { Modal, Button, InputNumber } from 'ant-design-vue'
import IocEditor from '@/packages/editor'
import IocCanvas from '@/packages/canvas'
import Left from './left'
import Right from './right'
import ComponentRender from './component-render'
export default {
  name: 'position',

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
      canvas: {
        title: '绝对布局 - 中屏页面',
        color: 'white',
        backgroundColor: 'white',
        backgroundImage: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201508%2F14%2F20150814204044_mciYt.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613290181&t=4171a1b6b74b4b0c2a8fa22af26ddf71',
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

    handleSave () {
      const { components } = this.screen
      const params = {
        page: this.canvas,
        components
      }
      console.log(JSON.stringify(params, 0, 2))
      alert(JSON.stringify(params, 0, 2))
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
