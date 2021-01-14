<template>
  <div class="ioc-editor-left">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ioc-editor-left',

  inject: ['iocEditor']
}
</script>

<style>
.ioc-editor-left {
  width: 300px;
  height: 100%;
  background-color: white;
  border: 1px solid #e8e8e8;

  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
}
</style>
