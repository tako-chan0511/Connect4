<template>
  <div class="cell" @click="() => $emit('click')">
    <div
      v-if="value"
      class="disc"
      :class="value === 'R' ? 'red' : 'yellow'"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, PropType } from 'vue';
type CellValue = 'R' | 'Y' | null;
const props = defineProps({
  value: { type: String as PropType<CellValue>, required: false }
});
</script>

<style scoped>
.cell {
  width: 40px;
  height: 40px;
  border: 1px solid #333;
  background: #00a;
  box-sizing: border-box;
  position: relative;
}
.disc {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin: 4px;
}
.disc.red {
  background: red;
}
.disc.yellow {
  background: gold;
}
</style>
