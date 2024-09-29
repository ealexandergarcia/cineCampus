<template>
  <div class="flex flex-col h-screen bg-gray-900 text-white">
    <div class="bg-[linear-gradient(-128deg,_rgba(39,39,39,0)_0%,_rgba(39,39,39,1)_100%)]">
      <!-- Header -->
      <CinemaHeader title="Order Summary" homeRoute="/ChooseSeat" />

      <!-- Movie Info -->
      <div class="flex p-4 pb-11 gap-[15px]" v-if="movieTitle">
        <img :src="moviePoster" :alt="movieTitle" class="w-28 h-36 object-cover rounded-lg" />
        <div class="w-[70%] text-left">
          <h2 class="text-base font-semibold text-red-600">{{ movieTitle }}</h2>
          <p class="text-[13px] font-semibold text-gray-400">{{ movieGenre }}</p>
          <p class="text-sm mt-4">Campus Cinemas</p>
          <p class="text-sm text-gray-400">{{ formattedDate }}</p>
        </div>
      </div>
    </div>

    <!-- Order Details -->
    <div class="px-4 py-2 bg-black text-left" v-if="orderId">
      <p class="text-[13px] text-gray-400">
        ORDER NUMBER: <span class="text-white">{{ orderId }}</span>
      </p>
    </div>



    <div class="px-4 space-y-2">
      <div class="pt-6 pb-4 flex justify-between text-gray-400 border-b border-gray-400" v-for="(group, index) in groupedSeats" :key="index">
        <span>{{ group.type.toUpperCase() }} SEAT</span>
        <span>${{ group.price }} x {{ group.count }}</span>
      </div>
      <div class="py-4 flex justify-between text-gray-400 border-b border-gray-400">
        <span>ROOM PRICE</span>
        <span>${{ roomPrice }}</span>
      </div>
    </div>

    <!-- Payment Method -->
    <div class="p-4">
      <h3 class="text-lg mb-2">Payment method</h3>
      <div class="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
        <div class="flex items-center">
          <img src="../assets/img/palomitas.png" alt="MasterCard" class="w-10 h-6 object-contain mr-3" />
          <span>**** **** **** 7865</span>
        </div>
        <div class="w-4 h-4 bg-red-600 rounded-full"></div>
      </div>
    </div>

    <!-- Payment Timer -->
    <div class="mx-4 mb-4">
      <div class="bg-red-900 text-red-500 p-3 rounded-lg flex items-center justify-between">
        <span>Complete your payment in</span>
        <span class="font-bold">{{ formattedTimeLeft }}</span>
      </div>
    </div>

    <!-- Buy Button -->
    <div class="mt-auto p-4">
      <button class="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold">
        Buy ticket
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import CinemaHeader from '../components/CinemaHeader.vue'

export default {
  components: { CinemaHeader },
  data() {
    return {
      movieTitle: null,
      moviePoster: null,
      movieGenre: null,
      showingTime: null,
      roomPrice: null,
      orderId: null,
      selectedSeats: [],
      groupedSeats: [],
      timeLeft: 300
    }
  },
  computed: {
    formattedDate() {
    if (this.showingTime) {
      console.log(this.showingTime);
      
      // Convertir la cadena de fecha a un objeto Date
      const date = new Date(this.showingTime);
      console.log(date);
      
      // Obtener fecha en formato deseado
      const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });

      // Obtener hora en formato 24 horas (13:00)
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      return `${formattedDate}. ${formattedTime}`;
    }
    return '';
  },
    formattedTimeLeft() {
      const minutes = Math.floor(this.timeLeft / 60)
      const seconds = this.timeLeft % 60
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
  },
  methods: {
    async fetchMovementDetails() {
      try {
        const movementId = sessionStorage.getItem('movementId')
        const response = await fetch(`http://localhost:5000/movements/v1/${movementId}`)
        const data = await response.json()
        const movement = data.movement

        // Guardar los datos del movimiento
        this.orderId = movement._id
        this.roomPrice = movement.room.price
        this.selectedSeats = movement.seats ? JSON.parse(movement.seats[0]) : []
        this.showingTime = movement.showing.datetime
        // Obtener el movieId y realizar la solicitud de detalles de la película
        const movieId = movement.showing.movie
        await this.fetchMovieDetails(movieId)

        // Obtener el tiempo y la agrupación de los asientos
        this.showingTime = movement.showing.datetime
        this.groupSeats(movement.showing.availableSeats)
      } catch (error) {
        console.error('Error fetching movement details:', error)
      }
    },

    async fetchMovieDetails(movieId) {
      try {
        const response = await fetch(`http://localhost:5000/movies/v1/${movieId}`)
        const movieData = await response.json()

        // Guardar los datos de la película
        this.movieTitle = movieData.title
        this.moviePoster = movieData.poster
        this.movieGenre = Array.isArray(movieData.genre) ? movieData.genre.join(', ') : ''
      } catch (error) {
        console.error('Error fetching movie details:', error)
      }
    },

    groupSeats(availableSeats) {
      const seatGroups = {}

      this.selectedSeats.forEach(seatName => {
        const seat = availableSeats.find(s => s.name === seatName)
        if (seat) {
          const key = `${seat.type}-${seat.price}`
          if (!seatGroups[key]) {
            seatGroups[key] = {
              type: seat.type,
              price: seat.price,
              count: 0
            }
          }
          seatGroups[key].count++
        }
      })

      this.groupedSeats = Object.values(seatGroups)
    }
  },
  mounted() {
    this.fetchMovementDetails()

    const timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--
      } else {
        clearInterval(timer)
      }
    }, 1000)

    onUnmounted(() => {
      clearInterval(timer)
    })
  }
}
</script>

<style scoped>
.bg-black {
  background-color: #121212;
}
.bg-gray-900 {
  background-color: #181818;
}
</style>
