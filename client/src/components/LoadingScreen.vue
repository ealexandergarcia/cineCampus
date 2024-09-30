<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
    <div class="loader"></div>
    <div class="text-white text-2xl font-semibold mt-4">Transaction in process...</div>
  </div>
</template>

<script>
export default {
  name: 'LoadingScreen',
  mounted() {
    setTimeout(() => {
      this.processPayment();
    }, 5000);
  },
  methods: {
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    },
    async processPayment() {
      const body = { status: "purchased" };
      const token = this.getCookie("token");
      
      try {
        const paymentId = sessionStorage.getItem('paymentId');
        const response = await fetch(`http://localhost:5000/payments/${paymentId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error('Error al procesar el pago');
        
        const result = await response.json();
        alert('Pago procesado con éxito: ' + result.message);
        this.$router.push('/Ticket');
      } catch (error) {
        console.error('Error en la compra:', error);
        alert('Error en la compra: ' + error.message);
      }
    },
  },
};
</script>

<style scoped>
.loader {
  border: 8px solid #FE0000; /* Cambia los colores según tu proyecto */
  border-top: 8px solid #ffffff; /* Color del spinner */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.text-white {
  color: #ffffff; /* Cambia el color del texto si es necesario */
}
</style>
