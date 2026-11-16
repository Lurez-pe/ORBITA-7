import React, { useEffect, useRef, useState } from 'react';
import { playCutsceneSound, soundClick } from '../game/audio.js';

// =========================================================================
// CUTSCENE PLAYER: SISTEMA REUTILIZABLE DE SECUENCIAS DE PLANOS
// - 4 a 6 planos por secuencia (1.5s a 2.5s cada uno, 8-12s total)
// - Plano de CAUSA (3 a 4 segundos antes de decidir)
// - Botón SALTAR siempre visible
// - Tipos de plano: General, Medio, Detalle
// - Efectos de cámara: Paneo, Zoom, Temblor
// - Sonidos Web Audio en cada plano
// - Animaciones por cuadros (steps) y estilo pixel art
// - Textos 100% traducidos mediante prop `t`
// =========================================================================

export function CutscenePlayer({ sequence, onComplete, isReplay = false, t }) {
  const shots = sequence.shots ?? [sequence];
  const [shotIndex, setShotIndex] = useState(0);
  const timerRef = useRef(null);

  const currentShot = shots[shotIndex] ?? shots[0];
  const totalShots = shots.length;

  const cutscenesLocale = t?.cutscenes;
  const macroUi = cutscenesLocale?.macroUi;

  // Manejador del avance automático de planos
  useEffect(() => {
    // Reproducir sonido asignado al plano actual
    if (currentShot.sound) {
      playCutsceneSound(currentShot.sound);
    }

    const duration = currentShot.duration ?? 2200;
    timerRef.current = window.setTimeout(() => {
      if (shotIndex + 1 < totalShots) {
        setShotIndex((idx) => idx + 1);
      } else {
        onComplete();
      }
    }, duration);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [shotIndex, currentShot, totalShots, onComplete]);

  // Botón SALTAR
  const handleSkip = () => {
    soundClick();
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    onComplete();
  };

  // Texto del subtítulo del plano traducido
  const captionText =
    cutscenesLocale?.captions?.[currentShot.id] ?? currentShot.text ?? '';

  const shotTypeLabel =
    cutscenesLocale?.shotTypes?.[currentShot.shotType] ??
    currentShot.shotType.toUpperCase();

  const tooltipText = cutscenesLocale?.timelineTooltip
    ? cutscenesLocale.timelineTooltip(shotIndex + 1, totalShots)
    : `Shot ${shotIndex + 1}/${totalShots}`;

  return (
    <div
      className={`pixel-cutscene-viewport ${currentShot.camera ?? 'cam-none'} shot-type--${currentShot.shotType}`}
      aria-label={tooltipText}
    >
      {/* Fondo de escena del plano actual */}
      <img
        src={currentShot.sceneBg ?? '/assets/ORB_ESC_base_exterior_v01.jpg'}
        className="cutscene-bg-img"
        alt=""
      />

      {/* Capa de atmósfera de tormenta marciana */}
      {(currentShot.dustStorm || currentShot.skyDarkness > 70) && (
        <div
          className="cutscene-dust-storm-layer"
          style={{ opacity: (currentShot.skyDarkness ?? 80) / 100 }}
        >
          <div className="dust-particle-stream stream-1" />
          <div className="dust-particle-stream stream-2" />
        </div>
      )}

      {/* Sol atenuado en cielo de tormenta */}
      {currentShot.sunDimmed && <div className="cutscene-sun-dimmed" />}

      {/* ===================================================================
          CONTENIDO SEGÚN TIPO DE PLANO (GENERAL / MEDIO / DETALLE)
          =================================================================== */}

      {/* 1. PLANO DETALLE: MACRO DE HERRAMIENTA, PANEL O MEDIDOR */}
      {currentShot.shotType === 'detail' && (
        <div className="cutscene-detail-frame">
          {/* Misión 1 Opción A: Brazo robótico y cepillo rotatorio */}
          {currentShot.detailView === 'rover_brush_arm' && (
            <div className="detail-rover-brush-box">
              <div className="macro-rover-arm">
                <img
                  src="/assets/ORB_OBJ_rover_lateral_v01.png"
                  alt=""
                  className="macro-rover-sprite"
                />
                <div className="macro-brush-spinner rotating-steps-3">
                  <div className="brush-bristles" />
                </div>
              </div>
              <div className="macro-dust-particles" />
            </div>
          )}

          {/* Misión 1 Opción B: Traje y barra de oxígeno bajando */}
          {currentShot.detailView === 'suit_o2_meter' && (
            <div className="detail-suit-o2-box">
              <div className="macro-helmet-view">
                <img
                  src="/assets/ORB_PERS_tripulante_lider.webp"
                  alt=""
                  className="macro-helmet-sprite"
                />
              </div>
              <div className="macro-o2-gauge">
                <div className="gauge-header">
                  <span>{macroUi?.suitO2 ?? 'EVA SUIT O₂'}</span>
                  <b className="gauge-o2-val">72%</b>
                </div>
                <div className="gauge-o2-bar-track">
                  <div className="gauge-o2-fill draining-steps" />
                </div>
                <span className="gauge-warning-tag">
                  {macroUi?.criticalDrain ?? 'CRITICAL DRAIN'}
                </span>
              </div>
            </div>
          )}

          {/* Misión 1 Opción C: Interruptores de ahorro bajando */}
          {currentShot.detailView === 'breaker_switches' && (
            <div className="detail-switches-box">
              <div className="breaker-row">
                <div className="breaker-switch switch-down-1">
                  <span className="switch-label">{macroUi?.mod2 ?? 'MOD-2'}</span>
                  <div className="lever-handle" />
                </div>
                <div className="breaker-switch switch-down-2">
                  <span className="switch-label">{macroUi?.lights ?? 'LIGHTS'}</span>
                  <div className="lever-handle" />
                </div>
                <div className="breaker-switch switch-down-3">
                  <span className="switch-label">{macroUi?.aux ?? 'AUX'}</span>
                  <div className="lever-handle" />
                </div>
              </div>
              <span className="breaker-status-alert">
                {macroUi?.powerSavingActive ?? 'POWER SAVING ENGAGED'}
              </span>
            </div>
          )}

          {/* Misión 2: Tubería congelada / descongelando */}
          {currentShot.detailView === 'thawing_pipe' && (
            <div className="detail-pipe-thaw-box">
              <img
                src="/assets/ORB_OBJ_extractor_hielo_v01.png"
                alt=""
                className="macro-extractor-sprite"
              />
              <div className="steam-jets-anim" />
            </div>
          )}

          {/* Misión 4: Soldadura de fuga de oxígeno */}
          {currentShot.detailView === 'welded_patch' && (
            <div className="detail-weld-patch-box">
              <img
                src="/assets/ORB_OBJ_modulo_oxigeno_v01.png"
                alt=""
                className="macro-o2module-sprite"
              />
              <div className="welding-sparks-anim" />
            </div>
          )}

          {/* Misión 6: Baliza de pista estroboscópica */}
          {currentShot.detailView === 'beacon_strobe' && (
            <div className="detail-beacon-strobe-box">
              <img
                src="/assets/ORB_OBJ_baliza_v01.png"
                alt=""
                className="macro-beacon-sprite"
              />
              <div className="xenon-strobe-flash" />
            </div>
          )}
        </div>
      )}

      {/* 2. PLANO MEDIO: PERSONAJE / VEHÍCULO Y OBJETIVO */}
      {currentShot.shotType === 'medium' && (
        <div className="cutscene-medium-stage">
          {/* Rover cruzando terreno marciano o barriendo paneles */}
          {currentShot.rover && (
            <div
              className={`cutscene-rover-actor actor-${currentShot.rover.state ?? 'driving'}`}
            >
              <img
                src="/assets/ORB_OBJ_rover_lateral_v01.png"
                alt=""
                className="rover-actor-img"
              />
              {currentShot.rover.state === 'sweeping_panels' && (
                <div className="rover-active-brush-head rotating-steps-3" />
              )}
            </div>
          )}

          {/* Astronautas caminando contra el viento o limpiando a mano */}
          {currentShot.crew && (
            <div
              className={`cutscene-crew-actors actor-${currentShot.crew.state ?? 'walking'}`}
            >
              <img
                src="/assets/ORB_PERS_tripulante_lider.webp"
                alt=""
                className="crew-lead-sprite"
              />
              <img
                src="/assets/ORB_PERS_tripulante_naranja.webp"
                alt=""
                className="crew-second-sprite"
              />
              {currentShot.crew.tools && (
                <img
                  src="/assets/ORB_OBJ_kit_reparacion_v01.png"
                  alt=""
                  className="crew-tool-sprite"
                />
              )}
            </div>
          )}

          {/* Matriz de paneles en plano medio */}
          <div className="medium-panels-target">
            <img
              src="/assets/ORB_OBJ_panel_solar_v01.png"
              alt=""
              className="medium-panel-img"
            />
            {currentShot.panelsCovered && (
              <div
                className={`medium-dust-layer ${currentShot.panelsCovered === 'clearing_chunks' ? 'clearing-steps' : ''}`}
              />
            )}
          </div>
        </div>
      )}

      {/* 3. PLANO GENERAL: TODA LA BASE Y SU ENTORNO */}
      {currentShot.shotType === 'general' && (
        <div className="cutscene-general-stage">
          {/* Luces del hábitat en apagado o parpadeo */}
          <div
            className={`general-base-lights ${currentShot.lightsShutoffSequence ? 'shutoff-seq' : ''}`}
          >
            <span className="light-sq sq-1" />
            <span className="light-sq sq-2" />
            <span className="light-sq sq-3" />
          </div>

          {/* Compuerta de garaje / esclusa */}
          {currentShot.garageDoor && (
            <div className={`general-garage-gate gate-${currentShot.garageDoor}`}>
              <div className="gate-door-panel" />
            </div>
          )}

          {currentShot.airlockDoor && (
            <div className={`general-airlock-hatch hatch-${currentShot.airlockDoor}`}>
              <div className="hatch-door-sliding" />
            </div>
          )}

          {/* Paneles solares en plano general */}
          <div className="general-solar-farm">
            <img
              src="/assets/ORB_OBJ_panel_solar_v01.png"
              alt=""
              className="general-panel-sprite"
            />
            {currentShot.panelsCovered && <div className="general-dust-sheet" />}
            {currentShot.panelsGlint && (
              <div className="general-panels-glint glint-anim" />
            )}
          </div>

          {/* Rover en plano general (saliendo del garaje o idle) */}
          {currentShot.rover && (
            <div className={`general-rover-pos rover-${currentShot.rover.state}`}>
              <img
                src="/assets/ORB_OBJ_rover_lateral_v01.png"
                alt=""
                className="general-rover-img"
              />
            </div>
          )}

          {/* Astronautas en plano general (saliendo o entrando a la esclusa) */}
          {currentShot.crew && (
            <div className={`general-crew-pos crew-${currentShot.crew.state}`}>
              <img
                src="/assets/ORB_PERS_tripulante_lider.webp"
                alt=""
                className="general-crew-img"
              />
              <img
                src="/assets/ORB_PERS_tripulante_naranja.webp"
                alt=""
                className="general-crew-img"
              />
            </div>
          )}

          {/* Alerta de energía cayendo en CAUSA */}
          {currentShot.energyDrop && (
            <div className="general-energy-drop-hud">
              <span className="hud-alert-tag">
                {macroUi?.energyDropping ?? '⚡ ENERGY DROPPING'}
              </span>
              <div className="energy-drain-mini-meter">
                <div className="meter-bar-draining" />
              </div>
            </div>
          )}

          {/* Nave en aproximación órbita (Misión 6) */}
          {currentShot.skyShipOrbit && (
            <div className="general-orbit-ship-actor">
              <img
                src="/assets/ORB_OBJ_nave_suministros_v01.png"
                alt=""
                className="orbit-ship-sprite"
              />
            </div>
          )}

          {/* Haz luminoso de baliza hacia el cielo (Misión 6) */}
          {currentShot.beaconTurnOn && (
            <div className="general-beacon-actor">
              <img
                src="/assets/ORB_OBJ_baliza_v01.png"
                alt=""
                className="beacon-obj-sprite"
              />
              <div className="vertical-sky-beam-anim" />
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          OVERLAYS DE CINEMÁTICA: SALTAR, TEXTO (MÁX 5 PALABRAS), PASOS
          =================================================================== */}

      {/* 1. Botón SALTAR SIEMPRE VISIBLE en la esquina superior derecha */}
      <div className="cutscene-top-controls">
        {isReplay && (
          <span className="cutscene-replay-badge">
            {cutscenesLocale?.replay ?? 'REPLAY'}
          </span>
        )}
        <button
          className="cutscene-skip-btn"
          onClick={handleSkip}
          title={cutscenesLocale?.skipTitle ?? 'Skip'}
        >
          <span>{cutscenesLocale?.skip ?? 'SKIP'}</span>
          <b>⏩</b>
        </button>
      </div>

      {/* 2. Barra de texto con subtítulo de máximo 5 palabras */}
      {captionText && (
        <div className="cutscene-caption-bar">
          <div className="caption-pixel-box">
            <span className="caption-type-badge">{shotTypeLabel}</span>
            <b className="caption-text-content">{captionText}</b>
          </div>
        </div>
      )}

      {/* 3. Indicador de progreso de planos (puntos de paso) */}
      <div className="cutscene-timeline-dots" title={tooltipText}>
        {shots.map((_, idx) => (
          <span
            key={idx}
            className={`timeline-dot ${idx < shotIndex ? 'is-past' : idx === shotIndex ? 'is-current' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
