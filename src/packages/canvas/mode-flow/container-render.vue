<template>
  <div
    :class="{'is-select': isSelect}"
    class="ioc-mode-flow-render"
    @click.stop="handleSelect"
  >
    <component
      :is="componentRender"
      :component="component"
    />
    <div class="ioc-mode-flow-render__operation">
      <Icon
        type="close"
        @click.stop="handleDelete"
      />
    </div>
  </div>
</template>
<script>
import { Icon } from 'ant-design-vue'
export default {
  name: 'ioc-mode-flow-render',

  components: {
    Icon
  },

  props: {
    component: {
      type: Object,
      require: true
    }
  },

  inject: [
    'iocEditor',
    'componentRender'
  ],

  computed: {
    isSelect () {
      return this.iocEditor.select === this.component.id
    }
  },

  methods: {
    handleSelect () {
      this.iocEditor.setSelect(this.component.id)
    },

    handleDelete () {
      this.iocEditor.removeComponent(this.component.id)
    }
  }
}
</script>

<style scoped lang="less">
@activeColor: #2266FF;
.ioc-mode-flow-render {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 2px;
  border: 1px solid currentColor;
  position: relative;
  min-height: 80px;

  &:hover,
  &.is-select {
    z-index: 999 !important;
    border: 1px solid #2266FF;
  }

  &__operation {
    position: absolute;
    border: 1px solid @activeColor;
    top: -1px;
    right: -1px;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #ffffff;
    background: @activeColor;
    cursor: pointer;
    display: none;
  }

  &.is-select {
    border: 1px solid @activeColor;
    border-radius: 2px;
    & > .ioc-mode-flow-render__operation {
      display: flex;
    }
  }
}
</style>
