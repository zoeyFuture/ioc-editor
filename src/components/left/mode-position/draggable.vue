<template>
  <div
    draggable="true"
    @mousedown="onMouseDown"
    @dragstart="onDragStart"
    class="ioc-mode-position-draggable"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ioc-mode-position-draggable',
  props: {
    item: {
      type: Object,
      require: true
    }
  },
  methods: {
    onMouseDown (event) {
      event.stopPropagation()
    },
    onDragStart (event) {
      event.stopPropagation()
      const { init, ...rest } = this.item
      if (typeof init === 'function') {
        event.dataTransfer.setData('item', JSON.stringify(init()))
      } else {
        event.dataTransfer.setData('item', JSON.stringify({
          ...rest,
          id: Date.now()
        }))
      }
    }
  }
}
</script>

<style>
.ioc-mode-position-draggable {
  width: max-content;
  height: max-content;
}
</style>
