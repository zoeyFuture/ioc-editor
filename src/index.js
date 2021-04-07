// import IocEditor from '@/packages/editor'
// import IocEditorLeft from '@/packages/left'
// import IocEditorRight from '@/packages/right'
// import IocDraggable from '@/packages/left/draggable'
// import IocCanvas from '@/packages/canvas'
// import IocContainerDrop from '@/packages/canvas/container-drop'

import IocEditor from './packages/editor'
import IocEditorLeft from './packages/left'
import IocEditorRight from './packages/right'
import IocDraggable from './packages/left/draggable'
import IocCanvas from './packages/canvas'
import IocContainerDrop from './packages/canvas/container-drop'

import {
  Container as SmoothContainer,
  Draggable as SmoothDraggable
} from 'vue-smooth-dnd'

const components = [
  IocEditor,
  IocEditorLeft,
  IocEditorRight,
  IocDraggable,
  IocCanvas,
  IocContainerDrop
]

const install = function (Vue) {
  // 事件总线
  if (!Vue.prototype.$eventBus) {
    Vue.prototype.$eventBus = new Vue()
  }
  components.forEach(component => {
    Vue.component(component.name, component)
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
