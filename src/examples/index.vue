<template>
 <div class="examples">
   <Flow v-if="mode === 'flow'" @change="handleChange"/>
   <Position v-if="mode==='position'" @change="handleChange"/>
 </div>
</template>

<script>
import Position from './position'
import Flow from './flow'
export default {
  name: 'examples',

  components: {
    Position,
    Flow
  },

  data () {
    return {
      mode: 'flow'
    }
  },

  methods: {
    handleChange (mode) {
      this.mode = mode
    }
  }
}
</script>

<style>
.examples {
  width: 100%;
  height: 100%;
}
</style>
