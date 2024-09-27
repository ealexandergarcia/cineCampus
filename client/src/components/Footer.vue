<template>
  <footer class="fixed bottom-0 left-0 w-full bg-gradient-to-r from-[#232323] to-[#161616] border-[1px] border-[#333333] text-white py-6 rounded-2xl h-[93px] flex items-center justify-center">
      <nav class="w-full">
          <ul class="flex justify-center gap-[50px] flex-wrap w-full">
              <li class="flex flex-col items-center">
                  <img src="../assets/img/house.svg" alt="Home" class="w-5 h-5">
                  <router-link class="hover:text-gray-400 text-[#FE0000] font-semibold text-xs" to="/">Home</router-link>
              </li>
              <li class="flex flex-col items-center">
                  <img src="../assets/img/magnifyinGlass2.svg" alt="Browse" class="w-5 h-5">
                  <router-link class="hover:text-gray-400 font-semibold text-xs" to="/browse">Browse</router-link>
              </li>
              <li class="flex flex-col items-center">
                  <img src="../assets/img/tickets.svg" alt="Tickets" class="w-5 h-5">
                  <router-link class="hover:text-gray-400 font-semibold text-xs" to="/tickets">Tickets</router-link>
              </li>
              <li class="flex flex-col items-center">
                  <img src="../assets/img/profile.svg" alt="Profile" class="w-5 h-5">
                  <router-link class="hover:text-gray-400 font-semibold text-xs" to="/profile">Profile</router-link>
              </li>
          </ul>
      </nav>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
/* No se necesita CSS adicional ya que Tailwind cubre todo */
</style>
