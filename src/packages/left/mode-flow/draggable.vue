<template>
  <smooth-container
    :get-child-payload="init"
    behaviour="copy"
    class="ioc-mode-flow-draggable"
  >
    <smooth-draggable>
      <slot></slot>
    </smooth-draggable>
  </smooth-container>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'
export default {
  name: 'ioc-mode-flow-draggable',

  components: {
    SmoothContainer: Container,
    SmoothDraggable: Draggable
  },

  props: {
    item: {
      type: Object,
      require: true
    }
  },

  methods: {
    init () {
      const { init, ...rest } = this.item
      if (typeof init === 'function') {
        return init()
      }
      return {
        ...rest,
        id: Date.now()
      }
    }
  }
}
</script>
