<template>
  <component :layer="layer" :is="render"/>
</template>
<script>
export default {
  name: 'ioc-mode-position-render',
  inject: ['render', 'iocEditor'],
  props: {
    layer: {
      type: Object,
      require: true
    }
  }
}
</script>
