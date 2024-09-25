<template>
  <div class="bg-[#121212] min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow">
        <NowPlayingCarousel />
        <ComingSoon/>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import NowPlayingCarousel from "../components/NowPlayingCarousel.vue";
import ComingSoon from "../components/ComingSoon.vue";
// import MovieList from './components/MovieList.vue'

export default {
  components: { Header, Footer, NowPlayingCarousel, ComingSoon}
}
</script>

<style scoped>
/* No es necesario CSS adicional aquí, Tailwind maneja el layout */
</style>