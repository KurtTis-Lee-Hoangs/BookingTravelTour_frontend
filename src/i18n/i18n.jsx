import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HEADER_VI from '../languages/vi-vi/header.json';
import HEADER_EN from '../languages/en-en/header.json';
import HOME_VI from '../languages/vi-vi/home.json';
import HOME_EN from '../languages/en-en/home.json';
import ABOUT_EN from '../languages/en-en/about.json';
import ABOUT_VI from '../languages/vi-vi/about.json';
import BLOG_EN from '../languages/en-en/blog.json';
import BLOG_VI from '../languages/vi-vi/blog.json';
import TOUR_EN from '../languages/en-en/tour.json';
import TOUR_VI from '../languages/vi-vi/tour.json';
import HOTEL_EN from '../languages/en-en/hotel.json';
import HOTEL_VI from '../languages/vi-vi/hotel.json';
import WEATHER_EN from '../languages/en-en/weather.json';
import WEATHER_VI from '../languages/vi-vi/weather.json';

const resources = {
    en: {
        header: HEADER_EN,
        home: HOME_EN,
        about: ABOUT_EN,
        blog: BLOG_EN,
        tour: TOUR_EN,
        hotel: HOTEL_EN,
        weather: WEATHER_EN,
    },

    vi: {
        header: HEADER_VI,
        home: HOME_VI,
        about: ABOUT_VI,
        blog: BLOG_VI,
        tour: TOUR_VI,
        hotel: HOTEL_VI,
        weather: WEATHER_VI,
    }
}

const language = localStorage.getItem('lang') || 'vi';

// const defaultNS = 'header';

i18n.use(initReactI18next).init({
    resources,
    lng: language,
    ns: ['header', 'home', 'about', 'blog', 'tour', 'hotel', 'weather'],
    fallbackLng: "en",
    // defaultNS,
    interpolation: {
        escapeValue: false // React already does escaping
    }
})