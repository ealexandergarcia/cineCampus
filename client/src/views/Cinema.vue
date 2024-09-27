<template>
  <div class="bg-[#121212] min-h-screen flex flex-col text-white">
    <CinemaHeader title="Cinema Selection" homeRoute="/home" />

    <!-- Poster de la película -->
    <div class="w-full px-3">
      <div
        class="w-full h-[204px] bg-cover rounded-2xl"
        :style="{ backgroundImage: `url(${movie.poster})` }"
      ></div>
    </div>

    <!-- Detalles de la película -->
    <div class="w-full">
      <div class="w-full h-14 mt-2 px-8 flex justify-between">
        <div class="w-3/4">
          <p class="text-sm font-semibold text-left">{{ movie.title }}</p>
          <p class="text-xs font-medium text-left text-gray-400">{{ movie.genre.join(", ") }}</p>
        </div>
        <button class="flex items-center gap-2 w-28 h-7 rounded-lg p-2 bg-[#FE0000]">
          <img src="../assets/img/watch.svg" alt="Watch Icon" class="w-3 h-3" />
          <p class="text-[10px] font-semibold">Watch Trailer</p>
        </button>
      </div>

      <!-- Sinopsis -->
      <div class="w-full mt-2 px-8">
        <p class="text-justify text-xs font-medium">{{ movie.synopsis }}</p>
      </div>

      <!-- Reparto -->
      <div class="w-full mt-5 pl-8 flex flex-col">
        <p class="text-base font-semibold text-left">Cast</p>
        <div class="flex overflow-x-auto gap-3 scrollbar-thin">
          <div v-for="actor in movie.cast" :key="actor.name" class="flex gap-1 items-center">
            <img :src="actor.photo" :alt="actor.name" class="w-10 h-10 rounded-full" />
            <div class="w-3/4 flex flex-col justify-center">
              <p class="text-[9px] font-semibold text-left">{{ actor.name }}</p>
              <p class="text-[9px] font-light text-left text-gray-400">{{ actor.role }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Cinema -->
      <div class="w-full mt-5 px-8 flex flex-col">
        <p class="text-base font-semibold text-left">Cinema</p>
        <div class="w-full h-14 mt-2 rounded-2xl py-2 px-4 bg-[#272727] flex items-center justify-between border-2 border-transparent hover:border-red-500 transition-all duration-200">
          <div class="w-3/4">
            <p class="text-sm font-semibold text-left">Campus Cinemas</p>
            <p class="text-xs font-medium text-left text-gray-400">Staff Lines, Saddar, Karachi</p>
          </div>
          <img src="https://campuslands.com/img/logoWhite.png" alt="Cinema Logo" class="w-24 h-10" />
        </div>
      </div>
      
      <!-- Botón para reservar -->
      <div class="fixed bottom-0 left-0 w-full px-8 text-white h-[93px] flex items-center justify-center">
        <button 
          class="bg-[#FE0000] h-12 w-full rounded-2xl" 
          @click="goToChooseSeat"
        >
          Book Now
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CinemaHeader from "../components/CinemaHeader.vue";

export default {
  components: { CinemaHeader },
  data() {
    return {
      movie: {
        title: "",
        genre: [],
        poster: "",
        synopsis: "",
        cast: [],
      },
    };
  },
  methods: {
    fetchMovieData() {
      const movieId = sessionStorage.getItem("selectedMovieId");
      if (movieId) {
        fetch(`http://localhost:5000/movies/v1/${movieId}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            this.movie = data;
          })
          .catch((error) => {
            console.error("Error fetching movie data:", error);
          });
      } else {
        console.error("No selected movie ID found in sessionStorage");
      }
    },
    goToChooseSeat() {
      this.$router.push('/ChooseSeat');
    },
  },
  mounted() {
    this.fetchMovieData();
  },
};
</script>

<style scoped>
/* Utilizando solo Tailwind para los estilos */
</style>
