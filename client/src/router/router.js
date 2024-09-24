import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import CreateAccount from '../views/CreateAccount.vue'

const routes = [
  { path: "/", component: Home },
  { path: '/createAccount', component: CreateAccount },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
