import React from 'react';
import { soundClick } from '../game/audio.js';

// =========================================================================
// SELECTOR DE IDIOMA PIXEL ART (EN | ES)
// - Pequeño, nítido y siempre visible
// - Inglés por defecto, persistido en localStorage
// =========================================================================

export function LanguageSelector({ currentLang, onChangeLang, className = '' }) {
  const handleSelect = (lang) => {
    if (lang === currentLang) return;
    soundClick();
    onChangeLang(lang);
  };

  return (
    <div
      className={`pixel-lang-selector ${className}`}
      role="group"
      aria-label="Language selector / Selector de idioma"
    >
      <button
        type="button"
        className={`lang-pill ${currentLang === 'en' ? 'is-active' : ''}`}
        onClick={() => handleSelect('en')}
        title="English (Default)"
        aria-pressed={currentLang === 'en'}
      >
        EN
      </button>
      <span className="lang-divider" aria-hidden="true">|</span>
      <button
        type="button"
        className={`lang-pill ${currentLang === 'es' ? 'is-active' : ''}`}
        onClick={() => handleSelect('es')}
        title="Español"
        aria-pressed={currentLang === 'es'}
      >
        ES
      </button>
    </div>
  );
}
