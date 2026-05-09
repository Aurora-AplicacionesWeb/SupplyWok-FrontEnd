import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import es from './locales/es.json'
import zh from './locales/zh.json'

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'es',
    fallbackLocale: 'en',
    messages: { en, es, zh }
})

export default i18n
