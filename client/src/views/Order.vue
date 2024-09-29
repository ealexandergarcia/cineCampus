<template>
    <div class="flex flex-col h-screen bg-gray-900 text-white">

        <div class="bg-[linear-gradient(-128deg,_rgba(39,39,39,0)_0%,_rgba(39,39,39,1)_100%)]">
            <!-- Your content here -->
            <!-- Header -->
            <CinemaHeader title="Order Summary" homeRoute="/ChooseSeat" />
        
            <!-- Movie Info -->
            <div class="flex p-4" v-if="movie">
              <img :src="movie.poster" :alt="movie.title" class="w-24 h-36 object-cover rounded-lg mr-4" />
              <div>
                <h2 class="text-xl font-bold text-red-600">{{ movie.title }}</h2>
                <p class="text-sm text-gray-400">{{ movie.genre.join(', ') }}</p>
                <p class="text-sm mt-2">HARTONO MALL</p>
                <p class="text-sm text-gray-400">{{ formattedDate }}. {{ showing.time }}</p>
              </div>
            </div>
        </div>

  
      <!-- Order Details -->
      <div class="px-4 py-2 bg-black" v-if="orderDetails">
        <p class="text-sm text-gray-400">ORDER NUMBER : 123456786</p>
      </div>
  
      <div class="p-4 space-y-2">
        <div class="flex justify-between" v-for="(group, index) in groupedSeats" :key="index">
          <span>{{ group.type.toUpperCase() }} SEAT</span>
          <span>${{ group.price }} x {{ group.count }}</span>
        </div>
        <div class="flex justify-between">
          <span>ROOM PRICE</span>
          <span>${{ room }}</span>
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
        movie: null,
        showing: null,
        room:null,
        selectedSeats: [],
        selectedSeatsDetails: [],
        groupedSeats: [],
        timeLeft: 300,
        orderDetails: null
      }
    },
    computed: {
      formattedDate() {
        if (this.showing) {
          const date = new Date(this.showing.date)
          return date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
        }
        return ''
      },
      formattedTimeLeft() {
        const minutes = Math.floor(this.timeLeft / 60)
        const seconds = this.timeLeft % 60
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      }
    },
    methods: {
      async fetchMovieDetails() {
        const movieId = sessionStorage.getItem('selectedMovieId')
        const response = await fetch(`http://localhost:5000/movies/v1/${movieId}`)
        const data = await response.json()
        this.movie = data
      },
      async fetchShowingDetails() {
        const movieId = sessionStorage.getItem('selectedMovieId')
        const response = await fetch(`http://localhost:5000/showings/${movieId}/availability`)
        const data = await response.json()
  
        const showingId = sessionStorage.getItem('selectedShowingId')
  
        // Filtrar la función seleccionada
        this.showing = data.find(s => s.showingIds.includes(showingId))
        this.room = this.showing.room.price
        console.log(this.showing.time);
        
  
        // Obtener detalles de los asientos seleccionados
        this.selectedSeats = JSON.parse(sessionStorage.getItem('selectedSeats')) || []
        this.selectedSeatsDetails = this.showing.availableSeats.filter(seat => this.selectedSeats.includes(seat.name))
  
        // Agrupar asientos por tipo y precio
        this.groupSeats()
      },
      groupSeats() {
        const seatGroups = {}
  
        this.selectedSeatsDetails.forEach(seat => {
          const key = `${seat.type}-${seat.price}`
          if (!seatGroups[key]) {
            seatGroups[key] = {
              type: seat.type,
              price: seat.price,
              count: 0
            }
          }
          seatGroups[key].count++
        })
  
        this.groupedSeats = Object.values(seatGroups)
      }
    },
    mounted() {
      this.fetchMovieDetails()
      this.fetchShowingDetails()
  
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
  