<template>
  <div class="movie-carousel">
    <h2 class="movie-carousel__title p-4 flex flex-row justify-between text-lg font-semibold">
      Now playing 
      <span class="see-all flex items-end text-sm font-semibold">See all</span>
    </h2>
    <Carousel :itemsToShow="1.8" :wrapAround="true" :transition="500">
      <Slide v-for="movie in movies" :key="movie._id" @click="selectMovie(movie._id)">
        <div class="carousel__item">
          <img :src="movie.poster || defaultImage" :alt="movie.title" class="movie-poster">
          <h3 class="movie-title" :title="movie.title">{{ movie.title }}</h3>
          <p class="movie-genre">{{ movie.genre.join(', ') }}</p>
        </div>
      </Slide>
      <template #addons>
        <Pagination class="custom-pagination" />
      </template>
    </Carousel>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Carousel, Slide, Pagination } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

export default defineComponent({
  name: 'MovieCarousel',
  components: {
    Carousel,
    Slide,
    Pagination,
  },
  data() {
    return {
      movies: [],
      defaultImage: 'src/assets/img/default_poster.png' // Ruta de la imagen por defecto
    }
  },
  mounted() {
    this.fetchMovies();
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await fetch('http://localhost:5000/movies/v1'); // Obtener las películas
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Procesar la data para ajustar el formato
        this.movies = data.map(movie => ({
          _id: movie._id,
          title: movie.title,
          genre: movie.genre,
          poster: movie.poster || '', // Asigna poster o una cadena vacía si no existe
        }));
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    },
    selectMovie(movieId) {
      sessionStorage.setItem('selectedMovieId', movieId); // Guardar el ID en sessionStorage
      this.$router.push('/cinema'); // Redirigir a la vista /cinema
    }
  },
})
</script>


<style>
.movie-carousel {
  width: 100%;
  margin: 0 auto;
}

.movie-carousel__title {
  margin-bottom: 20px;
  color: white;
}

.see-all {
  margin-left: 10px;
  color: #FE0000;
}

.carousel__viewport {
  perspective: 2000px;
}

.carousel__track {
  transform-style: preserve-3d;
}

.carousel__slide--sliding {
  transition: 0.5s;
}

.carousel__slide {
  padding: 5px;
  opacity: 0.9;
  transform: rotateY(-20deg) scale(0.9);
}

.carousel__slide--active~.carousel__slide {
  transform: rotateY(20deg) scale(0.9);
}

.carousel__slide--prev {
  opacity: 1;
  transform: rotateY(-10deg) scale(0.95);
}

.carousel__slide--next {
  opacity: 1;
  transform: rotateY(10deg) scale(0.95);
}

.carousel__slide--active {
  opacity: 1;
  transform: rotateY(0) scale(1.1);
}

.movie-poster {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 15px;
}

.movie-title {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  color: white;
  max-width: 100%; /* Limita el ancho máximo */
  overflow: hidden; /* Oculta el texto desbordante */
  white-space: nowrap; /* Evita que el texto se divida en varias líneas */
  text-overflow: ellipsis; /* Muestra "..." al final */
}

.movie-genre {
  font-size: 14px;
  color: gray;
}

.carousel__item {
  width: 204px;
  height: 405px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.carousel__pagination-button::after {
  display: block;
  content: '';
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 100px;
}

.carousel__pagination-button--active::after {
  background-color: #FE0000;
  width: 24px;
}
</style>
