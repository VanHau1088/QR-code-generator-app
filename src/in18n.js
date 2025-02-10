import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import viTranslation from './locales/vn.json'
import enTranslation from './locales/en.json'
import cnTranslation from './locales/cn.json'

const resources = {
    vi:{
        translation: viTranslation
    },
    en:{
        translation: enTranslation
    },
    cn:{
        translation: cnTranslation
    },
}

i18n.use(initReactI18next).init({
    resources: resources,
    lng: 'vi',
    fallbackLng: 'en',
    interpolation: {
        esbuildVersion: false
    },
});

export default i18n;