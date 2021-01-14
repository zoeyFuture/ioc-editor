<template>
  <ioc-editor-right #default="{ selectComponent }">
    <div class="info" v-if="selectComponent">
      {{selectComponent.title}}
      <br />
      坐标：({{selectComponent.position.x}},{{selectComponent.position.y}})
      <br />
      尺寸：({{selectComponent.size.width}},{{selectComponent.size.height}})
    </div>
  </ioc-editor-right>
</template>
<script>
import { IocEditorRight } from '@'
export default {
  name: 'right',

  components: {
    IocEditorRight
  }
}
</script>
