<template>
    <header class="w-full text-white p-4">
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center">
          <img src="../assets/img/profile-picture.svg" alt="Imagen de perfil" class="w-11 h-11 rounded-full">
          <div class="ml-3">
            <p class="text-white text-sm text-left">Hola, Ferrucio Tuccine!</p>
            <p class="text-white text-[15px] font-semibold text-left">¡Veamos una película juntos!</p>
          </div>
        </div>
        <button>
          <img src="../assets/img/dumbell.svg" alt="Icono de acciones" class="w-10 h-10">
        </button>
      </div>
  
      <!-- Input con lupa dentro, fondo con gradiente y borde blanco -->
      <div class="relative w-full">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <img src="../assets/img/magnifyinGlass.svg" alt="Lupa" class="w-5 h-5 text-gray-400">
        </span>
        <input
          type="search"
          placeholder="Search movie, cinema, genre..."
          class="pl-10 pr-4 py-2 text-white w-full bg-gradient-to-r from-[#232323] to-[#161616] border-[1px] border-white focus:outline-none rounded-xl"
        />
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'Header'
  }
  </script>
  
  <style scoped>
  /* No se requiere CSS adicional */
  </style>
  