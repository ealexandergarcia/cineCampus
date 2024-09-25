<template>
    <header class="w-full text-white p-8">
        <div class="flex justify-between items-center">
            <router-link to="/home" class="flex items-center">
                <img src="../assets/img/arrow-right.svg" alt="Icono de acciones" class="w-6 h-6">
            </router-link>
            <h1 class="text-lg font-semibold">{{ title }}</h1>
            <button @click="onMoreClick">
                <img src="../assets/img/more-vertical.svg" alt="Icono de acciones" class="w-6 h-6">
            </button>
        </div>
    </header>
</template>

<script>
export default {
    name: 'CinemaHeader',
    props: {
        title: {
            type: String,
            required: true,
        },
    },
    methods: {
        onMoreClick() {
            this.$emit('more'); // Emite un evento para manejar la acción de más
        },
    },
}
</script>

<style scoped>
/* No se requiere CSS adicional */
</style>
