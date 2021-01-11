import {
  Container as SmoothContainer,
  Draggable as SmoothDraggable
} from 'vue-smooth-dnd'

import Editor from './editor'
import EditorLeft from './left'
import Draggable from './left/draggable'
import EditorRight from './right'
import Canvas from './canvas'
import ContainerDrop from './canvas/container-drop'
import ContextMenu from './context-menu'

const components = [
  Editor,
  EditorLeft,
  Draggable,
  EditorRight,
  Canvas,
  ContainerDrop,
  ContextMenu
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
  Editor,
  EditorLeft,
  EditorRight,
  Canvas,
  ContainerDrop,
  ContextMenu,
  SmoothContainer,
  SmoothDraggable
}

export default {
  install
}
