/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from './router'
import VueCookies from 'vue-cookies';

export function registerPlugins (app) {
  app.use(vuetify);
  app.use(router);
  app.use(VueCookies, {
    expire: '1d',
    secure: true,
    sameSite: 'Strict',
  });
}


