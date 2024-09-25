import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import CreateAccount from '../views/CreateAccount.vue';
import Login from '../views/Login.vue';
import OpenningScreen from "../views/OpenningScreen.vue";
import Cinema from "../views/Cinema.vue";
const routes = [
  { path: "/", component: OpenningScreen },
  { path: '/createAccount', component: CreateAccount },
  { path: '/login', component: Login },
  { path: '/home', component: Home },
  { path: '/cinema', component:Cinema}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guardia de navegación
router.beforeEach((to, from, next) => {
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [name, value] = cookie.split("=");
    acc[name] = value;
    return acc;
  }, {});

  const cookieName = "token"; // Cambia esto por el nombre de tu cookie

  // Si el usuario intenta acceder a '/login' y la cookie está presente, redirigir a '/home'
  if (to.path === '/login' && cookies[cookieName]) {
    next('/home'); // Redirige al home si ya está autenticado
  } else {
    next(); // Permite la navegación a la ruta solicitada
  }
});

export default router;
