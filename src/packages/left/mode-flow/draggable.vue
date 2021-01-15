<template>
  <smooth-container
    :get-child-payload="init"
    behaviour="copy"
    class="ioc-mode-flow-draggable"
  >
    <smooth-draggable class="flow-draggable">
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

<style scoped lang="less">

.ioc-mode-flow-draggable {
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  .flow-draggable {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
  }
}

</style>
