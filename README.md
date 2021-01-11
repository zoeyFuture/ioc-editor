todo 

- [x] 加上 eslint-standard
- [x] template 里都是 a-b 的格式
- [x] 目录结构应该都是 a-b 格式
- [x] editor 改为画布 canvas
- [x] editor/mobile 改为 canvas/mode-flow
- [x] editor/screen 改为 canvas/mode-position

```
- canvas
  - mode-flow
    - container-drop.vue
    - container-render.vue
    - index.vue
  - mode-position
    - container-drop.vue
    - container-render.vue
    - index.vue
    - container-multi-select.vue
    - container-operator.vue
  - index.vue
  - container-drop.vue
  - container-render.vue
```

## Usage

### canvas

```vue
<template>
  <ioc-editor mode="flow|position">
    <template #header>
      自定义功能，如重置、上一步、下一步、预览、保存等
    </template>
    <template #editor-left>
      <ioc-editor-left>
        左侧资源栏
      </ioc-editor-left>
    </template>
    <template #editor-center>
      <ioc-canvas render="self-layer-render">
        中间画布区域
      </ioc-canvas>
    </template>
    <template #editor-right>
      <ioc-editor-right>
        右侧配置栏
      </ioc-editor-right>
    </template>
  </ioc-editor>
</template>

<script>
import { Editor, EditorLeft, EditorRight, Canvas, ContainerDrop, Draggable } from 'ioc-editor'
</script>
```
