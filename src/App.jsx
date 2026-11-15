import { useEffect, useRef, useState } from 'react';
import './gameplay.css';
import {
  baseTurnConsumption,
  briefingScript,
  endingsData,
  missionsData,
  resourceMeta,
  TOTAL_GAME_HOURS,
} from './data/missions.js';
import {
  chooseOption,
  continueAfterReport,
  freshGame,
  resourceStatus,
  startGame,
} from './game/engine.js';
import {
  isSoundEnabled,
  soundAction,
  soundAlert,
  soundClick,
  soundConfirm,
  soundHover,
  toggleSound,
} from './game/audio.js';

// =========================================================================
// COMPONENTE AUXILIAR: INSIGNIA S.T.A.R.
// =========================================================================
function StarBadge({ lang = 'es' }) {
  return (
    <div className="star-badge" aria-label="S.T.A.R.">
      <span className="star-icon">✦</span>
      <div className="star-badge-copy">
        <b>S.T.A.R.</b>
        <small>{lang === 'es' ? 'SISTEMA IA' : 'AI SYSTEM'}</small>
      </div>
    </div>
  );
}

// =========================================================================
// 6.1 BARRA SUPERIOR (HUD) - RELOJ, INDICADORES Y ALERTAS
// =========================================================================
function HUDTopBar({ game, missions, meta, lang, setLang, onRestart }) {
  const [soundActive, setSoundActive] = useState(isSoundEnabled);
  const mission = missions[game.turn] ?? missions[0];
  const elapsed = mission.startHour;
  const remaining = mission.remainingHours;
  const pct = Math.min(100, Math.round((elapsed / TOTAL_GAME_HOURS) * 100));

  const handleToggleSound = () => {
    setSoundActive(toggleSound());
  };

  return (
    <header className="hud-topbar">
      {/* Identidad del juego */}
      <div className="hud-brand">
        <span className="brand-mark">O7</span>
        <div className="brand-copy">
          <b>ORBITA-7</b>
          <small>{lang === 'es' ? 'BASE ALPHA-7 · ARCADIA PLANITIA' : 'BASE ALPHA-7 · ARCADIA PLANITIA'}</small>
        </div>
      </div>

      {/* Reloj de misión (Sección 6.1 GDD) */}
      <div className="hud-clock-widget" aria-label="Reloj de misión">
        <div className="clock-header">
          <span className="live-dot" />
          <span className="clock-title">{lang === 'es' ? 'RELOJ DE MISIÓN' : 'MISSION CLOCK'}:</span>
          <b className="clock-hour">{mission.time}</b>
          <span className="clock-turn">
            {lang === 'es' ? `TURNO ${game.turn + 1}/6` : `TURN ${game.turn + 1}/6`}
          </span>
        </div>
        <div className="clock-progress-bar">
          <div className="clock-progress-fill" style={{ width: `${pct}%` }} />
          <span className="clock-remaining">
            {remaining}h {lang === 'es' ? 'restantes' : 'remaining'}
          </span>
        </div>
      </div>

      {/* Cuatro Indicadores globales (Sección 6.1 GDD) */}
      <div className="hud-indicators-panel">
        {Object.entries(game.resources).map(([key, value]) => {
          const itemMeta = meta[key];
          const isLow = value < 40;
          const isCritical = value < 20;

          return (
            <div
              key={key}
              className={`indicator-gauge indicator--${itemMeta.color}${isLow ? ' is-low' : ''}${isCritical ? ' is-critical' : ''}`}
              title={`${itemMeta.label} (${itemMeta.code}): ${value}/100`}
            >
              <div className="indicator-top">
                <span className="indicator-icon">
                  <img src={itemMeta.image} alt="" />
                </span>
                <div className="indicator-labels">
                  <span className="ind-name">{itemMeta.label}</span>
                  <span className="ind-code">{itemMeta.code}</span>
                </div>
                <div className="ind-value-box">
                  {isLow && <span className="ind-warning-icon" title="Recurso bajo">⚠</span>}
                  <b>{value}<small>/100</small></b>
                </div>
              </div>
              <div className="indicator-track">
                <span className="indicator-fill" style={{ width: `${value}%` }} />
              </div>
              <div className="indicator-status-label">
                {resourceStatus(value, lang)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Botones de control */}
      <div className="hud-controls">
        <button
          className="hud-pill-btn"
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          title="Cambiar idioma / Switch language"
        >
          🌐 {lang.toUpperCase()}
        </button>
        <button className="hud-pill-btn" onClick={handleToggleSound} title="Sonido">
          {soundActive ? '🔊' : '🔇'}
        </button>
        <button
          className="hud-pill-btn hud-pill-btn--danger"
          onClick={() => {
            soundClick();
            onRestart();
          }}
          title={lang === 'es' ? 'Reiniciar simulación' : 'Restart simulation'}
        >
          {lang === 'es' ? 'REINICIAR' : 'RESTART'}
        </button>
      </div>
    </header>
  );
}

// =========================================================================
// 6.2 CENTRO: VISTA DINÁMICA DE LA BASE ALPHA-7 (ESTADO VISUAL REACTIVO CON SVG)
// =========================================================================
function BaseAlpha7Viewport({
  energy = 80,
  isCleaned = false,
  isPowerSaving = false,
  actionOptionId = null,
  lang = 'es',
  mission,
  onTestEnergy,
}) {
  const missionId = mission?.id ?? 1;

  // Estado derivado de ENERGÍA (Regla 1 del usuario):
  // > 60: Luces encendidas normales
  // 30 - 60: Luces titilan (flicker)
  // < 30: Luces apagadas casi todas + parpadeo rojo de emergencia
  const energyState = energy > 60 ? 'high' : energy >= 30 ? 'medium' : 'low';

  // Rayitas de la batería (5 barras de 20% cada una)
  const batteryBars = [
    { id: 1, min: 1, color: energy < 30 ? '#ff3b69' : '#55d6c2' },
    { id: 2, min: 21, color: energy < 30 ? '#ff3b69' : '#55d6c2' },
    { id: 3, min: 41, color: energy < 50 ? '#f4d36c' : '#55d6c2' },
    { id: 4, min: 61, color: '#55d6c2' },
    { id: 5, min: 81, color: '#55d6c2' },
  ];

  // Estado de los paneles y sol (Regla 1 y 2):
  // El cielo siempre tiene la tormenta activa (30% luz solar).
  // Los paneles sucios absorben 12% neto; limpios absorben 30% neto.
  const atmosphericLight = 30; // La tormenta en el cielo bloquea el 70% de luz
  const dustOnPanels = isCleaned ? 0 : 85;
  const netPowerOutput = isCleaned ? 30 : 12;

  // Animación del rover
  const isRoverRunning = actionOptionId === 'A';
  const isEvaRunning = actionOptionId === 'B';

  return (
    <section className="viewport-stage" aria-label="Vista visual reactiva de Base Alpha-7">
      {/* ================================================================= */}
      {/* LIENZO VECTORIAL SVG PURO: ESCENARIO REACTIVO A LOS 4 INDICADORES */}
      {/* ================================================================= */}
      <svg
        className="base-alpha7-svg-stage"
        viewBox="0 0 1000 380"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cielo marciano con tormenta activa */}
          <linearGradient id="marsSkyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#140a12" />
            <stop offset="45%" stopColor="#2a1216" />
            <stop offset="85%" stopColor="#481c1c" />
            <stop offset="100%" stopColor="#2c1114" />
          </linearGradient>

          {/* Suelo marciano de regolito */}
          <linearGradient id="marsGroundGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#281115" />
            <stop offset="25%" stopColor="#1f0d11" />
            <stop offset="100%" stopColor="#0d060a" />
          </linearGradient>

          {/* Celdas fotovoltaicas de los paneles */}
          <linearGradient id="solarCellGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f1c3a" />
            <stop offset="50%" stopColor="#192a54" />
            <stop offset="100%" stopColor="#0b1328" />
          </linearGradient>

          {/* Brillo especular de los paneles cuando están limpios */}
          <linearGradient id="solarGlintGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="45%" stopColor="rgba(85, 214, 194, 0.05)" />
            <stop offset="50%" stopColor="rgba(85, 214, 194, 0.7)" />
            <stop offset="55%" stopColor="rgba(244, 211, 108, 0.6)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Textura de la capa de polvo de óxido de hierro sobre los paneles */}
          <pattern id="dustTexturePattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <rect width="24" height="24" fill="rgba(195, 95, 55, 0.92)" />
            <circle cx="4" cy="5" r="1.5" fill="#f0ad78" opacity="0.6" />
            <circle cx="16" cy="11" r="2" fill="#9e4828" opacity="0.7" />
            <circle cx="10" cy="19" r="1.8" fill="#e89060" opacity="0.65" />
            <circle cx="21" cy="4" r="1.2" fill="#d97543" opacity="0.8" />
          </pattern>

          {/* Filtros de resplandor para luces y baliza roja */}
          <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glowCyan" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. CIELO Y TORMENTA PERMANENTE */}
        <rect x="0" y="0" width="1000" height="260" fill="url(#marsSkyGradient)" />

        {/* Sol marciano oscurecido por la tormenta (Regla 1 y 2) */}
        <g id="dimmed-sun" transform="translate(830, 60)">
          <circle cx="0" cy="0" r="42" fill="rgba(235, 120, 80, 0.15)" />
          <circle cx="0" cy="0" r="26" fill="rgba(235, 120, 80, 0.3)" />
          <circle cx="0" cy="0" r="14" fill="#e8f3ff" opacity="0.75" />
        </g>

        {/* Cordillera lejana de Arcadia Planitia */}
        <polygon
          points="0,215 90,195 210,210 320,185 460,205 600,180 750,200 890,188 1000,210 1000,260 0,260"
          fill="#1b0c11"
        />

        {/* Ráfagas de viento y polvo de la tormenta en el cielo */}
        <g id="sky-dust-gusts" opacity="0.35">
          <path d="M -50 85 Q 300 65 650 90 T 1100 80" stroke="#f28b4b" strokeWidth="18" fill="none" opacity="0.25" />
          <path d="M -80 140 Q 250 120 700 145 T 1120 135" stroke="#f4d36c" strokeWidth="26" fill="none" opacity="0.2" />
        </g>

        {/* 2. SUELO MARCIANO */}
        <polygon points="0,240 1000,240 1000,380 0,380" fill="url(#marsGroundGradient)" />
        <line x1="0" y1="240" x2="1000" y2="240" stroke="#f28b4b" strokeWidth="1.5" opacity="0.4" />

        {/* ================================================================= */}
        {/* 3. DÓMO DEL HÁBITAT BASE ALPHA-7 (ESTADO SEGÚN ENERGÍA) */}
        {/* ================================================================= */}
        <g id="habitat-dome" transform="translate(190, 160)">
          {/* Haz de luz exterior si la energía > 60 */}
          {energyState === 'high' && (
            <polygon points="60,78 -20,115 150,115" fill="rgba(255, 235, 130, 0.14)" />
          )}
          {energyState === 'medium' && (
            <polygon points="60,78 -20,115 150,115" fill="rgba(255, 235, 130, 0.07)" className="svg-flicker-lights" />
          )}

          {/* Estructura exterior del domo reforzado */}
          <path
            d="M 20 115 A 95 85 0 0 1 200 115 Z"
            fill="#181c34"
            stroke="#3a4268"
            strokeWidth="3"
          />
          <path d="M 50 115 A 70 65 0 0 1 170 115" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" />

          {/* Módulo de esclusa lateral derecha */}
          <rect x="180" y="70" width="38" height="45" rx="3" fill="#1b203c" stroke="#4a5585" strokeWidth="2" />
          <line x1="199" y1="70" x2="199" y2="115" stroke="#333b60" strokeWidth="2" />

          {/* VENTANAS DEL HÁBITAT (REGLA 1):
              > 60: Encendidas amarillo cálido
              30 - 60: Titilan (flicker)
              < 30: Apagadas casi todas */}
          <g id="dome-windows">
            {energyState === 'high' && (
              <g filter="url(#glowGold)">
                <rect x="70" y="58" width="16" height="12" rx="2" fill="#ffe773" opacity="0.95" />
                <rect x="94" y="52" width="18" height="13" rx="2" fill="#ffe773" opacity="0.95" />
                <rect x="120" y="52" width="18" height="13" rx="2" fill="#ffe773" opacity="0.95" />
                <rect x="146" y="58" width="16" height="12" rx="2" fill="#ffe773" opacity="0.95" />
              </g>
            )}
            {energyState === 'medium' && (
              <g className="svg-flicker-lights">
                <rect x="70" y="58" width="16" height="12" rx="2" fill="#ffd54f" opacity="0.75" />
                <rect x="94" y="52" width="18" height="13" rx="2" fill="#ffd54f" opacity="0.8" />
                <rect x="120" y="52" width="18" height="13" rx="2" fill="#ffd54f" opacity="0.7" />
                <rect x="146" y="58" width="16" height="12" rx="2" fill="#ffd54f" opacity="0.75" />
              </g>
            )}
            {energyState === 'low' && (
              <g>
                {/* Ventanas apagadas (interior a oscuras) */}
                <rect x="70" y="58" width="16" height="12" rx="2" fill="#151726" opacity="0.6" stroke="#252a42" />
                <rect x="94" y="52" width="18" height="13" rx="2" fill="#151726" opacity="0.6" stroke="#252a42" />
                <rect x="120" y="52" width="18" height="13" rx="2" fill="#151726" opacity="0.6" stroke="#252a42" />
                {/* Una sola ventana con luz roja residual débil */}
                <rect x="146" y="58" width="16" height="12" rx="2" fill="#ff3344" opacity="0.4" />
              </g>
            )}
          </g>

          {/* BALIZA SUPERIOR DE LA CÚPULA (REGLA 1):
              < 30: PARPADEO ROJO DE EMERGENCIA
              30 - 60: Ámbar lento
              > 60: Cian fijo */}
          <g id="dome-beacon" transform="translate(110, 26)">
            <rect x="-3" y="0" width="6" height="6" fill="#444d75" />
            {energyState === 'low' ? (
              <g className="svg-strobe-red">
                <circle cx="0" cy="-3" r="16" fill="rgba(255, 30, 60, 0.45)" filter="url(#glowRed)" />
                <circle cx="0" cy="-3" r="8" fill="#ff1744" />
                <circle cx="0" cy="-3" r="4" fill="#ffffff" />
              </g>
            ) : energyState === 'medium' ? (
              <g>
                <circle cx="0" cy="-3" r="8" fill="rgba(244, 211, 108, 0.4)" />
                <circle cx="0" cy="-3" r="4" fill="#f4d36c" />
              </g>
            ) : (
              <g>
                <circle cx="0" cy="-3" r="6" fill="rgba(85, 214, 194, 0.4)" />
                <circle cx="0" cy="-3" r="3" fill="#55d6c2" />
              </g>
            )}
          </g>

          {/* Rótulo de la base */}
          <text x="110" y="98" fill="#8c90ad" fontSize="8" fontFamily="DM Mono, monospace" textAnchor="middle" letterSpacing="2">
            ALPHA-7 // HAB
          </text>
        </g>

        {/* ================================================================= */}
        {/* 4. BANCO DE BATERÍAS CON RAYITAS SEGMENTADAS (REGLA 1) */}
        {/* ================================================================= */}
        <g id="battery-station" transform="translate(95, 205)">
          {/* Gabinete metálico de la batería */}
          <rect x="0" y="0" width="64" height="68" rx="4" fill="#141830" stroke="#373e63" strokeWidth="1.5" />
          <rect x="4" y="4" width="56" height="14" fill="#0c0e1e" rx="2" />
          <text x="32" y="14" fill="#8c90ad" fontSize="7" fontFamily="DM Mono, monospace" textAnchor="middle">
            BAT RES-7
          </text>

          {/* RAYITAS QUE BAJAN (5 segmentos horizontales):
              Se apagan a medida que la energía baja de 100 a 0 */}
          <g id="battery-segmented-bars" transform="translate(8, 22)">
            {batteryBars.map((bar, index) => {
              const isLit = energy >= bar.min;
              const yPos = 32 - index * 8; // De abajo hacia arriba
              return (
                <g key={bar.id}>
                  {/* Pista apagada de fondo */}
                  <rect x="0" y={yPos} width="48" height="5.5" rx="1.5" fill="#1b203c" />
                  {/* Segmento encendido si la energía lo cubre */}
                  {isLit && (
                    <rect
                      x="0"
                      y={yPos}
                      width="48"
                      height="5.5"
                      rx="1.5"
                      fill={bar.color}
                      className={energy < 30 ? 'svg-strobe-fast' : ''}
                      filter={isLit && energy >= 30 ? 'url(#glowCyan)' : undefined}
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Lectura numérica en la base de la batería */}
          <text
            x="32"
            y="64"
            fill={energy < 30 ? '#ff5277' : energy < 60 ? '#f4d36c' : '#55d6c2'}
            fontSize="8"
            fontWeight="bold"
            fontFamily="DM Mono, monospace"
            textAnchor="middle"
          >
            {energy}% {energyState === 'low' ? '⚠ BAJA' : energyState === 'medium' ? '⚡ MED' : '✓ OK'}
          </text>
        </g>

        {/* ================================================================= */}
        {/* 5. MATRIZ DE PANELES SOLARES (REGLA 1 Y 2: POLVO Y BRILLO SOLAR) */}
        {/* ================================================================= */}
        <g id="solar-panel-array" transform="translate(520, 175)">
          {/* Mástiles de soporte y seguimiento solar */}
          <line x1="80" y1="100" x2="80" y2="60" stroke="#3d466e" strokeWidth="6" strokeLinecap="round" />
          <line x1="200" y1="100" x2="200" y2="60" stroke="#3d466e" strokeWidth="6" strokeLinecap="round" />
          <polygon points="40,60 240,60 235,66 45,66" fill="#2d3350" />

          {/* Marco de los paneles solares fotovoltaicos inclinados */}
          <polygon points="20,18 260,18 245,64 5,64" fill="#0d1428" stroke="#485382" strokeWidth="2" />

          {/* Celdas fotovoltaicas (azul espacial profundo) */}
          <polygon points="24,21 256,21 242,61 10,61" fill="url(#solarCellGradient)" />

          {/* Líneas de cuadrícula de celdas */}
          <g stroke="rgba(255,255,255,0.12)" strokeWidth="1">
            <line x1="62" y1="21" x2="52" y2="61" />
            <line x1="102" y1="21" x2="92" y2="61" />
            <line x1="142" y1="21" x2="132" y2="61" />
            <line x1="182" y1="21" x2="172" y2="61" />
            <line x1="222" y1="21" x2="212" y2="61" />
            <line x1="17" y1="41" x2="249" y2="41" />
          </g>

          {/* BRILLO PROPORCIONAL A LA LUZ (REGLA 1):
              Si están limpios, destello cian/oro visible; si están con polvo, mate */}
          {isCleaned && (
            <polygon
              points="24,21 256,21 242,61 10,61"
              fill="url(#solarGlintGradient)"
              className="svg-solar-gleam-anim"
            />
          )}

          {/* CAPA DE POLVO VISIBLE MIENTRAS var_paneles_limpios = 0 (REGLA 2):
              Capa de polvo de óxido de hierro que bloquea las celdas */}
          <polygon
            points="22,19 258,19 244,63 7,63"
            fill="url(#dustTexturePattern)"
            className={`solar-dust-layer-svg ${isCleaned ? 'is-dissolved' : 'is-visible'}`}
            opacity={isCleaned ? 0 : 0.94}
          />

          {/* RAYO DE LIMPIEZA LÁSER / CEPILLOS DEL ROVER DURANTE LA ACCIÓN */}
          {isRoverRunning && (
            <g className="svg-laser-sweep-beam">
              <polygon points="10,18 45,18 35,64 0,64" fill="rgba(85, 214, 194, 0.75)" filter="url(#glowCyan)" />
              <line x1="30" y1="18" x2="20" y2="64" stroke="#ffffff" strokeWidth="3" />
            </g>
          )}

          {/* Icono de advertencia si los paneles están cubiertos de polvo */}
          {!isCleaned && (
            <g transform="translate(130, 2)" className="svg-strobe-fast">
              <circle cx="0" cy="0" r="10" fill="#f28b4b" />
              <text x="0" y="4" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">⚠</text>
            </g>
          )}

          {/* Rótulo de matriz solar y telemetría de rendimiento */}
          <text x="130" y="80" fill="#bac0d8" fontSize="8" fontFamily="DM Mono, monospace" textAnchor="middle">
            MATRIZ SOLAR FOTOVOLTAICA
          </text>
          <text
            x="130"
            y="92"
            fill={isCleaned ? '#55d6c2' : '#ff7b54'}
            fontSize="8"
            fontWeight="bold"
            fontFamily="DM Mono, monospace"
            textAnchor="middle"
          >
            {isCleaned ? '✓ 0% POLVO · POTENCIA: 30%' : '⚠ 85% POLVO · POTENCIA: 12% (CRÍTICA)'}
          </text>
        </g>

        {/* ================================================================= */}
        {/* 6. ROVER AUTÓNOMO ALPHA-7 (REGLA 2: ANIMA PASANDO Y LIMPIANDO) */}
        {/* ================================================================= */}
        <g
          id="rover-unit"
          className={`rover-svg-group ${isRoverRunning ? 'rover-animating-sweep' : ''}`}
          transform="translate(60, 245)"
        >
          {/* Sombra en el suelo */}
          <ellipse cx="25" cy="40" rx="28" ry="4" fill="rgba(0,0,0,0.5)" />

          {/* Chasis del rover */}
          <rect x="5" y="16" width="38" height="15" rx="3" fill="#cfd3e6" stroke="#4a5068" strokeWidth="1.5" />
          <rect x="10" y="8" width="22" height="9" rx="2" fill="#20263f" />

          {/* Mástil con cámara panorámica y sensor */}
          <line x1="32" y1="8" x2="32" y2="-2" stroke="#5a6585" strokeWidth="2" />
          <circle cx="32" cy="-4" r="3" fill="#55d6c2" filter="url(#glowCyan)" />

          {/* Brazo robótico con cepillo / escáner de polvo */}
          <line x1="38" y1="22" x2="48" y2="15" stroke="#f4d36c" strokeWidth="2.5" />
          <circle cx="49" cy="14" r="3.5" fill="#f28b4b" className={isRoverRunning ? 'svg-spin-fast' : ''} />

          {/* 6 Ruedas con sistema de suspensión balancín (rocker-bogie) */}
          <g fill="#1a1c28" stroke="#687396" strokeWidth="1.5">
            <circle cx="8" cy="34" r="6" />
            <circle cx="24" cy="34" r="6" />
            <circle cx="40" cy="34" r="6" />
          </g>

          {/* Rótulo del rover */}
          <text x="24" y="52" fill="#55d6c2" fontSize="7" fontFamily="DM Mono, monospace" textAnchor="middle">
            ROVER A-7
          </text>
        </g>

        {/* ================================================================= */}
        {/* 7. TRIPULACIÓN EVA CERCA DE LA ESCLUSA */}
        {/* ================================================================= */}
        <g
          id="eva-crew"
          className={`crew-svg-group ${isEvaRunning ? 'crew-animating-eva' : ''}`}
          transform="translate(415, 238)"
        >
          {/* Astronauta 1 (Comandante en traje blanco) */}
          <g transform="translate(0, 0)">
            <ellipse cx="10" cy="42" rx="8" ry="2.5" fill="rgba(0,0,0,0.4)" />
            {/* Mochila de soporte vital (PLSS) */}
            <rect x="2" y="12" width="6" height="18" rx="2" fill="#4a5578" />
            {/* Traje presurizado */}
            <rect x="6" y="10" width="12" height="22" rx="4" fill="#e4e8f5" stroke="#687498" strokeWidth="1" />
            {/* Casco con visor dorado reflectante */}
            <circle cx="12" cy="7" r="6.5" fill="#e4e8f5" stroke="#687498" strokeWidth="1" />
            <ellipse cx="14" cy="7" rx="3.5" ry="4" fill="#f4d36c" />
            {/* Piernas */}
            <rect x="8" y="30" width="3.5" height="11" fill="#c4cadc" />
            <rect x="13" y="30" width="3.5" height="11" fill="#c4cadc" />
          </g>

          {/* Astronauta 2 (Especialista en traje naranja) */}
          <g transform="translate(18, 2)">
            <ellipse cx="10" cy="42" rx="8" ry="2.5" fill="rgba(0,0,0,0.4)" />
            <rect x="2" y="12" width="6" height="18" rx="2" fill="#4a5578" />
            <rect x="6" y="10" width="12" height="22" rx="4" fill="#f28b4b" stroke="#7a3a1b" strokeWidth="1" />
            <circle cx="12" cy="7" r="6.5" fill="#f28b4b" />
            <ellipse cx="14" cy="7" rx="3.5" ry="4" fill="#f4d36c" />
            <rect x="8" y="30" width="3.5" height="11" fill="#b85a28" />
            <rect x="13" y="30" width="3.5" height="11" fill="#b85a28" />
          </g>

          <text x="18" y="52" fill="#e4e8f5" fontSize="7" fontFamily="DM Mono, monospace" textAnchor="middle">
            EVA CREW
          </text>
        </g>
      </svg>

      {/* ================================================================= */}
      {/* BANNER DE TELEMETRÍA CIENTÍFICA SUPERPUESTO */}
      {/* ================================================================= */}
      <div className="stage-telemetry-banner">
        <div className="telemetry-bar-row">
          <div className="telemetry-factor">
            <span className="factor-label">{lang === 'es' ? '1. Luz en cielo (Tormenta):' : '1. Sky Light (Storm):'}</span>
            <div className="factor-progress">
              <span style={{ width: `${atmosphericLight}%` }} />
            </div>
            <b className="factor-val">{atmosphericLight}% ({lang === 'es' ? 'Cielo oscuro' : 'Dark sky'})</b>
          </div>

          <div className="telemetry-factor">
            <span className="factor-label">{lang === 'es' ? '2. Polvo en paneles:' : '2. Panel Dust:'}</span>
            <div className="factor-progress">
              <span
                className={isCleaned ? 'fill-clean' : 'fill-dirty'}
                style={{ width: `${dustOnPanels}%` }}
              />
            </div>
            <b className="factor-val">
              {dustOnPanels}% {isCleaned ? (lang === 'es' ? '(¡Limpios!)' : '(Cleaned!)') : (lang === 'es' ? '(Cubiertos)' : '(Blanketed)')}
            </b>
          </div>

          <div className="telemetry-factor">
            <span className="factor-label">{lang === 'es' ? '3. Batería Base Alpha-7:' : '3. Base Battery:'}</span>
            <div className="factor-progress">
              <span
                style={{
                  width: `${energy}%`,
                  background: energy < 30 ? '#ff3b69' : energy < 60 ? '#f4d36c' : '#55d6c2',
                }}
              />
            </div>
            <b className="factor-val">
              {energy}% ({energyState === 'high' ? 'Luces ON' : energyState === 'medium' ? 'Luces Titilando' : 'Alerta Roja'})
            </b>
          </div>

          <div className="telemetry-factor telemetry-factor--result">
            <span className="factor-label">{lang === 'es' ? '➔ Gen. eléctrica neta:' : '➔ Net Output:'}</span>
            <b className={`output-score ${isCleaned ? 'is-improved' : 'is-critical'}`}>
              {netPowerOutput}%
            </b>
          </div>
        </div>

        {/* NOTA DINÁMICA DE LA FÍSICA MARCIANA */}
        <div className={`telemetry-note ${isCleaned ? 'note--cleaned' : isPowerSaving ? 'note--saving' : 'note--dusty'}`}>
          {isCleaned ? (
            <span>
              ✓ <b>{lang === 'es' ? 'Paneles limpios (0% polvo)' : 'Panels Cleaned (0% dust)'}:</b>{' '}
              {lang === 'es'
                ? 'La generación subió a 30%, pero el cielo sigue oscuro porque la tormenta en la atmósfera continúa bloqueando el 70% de luz solar.'
                : 'Solar generation increased to 30%, but the atmospheric storm continues to block 70% of available sunlight.'}
            </span>
          ) : isPowerSaving ? (
            <span>
              ⚡ <b>{lang === 'es' ? 'Modo de ahorro activo' : 'Power saving active'}:</b>{' '}
              {lang === 'es'
                ? 'Cargas auxiliares apagadas. La batería se preserva mientras la tormenta se mantiene en su pico.'
                : 'Non-essential loads disabled to conserve battery bank.'}
            </span>
          ) : (
            <span>
              ⚠ <b>{lang === 'es' ? 'Problema visible' : 'Visible problem'}:</b>{' '}
              {lang === 'es'
                ? 'El polvo cubre las celdas (85%) Y la tormenta oscurece el cielo. Limpiar los paneles ayuda, pero el cielo continuará bloqueado.'
                : 'Dust blankets panels (85%) AND storm obscures sky. Cleaning removes surface dust, but sky stays dark.'}
            </span>
          )}
        </div>

        {/* BOTONES INTERACTIVOS DE PRUEBA EN LOCALHOST PARA EL USUARIO */}
        {onTestEnergy && (
          <div className="telemetry-test-bar">
            <span className="test-bar-label">{lang === 'es' ? 'PROBAR ENERGÍA (REGLA 1):' : 'TEST ENERGY (RULE 1):'}</span>
            <button
              className={`test-btn ${energy > 60 ? 'is-active' : ''}`}
              onClick={() => onTestEnergy(85)}
              title="Probar > 60: Luces normales encendidas, 5 rayitas"
            >
              85% ({lang === 'es' ? 'Normal / Luces ON' : 'Normal / Lights ON'})
            </button>
            <button
              className={`test-btn ${energy >= 30 && energy <= 60 ? 'is-active' : ''}`}
              onClick={() => onTestEnergy(45)}
              title="Probar 30-60: Luces titilan, 3 rayitas"
            >
              45% ({lang === 'es' ? 'Titilando / 3 rayitas' : 'Flickering / 3 bars'})
            </button>
            <button
              className={`test-btn ${energy < 30 ? 'is-active' : ''}`}
              onClick={() => onTestEnergy(20)}
              title="Probar < 30: Luces apagadas, parpadeo rojo, 1 rayita"
            >
              20% ({lang === 'es' ? 'Alerta roja / Apagadas' : 'Red alert / Lights OFF'})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// =========================================================================
// 6.3 PANEL INFERIOR: CONSOLA DE DECISIONES (S.T.A.R., BOTONES A, B, C Y AVANZAR)
// =========================================================================
function DecisionConsole({
  mission,
  meta,
  phase,
  report,
  decisionEffect,
  actionSequence,
  onPerformAction,
  onAdvance,
  lang,
}) {
  return (
    <footer className={`decision-console decision-console--${phase}`} aria-label="Consola de decisiones de la misión">
      {/* Cabecera de S.T.A.R. */}
      <div className="console-header">
        <StarBadge lang={lang} />
        <div className="console-speaker-text">
          <span className="speaker-role">
            {phase === 'report'
              ? (lang === 'es' ? 'INFORME DE CONSECUENCIAS · S.T.A.R.' : 'CONSEQUENCES REPORT · S.T.A.R.')
              : (lang === 'es' ? 'S.T.A.R. · SISTEMA DE APOYO A LA MISIÓN' : 'S.T.A.R. · MISSION DIRECTIVE')}
          </span>
          <b className="incident-title">
            {mission.title} ({mission.time})
          </b>
        </div>
      </div>

      {/* MODO JUGAR: Muestra el problema y los 3 botones de decisión (Opción A, B, C) */}
      {phase === 'play' ? (
        <div className="console-play-body">
          <p className="incident-alert-desc">{mission.alert}</p>

          <div className="options-grid">
            {mission.options.map((option) => (
              <div className="option-card" key={option.id}>
                <div className="option-card-top">
                  <span className="option-letter-badge">{lang === 'es' ? `OPCIÓN ${option.id}` : `OPTION ${option.id}`}</span>
                  <b className="option-title-text">{option.title}</b>
                </div>

                <div className="option-card-center">
                  <div className="option-thumb-box">
                    <img src={option.thumb} alt="" />
                  </div>
                  <div className="option-text-block">
                    <p className="option-action-detail">{option.detail}</p>
                    <div className="option-why-box">
                      <span className="why-tag">{lang === 'es' ? '¿Por qué tomarla?' : 'Why choose this?'}</span>
                      <small className="why-desc">{option.why}</small>
                    </div>
                  </div>
                </div>

                <div className="option-card-bottom">
                  <div className="option-effects-row">
                    <span className="eff-label">{lang === 'es' ? 'Efecto:' : 'Cost:'}</span>
                    {Object.entries(option.effects).map(([resKey, val]) => (
                      <span key={resKey} className={`eff-pill ${val >= 0 ? 'gain' : 'loss'}`}>
                        {meta[resKey]?.label}: {val > 0 ? '+' : ''}{val}
                      </span>
                    ))}
                  </div>

                  <button
                    className="option-choose-btn"
                    disabled={Boolean(actionSequence)}
                    onClick={() => {
                      soundClick();
                      onPerformAction(option);
                    }}
                    onMouseEnter={soundHover}
                  >
                    <span>{lang === 'es' ? `ELEGIR OPCIÓN ${option.id}` : `CHOOSE OPTION ${option.id}`}</span>
                    <b>➔</b>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="console-report-body">
          {/* MODO REPORTE: Consecuencias, aprendizaje y el botón explícito CONTINUAR */}
          {/* COMPARATIVA DE ESTADO VISUAL: ANTES Y DESPUÉS (REGLA SOLICITADA) */}
          <div className="report-before-after-card">
            <span className="before-after-tag">
              {lang === 'es' ? 'SISTEMA VISUAL AFECTADO · ANTES Y DESPUÉS' : 'VISUAL STATE COMPARISON · BEFORE & AFTER'}
            </span>
            <div className="before-after-grid">
              <div className="ba-col">
                <small>{lang === 'es' ? 'ESTADO ANTES:' : 'BEFORE STATE:'}</small>
                <b>{lang === 'es' ? 'Paneles cubiertos (85% polvo)' : 'Panels blanketed (85% dust)'}</b>
                <span>{lang === 'es' ? 'Generación 12% · Batería 80%' : '12% output · Battery 80%'}</span>
              </div>
              <div className="ba-arrow">➔</div>
              <div className="ba-col ba-col--after">
                <small>{lang === 'es' ? 'ESTADO DESPUÉS:' : 'AFTER STATE:'}</small>
                <b>
                  {report?.optionId === 'C'
                    ? (lang === 'es' ? 'Modo ahorro (Luces atenuadas)' : 'Power saving active')
                    : (lang === 'es' ? 'Paneles limpios (0% polvo)' : 'Panels cleaned (0% dust)')}
                </b>
                <span>
                  {report?.optionId === 'C'
                    ? (lang === 'es' ? 'Batería asegurada (+5) · Temp. reducida' : 'Battery protected (+5) · Aux heat off')
                    : (lang === 'es' ? 'Generación sube a 30% · Cielo aún con tormenta' : '30% output · Storm persists in sky')}
                </span>
              </div>
            </div>
          </div>

          <div className="report-narrative-card">
            <span className="narrative-tag">{lang === 'es' ? 'RESULTADO NARRATIVO:' : 'NARRATIVE OUTCOME:'}</span>
            <p className="narrative-content">"{report?.outcome}"</p>
          </div>

          <div className="report-lesson-card">
            <span className="lesson-tag">{lang === 'es' ? 'APRENDIZAJE CIENTÍFICO (NASA):' : 'SCIENTIFIC TAKEAWAY (NASA):'}</span>
            <p className="lesson-content">{report?.lesson}</p>
          </div>

          <div className="report-math-summary">
            <div className="math-side">
              <span className="math-header">{lang === 'es' ? '1. Efecto de tu decisión:' : '1. Decision Impact:'}</span>
              <div className="math-chips-list">
                {Object.entries(decisionEffect ?? {}).map(([resKey, val]) => (
                  <span key={resKey} className={`math-chip ${val >= 0 ? 'gain' : 'loss'}`}>
                    {meta[resKey]?.label}: {val > 0 ? '+' : ''}{val}
                  </span>
                ))}
              </div>
            </div>

            <div className="math-side">
              <span className="math-header">{lang === 'es' ? '2. Consumo base al avanzar (GDD 3.3):' : '2. Turn Attrition (GDD 3.3):'}</span>
              <div className="math-chips-list">
                <span className="math-chip loss">{meta.energy?.label}: -5</span>
                <span className="math-chip loss">{meta.life?.label}: -3</span>
                <span className="math-chip loss">{meta.supplies?.label}: -4</span>
              </div>
            </div>
          </div>

          {/* BOTÓN EXPLÍCITO CONTINUAR (Sección 6.3 del GDD) */}
          <div className="console-advance-bar">
            <span className="advance-notice">
              {lang === 'es'
                ? 'Al presionar continuar se aplicará el consumo base del hábitat y se actualizará el reloj.'
                : 'Advancing applies base habitat consumption and advances the 72-hour clock.'}
            </span>
            <button
              className="primary-button btn-advance-turn"
              onClick={() => {
                soundConfirm();
                onAdvance();
              }}
              onMouseEnter={soundHover}
            >
              <span>
                {mission.turn === missionsData[lang]?.length
                  ? (lang === 'es' ? 'EVALUAR FINAL DE LA MISIÓN' : 'EVALUATE FINAL OUTCOME')
                  : (lang === 'es' ? `CONTINUAR AL TURNO ${mission.turn + 1} (12/72h) · EXTRACTOR DE HIELO` : `CONTINUE TO TURN ${mission.turn + 1} (12/72h) · ICE EXTRACTOR`)}
              </span>
              <b>➔</b>
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}

// =========================================================================
// PANTALLA DE INTRODUCCIÓN (BRIEFING)
// =========================================================================
function IntroScreen({ onStart, lang, setLang }) {
  const [soundActive, setSoundActive] = useState(isSoundEnabled);
  const script = briefingScript[lang] ?? briefingScript.es;

  return (
    <main className="intro-screen">
      <div className="intro-backdrop" />
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-mark">O7</span>
          <span>ORBITA-7<small>BASE ALPHA-7 // ARCADIA PLANITIA</small></span>
        </a>
        <div className="topbar__controls">
          <button
            className="icon-pill-button"
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            title="Cambiar idioma"
          >
            🌐 {lang.toUpperCase()}
          </button>
          <button className="icon-pill-button" onClick={() => setSoundActive(toggleSound())} title="Sonido">
            {soundActive ? '🔊' : '🔇'}
          </button>
          <span className="topbar__tag">GDD FASE 1 REVISADA · 72 HORAS</span>
        </div>
      </header>

      <section className="intro-hero" id="top">
        <div className="intro-copy">
          <span className="eyebrow"><i /> {lang === 'es' ? 'MARTE, AÑO 2042 · BASE ALPHA-7' : 'MARS, YEAR 2042 · BASE ALPHA-7'}</span>
          <h1>72 {lang === 'es' ? 'Horas' : 'Hours'}<br /><em>{lang === 'es' ? 'para sobrevivir' : 'to Survive'}</em><br />{lang === 'es' ? 'en Marte' : 'on Mars'}.</h1>
          <p>
            {lang === 'es'
              ? 'Una tormenta de polvo regional a escala planetaria oscurece el cielo. Eres el Director o Directora de Operaciones de Alpha-7: analiza las emergencias en 6 turnos de 12 horas, gestiona los 4 indicadores y prepara una llegada segura para la nave de suministros.'
              : 'A planetary-scale dust storm darkens the sky. You are the Operations Director of Alpha-7: analyze emergencies across 6 twelve-hour turns, balance 4 vital indicators, and guide the resupply ship to touchdown.'}
          </p>

          <div className="intro-meta">
            <span><b>06</b> {lang === 'es' ? 'TURNOS' : 'TURNS'}</span>
            <span><b>04</b> {lang === 'es' ? 'INDICADORES' : 'INDICATORS'}</span>
            <span><b>72</b> {lang === 'es' ? 'HORAS' : 'HOURS'}</span>
          </div>

          <button
            className="primary-button"
            onClick={() => {
              soundConfirm();
              onStart();
            }}
            onMouseEnter={soundHover}
          >
            {script.startButton} <span>↗</span>
          </button>
        </div>

        <div className="intro-art intro-art--menu">
          <img src="/assets/orbita7_menu_inicio.png" alt="Menú inicial de ORBITA-7" />
          <div className="menu-hotspots">
            <button
              className="menu-hotspot menu-hotspot--start"
              onClick={() => {
                soundConfirm();
                onStart();
              }}
              onMouseEnter={soundHover}
            >
              <span>{script.startButton}</span>
            </button>
          </div>
          <div className="art-scan" />
        </div>
      </section>

      <section className="intro-lower">
        <div className="intro-lower__title">
          <span className="eyebrow">{lang === 'es' ? 'BRIEFING DE S.T.A.R.' : 'S.T.A.R. BRIEFING'}</span>
          <h2>{lang === 'es' ? 'Pantalla de Briefing (GDD Sección 2)' : 'Briefing Script (GDD Section 2)'}</h2>
        </div>
        <div className="brief-card">
          <StarBadge lang={lang} />
          <div>
            <b>{script.welcome}</b>
            <p>{script.lines[0]}</p>
            <p style={{ marginTop: '4px' }}>{script.lines[2]}</p>
            <small>{lang === 'es' ? 'S.T.A.R. · Sistema de apoyo a la misión' : 'S.T.A.R. · Mission Support System'}</small>
          </div>
        </div>
        <div className="intro-data">
          <span className="data-icon">⌁</span>
          <b>{lang === 'es' ? 'Ciencia real de la NASA' : 'Real NASA Science'}</b>
          <p>
            {lang === 'es'
              ? 'El polvo suspendido reduce la luz que llega a los paneles solares. Las tormentas globales han obligado a misiones de la NASA a conservar batería durante tormentas marcianas.'
              : 'Suspended airborne dust can reduce sunlight reaching solar panels; NASA missions have had to conserve battery power during Martian storms.'}
          </p>
        </div>
      </section>
    </main>
  );
}

// =========================================================================
// PANTALLA DE RESULTADOS / FINALES (SECCIÓN 5 GDD)
// =========================================================================
function ResultScreen({ game, onRestart, lang }) {
  const ending = (endingsData[lang] ?? endingsData.es)[game.result] ?? (endingsData[lang] ?? endingsData.es).finalA;
  const meta = resourceMeta[lang] ?? resourceMeta.es;

  return (
    <main className="result-screen">
      <div className="result-orbit" />
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-mark">O7</span>
          <span>ORBITA-7<small>BASE ALPHA-7 // ARCADIA PLANITIA</small></span>
        </a>
        <span className="topbar__tag">{lang === 'es' ? 'INFORME FINAL · 72 HORAS' : 'FINAL REPORT · 72 HOURS'}</span>
      </header>

      <section className="result-panel">
        <div className="result-mark">{game.result === 'finalA' ? '✓' : '!'}</div>
        <span className="eyebrow">{ending.tag}</span>
        <h1>{ending.title}</h1>
        <p>{ending.text}</p>

        <div className="result-stats">
          {Object.entries(game.resources).map(([key, value]) => (
            <div key={key}>
              <span>{meta[key]?.label ?? key}</span>
              <b>{value}<small>/100</small></b>
            </div>
          ))}
        </div>

        <div className="history">
          <span className="eyebrow">{lang === 'es' ? 'BANDERAS DE MISIÓN REGISTRADAS' : 'MISSION FLAGS LOG'}</span>
          <div className="flags-list">
            <div><span>var_comunicaciones</span>: <b>{game.flags.var_comunicaciones}</b></div>
            <div><span>var_zona_aterrizaje</span>: <b>{game.flags.var_zona_aterrizaje}</b></div>
            <div><span>var_reparacion_base</span>: <b>{game.flags.var_reparacion_base}</b></div>
          </div>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            soundConfirm();
            onRestart();
          }}
          onMouseEnter={soundHover}
        >
          {lang === 'es' ? 'REINICIAR SIMULACIÓN' : 'RESTART SIMULATION'} <span>↻</span>
        </button>
      </section>
    </main>
  );
}

// =========================================================================
// COMPONENTE PRINCIPAL (ORBITA-7)
// =========================================================================
export default function App() {
  const [lang, setLang] = useState('es'); // Idioma por defecto en español
  const [game, setGame] = useState(freshGame);
  const [actionSequence, setActionSequence] = useState(null);
  const actionTimers = useRef([]);

  const missions = missionsData[lang] ?? missionsData.es;
  const currentMeta = resourceMeta[lang] ?? resourceMeta.es;
  const mission = missions[game.turn] ?? missions[0];

  useEffect(() => () => actionTimers.current.forEach(window.clearTimeout), []);

  if (game.phase === 'intro') {
    return <IntroScreen onStart={() => setGame(startGame())} lang={lang} setLang={setLang} />;
  }

  if (game.phase === 'result') {
    return <ResultScreen game={game} onRestart={() => setGame(freshGame())} lang={lang} />;
  }

  function handlePerformAction(option) {
    if (actionSequence) return;
    soundAction(option.id === 'A' ? 'rover' : option.id === 'B' ? 'eva' : 'power');

    setActionSequence({
      missionId: mission.id,
      optionId: option.id,
    });

    const duration = option.id === 'A' ? 3200 : option.id === 'B' ? 3000 : 2000;

    actionTimers.current.push(
      window.setTimeout(() => {
        soundConfirm();
        setGame((current) => chooseOption(current, mission, option));
        setActionSequence(null);
      }, duration)
    );
  }

  function handleAdvance() {
    setGame((current) => continueAfterReport(current, missions.length));
  }

  function handleTestEnergy(val) {
    soundClick();
    setGame((current) => ({
      ...current,
      resources: {
        ...current.resources,
        energy: val,
      },
    }));
  }

  const isCleaned = game.flags.var_paneles_limpios === 1 || actionSequence?.optionId === 'A' || actionSequence?.optionId === 'B';
  const isPowerSaving = game.flags.var_modo_ahorro === 1 || actionSequence?.optionId === 'C';

  return (
    <div className="game-screen-wrapper">
      {/* 6.1 Barra superior (HUD) */}
      <HUDTopBar
        game={game}
        missions={missions}
        meta={currentMeta}
        lang={lang}
        setLang={setLang}
        onRestart={() => setGame(freshGame())}
      />

      {/* 6.2 Centro: vista de la Base Alpha-7 (Reactivo al estado visual) */}
      <BaseAlpha7Viewport
        energy={game.resources.energy}
        isCleaned={isCleaned}
        isPowerSaving={isPowerSaving}
        actionOptionId={actionSequence?.optionId}
        lang={lang}
        mission={mission}
        onTestEnergy={handleTestEnergy}
      />

      {/* 6.3 Panel inferior: consola de decisiones */}
      <DecisionConsole
        mission={mission}
        meta={currentMeta}
        phase={game.phase}
        report={game.report}
        decisionEffect={game.decisionEffect}
        actionSequence={actionSequence}
        onPerformAction={handlePerformAction}
        onAdvance={handleAdvance}
        lang={lang}
      />
    </div>
  );
}
