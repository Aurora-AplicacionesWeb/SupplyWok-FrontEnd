import { createApp } from 'vue'
import './style.css'
import App from './app.vue'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import { Button, InputText, Card } from 'primevue'

import i18n from './i18n.js'
import router from "./router.js";
import pinia from "./pinia.js";

createApp(App)
    .use(i18n)
    .use(router)
    .use(pinia)
    .use(PrimeVue, { theme: { preset: Aura }, ripple: true })
    .component('pv-button', Button)
    .component('pv-input-text', InputText)
    .component('pv-card', Card)
    .mount('#app')
