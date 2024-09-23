<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="flex flex-col items-center justify-center bg-black">
    <a href="https://vitejs.dev" target="_blank" class="p-6 transition duration-300 hover:drop-shadow-lg">
      <img src="/vite.svg" class="h-24" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank" class="p-6 transition duration-300 hover:drop-shadow-lg">
      <img src="./assets/vue.svg" class="h-24" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
/* Puedes eliminar el CSS antiguo, ya que hemos adaptado los estilos con Tailwind */
</style>
