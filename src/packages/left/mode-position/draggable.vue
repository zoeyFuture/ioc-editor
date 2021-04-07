<template>
  <div
    :draggable="draggable"
    class="ioc-mode-position-draggable"
    @mousedown.stop
    @dragstart.stop="onDragStart"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ioc-mode-position-draggable',

  props: {
    item: {
      type: Object,
      require: true
    },

    draggable: {
      type: Boolean,
      default: () => true
    }
  },

  methods: {
    onDragStart (event) {
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
