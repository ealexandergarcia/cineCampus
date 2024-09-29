import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import CreateAccount from '../views/CreateAccount.vue';
import Login from '../views/Login.vue';
import OpenningScreen from "../views/OpenningScreen.vue";
import Cinema from "../views/Cinema.vue";
import ChooseSeat from "../views/ChooseSeat.vue";
import Order from "../views/Order.vue";

// Definición de las rutas
const routes = [
  { path: "/", component: OpenningScreen },
  { path: '/createAccount', component: CreateAccount },
  { path: '/login', component: Login },
  { path: '/home', component: Home },
  { path: '/cinema', component: Cinema },
  { path: '/ChooseSeat', component: ChooseSeat },
  { path: '/Order', component: Order },
];

// Creación del router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Función para obtener la cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Guardia de navegación
router.beforeEach((to, from, next) => {
  const token = getCookie("token"); // Obtener el token
  const protectedRoutes = ['/home', '/cinema', '/ChooseSeat','Order'];

  // Verificar si el usuario tiene acceso a rutas protegidas
  if (protectedRoutes.includes(to.path) && !token) {
    console.error("No token found, redirecting to login");
    next('/login'); // Redirigir al login
  } else if (to.path === '/login' && token) {
    next('/home'); // Redirigir al home si ya está autenticado
  } else {
    next(); // Permitir la navegación a la ruta solicitada
  }
});

export default router;
