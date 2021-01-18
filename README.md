[TOC]

# 中屏可视化框架

# 背景

可视化编辑器在项目中很常见，常见的功能无非是拖入容器或组件，配置组件属性，导出组件配置等，
为了方便快捷的开发出满足需求的可视化编辑页面，我们对日常的拖拽配置方案进行收集整合为讯盟
可视化框架，针对手机端流式布局和PC端绝对布局做了封装

主要解决问题：

-	规范并统一编辑器的交互和布局样式
-	统一解决容器嵌套问题
-	支持时间旅行

# 方案

小屏拖拽：vue-smooth-dnd，提供友好的拖拽动画和组件嵌套解决方案
html5的拖拽，可以精确定位坐标位置
基于鼠标事件的拖拽，自定义的元素拖拽，避免与其他鼠标事件的冲突

# 安装与使用

可视化页面分为流式布局（flow）和绝对布局（position）两种模式，分别对应小屏（手机端）和中屏（PC端）的样式，不同模式下的画布和组件都是可配置的，包括尺寸、背景、前景色等

[小屏（手机端）](http://localhost:8082/)

![](https://global.uban360.com/sfs/file?digest=fid4e5a7b9a854ea65f9fc56aa83be185a3&fileType=2)

[中屏（PC端）](http://localhost:8082/)

![](https://global.uban360.com/sfs/file?digest=fid6114f63270e45320b66d77c9f64d5010&fileType=2)

## 组件列表

框架提供目前只提供6个组件：IocEditor、IocEditorLeft、IocEditorRight,、IocDraggable、IocCanvas、IocContainerDrop

[IocEditor](https://github.com/shinemofe/ioc-editor/blob/master/src/packages/editor/index.vue)

IocEditor 主题样式框架，确保使用是在App.vue中设置宽高，一般都是 100vw/vh

属性配置：

|  属性    | 功能描述  | 是否必填 | 可选值 |
|  ----   | ----  | ---- |
|  v-model | 可视化框架对象 | true | { components: [], iocEditor: {} }，components 保存当前画布中的组件列表， iocEditor属性会返回可视化框架实例 |
|  mode   | 可视化布局模式  | true | flow - 流式布局，对应小屏（手机端样式）,position - 绝对布局，对应中屏屏（PC端样式）|


[IocEditorLef](https://github.com/shinemofe/ioc-editor/blob/master/src/packages/editor/index.vue)

IocEditorLeft 仅提供左侧栏布局，需要和 IocDraggable 使用，表示左侧需要拖拽的组件资源

[IocEditorLeft](https://github.com/shinemofe/ioc-editor/blob/master/src/packages/editor/index.vue)

IocDraggable 声明需要拖拽的元素

属性配置：

|  属性    | 功能描述 | 是否必填 | 可选值 |
|  ----   | ----  | ---- |
|  item | 拖拽的参数 | true | 如果item中包含 init() 初始化方法，会调用 init() 返回初始化后的对象（主要是ID），如果没有，则返回 { ...item, id: Date.now() } |

```html
<template>
  <ioc-editor-left>
    <div class="left">
      <div clas="group">
        <div class="group__header">
          组件
        </div>
        <div class="group__content">
          <ioc-draggable
            v-for="item in items"
            :key="item.id"
            :item="item"
            class="material"
          >
            {{item.title}}
          </ioc-draggable>
        </div>
      </div>
    </div>
  </ioc-editor-left>
</template>
<script>
import IocEditorLeft from '@/packages/left'
import IocDraggable from '@/packages/left/draggable'
export default {
  name: 'left',

  components: {
    IocEditorLeft,
    IocDraggable
  },

  data () {
    return {
      items: [
        {
          title: '组件1',
          content: '哈哈哈，我是组件1'
        },
        {
          title: '组件2',
          content: '哈哈哈，我是组件2'
        },
        {
          title: '组件3',
          content: '哈哈哈，我是组件3',
          init: () => {
            return {
              title: '组件3',
              id: Date.now(),
              content: '哈哈哈，我是初始化之后的组件3'
            }
          }
        }
      ]
    }
  }
}
</script>
</style>

```

[IocCanvas](https://github.com/shinemofe/ioc-editor/blob/master/src/packages/editor/index.vue)

IocCanvas表示是画布区域，需要配置自定义的渲染组件，用于渲染左侧拖入组件的样式，当需要对画布做定制化需求时，可以配置画布的参数

属性配置：

|  属性    | 功能描述  | 是否必填 | 可选值 |
|  ----   | ----  | ---- |
|  canvas | 画布对象  | false | 目前只支持配置画布的前景色 color、背景色 backgroundColor、背景图片 backgroundImage，画布尺寸 size: { width, height }，小屏默认配置：{ color: 'black', backgroundColor: 'white', size: { width: 375, height: 680 } }, 中屏默认配置：{ color: 'white', backgroundColor: 'gray', size: { width: 1600, height: 900 } }
|  component-render |  自定义的渲染组件  | true | 框架会传入当前组件对象参数 component，用于自定义渲染 |

```html
<template #center>
    <ioc-canvas :component-render="componentRender" :canvas="canvas"/>
</template>

<script>
import ComponentRender from './component-render'
export default {
  name: 'screen',

  components: {
    IocEditor,
  },

  data () {
    return {
      componentRender: ComponentRender, // 组件渲染
    }
  }
}
</script>
```

自定义的渲染组件：component-render.vue
```html
<template>
  <div class="render">
    <div class="render__header">
      {{component.title}}
    </div>
    <div class="render__content">
      坐标：({{component.position.x}},{{component.position.y}})
      <br />
      尺寸：({{component.size.width}},{{component.size.height}})
    </div>
  </div>
</template>
<script>

export default {
  name: 'screen-render',

  props: {
    component: {
      type: Object,
      require: true
    }
  }
}
</script>
```

[IocContainerDrop](https://github.com/shinemofe/ioc-editor/blob/master/src/packages/editor/index.vue)

IocContainerDrop 是画布中的容器组件，可以通过容器来对组件进行分组

属性配置：

|  属性    | 功能描述 | 是否必填 | 可选值 |
|  ----   | ----  | ---- |
|  pid | 容器所属的组件id | false | 组件的都是通过pid分组的，不传为 undefined，如果是子层级，则必填  |
|  group | 容器内的组名 | false | 当前容器的组名，默认是 container |
|  can-drop | 是否可放置 | false | 接受两个参数: group 当前容器的组名，source，当前拖拽的组件内容，返回 true 表示可放置，false 表示不可放置，默认返回 true |

IocEditorRight

IocEditorLeft 提供右侧栏布局，并接受当前选中的组件

```html
<template>
  <ioc-editor-right #default="{ selectComponent }">
    <div class="info" v-if="selectComponent">
      自定义的组件配置
    </div>
    <div v-else>
      右侧配置栏
    </div>
  </ioc-editor-right>
</template>

<script>
export default {
  name: 'right',
  inject: ['iocEditor', 'updateComponent'],

  methods: {
    onChange (value) {
		// 更新组件配置
    this.updateComponent(value)
    }
  }
}
</script>

```

## 安装

指定公司的npm源安装

```bash
cnpm --registry=http://10.0.10.59:7001 install @xm/ioc-editor -S
```
或
```bash
xnpm install @xm/ioc-editor -S
```

## 使用

使用时需在main.js引入库

```js
import '@xm/ioc-editor'
```

可视化页面主题分为四个部分：头部操作栏、左侧组件栏、中间画布区域、右侧配置栏

![](https://global.uban360.com/sfs/file?digest=fideb50d576b9e6abbe88e352784cdcf8be&fileType=2)

可视化框架对这四个区域添加基本样式，对外透出四个插槽header、left、canvas、right，用于自定义内容

```html
<template>
  <ioc-editor mode="position" v-model="screen" >
    <template #header>
      <div class="header">
        自定义的头部内容
      </div>
    </template>
    <template #left>
      <div class="left">
        自定义的左侧内容
      </div>
    </template>
    <template #canvas>
      <ioc-canvas :component-render="componentRender" :canvas="canvas"/>
    </template>
    <template #right>
      <div class="right">
        自定义的右侧内容
      </div>
    </template>
  </ioc-editor>
</template>
```

# 总结

中屏可视化框架的功能相对比较简单，主要整合了平常比较多见的可视化页面的基本功能，避免重复工作，提高开发效率，如果有特别定制化的需求，也可以在此基础上持续优化

# 参考文献

-   [可视化拖拽组件库一些技术要点原理分析](https://juejin.cn/post/6908502083075325959)
-   [轻松教你搞定组件的拖拽, 缩放, 多控制点伸缩和拖拽数据上报](https://juejin.cn/post/6917648021794586631)

# 推荐文章

-	[玩一下低代码框架amis，并动手封装一个表情输入框组件](https://juejin.cn/post/6918589906675728391)

