// ORBITA-7: Game Design Data (Retro Pixel Art Edition)
// Delegated cleanly to en.js (default) and es.js for full i18n support.

import { en } from './en.js';
import { es } from './es.js';

export const initialResources = {
  energy: 80,    // var_energia: 80/100
  life: 80,      // var_soporte: 80/100
  supplies: 80,  // var_suministros: 80/100
  safety: 80,    // var_seguridad: 80/100
};

export const baseTurnConsumption = {
  energy: -5,    // Energía: -5 por turno
  life: -3,      // Soporte vital: -3 por turno
  supplies: -4,  // Agua y suministros: -4 por turno
  safety: 0,     // Seguridad: no baja automáticamente
};

export const TOTAL_GAME_HOURS = 72;

export const resourceMeta = {
  es: {
    energy: { label: es.resources.energy.label, code: 'var_energia', short: 'ENE', icon: '⚡', image: 'assets/ORB_UI_energia.webp', color: 'energy' },
    life: { label: es.resources.life.label, code: 'var_soporte', short: 'SOP', icon: '🫁', image: 'assets/ORB_UI_soporte_vital.webp', color: 'life' },
    supplies: { label: es.resources.supplies.label, code: 'var_suministros', short: 'AGU', icon: '💧', image: 'assets/ORB_UI_animo.webp', color: 'supplies' },
    safety: { label: es.resources.safety.label, code: 'var_seguridad', short: 'SEG', icon: '🛡️', image: 'assets/ORB_UI_proteccion.webp', color: 'safety' },
  },
  en: {
    energy: { label: en.resources.energy.label, code: 'var_energia', short: 'ENG', icon: '⚡', image: 'assets/ORB_UI_energia.webp', color: 'energy' },
    life: { label: en.resources.life.label, code: 'var_soporte', short: 'LIF', icon: '🫁', image: 'assets/ORB_UI_soporte_vital.webp', color: 'life' },
    supplies: { label: en.resources.supplies.label, code: 'var_suministros', short: 'WAT', icon: '💧', image: 'assets/ORB_UI_animo.webp', color: 'supplies' },
    safety: { label: en.resources.safety.label, code: 'var_seguridad', short: 'SAF', icon: '🛡️', image: 'assets/ORB_UI_proteccion.webp', color: 'safety' },
  },
};

export const missionsData = {
  en: en.missions,
  es: es.missions,
};

export const briefingScript = {
  en: en.briefing,
  es: es.briefing,
};

export const endingsData = {
  en: en.endings,
  es: es.endings,
};

