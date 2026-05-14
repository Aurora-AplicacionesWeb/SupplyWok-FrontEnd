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

import { Button, InputText, Card, SelectButton, Select, Checkbox, Menu, DataTable, Column, Tag, IconField, InputIcon, Dialog, InputNumber } from 'primevue'

import i18n from './i18n.js'

createApp(App)
    .use(i18n)
    .use(pinia)
    .use(router)
        .use(PrimeVue, {
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: 'none'
                }
            },
            ripple: true
        })
        .use(ConfirmationService)
    .component('pv-button', Button)
    .component('pv-input-text', InputText)
    .component('pv-card', Card)
    .component('pv-select-button', SelectButton)
    .component('pv-select', Select)
    .component('pv-checkbox', Checkbox)
    .component('pv-menu', Menu)
    .component('pv-datatable', DataTable)
    .component('pv-column', Column)
    .component('pv-tag', Tag)
    .component('pv-icon-field', IconField)
    .component('pv-input-icon', InputIcon)
    .component('pv-dialog', Dialog)
    .component('pv-input-number', InputNumber)
    .mount('#app')
