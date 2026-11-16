import React, { useEffect, useRef, useState } from 'react';
import {
  isSoundEnabled,
  playCutsceneSound,
  soundClick,
  soundConfirm,
  soundSoftAlarm,
  soundTypewriter,
  soundWind,
  toggleSound,
} from '../game/audio.js';
import { LanguageSelector } from './LanguageSelector.jsx';

// =========================================================================
// CINEMATIC INTRO: 5 ESCENAS RETRO PIXEL ART ANTES DEL TURNO 1
// 1. Vista general de Marte y Base Alpha-7
// 2. Tormenta de polvo cubriendo cielo y paneles solares
// 3. Baterías bajando y comunicaciones inestables
// 4. S.T.A.R. se dirige al jugador (Director de Operaciones)
// 5. Nave de suministros en órbita con señal de aproximación
// - Subtítulos con efecto de máquina de escribir (máx 10 palabras)
// - Botón SALTAR siempre visible
// - Al terminar, botón INICIAR MISIÓN
// - Sonidos procedurales Web Audio API
// =========================================================================

export function CinematicIntro({ t, lang, onChangeLang, onStartMission, onBackToMenu }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [soundActive, setSoundActive] = useState(isSoundEnabled);

  const introLocale = t?.cinematicIntro;
  const scenes = introLocale?.scenes ?? [];
  const currentScene = scenes[sceneIndex] ?? scenes[0];
  const fullText = currentScene?.text ?? '';

  const timerRef = useRef(null);
  const typewriterTimerRef = useRef(null);

  // 1. EFECTO DE MÁQUINA DE ESCRIBIR
  useEffect(() => {
    setTypedChars(0);
    setIsTypingComplete(false);

    if (typewriterTimerRef.current) {
      clearInterval(typewriterTimerRef.current);
    }

    let charIdx = 0;
    const textLen = fullText.length;

    // Disparar sonido del plano
    if (currentScene?.sound) {
      if (currentScene.sound === 'wind') {
        soundWind();
      } else if (currentScene.sound === 'soft_alarm') {
        soundSoftAlarm();
      } else {
        playCutsceneSound(currentScene.sound);
      }
    }

    typewriterTimerRef.current = setInterval(() => {
      charIdx += 1;
      setTypedChars(charIdx);

      // Reproducir clic sutil de teletipo cada 2 caracteres
      if (charIdx % 2 === 0 && charIdx < textLen) {
        soundTypewriter();
      }

      if (charIdx >= textLen) {
        clearInterval(typewriterTimerRef.current);
        setIsTypingComplete(true);
      }
    }, 40);

    return () => {
      if (typewriterTimerRef.current) {
        clearInterval(typewriterTimerRef.current);
      }
    };
  }, [sceneIndex, fullText, currentScene]);

  // 2. AVANCE AUTOMÁTICO DE ESCENA (3.8 segundos por escena)
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // En la escena 5, no avanza automáticamente para dejar el botón INICIAR MISIÓN activo
    if (sceneIndex < scenes.length - 1) {
      timerRef.current = setTimeout(() => {
        setSceneIndex((prev) => prev + 1);
      }, 3800);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [sceneIndex, scenes.length]);

  // Manejador del botón SALTAR
  const handleSkip = () => {
    soundClick();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);

    // Si ya está en la última escena o el usuario quiere empezar, inicia la misión
    if (sceneIndex === scenes.length - 1) {
      onStartMission();
    } else {
      // Salta a la última escena con el botón de INICIAR MISIÓN listo
      setSceneIndex(scenes.length - 1);
      setTypedChars(scenes[scenes.length - 1]?.text?.length ?? 100);
      setIsTypingComplete(true);
    }
  };

  // Botón Iniciar Misión
  const handleStart = () => {
    soundConfirm();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    onStartMission();
  };

  const handleToggleSound = () => {
    setSoundActive(toggleSound());
  };

  const displayedText = fullText.slice(0, typedChars);

  return (
    <div
      className={`cinematic-intro-wrapper scene--${sceneIndex + 1}`}
      role="region"
      aria-label="Introducción Cinemática de ORBITA-7"
    >
      {/* 1. BARRA SUPERIOR DE LA CINEMÁTICA */}
      <header className="cinematic-header-bar">
        <div className="header-brand-pixel">
          <span className="brand-mark">{t?.hud?.brandBadge ?? 'O7'}</span>
          <b className="brand-name">{t?.hud?.brandName ?? 'ORBITA-7'}</b>
          <span className="brand-subtitle">
            {introLocale?.sceneProgress
              ? introLocale.sceneProgress(sceneIndex + 1, scenes.length)
              : `Scene ${sceneIndex + 1}/${scenes.length}`}
          </span>
        </div>

        <div className="header-actions-row">
          {onBackToMenu && (
            <button
              type="button"
              className="pixel-btn-sm"
              onClick={onBackToMenu}
              title={introLocale?.backToMenu ?? 'Back to menu'}
            >
              ↩ {introLocale?.backToMenu ?? 'MENU'}
            </button>
          )}

          <LanguageSelector
            currentLang={lang}
            onChangeLang={onChangeLang}
            className="intro-lang-pill"
          />

          <button
            type="button"
            className="pixel-btn-sm"
            onClick={handleToggleSound}
            title={t?.hud?.soundTitle ?? 'Sound'}
          >
            {soundActive ? '🔊' : '🔇'}
          </button>

          {/* BOTÓN SALTAR SIEMPRE VISIBLE */}
          <button
            type="button"
            className="cutscene-skip-btn always-visible"
            onClick={handleSkip}
            title={introLocale?.skipTitle ?? 'Skip'}
          >
            <span>{introLocale?.skip ?? 'SKIP'}</span>
            <b>⏩</b>
          </button>
        </div>
      </header>

      {/* 2. ESCENARIO VISUAL PIXEL ART SEGÚN ESCENA (1 a 5) */}
      <div className="cinematic-stage-viewport">
        {/* ESCENA 1: VISTA GENERAL DE MARTE Y BASE ALPHA-7 */}
        {sceneIndex === 0 && (
          <div className="intro-scene intro-scene--1">
            <img
              src="/assets/ORB_ESC_base_exterior_v01.jpg"
              alt=""
              className="scene-bg-pixel"
            />
            <div className="mars-orbit-sun-clear" />
            <div className="base-habitat-dome-glow" />

            {/* 4 Tripulantes en la base marciana */}
            <div className="crew-lineup-unit">
              <div className="crew-sprites-group">
                <img
                  src="/assets/ORB_PERS_tripulante_lider.webp"
                  alt="Comandante"
                  className="crew-avatar-pixel"
                />
                <img
                  src="/assets/ORB_PERS_tripulante_naranja.webp"
                  alt="Especialista"
                  className="crew-avatar-pixel"
                />
                <img
                  src="/assets/ORB_PERS_tripulante_antena.webp"
                  alt="Comunicaciones"
                  className="crew-avatar-pixel"
                />
                <img
                  src="/assets/ORB_PERS_tripulante_naranja.webp"
                  alt="Operador"
                  className="crew-avatar-pixel"
                />
              </div>
              <span className="pixel-label-tag">BASE ALPHA-7 · CREW 04</span>
            </div>

            {/* Rover estacionado */}
            <div className="rover-parked-unit">
              <img
                src="/assets/ORB_OBJ_rover_lateral_v01.png"
                alt=""
                className="rover-sprite-pixel"
              />
            </div>

            {/* Paneles solares limpios iniciales */}
            <div className="solar-clean-unit">
              <img
                src="/assets/ORB_OBJ_panel_solar_v01.png"
                alt=""
                className="panel-sprite-pixel"
              />
            </div>
          </div>
        )}

        {/* ESCENA 2: TORMENTA DE POLVO CUBRE CIELO Y PANELES */}
        {sceneIndex === 1 && (
          <div className="intro-scene intro-scene--2">
            <img
              src="/assets/ORB_ESC_base_exterior_v01.jpg"
              alt=""
              className="scene-bg-pixel is-darkened"
            />
            {/* Capas densas de partículas de polvo en movimiento */}
            <div className="intro-storm-overlay">
              <div className="dust-particle-stream stream-1" />
              <div className="dust-particle-stream stream-2" />
            </div>

            {/* Sol atenuado en el cielo rojizo */}
            <div className="cinematic-sun-dimmed" />

            {/* Paneles solares cubriéndose de polvo */}
            <div className="solar-dusting-unit">
              <img
                src="/assets/ORB_OBJ_panel_solar_v01.png"
                alt=""
                className="panel-sprite-pixel"
              />
              <div className="pixel-dust-blanket is-active" />
              <div className="storm-alert-badge">
                <img
                  src="/assets/orbita7_alerta_tormenta_de_polvo_v3.png"
                  alt=""
                  className="storm-alert-icon"
                />
              </div>
            </div>

            <div className="storm-telemetry-box">
              <span className="telemetry-chip loss">⚡ SOLAR DROPPING: 12%</span>
            </div>
          </div>
        )}

        {/* ESCENA 3: BATERÍAS BAJANDO Y COMUNICACIONES PARPADEANDO */}
        {sceneIndex === 2 && (
          <div className="intro-scene intro-scene--3">
            <img
              src="/assets/ORB_ESC_sala_control_v01.webp"
              alt=""
              className="scene-bg-pixel"
            />
            <div className="red-alert-flashing-overlay" />

            {/* Medidor de batería grande cayendo */}
            <div className="power-drain-hero-card">
              <div className="hero-card-header">
                <span className="power-icon-spark">⚡</span>
                <b className="power-title">MAIN BATTERY ARRAY</b>
              </div>
              <div className="power-gauge-track">
                <div className="power-gauge-fill is-collapsing" />
              </div>
              <div className="power-stats-row">
                <span className="drain-val">80% ➔ 28%</span>
                <span className="drain-warn-blink">CRITICAL</span>
              </div>
            </div>

            {/* Antena y comunicaciones inestables */}
            <div className="comms-disrupt-hero-card">
              <div className="antenna-sprite-box">
                <img
                  src="/assets/ORB_PERS_tripulante_antena.webp"
                  alt=""
                  className="antenna-tech-sprite"
                />
                <div className="static-wave-anim" />
              </div>
              <div className="comms-status-strip">
                <span className="static-tag">📡 NO SIGNAL // RE-LINKING</span>
              </div>
            </div>
          </div>
        )}

        {/* ESCENA 4: S.T.A.R. SE DIRIGE AL JUGADOR (DIRECTOR DE OPERACIONES) */}
        {sceneIndex === 3 && (
          <div className="intro-scene intro-scene--4">
            <div className="star-terminal-interface">
              <div className="terminal-crt-scanlines" />

              {/* Dossier del Director */}
              <div className="director-dossier-card">
                <div className="dossier-badge-row">
                  <span className="ai-star-mark">S.T.A.R. AI</span>
                  <span className="dossier-auth">AUTH: LEVEL-A // MARS COMMAND</span>
                </div>

                <div className="director-title-box">
                  <span className="director-eyebrow">APPOINTED OFFICER</span>
                  <h2 className="director-role-text">OPERATIONS DIRECTOR</h2>
                  <p className="director-sub-directive">
                    BASE ALPHA-7 · ALL PROTOCOLS DELEGATED
                  </p>
                </div>

                {/* Mapa táctico de la colonia */}
                <div className="tactical-colony-map">
                  <img
                    src="/assets/ORB_MAP_alpha7.webp"
                    alt=""
                    className="colony-map-img"
                  />
                  <div className="node-ping node-energy">⚡</div>
                  <div className="node-ping node-life">🫁</div>
                  <div className="node-ping node-water">💧</div>
                  <div className="node-ping node-safety">🛡️</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ESCENA 5: NAVE DE SUMINISTROS EN ÓRBITA CON PEQUEÑA SEÑAL */}
        {sceneIndex === 4 && (
          <div className="intro-scene intro-scene--5">
            <div className="orbital-space-backdrop">
              <div className="starry-cosmos-layer" />
              <div className="mars-curved-limb" />

              {/* Nave de suministros en órbita */}
              <div className="cargo-ship-orbit-actor">
                <img
                  src="/assets/ORB_OBJ_nave_suministros_v01.png"
                  alt=""
                  className="cargo-vessel-sprite"
                />
                <div className="orbital-beacon-rings" />
                <div className="telemetry-beacon-line" />
              </div>

              {/* Datos de aproximación */}
              <div className="orbit-vessel-hud">
                <span className="vessel-tag">VESSEL: SS HOPE-7</span>
                <span className="vessel-orbit-countdown">ORBIT: 72 HOURS</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. CONSOLA DE SUBTÍTULOS S.T.A.R. (MÁQUINA DE ESCRIBIR) */}
      <footer className="cinematic-caption-console">
        <div className="caption-star-header">
          <span className="star-tag-badge">
            {introLocale?.starTag ?? 'S.T.A.R. // BRIEFING DIRECTIVE'}
          </span>
          <span className="scene-topic-tag">{currentScene?.title}</span>
        </div>

        {/* Texto con efecto de teletipo */}
        <div className="caption-typewriter-box">
          <b className="typewriter-line">
            {displayedText}
            {!isTypingComplete && <span className="typewriter-cursor">█</span>}
          </b>
        </div>

        {/* Puntos de paso de las 5 escenas */}
        <div className="cinematic-dots-row">
          {scenes.map((sc, idx) => (
            <button
              key={sc.id}
              type="button"
              className={`intro-dot-btn ${idx === sceneIndex ? 'is-active' : idx < sceneIndex ? 'is-done' : ''}`}
              onClick={() => setSceneIndex(idx)}
              title={`${sc.title}`}
            >
              <span className="dot-inner" />
            </button>
          ))}
        </div>

        {/* 4. BOTÓN INICIAR MISIÓN (Aparece al terminar la escena 5 o de inmediato al saltar) */}
        {(sceneIndex === scenes.length - 1 || isTypingComplete) && (
          <div className="cinematic-start-action-row">
            <button
              type="button"
              className="big-pixel-btn btn-start-mission-glow"
              onClick={handleStart}
              title={introLocale?.startMission ?? 'Start Mission'}
            >
              <span>{introLocale?.startMission ?? 'START MISSION'}</span>
              <b className="arrow-icon">➔</b>
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
