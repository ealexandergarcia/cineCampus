<template>
    <section class="w-screen h-screen flex flex-col items-center overflow-y-scroll">
      <div class="mb-8 w-[365px]">
        <div class="flex gap-4 mb-4">
          <div
            v-for="day in availableDays"
            :key="day"
            @click="selectDay(day)"
            :class="['cursor-pointer p-2 rounded', selectedDay === day ? 'bg-blue-500 text-white' : 'bg-gray-200']"
          >
            {{ day }}
          </div>
        </div>
  
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
  
      <div class="flex gap-4 mt-6 mb-12">
        <div v-for="(showing, index) in filteredShowings" :key="index" class="flex flex-col items-center">
          <div @click="selectShowing(showing)" class="bg-color-2 w-[84px] h-[62px] rounded-md flex flex-col items-center p-1.5 cursor-pointer">
            <p class="poppinsHour">{{ showing.time }}</p>
            <p class="text-color-3 font-semi-bold text-xs">{{ showing.availableSeats.length }} seats</p>
          </div>
        </div>
      </div>
  
      <div class="w-[333px] flex gap-12 mb-5">
        <div>
          <p class="text-lg text-color-3 inter">Price</p>
          <p class="text-lg text-color-3 inter font-semibold">{{ selectedSeatPrice }}</p>
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
        selectedSeatPrice: 0,
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
        // Filtrar las funciones según el día seleccionado
        if (!this.selectedDay) return [];
        return this.showings.filter(showing => showing.date === this.selectedDay);
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
          }));
  
          // Obtener días únicos
          const uniqueDays = new Set(this.showings.map(showing => showing.date));
          this.availableDays = Array.from(uniqueDays);
          this.selectedDay = this.availableDays[0]; // Seleccionar el primer día por defecto
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
        this.selectedShowing = showing; // Guardamos la función seleccionada
        this.availableSeats = showing.availableSeats; // Actualizamos los asientos disponibles
        this.selectedSeat = null; // Resetear el asiento seleccionado
        this.selectedSeatPrice = 0; // Resetear el precio
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
            this.selectedSeatPrice = 0;
          } else {
            this.selectedSeat = seatId;
            const seat = this.availableSeats.find((s) => s.name === seatId);
            this.selectedSeatPrice = seat ? seat.price : 0;
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
    },
  };
  </script>
  
  <style>
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");
  @import url("https://fonts.googleapis.com/css2?family/Poppins:wght@100..900&display=swap");
  
  .inter {
    font-family: "Inter", sans-serif;
  }
  
  .poppins {
    font-family: "Poppins", sans-serif;
  }
  
  .poppinsSmall {
    font-family: "Poppins", sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
  }
  
  .poppinsDay {
    font-family: "Inter", sans-serif;
    font-size: 14px;
    font-weight: 300;
    color: #969696;
  }
  
  .poppinsHour {
    font-family: "Inter", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
  }
  </style>
  