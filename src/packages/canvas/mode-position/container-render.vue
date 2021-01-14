<template>
  <component
    :is="componentRender"
    :component="component"
  />
</template>
<script>
export default {
  name: 'ioc-mode-position-render',

  props: {
    component: {
      type: Object,
      require: true
    }
  },

  inject: [
    'iocEditor',
    'componentRender'
  ]
}
</script>
