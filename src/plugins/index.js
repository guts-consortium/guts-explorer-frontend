/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import { createAppRouter } from './router'
import VueCookies from 'vue-cookies';

export function registerPlugins (app, config) {
  const router = createAppRouter(config)
  app.use(vuetify);
  app.use(router);
  app.use(VueCookies, {
    expire: '1d',
    secure: true,
    sameSite: 'Strict',
  });
}


