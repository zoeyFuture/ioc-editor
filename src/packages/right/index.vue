<template>
  <div class="ioc-editor-right">
    <slot :select-component="iocEditor.selectComponent" />
  </div>
</template>

<script>
export default {
  name: 'ioc-editor-right',

  inject: ['iocEditor']
}
</script>

<style>
.ioc-editor-right {
  width: 300px;
  height: 100%;
  background-color: white;
  border: 1px solid #e8e8e8;

  position: absolute;
  right: 0;
  top: 0;
  z-index: 999;
}
</style>
