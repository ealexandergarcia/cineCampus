<template>
  <div class="bg-[#121212] min-h-screen flex flex-col text-white">
    <CinemaHeader title="Cinema Selection" homeRoute="/home" />
    <div class="w-full px-3">
      <div class="w-full h-[204px] bg-cover rounded-2xl" :style="{ backgroundImage: `url(src/assets/img/rapido.png)` }"></div>
    </div>
    <div class="w-full">
      <div class="w-full h-[40px] mt-[10px] px-[30px] flex justify">
        <div class=" w-[70%]">
            <p class="text-base font-medium text-left">Puss in boots the last wish</p>
            <p class="text-xs font-medium text-left">Action, Adventure</p>
          </div>
        <button class="flex items-center gap-2 w-28 h-7 rounded-lg p-2 bg-[#FE0000]">
          <img src="../assets/img/watch.svg" alt="Icono de acciones" class="w-3 h-3">
          <p class="text-xs font-semibold">Watch Trailer</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CinemaHeader from '../components/CinemaHeader.vue'

export default {
  components: { CinemaHeader }
}
</script>

<style scoped>
/* No es necesario CSS adicional aquí, Tailwind maneja el layout */
</style>
