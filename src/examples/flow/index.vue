<template>
  <ioc-editor
    mode="flow"
    v-model="mobile"
  >
    <template #header>
      <div class="header">
        <Button type="primary" @click="$emit('change', 'position')">
          切换绝对布局
        </Button>
        <Button @click="handleReset">
          清空画布
        </Button>
        <Button :disabled="!mobile.iocEditor.canUndo" @click="mobile.iocEditor.undo()">
          撤销
        </Button>
        <Button :disabled="!mobile.iocEditor.canRedo" @click="mobile.iocEditor.redo()">
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
    <template #canvas>
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
  name: 'flow',

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
      componentRender: ComponentRender, // 渲染组件
      mobile: {
        components: [],
        iocEditor: {}
      },
      canvas: {
        title: '流式布局',
        backgroundColor: '#fff',
        backgroundImage: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201508%2F14%2F20150814204044_mciYt.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613290181&t=4171a1b6b74b4b0c2a8fa22af26ddf71',
        size: {
          width: 375,
          height: 680
        }
      }
    }
  },

  created () {
    document.title = '流式布局'
  },

  methods: {
    handleReset () {
      Modal.confirm({
        title: '确认恢复初始吗？',
        content: '将恢复到上次保存后的状态',
        onOk: () => {
          // 更新组件列表
          this.mobile.iocEditor.setComponents([])
        }
      })
    },

    handleSelect (id) {
      // 选中某个组件
      this.mobile.iocEditor.setSelect(id)
    },

    handleScale ({ key }) {
      if (key === -1) {
        // 适配屏幕
        this.mobile.iocEditor.adaptScreen()
      } else {
        this.mobile.iocEditor.setScale(key)
      }
    },

    handleSave () {
      const { components } = this.mobile
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
