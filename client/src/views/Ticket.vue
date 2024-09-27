<template>
    <div class="flex flex-col h-screen bg-black text-white">
        <!-- Header -->
        <CinemaHeader title="Ticket" homeRoute="/home" />
        <!-- Ticket Card -->
        <div class="p-5 mx-4 bg-white rounded-xl overflow-hidden" v-if="payment">
            <!-- Movie Poster -->
            <div class="relative h-40 bg-gray-300 p-15 rounded-xl">
                <img :src="payment.poster" alt="Movie Poster" class="w-full h-full object-cover rounded-xl" />
            </div>

            <!-- Ticket Details -->
            <div class="p-4 text-black text-left">
                <h2 class="text-xl font-bold mb-1">{{ payment.movie }}</h2>
                <p class="text-sm text-[#787878] mb-4">Show this ticket at the entrance</p>
                <hr>
                <div class="flex justify-between items-center mt-3 mb-10">
                    <div>
                        <h3 class="font-bold text-[13px] text-[#787878]">Cinema</h3>
                        <p class="text-xl font-bold">Cine Campus</p>
                    </div>
                    <img src="../assets/img/popcorn.svg" alt="Cinema Logo" class="w-10 h-10 rounded" />
                </div>

                <div class="grid grid-cols-3 mb-4">
                    <div class="col-span-2 mb-6"> <!-- Ocupa 2/3 del espacio -->
                        <h3 class="font-bold text-[13px] text-[#787878]">Date</h3>
                        <p class="text-base font-bold">{{ formattedDate }}</p>
                    </div>
                    <div class="mb-6"> <!-- Ocupa 1/3 del espacio -->
                        <h3 class="font-bold text-[13px] text-[#787878]">Time</h3>
                        <p class="text-base font-bold">{{ formattedTime }}</p>
                    </div>
                    <div class="col-span-2 mb-6"> <!-- Ocupa 2/3 del espacio -->
                        <h3 class="font-bold text-[13px] text-[#787878]">Cinema Hall #</h3>
                        <p class="text-base font-bold">{{ payment.room }}</p>
                    </div>
                    <div class="mb-6"> <!-- Ocupa 1/3 del espacio -->
                        <h3 class="font-bold text-[13px] text-[#787878]">Seat</h3>
                        <p class="text-base font-bold">{{ seatNames }}</p>
                    </div>
                    <div class="col-span-2 mb-6"> <!-- Ocupa 2/3 del espacio -->
                        <h3 class="font-bold text-[13px] text-[#787878]">Cost</h3>
                        <p class="text-base font-bold">${{ payment.amount }}</p>
                    </div>
                    <div class="mb-6"> <!-- Ocupa 1/3 del espacio -->
                        <h3 class="font-bold text-[13px] text-[#787878] ">Order ID</h3>
                        <p class="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis">{{ payment._id }}</p>
                    </div>
                </div>

                <div class="border-t border-dashed border-gray-300 pt-4 flex justify-center">
                    <div class="barcode-container w-full">
                        <!-- Contenedor para el código de barras -->
                        <svg id="barcode"></svg>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p>Loading payment details...</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import CinemaHeader from '../components/CinemaHeader.vue';
import JsBarcode from 'jsbarcode';

const payment = ref(null);
const formattedDate = ref('');
const formattedTime = ref('');
const seatNames = ref('');
const error = ref(null);

const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    return `${date.toLocaleString('en-US', options).replace(/\d+/, day + suffix)}`;
};

const fetchPaymentDetails = async () => {
    const paymentId = sessionStorage.getItem('paymentId');
    if (!paymentId) {
        console.error('Payment ID not found in sessionStorage');
        return;
    }

    try {
        const token = getCookie("token");
        const response = await fetch(`http://localhost:5000/payments/${paymentId}/details`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        
        if (response.ok) {
            payment.value = data.payment;
            formattedDate.value = formatDate(payment.value.showingTime); 
            formattedTime.value = new Date(payment.value.showingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            seatNames.value = payment.value.seats.join(', '); 
            
            // Esperar a que el DOM se actualice
            await nextTick();
            generateBarcode(payment.value._id); // Generar código de barras
        } else {
            error.value = data.message; 
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error fetching payment details:', error);
    }
};

const generateBarcode = (orderId) => {
    JsBarcode("#barcode", orderId, {
        format: "CODE128",
        lineColor: "#000",
        width: 1, // Reduce el ancho del código de barras
        height: 30, // Reduce la altura del código de barras
        displayValue: true,
        fontSize: 12, // Ajusta el tamaño de la fuente
        margin: 2 // Margen alrededor del código de barras
    });
};

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
};

onMounted(fetchPaymentDetails);
</script>

<style scoped>
.bg-black {
    background-color: #121212;
}

.barcode-container {
    width: 100%; /* Hace que el contenedor ocupe todo el ancho disponible */
    max-width: 300px; /* Ajusta el tamaño máximo si es necesario */
    margin: 0 auto; /* Centra el contenedor */
    text-align: center; /* Centra el contenido */
}
</style>
