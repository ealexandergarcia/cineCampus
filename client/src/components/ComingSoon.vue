<template>
    <div class="text-white p-4">
      <h2 class="pb-4 flex flex-row justify-between text-lg font-semibold">
        Coming Soon 
        <span class="see-all flex items-end text-sm font-semibold">See all</span>
      </h2>
      <div class="overflow-y-auto max-h-[400px] mb-20"> <!-- Ajusta la altura según lo necesites -->
        <div 
          v-for="movie in movies" 
          :key="movie._id" 
          class="flex w-full bg-[#272727] p-2 rounded-lg mb-4"
        >
          <div 
            class="w-20 h-20 bg-cover rounded-2xl"
            :style="{ backgroundImage: `url(${movie.poster || defaultImage})` }"
          ></div>
          <div class="ml-[19px] w-[70%]">
            <p class="text-base font-medium text-left">{{ movie.title }}</p>
            <p class="text-xs font-medium text-left">{{ movie.genre.join(', ') }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ComingSoon',
    data() {
      return {
        movies: [],
        defaultImage: 'src/assets/img/default_poster.png', // Ruta de la imagen por defecto
      };
    },
    mounted() {
      this.fetchComingSoonMovies();
    },
    methods: {
      async fetchComingSoonMovies() {
        try {
          const response = await fetch('http://localhost:5000/movies/coming-soon');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
  
          // Procesar la data
          this.movies = data.map(movie => ({
            _id: movie._id,
            title: movie.title,
            genre: movie.genre,
            poster: movie.poster
          }));
        } catch (error) {
          console.error('Error fetching coming soon movies:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* No se necesita CSS adicional ya que Tailwind cubre todo */
  </style>
  