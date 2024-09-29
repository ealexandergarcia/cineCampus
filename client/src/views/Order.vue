<template>
  <div class="flex flex-col  bg-gray-900 text-white">
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
      <p class="text-[13px] text-gray-400">
      </p>
    </div>

    <div class="px-4 space-y-2">
      <div class="pt-6 pb-4 flex justify-between text-gray-400 border-b border-gray-400" v-for="(group, index) in groupedSeats" :key="index">
        <span>{{ ticketQuantity }}</span>
        <span>{{ ticketDetailsSeatNames }}</span>
      </div>
      <div class="py-4 flex justify-between text-gray-400 border-b border-gray-400" v-for="(group, index) in groupedSeats" :key="index">
        <span>{{ group.type.toUpperCase() }} SEAT</span>
        <span>${{ group.price }} x {{ group.count }}</span>
      </div>
      <div class="py-4 flex justify-between text-gray-400 border-b border-gray-400">
        <span>ROOM PRICE</span>
        <span>${{ roomPrice }}</span>
      </div>
    </div>

    <!-- Payment Methods Accordion -->
    <div class="p-4 pt-6">
      <h3 class="text-lg mb-2">Payment Method</h3>
      <div v-for="method in paymentMethods" :key="method.type">
        <button @click="toggleMethod(method.type)" class="w-full text-left bg-[#272727] p-3 rounded-lg mb-2 flex justify-between border border-[#fff3]">
          <span>{{ method.label }}</span>
          <span>{{ method.selected ? '-' : '+' }}</span>
        </button>
        <div v-if="method.selected" class="p-3 bg-gray-900 rounded-lg">
          <form @submit.prevent="savePaymentMethod(method.type)">
            <div v-if="method.type === 'credit_card'">
              <label class="block text-gray-400">Card Number</label>
              <input type="text" class="w-full p-2 bg-[#272727] rounded mb-2" placeholder="XXXX XXXX XXXX XXXX" />
            </div>
            <div v-if="method.type === 'debit_card'">
              <label class="block text-gray-400">Card Number</label>
              <input type="text" class="w-full p-2 bg-[#272727] rounded mb-2" placeholder="XXXX XXXX XXXX XXXX" />
            </div>
            <div v-if="method.type === 'paypal'">
              <label class="block text-gray-400">Email</label>
              <input type="email" class="w-full p-2 bg-[#272727] rounded mb-2" placeholder="your-email@example.com" />
            </div>
            <button type="submit" class="w-full bg-red-600 text-white py-2 rounded-lg">
              Save Payment Method
            </button>
          </form>
        </div>
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
      <button @click="buyTicket" class="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold">
        Buy ticket
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import CinemaHeader from '../components/CinemaHeader.vue';

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
      timeLeft: 300,
      paymentMethods: [
        { type: 'credit_card', label: 'Credit Card', selected: false },
        { type: 'debit_card', label: 'Debit Card', selected: false },
        { type: 'paypal', label: 'PayPal', selected: false },
      ],
    };
  },
  computed: {
    formattedDate() {
      if (this.showingTime) {
        const date = new Date(this.showingTime);
        const formattedDate = date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return `${formattedDate}. ${formattedTime}`;
      }
      return '';
    },
    formattedTimeLeft() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },
    ticketQuantity() {
      const count = this.selectedSeats.length;
      return `${count} TICKET${count !== 1 ? 'S' : ''}`;
    },
    ticketDetailsSeatNames() {
      return this.selectedSeats.join(', ');
    },
  },
  methods: {
    toggleMethod(methodType) {
      this.paymentMethods.forEach(method => {
        if (method.type === methodType) {
          method.selected = !method.selected;
        } else {
          method.selected = false; // Cerrar otros métodos
        }
      });
    },
    savePaymentMethod(methodType) {
      console.log(`Selected payment method: ${methodType}`);
      // Aquí puedes guardar el método de pago si lo necesitas
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`); 
      if (parts.length === 2) return parts.pop().split(";").shift(); 
    },
    async fetchMovementDetails() {
      try {
        const movementId = sessionStorage.getItem('movementId');
        if (!movementId) {
          // El movimiento no se encontró, redirigir al login y borrar el movementId
          this.$router.push('/login'); // Cambia '/login' por la ruta de tu login
       }
        const token = this.getCookie("token");
        const response = await fetch(`http://localhost:5000/movements/v1/${movementId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 404) {
            // El movimiento no se encontró, redirigir al login y borrar el movementId
            sessionStorage.removeItem('movementId');
            this.$router.push('/login'); // Cambia '/login' por la ruta de tu login
            return;
          }
          throw new Error('Error fetching movement details');
        }
        const data = await response.json();
        const movement = data.movement;

        // Guardar los datos del movimiento
        this.orderId = movement._id;
        this.roomPrice = movement.room.price;
        this.selectedSeats = movement.seats ? JSON.parse(movement.seats[0]) : [];
        this.showingTime = movement.showing.datetime;
        
        // Obtener el movieId y realizar la solicitud de detalles de la película
        const movieId = movement.showing.movie;
        await this.fetchMovieDetails(movieId);
        
        // Obtener el tiempo y la agrupación de los asientos
        this.groupSeats(movement.showing.availableSeats);
      } catch (error) {
        console.error('Error fetching movement details:', error);
      }
    },
    async fetchMovieDetails(movieId) {
      try {
        const response = await fetch(`http://localhost:5000/movies/v1/${movieId}`);
        const movieData = await response.json();

        // Guardar los datos de la película
        this.movieTitle = movieData.title;
        this.moviePoster = movieData.poster;
        this.movieGenre = Array.isArray(movieData.genre) ? movieData.genre.join(', ') : '';
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    },
    groupSeats(availableSeats) {
      const seatGroups = {};

      this.selectedSeats.forEach(seatName => {
        const seat = availableSeats.find(s => s.name === seatName);
        if (seat) {
          const key = `${seat.type}-${seat.price}`;
          if (!seatGroups[key]) {
            seatGroups[key] = {
              type: seat.type,
              price: seat.price,
              count: 0,
            };
          }
          seatGroups[key].count++;
        }
      });

      this.groupedSeats = Object.values(seatGroups);
    },
    async buyTicket() {
      const paymentId = sessionStorage.getItem('paymentId');
      const paymentMethod = this.paymentMethods.find(method => method.selected)?.type;

      if (!paymentId || !paymentMethod) {
        alert('Por favor, guarda un método de pago antes de continuar.');
        return;
      }

      const body = {
        status: "processing",
        paymentMethod: paymentMethod, // 'credit_card', 'debit_card', or 'paypal'
      };
      console.log(body);
      
      try {
        const response = await fetch(`http://localhost:5000/payments/${paymentId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error('Error al procesar el pago');
        }

        const result = await response.json();
        alert('Pago procesado con éxito: ' + result.message);
        // Redirige o realiza otra acción después del pago exitoso.
      } catch (error) {
        console.error('Error en la compra:', error);
        alert('Error en la compra: ' + error.message);
      }
    },
  },
  mounted() {
    this.fetchMovementDetails();

    const timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(timer);
      }
    }, 1000);

    onUnmounted(() => {
      clearInterval(timer);
    });
  },
};
</script>

<style scoped>
.bg-black {
  background-color: #121212;
}
.bg-gray-900 {
  background-color: #181818;
}
</style>
