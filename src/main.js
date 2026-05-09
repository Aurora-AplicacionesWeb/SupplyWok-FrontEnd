import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import i18n from './i18n.js';
import pinia from './pinia.js';

createApp(App)
    .use(pinia)
    .use(i18n)
    .use(PrimeVue, {ripple: true, theme: {preset: Material}})
    .mount('#app')

