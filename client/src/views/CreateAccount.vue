<template>
  <div
    class="h-screen w-screen flex flex-col justify-center items-center text-white"
  >
    <button @click="goToHome">
      <img class="flex mb-14 ml-72" :src="smallStarImg" />
    </button>
    <h1 class="font-poppins font-bold mb-10 text-3xl mr-32">Create account</h1>
    <form @submit.prevent="createAccount">
      <div class="relative w-80">
        <p class="font-inter font-regular text-left mb-1.5 text-sm">Username</p>
        <input
          class="border border-slate-0 rounded-lg mb-6 px-4 py-2 w-80 bg-color1 text-black"
          type="text"
          v-model="formData.nick"
          id="nick"
          placeholder="Your username"
          required
        />
      </div>
      <div class="relative w-80">
        <p class="font-inter font-regular text-left mb-1.5 text-sm">Email</p>
        <input
          class="border border-slate-0 rounded-lg mb-6 px-4 py-2 w-80 bg-color1 text-black"
          type="email"
          v-model="formData.email"
          id="email"
          placeholder="Your email"
          required
        />
      </div>
      
      <div class="relative mb-6 w-80">
        <p class="text-left font-inter font-regular mb-1.5 text-sm">Password</p>
        <input
          class="border border-slate-0 rounded-lg px-4 py-2 w-80 bg-color1 text-black"
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
      <div class="flex flex-row gap-x-3 mb-10 ml-2">
        <img :src="agree ? agreeImg : disagreeImg" @click="toggleAgreement" />
        <p class="font-inter font-regular text-sm">
          I accept the terms and privacy policy
        </p>
      </div>
      <button
        type="submit"
        class="bg-[#FE0000] font-inter font-semibold text-slate-50 px-36 py-4 rounded-lg text-base mb-32"
      >
        Log in
      </button>
    </form>
    <div class="flex flex-row gap-x-2">
      <p class="font-inter font-regular text-sm">Already have an account?</p>
      <a
        class="font-inter font-semibold text-white border-b-2 border-slate-950"
        href="#"
        @click="goToLogin"
        >Log in</a
      >
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import agreeImg from '../assets/img/agree.svg';
import disagreeImg from '../assets/img/disagree.svg';
import smallStarImg from '../assets/img/smallStar.svg';
import ableImg from '../assets/img/able.svg';
import occultImg from '../assets/img/occult.svg';

export default {
  setup() {
    const router = useRouter();
    const formData = ref({
      nick: '',
      email: '',
      password: '',
    });
    const agree = ref(false);
    const passwordVisible = ref(false);

    const toggleAgreement = () => {
      agree.value = !agree.value;
    };

    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    const createAccount = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData.value),
        });
        const result = await response.json();

        if (result.status === 201) {
          router.push('/login');
        } else {
          console.log(result);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    const goToLogin = () => {
      router.push('/login');
    };
    const goToHome =()=>{
      router.push('/')
    }

    return {
      formData,
      agree,
      passwordVisible,
      agreeImg,
      disagreeImg,
      smallStarImg,
      ableImg,
      occultImg,
      toggleAgreement,
      togglePasswordVisibility,
      createAccount,
      goToLogin,
      goToHome
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>