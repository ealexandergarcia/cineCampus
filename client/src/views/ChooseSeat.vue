<template>
  <div class="bg-[#121212] min-h-screen flex flex-col">
    <CinemaHeader title="Choose Seat" homeRoute="/cinema" />
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
