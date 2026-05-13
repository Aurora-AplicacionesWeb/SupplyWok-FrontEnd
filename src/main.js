import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import router from './router.js'
import pinia from './pinia.js'

import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import Aura from '@primeuix/themes/aura'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import { Button, InputText, Card, SelectButton } from 'primevue'

import i18n from './i18n.js'

createApp(App)
    .use(i18n)
    .use(pinia)
    .use(router)
        .use(PrimeVue, { theme: { preset: Aura }, ripple: true })
        .use(ConfirmationService)
    .component('pv-button', Button)
    .component('pv-input-text', InputText)
    .component('pv-card', Card)
    .component('pv-select-button', SelectButton)
    .mount('#app')