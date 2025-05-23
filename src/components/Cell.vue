<template>
  <div class="cell" @click="$emit('click')">
    <!-- value が 'R' or 'Y' のときだけディスクを描画 -->
    <div
      v-if="value"
      :class="['disc', value === 'R' ? 'red' : 'yellow']"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

type CellValue = 'R' | 'Y' | null;
const props = defineProps<{
  value: CellValue;
}>();
</script>

<style scoped>
.cell {
  width: 50px;
  height: 50px;
  margin: 2px;
  background-color: #99ccff; /* ホールを薄い青で */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.disc {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
}

.red {
  background-color: #e74c3c;
}

.yellow {
  background-color: #f1c40f;
}
</style>
