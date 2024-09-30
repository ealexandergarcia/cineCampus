<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
    <div class="text-white text-2xl font-semibold">In process...</div>
  </div>
</template>

<script>
export default {
  name: 'LoadingScreen',

  mounted() {
    // Ejecutar la función después de 8 segundos
    setTimeout(() => {
      this.processPayment();
    }, 8000);
  },
  methods: {
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    },
    async processPayment() {
      const body = {
        status: "purchased"
      };
      console.log(body);
      const token = this.getCookie("token");
      console.log(token);
      
      try {
        const paymentId = sessionStorage.getItem('paymentId');
        console.log(paymentId);

        const response = await fetch(`http://localhost:5000/payments/${paymentId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error('Error al procesar el pago');
        }

        const result = await response.json();
        alert('Pago procesado con éxito: ' + result.message);

        // Redirigir a la ruta '/home' después de una petición exitosa
        this.$router.push('/home');
      } catch (error) {
        console.error('Error en la compra:', error);
        alert('Error en la compra: ' + error.message);
      }
    },
  },
};
</script>

<style scoped>
/* Puedes ajustar los estilos si lo deseas, pero esto mantiene el diseño básico */
</style>
