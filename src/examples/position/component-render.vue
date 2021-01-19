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
  name: 'position-render',

  props: {
    component: {
      type: Object,
      require: true
    }
  }
}
</script>

<style scoped lang="less">
.render {
  width: 100%;
  height: 100%;
  display: flex;
  align-self: center;
  justify-content: flex-start;
  flex-direction: column;
  cursor: pointer;
  padding: 4px;
  background-color: gray;

  &__header {
    width: 100%;
    height: 32px;
    line-height: 32px;
  }

  &__content {
    width: 100%;
    flex: 1;
  }
}
</style>
