import React, { useState } from 'react';
import {
  isSoundEnabled,
  soundClick,
  soundConfirm,
  soundHover,
  toggleSound,
} from '../game/audio.js';

// =========================================================================
// CONSOLA INTERACTIVA DE MENÚ (PANTALLA DE INICIO)
// - Convierte la imagen estática en un panel de control retro pixel art funcional
// - 3 botones reales y accesibles (mínimo 48px, teclado Tab/Enter, táctil):
//   1. PLAY: Inicia la misión (pulso suave, hover elevado, sonido confirm)
//   2. SOUND: Activa/silencia el sonido, icono dinámico, guarda preferencia
//   3. EN | ES: Alterna idioma al instante entre inglés y español
// - Dales vida: luces LED parpadeantes, deriva de polvo marciano, CRT scanlines
// =========================================================================

export function InteractiveMenuConsole({
  onStartMission,
  currentLang,
  onChangeLang,
  t,
}) {
  const [soundActive, setSoundActive] = useState(isSoundEnabled);

  const menuLocale = t?.menu;

  const handlePlayClick = () => {
    soundConfirm();
    onStartMission();
  };

  const handleSoundToggle = () => {
    const nextState = toggleSound();
    setSoundActive(nextState);
  };

  const handleLangToggle = (lang) => {
    if (lang === currentLang) return;
    soundClick();
    onChangeLang(lang);
  };

  return (
    <div
      className="interactive-menu-console"
      role="region"
      aria-label="Consola de Control de ORBITA-7"
    >
      {/* 1. MARCO DE PANTALLA CRT CON ARTE MARCIANO Y EFECTOS AMBIENTALES */}
      <div className="console-screen-chassis">
        {/* Imagen de fondo original de la base marciana */}
        <img
          src="/assets/orbita7_menu_inicio.png"
          alt=""
          className="console-screen-bg"
        />

        {/* Efecto de deriva de polvo marciano */}
        <div className="console-dust-drift" aria-hidden="true" />

        {/* Líneas de escaneo CRT sutiles */}
        <div className="console-crt-scanlines" aria-hidden="true" />

        {/* Telemetría retro en pantalla */}
        <div className="console-screen-overlay-hud">
          <div className="hud-status-strip">
            <span className="terminal-live-beacon" />
            <b className="terminal-status-text">
              {menuLocale?.consoleStatus ?? 'BASE ALPHA-7 // CONSOLE ACTIVE'}
            </b>
          </div>
          <div className="hud-system-ready-tag">
            {menuLocale?.systemReady ?? 'ALL SYSTEMS NOMINAL'}
          </div>
        </div>

        {/* Luces LED pixel art parpadeantes en el bisel de la consola */}
        <div className="console-led-array" aria-hidden="true">
          <span className="console-led led--green" title="Power status" />
          <span className="console-led led--amber" title="Telemetry sync" />
          <span className="console-led led--cyan" title="Life loop" />
          <span className="console-led led--red" title="Dust alert" />
        </div>
      </div>

      {/* 2. DECK DE BOTONES INTERACTIVOS (3 BOTONES REALES Y ACCESIBLES) */}
      <nav
        className="console-controls-deck"
        aria-label="Controles del menú principal"
      >
        {/* BOTÓN 1: PLAY (Inicia la misión, pulso suave, tamaño destacado) */}
        <button
          type="button"
          className="menu-pixel-btn btn--play is-pulsing-play"
          onClick={handlePlayClick}
          onMouseEnter={soundHover}
          title={menuLocale?.playTitle ?? 'Start Mission'}
          aria-label={menuLocale?.playTitle ?? 'Start Mission'}
        >
          <span className="btn-icon-pixel">▶</span>
          <b className="btn-label-pixel">{menuLocale?.play ?? 'PLAY'}</b>
        </button>

        {/* BOTÓN 2: SOUND (Activa/silencia audio con icono dinámico) */}
        <button
          type="button"
          className={`menu-pixel-btn btn--sound ${soundActive ? 'is-sound-on' : 'is-sound-off'}`}
          onClick={handleSoundToggle}
          onMouseEnter={soundHover}
          title={menuLocale?.soundTitle ?? 'Toggle sound'}
          aria-pressed={soundActive}
          aria-label={menuLocale?.soundTitle ?? 'Toggle sound'}
        >
          <span className="btn-icon-pixel">
            {soundActive ? '🔊' : '🔇'}
          </span>
          <span className="btn-label-group">
            <small className="btn-subtext">{menuLocale?.sound ?? 'SOUND'}</small>
            <b className="btn-state-text">{soundActive ? 'ON' : 'OFF'}</b>
          </span>
        </button>

        {/* BOTÓN 3: SELECTOR DE IDIOMA EN | ES (Cambio instantáneo) */}
        <div
          className="menu-pixel-btn btn--lang-group"
          role="group"
          aria-label={menuLocale?.langTitle ?? 'Switch Language'}
        >
          <button
            type="button"
            className={`lang-sub-pill ${currentLang === 'en' ? 'is-active' : ''}`}
            onClick={() => handleLangToggle('en')}
            onMouseEnter={soundHover}
            title="English (Default)"
            aria-pressed={currentLang === 'en'}
          >
            EN
          </button>
          <span className="lang-pipe" aria-hidden="true">|</span>
          <button
            type="button"
            className={`lang-sub-pill ${currentLang === 'es' ? 'is-active' : ''}`}
            onClick={() => handleLangToggle('es')}
            onMouseEnter={soundHover}
            title="Español"
            aria-pressed={currentLang === 'es'}
          >
            ES
          </button>
        </div>
      </nav>
    </div>
  );
}
