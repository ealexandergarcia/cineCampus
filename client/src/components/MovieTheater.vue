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
    <div class="flex gap-4 mb-4 w-4/5 overflow-auto">
      <div
        v-for="day in availableDays"
        :key="day"
        @click="selectDay(day)"
        :class="['cursor-pointer p-2 w-14 h-20 content-center', selectedDay === day ? 'bg-color-2 text-white rounded-md' : 'bg-gray-200 rounded-xl']"
      >
        <p :class="['text-sm ', selectedDay === day ? 'text-white font-bold' : 'text-[#969696] font-medium']">{{ formatDay(day).day }}</p>
        <p class="text-2xl font-bold">{{ formatDay(day).weekday }}</p>
      </div>
    </div>
    <div class="flex gap-4 mt-6 mb-12 w-4/5 overflow-auto">
      <div v-for="(showing, index) in filteredShowings" :key="index" class="flex flex-col items-center">
        <div @click="selectShowing(showing)" class="bg-color-2 w-[84px] h-[62px] rounded-md flex flex-col items-center p-1.5 cursor-pointer">
          <p class="poppinsHour">{{ showing.time }}</p>
          <p class="text-color-3 font-semi-bold text-xs">$ {{showing.room.price}}・{{ showing.room.name }}</p> <!-- Mostrar nombre de la sala -->
        </div>
      </div>
    </div>

    <div class="w-[333px] flex gap-12 mb-5">
      <div>
        <p class="text-lg text-color-3 inter">Total Price</p>
        <p class="text-lg text-color-3 inter font-semibold">{{ totalPrice }}</p> <!-- Muestra el precio total -->
      </div>
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
      selectedSeat: null,
      showings: [],
      selectedShowing: null,
      selectedDay: null, // Día seleccionado por defecto
      availableDays: [], // Días disponibles
    };
  },
  created() {
    this.fetchShowings();
  },
  computed: {
    filteredShowings() {
      if (!this.selectedDay) return [];
      return this.showings.filter(showing => showing.date === this.selectedDay);
    },
    totalPrice() {
      if (this.selectedShowing && this.selectedSeat) {
        const seat = this.availableSeats.find(s => s.name === this.selectedSeat);
        const roomPrice = this.selectedShowing.room.price; // Precio de la sala
        const seatPrice = seat ? seat.price : 0; // Precio del asiento
        return roomPrice + seatPrice; // Suma de precios
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

        const response = await fetch("http://localhost:5000/showings/66d10e5a4eb032980fd9468b/availability", {
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
    },

    selectShowing(showing) {
      this.selectedShowing = showing;
      this.availableSeats = showing.availableSeats;
      this.selectedSeat = null;
    },

    isSeatAvailable(seatId) {
      const seat = this.availableSeats.find((s) => s.name === seatId);
      return seat ? seat.available : false;
    },

    isSelected(seatId) {
      return this.selectedSeat === seatId;
    },

    handleSeatClick(seatId) {
      if (this.isSeatAvailable(seatId)) {
        if (this.isSelected(seatId)) {
          this.selectedSeat = null;
          console.log(`Seat ${seatId} esta desseleccionado`);
          
        } else {
          this.selectedSeat = seatId;
          console.log(`Seat ${seatId} esta seleccionado`);
        }
      } else {
        console.log(`Seat ${seatId} is unavailable`);
      }
    },

    seatClasses(seatId) {
      const isAvailable = this.isSeatAvailable(seatId);
      const isSelected = this.isSelected(seatId);

      if (isSelected) {
        return "bg-color-2 text-white";
      }
      if (isAvailable) {
        return "bg-color-5 text-gray-300";
      }
      return "bg-color-6 text-gray-700"; // Estado reservado
    },

    goToLogin() {
      this.$router.push("/login");
    },

    formatDay(dateString) {
      const date = new Date(dateString);
      const options = { weekday: "short", day: "numeric" };
      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
      const [weekday, day] = formattedDate.split(" ");
      return { weekday, day };
    },
  },
};
</script>
