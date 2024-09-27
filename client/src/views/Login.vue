<template>
  <div class="h-screen w-screen flex flex-col justify-center items-center text-white">
    <button @click="goToHome">
      <img class="flex mb-14 ml-72" :src="smallStarImg" />
    </button>
    <h1 class="font-poppins font-bold mb-10 text-3xl mr-60">Log in</h1>
    <form @submit.prevent="handleSubmit">
      <div class="relative mb-4 w-80 text-sm">
        <p class="font-inter font-regular mb-1.5 text-left">Email address</p>
        <input
          class="border border-slate-0 rounded-lg px-4 py-2 w-80 bg-color1 text-black text-left bg-white"
          type="email"
          v-model="formData.email"
          id="email"
          placeholder="helloworld@gmail.com"
          required
        />
        <img
          class="absolute right-3 transform -translate-y-7"
          :src="formData.email ? agreeImg : disagreeImg"
        />
      </div>
      <div class="relative mb-3.5 w-80 text-sm">
        <p class="font-inter font-regular mb-1.5 text-left">Password</p>
        <input
          class="border border-slate-0 rounded-lg px-4 py-2 w-80 bg-color1 text-black text-left bg-white"
          :type="passwordVisible ? 'text' : 'password'"
          v-model="formData.password"
          id="password"
          placeholder="Your password"
          required
        />
        <img
          class="absolute right-3 transform -translate-y-7"
          :src="passwordVisible ? ableImg : occultImg"
          @click="togglePasswordVisibility"
        />
      </div>
      <p class="mb-9 ml-48 text-sm">Forgot password?</p>
      <button class="bg-[#FE0000] font-inter font-semibold text-slate-50 px-36 py-4 rounded-lg mb-9">
        Log in
      </button>
    </form>
    <div class="flex flex-row mb-5 gap-x-2.5">
      <img :src="LineImg" />
      <p class="text-sm">Or Login with</p>
      <img :src="LineImg" />
    </div>
    <div class="flex flex-row mb-32 gap-x-4">
      <button class="border border-slate-0 rounded-lg px-11 py-4 w-28 bg-color1 bg-white">
        <img class="w-6" :src="facebookImg" />
      </button>
      <button class="border border-slate-0 rounded-lg px-11 py-4 w-28 bg-color1 bg-white">
        <img class="w-6" :src="googleImg" />
      </button>
      <button class="border border-slate-0 rounded-lg px-11 py-4 w-28 bg-color1 bg-white">
        <img class="w-6" :src="appleImg" />
      </button>
    </div>
    <div class="flex flex-row gap-x-2">
      <p class="font-inter font-regular text-sm">Don’t have an account?</p>
      <a
        class="font-inter font-semibold text-white border-b-2 border-slate-950 text-sm"
        href="#"
        @click="goToCreateAccount"
      >
        Sign up
      </a>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

import smallStarImg from "../assets/img/smallStar.svg";
import agreeImg from "../assets/img/agree.svg";
import disagreeImg from "../assets/img/disagree.svg";
import ableImg from "../assets/img/able.svg";
import occultImg from "../assets/img/occult.svg";
import googleImg from "../assets/img/google.svg";
import facebookImg from "../assets/img/facebook.svg";
import appleImg from "../assets/img/apple.svg";
import LineImg from "../assets/img/Line.svg";

export default {
  setup() {
    const router = useRouter();

    const formData = ref({
      email: "",
      password: "123456789",
    });

    const passwordVisible = ref(false);

    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    const goToCreateAccount = () => {
      router.push("/createAccount");
    };

    const goToHome = () => {
      router.push("/");
    };

    const handleSubmit = async () => {
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Esto permite enviar y recibir cookies
        body: JSON.stringify(formData.value),
      };

      try {
        const response = await fetch("http://localhost:5000/auth/login", config);

        if (response.status === 200) {
          const data = await response.json();
          console.log("Inicio de sesión exitoso:", data);

          // Verificar la cookie justo después de un inicio de sesión exitoso
          const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
            const [name, value] = cookie.split("=");
            acc[name] = value;
            return acc;
          }, {});

          const cookieName = "token"; // Nombre de la cookie que deseas verificar

          if (cookies[cookieName]) {
            router.push("/home"); // Redirige si la cookie está presente
          }
        } else {
          console.log("Error al iniciar sesión:", response.status);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    return {
      formData,
      passwordVisible,
      togglePasswordVisibility,
      goToCreateAccount,
      handleSubmit,
      goToHome,
      smallStarImg,
      agreeImg,
      disagreeImg,
      ableImg,
      occultImg,
      googleImg,
      facebookImg,
      appleImg,
      LineImg,
    };
  },
};
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
