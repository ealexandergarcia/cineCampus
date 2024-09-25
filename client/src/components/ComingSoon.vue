<template>
    <div class="text-white p-4">
        <h2 class="pb-4 flex flex-row justify-between text-lg font-semibold">
            Now playing 
            <span class="see-all flex items-end text-sm font-semibold">See all</span>
        </h2>
        <div class="overflow-y-auto max-h-[400px] mb-20"> <!-- Ajusta la altura según lo necesites -->
            <div 
                v-for="movie in movies" 
                :key="movie.id" 
                class="flex w-full bg-[#272727] p-2 rounded-lg mb-4"
            >
                <div 
                    class="w-20 h-20 bg-cover rounded-2xl"
                    :style="{ backgroundImage: `url(${movie.image})` }"
                ></div>
                <div class="ml-[19px]">
                    <p class="text-base font-medium text-left">{{ movie.title }}</p>
                    <p class="text-xs font-medium text-left">{{ movie.genre }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ComingSoon',
    data() {
        return {
            movies: [
                {
                    id: 1,
                    title: 'Avatar: The Way of Water',
                    genre: 'Science Fiction',
                    image: 'src/assets/img/avatar.png',
                },
                {
                    id: 2,
                    title: 'Puss In Boots The Last...',
                    genre: 'Adventure',
                    image: 'src/assets/img/gato.png',
                },
                {
                    id: 3,
                    title: 'Fast X',
                    genre: 'Action',
                    image: 'src/assets/img/rapido.png',
                },
                {
                    id: 4,
                    title: 'Fast X',
                    genre: 'Action',
                    image: 'src/assets/img/rapido.png',
                },
                {
                    id: 5,
                    title: 'Fast X',
                    genre: 'Action',
                    image: 'src/assets/img/rapido.png',
                },
                // Agrega más películas si es necesario
            ],
        };
    },
};
</script>

<style scoped>
/* No se necesita CSS adicional ya que Tailwind cubre todo */
</style>
