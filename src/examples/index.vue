<template>
 <div class="examples">
   <flow
     v-if="mode === 'flow'"
     :key="mode"
     @change="handleChange"
   />
   <position
     v-if="mode==='position'"
     :key="mode"
     @change="handleChange"
   />
 </div>
</template>

<script>
import Flow from './flow'
import Position from './position'
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
