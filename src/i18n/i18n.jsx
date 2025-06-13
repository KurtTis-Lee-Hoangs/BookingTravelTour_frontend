import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HEADER_VI from '../languages/vi-vi/header.json';
import HEADER_EN from '../languages/en-en/header.json';
import FOOTER_VI from '../languages/vi-vi/footer.json';
import FOOTER_EN from '../languages/en-en/footer.json';
import HOME_VI from '../languages/vi-vi/home.json';
import HOME_EN from '../languages/en-en/home.json';
import ABOUT_VI from '../languages/vi-vi/about.json';
import ABOUT_EN from '../languages/en-en/about.json';
import BLOG_VI from '../languages/vi-vi/blog.json';
import BLOG_EN from '../languages/en-en/blog.json';
import TOUR_VI from '../languages/vi-vi/tour.json';
import TOUR_EN from '../languages/en-en/tour.json';
import HOTEL_VI from '../languages/vi-vi/hotel.json';
import HOTEL_EN from '../languages/en-en/hotel.json';
import WEATHER_VI from '../languages/vi-vi/weather.json';
import WEATHER_EN from '../languages/en-en/weather.json';
import THANKYOU_VI from '../languages/vi-vi/thankyou.json';
import THANKYOU_EN from '../languages/en-en/thankyou.json';
import LOGIN_VI from '../languages/vi-vi/login.json';
import LOGIN_EN from '../languages/en-en/login.json';
import REGISTER_VI from '../languages/vi-vi/register.json';
import REGISTER_EN from '../languages/en-en/register.json';
import FORGOTPASSWORD_VI from '../languages/vi-vi/forgot-password.json';
import FORGOTPASSWORD_EN from '../languages/en-en/forgot-password.json';
import PROFILE_VI from '../languages/vi-vi/profile.json';
import PROFILE_EN from '../languages/en-en/profile.json';
import HISTORY_VI from '../languages/vi-vi/history.json';
import HISTORY_EN from '../languages/en-en/history.json';
import ADMIN_VI from '../languages/vi-vi/admin.json';
import ADMIN_EN from '../languages/en-en/admin.json';


const resources = {
    en: {
        header: HEADER_EN,
        footer: FOOTER_EN,
        home: HOME_EN,
        about: ABOUT_EN,
        blog: BLOG_EN,
        tour: TOUR_EN,
        hotel: HOTEL_EN,
        weather: WEATHER_EN,
        thankyou: THANKYOU_EN,
        login: LOGIN_EN,
        register: REGISTER_EN,
        forgotpassword: FORGOTPASSWORD_EN,
        profile: PROFILE_EN,
        history: HISTORY_EN,
        admin: ADMIN_EN,
    },

    vi: {
        header: HEADER_VI,
        footer: FOOTER_VI,
        home: HOME_VI,
        about: ABOUT_VI,
        blog: BLOG_VI,
        tour: TOUR_VI,
        hotel: HOTEL_VI,
        weather: WEATHER_VI,
        thankyou: THANKYOU_VI,
        login: LOGIN_VI,
        register: REGISTER_VI,
        forgotpassword: FORGOTPASSWORD_VI,
        profile: PROFILE_VI,
        history: HISTORY_VI,
        admin: ADMIN_VI,
    }
}

const language = localStorage.getItem('lang') || 'vi';

// const defaultNS = 'header';

i18n.use(initReactI18next).init({
    resources,
    lng: language,
    ns: ['header', 'footer', 'home', 'about', 'blog', 'tour', 'hotel', 'weather', 'thankyou', 'login', 'register', 'forgotpassword', 'profile', 'history', 'admin'],
    fallbackLng: "en",
    // defaultNS,
    interpolation: {
        escapeValue: false // React already does escaping
    }
})