<template>
  <section class="w-screen flex flex-col items-center overflow-y-scroll">
    <div class="mb-8 w-[365px]">
      <div class="flex flex-col">
        <div
          v-for="row in rows"
          :key="row"
          :class="['flex items-center', row === 'B' ? 'mb-14' : '']"
        >
          <div class="w-6 text-gray-400 font-bold">{{ row }}</div>
          <div class="flex flex-1 justify-center">
            <div
              v-for="seatNumber in seatsPerRow(row)"
              :key="`${row}${seatNumber}`"
              :data-id="`${row}${seatNumber}`"
              @click="handleSeatClick(`${row}${seatNumber}`)"
              :class="seatClasses(`${row}${seatNumber}`)"
              class="w-[31px] h-[31px] m-1 rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              {{ isSelected(`${row}${seatNumber}`) ? seatNumber : "" }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-8 mb-6">
      <div class="flex gap-2.5">
        <div class="bg-color-5 rounded-full w-3 h-3 mt-1"></div>
        <p class="font-medium text-sm text-white">Available</p>
      </div>
      <div class="flex gap-2.5">
        <div class="bg-color-6 rounded-full w-3 h-3 mt-1"></div>
        <p class="font-medium text-sm text-white">Reserved</p>
      </div>
      <div class="flex gap-2.5">
        <div class="bg-color-2 rounded-full w-3 h-3 mt-1"></div>
        <p class="font-medium text-sm text-white">Selected</p>
      </div>
    </div>
    <div class="flex gap-4 mb-4 w-4/5 overflow-auto">
      <div
        v-for="day in availableDays"
        :key="day"
        @click="selectDay(day)"
        :class="['cursor-pointer p-2 w-14 h-20 content-center', selectedDay === day ? 'bg-color-2 text-white rounded-md' : 'bg-[#F8F5F5] rounded-xl']"
      >
        <p :class="['text-sm ', selectedDay === day ? 'text-white font-bold' : 'text-[#969696] font-medium']">{{ formatDay(day).weekday }}</p>
        <p class="text-2xl font-bold">{{ formatDay(day).day }}</p>
      </div>
    </div>
    <div class="flex gap-4 mt-6 mb-12 w-4/5 overflow-auto">
      <div v-for="(showing, index) in filteredShowings" :key="index" class="flex flex-col items-center">
        <div 
          @click="selectShowing(showing)" 
          :class="[ 
            'w-[84px] h-[62px] rounded-md flex flex-col items-center p-1.5 cursor-pointer justify-center', 
            selectedShowing && selectedShowing.time === showing.time ? 'bg-[#FE0000]' : 'bg-[#F8F5F5]'
          ]"
        >
          <p :class="[ 
            'text-2xl', selectedShowing && selectedShowing.time === showing.time ? 'text-white font-bold' : 'font-medium']">{{ showing.time }}</p>
          <p :class="[ 
            'text-sm', selectedShowing && selectedShowing.time === showing.time ? 'text-white font-bold' : 'font-medium text-[#969696]']">$ {{ showing.room.price }}・{{ showing.room.name }}</p>
        </div>
      </div>
    </div>

    <div class="w-[333px] flex gap-12 mb-5">
      <div class="text-left">
        <p class="text-lg text-color-3 inter">Price</p>
        <p class="text-lg text-color-3 inter font-semibold">${{ totalPrice }}</p> <!-- Muestra el precio total -->
      </div>
      <button 
        class="bg-[#FE0000] h-14 w-full rounded-2xl text-white font-semibold text-base"
        @click="buyTicket"
      >
        Buy ticket
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: "MovieTheater",
  data() {
    return {
      rows: ["A", "B", "C", "D", "E", "F"],
      availableSeats: [],
      selectedSeats: [], // Permite seleccionar múltiples asientos
      showings: [],
      selectedShowing: null,
      selectedDay: null, // Día seleccionado por defecto
      availableDays: [], // Días disponibles
      showingID: null,
      selectedMovieId: null, // Agrega esta línea
    };
  },
  created() {
    const selectedMovieId = sessionStorage.getItem('selectedMovieId');
    if (selectedMovieId) {
      this.selectedMovieId = selectedMovieId; // Asegúrate de definir esta variable en data()
      this.fetchShowings();
    } else {
      console.error("No selectedMovieId found in sessionStorage");
      this.goToLogin();
    }
  },

  computed: {
    filteredShowings() {
      if (!this.selectedDay) return [];
      return this.showings.filter(showing => showing.date === this.selectedDay);
    },
    totalPrice() {
      if (this.selectedShowing && this.selectedSeats.length > 0) {
        const roomPrice = this.selectedShowing.room.price; // Precio de la sala
        const selectedSeatsPrice = this.selectedSeats.reduce((total, seat) => {
          const seatData = this.availableSeats.find(s => s.name === seat);
          return total + (seatData ? seatData.price : 0); // Suma de precios de los asientos
        }, 0);
        return roomPrice + selectedSeatsPrice; // Suma de precios
      }
      return 0;
    },
  },
  methods: {
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    },

    setCookie(name, value, days) {
      const d = new Date();
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = "expires=" + d.toUTCString();
      document.cookie = `${name}=${value}; ${expires}; path=/`;
    },

    seatsPerRow(row) {
      if (row === "A") return 5;
      else if (row === "B") return 7;
      else return 9;
    },

    async fetchShowings() {
      try {
        const token = this.getCookie("token");
        if (!token) {
          console.error("No token found");
          this.goToLogin();
          return;
        }

        const response = await fetch(`http://localhost:5000/showings/${this.selectedMovieId}/availability`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        // Guardar funciones y días únicos
        this.showings = data.map(showing => ({
          time: showing.time,
          availableSeats: showing.availableSeats,
          date: showing.date,
          room: showing.room, // Asegúrate de incluir la sala aquí
          showingId: showing.showingIds,
        }));

        // Obtener días únicos
        const uniqueDays = new Set(this.showings.map(showing => showing.date));
        this.availableDays = Array.from(uniqueDays);

        // Seleccionar el primer día y la primera función por defecto
        if (this.availableDays.length > 0) {
          this.selectedDay = this.availableDays[0]; // Primer día
          const firstShowing = this.filteredShowings[0];
          if (firstShowing) {
            this.selectShowing(firstShowing); // Primera función
          }
        }
      } catch (error) {
        console.error("Error fetching showings:", error);
      }
    },

    selectDay(day) {
      this.selectedDay = day; // Guardamos el día seleccionado
      this.selectedShowing = null; // Resetear la selección de horario
      this.availableSeats = []; // Resetear los asientos disponibles
      this.selectedSeats = []; // Reiniciar selección de asientos

      // Seleccionar automáticamente el primer horario
      const firstShowing = this.filteredShowings[0];
      if (firstShowing) {
        this.selectShowing(firstShowing);
      }
    },

    selectShowing(showing) {
      this.selectedShowing = showing;
      this.availableSeats = showing.availableSeats;
      this.selectedSeats = []; // Reiniciar selección de asientos

      console.log(showing.showingId.length)

      // Guardar el primer ID del array showingIds en selectedShowingId
      if (showing.showingId.length > 0) {
        // this.setCookie("selectedShowingId", showing.showingId[0], 1);
        sessionStorage.setItem('selectedShowingId', showing.showingId[0], 1); // Guardar el primer ID en la cookie
      }
    },

    isSeatAvailable(seatId) {
      const seat = this.availableSeats.find((s) => s.name === seatId);
      return seat ? seat.available : false;
    },

    isSelected(seatId) {
      return this.selectedSeats.includes(seatId);
    },

    handleSeatClick(seatId) {
      if (this.isSeatAvailable(seatId)) {
        if (this.isSelected(seatId)) {
          this.selectedSeats = this.selectedSeats.filter(s => s !== seatId);
          console.log(`Seat ${seatId} está deseleccionado`);
        } else {
          this.selectedSeats.push(seatId);
          console.log(`Seat ${seatId} está seleccionado`);
        }
        // Guarda el array de asientos seleccionados en sessionStorage como JSON
        sessionStorage.setItem("selectedSeats", JSON.stringify(this.selectedSeats));
      } else {
        console.log(`Seat ${seatId} no está disponible`);
      }
    },

    seatClasses(seatId) {
      if (this.isSelected(seatId)) return 'bg-color-2 text-white'; // Color de asiento seleccionado
      if (this.isSeatAvailable(seatId)) return 'bg-color-5'; // Color de asiento disponible
      return 'bg-color-6'; // Color de asiento reservado
    },

    async buyTicket() {
      const selectedSeatsS = sessionStorage.getItem("selectedSeats");
      const selectedShowingId = sessionStorage.getItem("selectedShowingId");
      const data = {
        showingId: selectedShowingId,
        seats: selectedSeatsS
      };

      try {
        const token = this.getCookie("token");
        const response = await fetch(`http://localhost:5000/movements/v1/purchase`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const responseData = await response.json();
          // Obtén la respuesta del servidor
          const movementId = responseData.movement._id; // Asegúrate de que el servidor devuelva el ID del movimiento
          const paymentId = responseData.payment._id; // Asegúrate de que el servidor devuelva el ID del movimiento
          sessionStorage.setItem('movementId', movementId); // Guarda el ID en sessionStorage
          sessionStorage.setItem('paymentId', paymentId); // Guarda el ID en sessionStorage

          alert("Tickets purchased!");
          // Redirigir a la página de órdenes
          this.$router.push('/Order');
        } else {
          const errorData = await response.json();
          alert(`Error purchasing tickets: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error purchasing tickets:", error);
        alert("Error purchasing tickets. Please try again later.");
      }
    },



    formatDay(day) {
      const date = new Date(day);
      return {
        day: date.toLocaleDateString('en-US', { day: 'numeric' }),
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      };
    },
    
    goToLogin() {
      // Implementa la lógica para redirigir a la página de login
      this.$router.push('/login');
    },
  },
};
</script>
