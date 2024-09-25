<template>
  <div class="bg-[#121212] min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow">
        <NowPlayingCarousel />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import NowPlayingCarousel from "../components/NowPlayingCarousel.vue";
// import MovieList from './components/MovieList.vue'

export default {
  components: { Header, Footer, NowPlayingCarousel }
}
</script>

<style scoped>
/* No es necesario CSS adicional aquí, Tailwind maneja el layout */
</style>