<template>
    <section class="w-screen h-screen flex flex-col items-center overflow-y-scroll">
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
          <p class="poppinsSmall">Available</p>
        </div>
        <div class="flex gap-2.5">
          <div class="bg-color-6 rounded-full w-3 h-3 mt-1"></div>
          <p class="poppinsSmall">Reserved</p>
        </div>
        <div class="flex gap-2.5">
          <div class="bg-color-2 rounded-full w-3 h-3 mt-1"></div>
          <p class="poppinsSmall">Selected</p>
        </div>
      </div>
      <div class="flex gap-4 mt-6 mb-12">
        <div class="bg-color-2 w-14 h-[78px] rounded-md flex p-3 flex-col items-center gap-1">
          <p class="text-color-3 font-bold">Fri</p>
          <p class="poppins text-color-3 text-2xl font-bold">17</p>
        </div>
        <div class="bg-color-3 w-14 h-[78px] rounded-xl flex p-3 flex-col items-center gap-1">
          <p class="poppinsDay">Sat</p>
          <p class="poppins text-color-1 text-2xl font-bold">18</p>
        </div>
        <div class="bg-color-3 w-14 h-[78px] rounded-xl flex p-3 flex-col items-center gap-1">
          <p class="poppinsDay">Sun</p>
          <p class="poppins text-color-1 text-2xl font-bold">19</p>
        </div>
        <div class="bg-color-3 w-14 h-[78px] rounded-xl flex p-3 flex-col items-center gap-1">
          <p class="poppinsDay">Mon</p>
          <p class="poppins text-color-1 text-2xl font-bold">20</p>
        </div>
        <div class="bg-color-3 w-14 h-[78px] rounded-xl flex p-3 flex-col items-center gap-1">
          <p class="poppinsDay">Tue</p>
          <p class="poppins text-color-1 text-2xl font-bold">21</p>
        </div>
      </div>
      <div class="flex gap-4 mt-6 mb-12">
        <div class="bg-color-2 w-[84px] h-[62px] rounded-md flex flex-col items-center p-1.5">
          <p class="poppinsHour">13:00</p>
          <p class="text-color-3 font-semi-bold text-xs">$ 5.25 3D</p>
        </div>
        <div class="bg-color-3 w-[84px] h-[62px] rounded-md flex flex-col items-center p-1.5">
          <p class="poppins text-color-1 text-xl font-bold">15:45</p>
          <p class="poppinsDay">$ 5.99 XD</p>
        </div>
        <div class="bg-color-3 w-[84px] h-[62px] rounded-md flex flex-col items-center p-1.5">
          <p class="poppins text-color-1 text-xl font-bold">18:50</p>
          <p class="poppinsDay">$ 4.50 2D</p>
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
      };
    },
    created() {
      this.fetchSeats();
    },
    methods: {
      getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      },
  
      seatsPerRow(row) {
        if (row === "A") {
          return 5;
        } else if (row === "B") {
          return 7;
        } else {
          return 9;
        }
      },
  
      async fetchSeats() {
        try {
          const token = this.getCookie("token");
          if (!token) {
            console.error("No token found");
            this.goToLogin();
            return;
          }
          const response = await fetch(
            "http://localhost:5000/showings/66d10ece4eb032980fd9468f/availability",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          this.availableSeats = data.availableSeats; // Ajuste aquí para acceder a la propiedad correcta
        } catch (error) {
          console.error("Error fetching seats:", error);
        }
      },
  
      isSeatAvailable(seatId) {
        const seat = this.availableSeats.find((s) => s.name === seatId);
        return seat ? seat.available : false; // Ajuste para verificar la disponibilidad
      },
  
      isSelected(seatId) {
        return this.selectedSeat === seatId;
      },
  
      handleSeatClick(seatId) {
        if (this.isSeatAvailable(seatId)) {
          if (this.isSelected(seatId)) {
            this.selectedSeat = null;
            this.selectedSeatPrice = 0;
            console.log(`Seat unselected: ${seatId}`);
          } else {
            this.selectedSeat = seatId;
            const seat = this.availableSeats.find((s) => s.name === seatId);
            this.selectedSeatPrice = seat ? seat.price : 0; // Asignar el precio del asiento seleccionado
            console.log(`Seat selected: ${seatId}`);
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
          return "bg-color-5 text-gray-300"; // Cambia para reflejar el estado de disponible
        }
        return "bg-color-6 text-gray-700"; // Cambia para reflejar el estado de reservado
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
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100..900&display=swap");
  
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
  