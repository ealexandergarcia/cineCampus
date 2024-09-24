<template>
  <div class="flex flex-col items-center justify-center min-h-screen ">
    <img src="../assets/img/Illustration.svg" alt="Image" class="w-3/4 mb-8" />
    
    <!-- Texto entre la imagen y los botones -->
    <div class="text-center mb-8 px-6">
      <h2 class=" text-white font-semibold mb-2 text-4xl">Explore the app</h2>
      <p class="text-white">Now your finances are in one place and always under control</p>
    </div>

    <div class="flex flex-col space-y-4 w-full px-6">
      <!-- Botón de Log In -->
      <button @click="goToLogin" class="w-full bg-[#FE0000] text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300">Log In</button>
      <!-- Botón de Create Account con colores opuestos -->
      <button @click="goToCreateAccount" class="w-full bg-white text-black p-2 rounded-md border border-black hover:bg-gray-100 focus:outline-none focus:bg-white focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-300">Create Account</button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name:"Home",
  setup() {
    const router = useRouter()

    function goToLogin() {
      router.push('/login')
    }

    function goToCreateAccount() {
      router.push('/createAccount')
    }

    return { goToLogin, goToCreateAccount }
  }
}
</script>

<style scoped>
/* Puedes agregar estilos específicos si es necesario */
</style>
