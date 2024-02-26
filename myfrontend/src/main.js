import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'

import Vuelidate from 'vuelidate'

import 'bulma/css/bulma.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

// *** boostrap-vue *** 
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.use(Vuelidate)

import "./assets/css/home.css";

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
