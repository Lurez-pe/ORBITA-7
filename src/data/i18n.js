import { en } from './en.js';
import { es } from './es.js';

export const dictionaries = { en, es };
export const DEFAULT_LANG = 'en';

// Obtener idioma almacenado (Por defecto INGLÉS 'en', sin importar el navegador)
export function getSavedLanguage() {
  try {
    const saved = localStorage.getItem('orbita7_lang');
    if (saved === 'es' || saved === 'en') {
      return saved;
    }
  } catch {
    // Si localStorage está bloqueado o da error
  }
  return DEFAULT_LANG;
}

// Guardar preferencia de idioma en localStorage
export function saveLanguage(lang) {
  try {
    if (lang === 'es' || lang === 'en') {
      localStorage.setItem('orbita7_lang', lang);
    }
  } catch {
    // Manejo seguro de errores de almacenamiento
  }
}

// Obtener diccionario del idioma solicitado con fallback automático a inglés
export function getLocale(lang = 'en') {
  if (lang === 'en') {
    return en;
  }

  // Proxy recursivo de fallback: cualquier clave que falte en español se toma de inglés
  function createFallbackProxy(target, fallback) {
    if (!target) return fallback;
    return new Proxy(target, {
      get(obj, prop) {
        const val = obj[prop];
        const fbVal = fallback ? fallback[prop] : undefined;

        if (val === undefined || val === null) {
          return fbVal;
        }

        // Si es un objeto (pero no arreglo ni función), envolver en proxy recursivo
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          return createFallbackProxy(val, fbVal);
        }

        return val;
      },
    });
  }

  return createFallbackProxy(es, en);
}
