import IocEditor from '@/packages/editor'
import IocEditorLeft from '@/packages/left'
import IocEditorRight from '@/packages/right'
import IocDraggable from '@/packages/left/draggable'
import IocCanvas from '@/packages/canvas'
import IocContainerDrop from '@/packages/canvas/container-drop'

import {
  Container as SmoothContainer,
  Draggable as SmoothDraggable
} from 'vue-smooth-dnd'

const components = {
  IocEditor: '@/packages/editor',
  IocEditorLeft: '@/packages/left',
  IocEditorRight: '@/packages/right',
  IocDraggable: '@/packages/left/draggable',
  IocCanvas: '@/packages/canvas',
  IocContainerDrop: '@/packages/canvas/container-drop'
}

const install = function (Vue) {
  // 事件总线
  if (!Vue.prototype.$eventBus) {
    Vue.prototype.$eventBus = new Vue()
  }
  Object.keys(components).map(name => {
    Vue.component(name, () => import(components[name]))
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  IocEditor,
  IocEditorLeft,
  IocEditorRight,
  IocDraggable,
  IocCanvas,
  IocContainerDrop,
  SmoothContainer,
  SmoothDraggable
}
