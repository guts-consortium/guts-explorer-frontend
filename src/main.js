/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Config
import { loadConfig } from '@/modules/config';

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)
const config = await loadConfig();
app.provide('config', config)
registerPlugins(app, config)
app.mount('#app')