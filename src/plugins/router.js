// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
const backendUrl = import.meta.env.VITE_BACKEND_API_URL;

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App,
    alias: '/guts-explorer',
  },
  {
    path: '/user',
    name: 'User',
    redirect: (to) => {
      console.log("Redirecting from '/user' to '${backendUrl}/api/callback' ")
      return {
        path: `${backendUrl}/api/callback`,
        query: {...to.query}
      }
    }
  },
  {
    path: '/guts-explorer/user',
    name: 'User2',
    redirect: (to) => {
      console.log("Redirecting from '/guts-explorer/user' to '${backendUrl}/api/callback' ")
      console.log(`${backendUrl}/api/callback`)
      for(const p in to.query) {
        console.log (p, to.query[p])
      }
      return window.location.href = `${backendUrl}/api/callback?${new URLSearchParams(to.query).toString()}`;
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
