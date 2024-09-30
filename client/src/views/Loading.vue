<template>
    <div>
      <!-- Otros componentes o contenido -->
      
      <LoadingScreen v-if="isLoading" />
    </div>
  </template>
  
  <script>
import LoadingScreen from '../components/LoadingScreen.vue'
  
  export default {
    components: {
      LoadingScreen,
    },
    data() {
      return {
        isLoading: true, // Manejar el estado de carga
      };
    },
  };
  </script>
  