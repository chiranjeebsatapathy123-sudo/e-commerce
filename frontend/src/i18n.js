import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Spark E-Commerce",
      "cart": "Shopping Cart",
      "checkout": "Proceed to Checkout",
      "products": "Products",
      "search_placeholder": "Search products...",
      "add_to_cart": "Add to Cart",
      "out_of_stock": "Out of Stock"
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido a Spark E-Commerce",
      "cart": "Carrito de Compras",
      "checkout": "Proceder al Pago",
      "products": "Productos",
      "search_placeholder": "Buscar productos...",
      "add_to_cart": "Añadir al Carrito",
      "out_of_stock": "Agotado"
    }
  },
  fr: {
    translation: {
      "welcome": "Bienvenue sur Spark E-Commerce",
      "cart": "Panier",
      "checkout": "Passer à la caisse",
      "products": "Produits",
      "search_placeholder": "Rechercher des produits...",
      "add_to_cart": "Ajouter au panier",
      "out_of_stock": "Épuisé"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    }
  });

export default i18n;
