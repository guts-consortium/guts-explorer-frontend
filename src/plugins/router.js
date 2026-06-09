// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';

export function createAppRouter(config) {
  let VITE_BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;
  if (!VITE_BACKEND_API_URL) {
    if (config.hasOwnProperty('VITE_BACKEND_API_URL')) {
      VITE_BACKEND_API_URL = config.VITE_BACKEND_API_URL;
    } else {
      VITE_BACKEND_API_URL = window.location.origin;
    }
  }
  const backendUrl = VITE_BACKEND_API_URL;
  const routes = [
    {
      path: '/',
      name: 'Home',
      component: App,
      alias: '/guts-explorer',
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

  return createRouter({
    history: createWebHistory(),
    routes,
  });
}
