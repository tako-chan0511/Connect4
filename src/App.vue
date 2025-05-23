<template>
  <div id="app">
    <!-- タイトル表示 -->
    <header class="app-header">
      <h1>Connect4（立体4並べ）</h1>
    </header>

    <!-- Connect4 ボードコンポーネント -->
    <Connect4Board />
  </div>
</template>

<script setup lang="ts">
import Connect4Board from './components/Connect4Board.vue';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 20px;
}

.app-header h1 {
  margin: 0 0 1rem;
  font-size: 2rem;
  color: #333;
}
</style>
