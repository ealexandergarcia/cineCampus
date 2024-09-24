<template>
  <div class="bg-[#121212] min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow">
      <MovieList />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
// import MovieList from './components/MovieList.vue'

export default {
  name: 'App',
  components: { Header, Footer }
}
</script>

<style scoped>
/* No es necesario CSS adicional aquí, Tailwind maneja el layout */
</style>
