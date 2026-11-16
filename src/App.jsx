import React, { useEffect, useRef, useState } from 'react';
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
  markUserInteracted,
  soundAction,
  soundAlert,
  soundClick,
  soundConfirm,
  soundHover,
  toggleSound,
} from './game/audio.js';
import { cutscenesData } from './data/cutscenes.js';
import { CutscenePlayer } from './components/CutscenePlayer.jsx';
import { ActionPictogram } from './components/ActionPictogram.jsx';
import { ResultScreen } from './components/ResultScreen.jsx';
import { LanguageSelector } from './components/LanguageSelector.jsx';
import { CinematicIntro } from './components/CinematicIntro.jsx';
import { getLocale, getSavedLanguage, saveLanguage } from './data/i18n.js';

// =========================================================================
// 1. BARRA SUPERIOR (HUD) REDISEÑADA: 4 BLOQUES GRANDES (MÍNIMO 64PX)
// =========================================================================
function HUDTopBar({ game, missions, meta, lang, setLang, onRestart, deltas, t }) {
  const [soundActive, setSoundActive] = useState(isSoundEnabled);
  const mission = missions[game.turn] ?? missions[0];

  const handleToggleSound = () => {
    setSoundActive(toggleSound());
  };

  return (
    <header className="pixel-hud-topbar" aria-label="HUD Principal">
      {/* Meta de la misión y reloj 12/72 */}
      <div className="hud-meta-group">
        <div className="hud-brand-pixel">
          <span className="brand-badge">{t.hud.brandBadge}</span>
          <b className="brand-text">{t.hud.brandName}</b>
        </div>
        <div className="hud-clock-box">
          <div className="clock-main-line">
            <span>{mission.time}</span>
            <span>T{game.turn + 1}/6</span>
          </div>
          {/* 6 Puntos de Turno Visibles */}
          <div className="clock-turn-dots" title={t.hud.turnTitle(game.turn + 1)}>
            {Array.from({ length: 6 }, (_, i) => (
              <span
                key={i}
                className={`turn-dot ${i < game.turn ? 'is-done' : i === game.turn ? 'is-active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 4 BLOQUES GRANDES DE INDICADORES (MÍNIMO 64PX DE ALTO) */}
      <div className="hud-indicators-grid">
        {Object.entries(game.resources).map(([key, value]) => {
          const itemMeta = meta[key];
          const delta = deltas[key];
          const stateColor = value > 60 ? 'green' : value >= 30 ? 'yellow' : 'red';
          const isCritical = value < 30;

          // 10 segmentos gruesos de barra
          const totalSegments = 10;
          const activeSegments = Math.round((value / 100) * totalSegments);

          return (
            <div
              key={key}
              className={`hud-block ${isCritical ? 'is-blinking-critical' : ''} ${delta ? 'has-flash' : ''}`}
            >
              {/* Número flotante (-8, +12) cuando el valor cambia */}
              {delta && (
                <span
                  key={delta.id}
                  className={`floating-delta-tag ${delta.diff > 0 ? 'gain' : 'loss'}`}
                >
                  {delta.diff > 0 ? `+${delta.diff}` : delta.diff}
                </span>
              )}

              <div className="block-header-row">
                <div className="block-title-group">
                  <span className="block-icon-sprite">
                    <img src={itemMeta?.image} alt="" />
                  </span>
                  <span className="block-name">{t.resources[key]?.label ?? itemMeta?.label}</span>
                </div>
                <b className="block-num">{value}</b>
              </div>

              {/* Barra gruesa segmentada con colores Verde / Amarillo / Rojo */}
              <div className={`block-bar-thick state--${stateColor}`}>
                {Array.from({ length: totalSegments }, (_, i) => (
                  <span
                    key={i}
                    className={`thick-seg ${i < activeSegments ? 'is-filled' : ''}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controles de juego con selector de idioma pixel art (EN | ES) */}
      <div className="hud-buttons-col">
        <LanguageSelector currentLang={lang} onChangeLang={setLang} />
        <button className="pixel-btn-sm" onClick={handleToggleSound} title={t.hud.soundTitle}>
          {soundActive ? t.hud.soundOn : t.hud.soundOff}
        </button>
        <button
          className="pixel-btn-sm btn--danger"
          onClick={() => {
            soundClick();
            onRestart();
          }}
          title={t.hud.restartTitle}
        >
          {t.hud.restart}
        </button>
      </div>
    </header>
  );
}

// =========================================================================
// 2. ESCENARIO VISUAL PIXEL ART ESTÁTICO DE BASE ALPHA-7
// =========================================================================
function BaseAlpha7Viewport({ energy = 80, isCleaned, mission, onReplayCause, t }) {
  const lightsState = energy > 60 ? 'on' : energy >= 30 ? 'flicker' : 'blackout';
  const skyLight = 30;
  const dustVal = isCleaned ? 0 : 85;
  const powerOutput = isCleaned ? 30 : 12;

  return (
    <section className="pixel-stage-wrapper" aria-label={t.hud.baseLocation}>
      <img
        src={mission.sceneBg ?? '/assets/ORB_ESC_base_exterior_v01.jpg'}
        className="pixel-stage-bg"
        alt=""
      />

      <div className="pixel-storm-sky-overlay" />
      <div className="pixel-sun-marker" title={t.stage.sunTitle} />

      {/* Telemetría retro en pantalla */}
      <div className="pixel-stage-hud-bar">
        <span className="stage-hud-stat">
          {t.stage.skyLight(skyLight)}
        </span>
        <span className={`stage-hud-stat ${isCleaned ? 'stat-clean' : 'stat-dirty'}`}>
          {t.stage.dustStatus(dustVal)}
        </span>
        <span className={`stage-hud-stat ${isCleaned ? 'stat-clean' : 'stat-dirty'}`}>
          {t.stage.solarOutput(powerOutput)}
        </span>
        {onReplayCause && (
          <button
            className="pixel-btn-sm"
            style={{ marginLeft: 'auto', padding: '2px 6px', fontSize: '7px' }}
            onClick={onReplayCause}
            title={t.stage.viewCauseTitle}
          >
            {t.stage.viewCause}
          </button>
        )}
      </div>

      {/* Luces del hábitat */}
      <div className={`pixel-base-lights-block state--${lightsState}`}>
        <span className="pixel-light-square" />
        <span className="pixel-light-square" />
        <span className="pixel-light-square" />
      </div>
      {energy < 30 && <div className="pixel-dome-red-beacon" title={t.stage.domeBeaconTitle} />}

      {/* Matriz de paneles solares */}
      <div className="pixel-panels-unit">
        <div className="pixel-panel-frame">
          <img
            src="/assets/ORB_OBJ_panel_solar_v01.png"
            className="pixel-panel-img"
            alt=""
          />
          <div className={`pixel-dust-blanket ${isCleaned ? 'is-cleared' : ''}`} />
          {!isCleaned && (
            <div className="pixel-panel-alert">
              <img
                src="/assets/orbita7_alerta_tormenta_de_polvo_v3.png"
                alt=""
                title={t.stage.panelAlertTitle}
              />
            </div>
          )}
        </div>
        <span className="pixel-unit-tag">{t.stage.unitPanels}</span>
      </div>

      {/* Rover autónomo */}
      <div className="pixel-rover-unit">
        <img
          src="/assets/ORB_OBJ_rover_lateral_v01.png"
          className="pixel-rover-img"
          alt=""
        />
        <span className="pixel-unit-tag">{t.stage.unitRover}</span>
      </div>

      {/* Astronautas con traje y casco */}
      <div className="pixel-astronauts-unit">
        <div className="astronaut-sprites-row">
          <img
            src="/assets/ORB_PERS_tripulante_lider.webp"
            alt=""
            title={t.stage.crewCommanderTitle}
          />
          <img
            src="/assets/ORB_PERS_tripulante_naranja.webp"
            alt=""
            title={t.stage.crewSpecialistTitle}
          />
        </div>
        <span className="pixel-unit-tag">{t.stage.unitCrew}</span>
      </div>
    </section>
  );
}

// =========================================================================
// 3. CONSOLA DE DECISIONES CON PICTOGRAMAS GRANDES Y TEXTO MÍNIMO ESTRICTO
// =========================================================================
function DecisionConsole({
  mission,
  meta,
  phase,
  report,
  decisionEffect,
  selectedOptionId,
  isCutscenePlaying,
  onSelectOption,
  onReplayCutscene,
  onAdvance,
  t,
}) {
  // Lección resuelta dinámicamente para que al alternar idioma se actualice al instante
  const currentLesson =
    mission.options?.find((o) => o.id === report?.optionId)?.lesson ||
    report?.lesson;

  return (
    <footer className="pixel-decision-console" aria-label="Consola de decisiones">
      {/* Cabecera S.T.A.R. con directiva corta (máx 12 palabras) */}
      <div className="pixel-console-header">
        <span className="console-star-tag">{t.console.starHeader(mission.id)}</span>
        <b className="console-directive-text">{mission.alert}</b>
      </div>

      {/* MODO JUGAR: 3 TARJETAS CON PICTOGRAMA GRANDE Y TEXTO MÍNIMO ESTRICTO */}
      {phase === 'play' ? (
        <div className="pixel-options-grid">
          {mission.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            return (
              <div
                key={option.id}
                className={`pixel-option-card ${isSelected ? 'is-selected' : ''}`}
                onClick={() => {
                  if (isCutscenePlaying || selectedOptionId) return;
                  soundClick();
                  onSelectOption(option);
                }}
                onMouseEnter={soundHover}
                role="button"
                tabIndex={0}
                title={`${option.id}: ${option.title}`}
              >
                {/* 1. Letra + Nombre de máximo 3 palabras */}
                <div className="card-top-row">
                  <span className="card-letter-box">{option.id}</span>
                  <b className="card-title-text">{option.title}</b>
                </div>

                {/* 2. Pictograma pixel art grande animado en hover */}
                <div className="card-pictogram-box">
                  <ActionPictogram missionId={mission.id} optionId={option.id} t={t} />
                </div>

                {/* 3. Efectos: Icono + Número únicamente */}
                <div className="card-effects-row">
                  {Object.entries(option.effects).map(([resKey, val]) => (
                    <span
                      key={resKey}
                      className={`effect-chip-pixel ${val >= 0 ? 'gain' : 'loss'}`}
                    >
                      {meta[resKey]?.icon} {val > 0 ? `+${val}` : val}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* MODO REPORTE: SOLO CAMBIOS NUMÉRICOS + LECCIÓN (MÁX 15 PALABRAS) */
        <div className="pixel-report-console">
          {/* Resumen numérico */}
          <div className="report-numbers-strip">
            <div className="num-col">
              <span className="num-col-title">{t.console.decisionLabel}</span>
              <div className="num-pills-row">
                {Object.entries(decisionEffect ?? {}).map(([resKey, val]) => (
                  <span key={resKey} className={`effect-chip-pixel ${val >= 0 ? 'gain' : 'loss'}`}>
                    {meta[resKey]?.icon} {val > 0 ? `+${val}` : val}
                  </span>
                ))}
              </div>
            </div>

            <div className="num-col">
              <span className="num-col-title">{t.console.baseConsumptionLabel}</span>
              <div className="num-pills-row">
                <span className="effect-chip-pixel loss">⚡ -5</span>
                <span className="effect-chip-pixel loss">🫁 -3</span>
                <span className="effect-chip-pixel loss">💧 -4</span>
              </div>
            </div>
          </div>

          {/* Lección única (máximo 15 palabras) */}
          <div className="report-lesson-pixel-box">
            <span className="lesson-header">{t.console.lessonHeader}</span>
            <p className="lesson-single-phrase">{currentLesson}</p>
          </div>

          {/* Controles: Ver de nuevo + Continuar */}
          <div className="pixel-advance-row">
            <button
              className="btn-pixel-replay"
              onClick={() => {
                soundClick();
                onReplayCutscene();
              }}
              onMouseEnter={soundHover}
              title={t.console.viewAgainTitle}
            >
              <span>{t.console.viewAgain}</span>
            </button>

            <button
              className="btn-pixel-advance"
              onClick={() => {
                soundConfirm();
                onAdvance();
              }}
              onMouseEnter={soundHover}
            >
              <span>{t.console.continueTurn(mission.turn + 1)}</span>
              <b>➔</b>
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}

// =========================================================================
// PANTALLA DE INICIO (ORBITA-7 - DISEÑO LIMPIO DE 3 BOTONES)
// 1. Título "ORBITA-7" grande y subtítulo ("72 hours to survive on Mars")
// 2. Fondo decorativo: base marciana pixel art con polvo y balizas (no clicable)
// 3. Botón PLAY: grande, centrado, pulso suave (inicia intro y misión)
// 4. Sub-fila con 2 botones de igual tamaño: IDIOMA (EN | ES) y SONIDO (🔊 / 🔇)
// 5. Sin ningún otro botón o icono
// =========================================================================
function IntroScreen({ onStart, lang, setLang, t }) {
  const [soundActive, setSoundActive] = useState(isSoundEnabled);

  const handlePlayClick = () => {
    markUserInteracted();
    soundConfirm();
    onStart();
  };

  const handleToggleLang = () => {
    markUserInteracted();
    soundClick();
    const nextLang = lang === 'en' ? 'es' : 'en';
    setLang(nextLang);
  };

  const handleToggleSound = () => {
    markUserInteracted();
    const nextSound = toggleSound();
    setSoundActive(nextSound);
  };

  const strings = t.startScreen ?? {
    title: 'ORBITA-7',
    tagline: lang === 'es' ? '72 horas para sobrevivir en Marte' : '72 hours to survive on Mars',
    play: lang === 'es' ? 'JUGAR' : 'PLAY',
    playTitle: lang === 'es' ? 'Iniciar introducción y misión' : 'Start introduction and mission',
    langAria: lang === 'es' ? 'Cambiar idioma: Español o Inglés' : 'Switch language: English or Spanish',
    soundOn: lang === 'es' ? 'SONIDO' : 'SOUND',
    soundOff: lang === 'es' ? 'SILENCIO' : 'MUTED',
    soundTitle: lang === 'es' ? 'Activar o silenciar sonido' : 'Toggle sound',
  };

  return (
    <main className="start-screen" role="main">
      {/* 1. FONDO DECORATIVO: BASE MARCIANA PIXEL ART CON POLVO Y BALIZAS (NO CLICABLE) */}
      <div className="start-screen__backdrop" aria-hidden="true">
        <img
          src="/assets/ORB_ESC_base_exterior_v01.jpg"
          alt=""
          className="start-screen__bg-image"
        />
        {/* Polvo marciano en movimiento */}
        <div className="start-screen__dust" />
        {/* Balizas y luces de la base parpadeando en pixel art */}
        <div className="start-screen__beacon beacon--1" />
        <div className="start-screen__beacon beacon--2" />
        <div className="start-screen__beacon beacon--3" />
        {/* Scanlines CRT retro */}
        <div className="start-screen__scanlines" />
        {/* Viñeta para máximo contraste de textos y controles */}
        <div className="start-screen__vignette" />
      </div>

      {/* 2. CONTENIDO PRINCIPAL: TÍTULO, SUBTÍTULO Y LOS 3 ÚNICOS BOTONES */}
      <div className="start-screen__content">
        <header className="start-screen__header">
          <h1 className="start-screen__title">{strings.title}</h1>
          <p className="start-screen__tagline">{strings.tagline}</p>
        </header>

        <div className="start-screen__controls">
          {/* BOTÓN 1: PLAY (GRANDE, CENTRADO, PULSO SUAVE) */}
          <button
            type="button"
            className="start-btn-play is-pulsing"
            onClick={handlePlayClick}
            onMouseEnter={soundHover}
            title={strings.playTitle}
            aria-label={strings.playTitle}
          >
            <span className="play-icon" aria-hidden="true">▶</span>
            <span className="play-text">{strings.play}</span>
          </button>

          {/* FILA CON LOS DOS BOTONES PEQUEÑOS DEL MISMO TAMAÑO */}
          <div className="start-screen__sub-row">
            {/* BOTÓN 2: IDIOMA (EN | ES) */}
            <button
              type="button"
              className="start-btn-sub start-btn-sub--lang"
              onClick={handleToggleLang}
              onMouseEnter={soundHover}
              title={strings.langAria}
              aria-label={strings.langAria}
            >
              <span className="sub-icon" aria-hidden="true">🌐</span>
              <span className="sub-label">
                <span className={`lang-tag ${lang === 'en' ? 'is-active' : ''}`}>EN</span>
                <span className="lang-sep">|</span>
                <span className={`lang-tag ${lang === 'es' ? 'is-active' : ''}`}>ES</span>
              </span>
            </button>

            {/* BOTÓN 3: SONIDO (ICONO QUE CAMBIA Y TEXTO) */}
            <button
              type="button"
              className={`start-btn-sub start-btn-sub--sound ${soundActive ? 'is-on' : 'is-off'}`}
              onClick={handleToggleSound}
              onMouseEnter={soundHover}
              title={strings.soundTitle}
              aria-label={strings.soundTitle}
              aria-pressed={soundActive}
            >
              <span className="sub-icon" aria-hidden="true">
                {soundActive ? '🔊' : '🔇'}
              </span>
              <span className="sub-label">
                {soundActive ? strings.soundOn : strings.soundOff}
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}


// =========================================================================
// COMPONENTE PRINCIPAL (ORBITA-7)
// =========================================================================
export default function App() {
  const [lang, setLang] = useState(getSavedLanguage);
  const [game, setGame] = useState(freshGame);
  const [showCinematicIntro, setShowCinematicIntro] = useState(false);

  const handleSetLang = (newLang) => {
    setLang(newLang);
    saveLanguage(newLang);
  };

  const t = getLocale(lang);
  const missions = t.missions;
  const currentMeta = {
    energy: { ...resourceMeta.en.energy, label: t.resources.energy.label },
    life: { ...resourceMeta.en.life, label: t.resources.life.label },
    supplies: { ...resourceMeta.en.supplies, label: t.resources.supplies.label },
    safety: { ...resourceMeta.en.safety, label: t.resources.safety.label },
  };
  const mission = missions[game.turn] ?? missions[0];

  // Estado del sistema de cinemáticas
  // cutscene: null | { type: 'cause' | 'option' | 'replay', sequence: object, option?: object, isReplay?: boolean }
  const [cutscene, setCutscene] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [lastOptionCutscene, setLastOptionCutscene] = useState(null);

  // Control de números flotantes y destello al cambiar recursos
  const [deltas, setDeltas] = useState({});
  const prevResourcesRef = useRef(game.resources);

  // Detecta cambios en los recursos para disparar números flotantes y destello
  useEffect(() => {
    const prev = prevResourcesRef.current;
    const current = game.resources;
    const newDeltas = {};
    for (const key of Object.keys(current)) {
      const diff = current[key] - (prev[key] ?? current[key]);
      if (diff !== 0) {
        newDeltas[key] = { diff, id: Date.now() + Math.random() };
      }
    }
    prevResourcesRef.current = current;

    if (Object.keys(newDeltas).length > 0) {
      setDeltas(newDeltas);
      const timer = window.setTimeout(() => setDeltas({}), 2000);
      return () => window.clearTimeout(timer);
    }
  }, [game.resources]);

  // Inicia la partida real desde la cinemática o briefing
  function handleStartMissionDirectly() {
    setShowCinematicIntro(false);
    setGame(startGame());
    setSelectedOptionId(null);
    setLastOptionCutscene(null);

    // Dispara el plano de CAUSA de la Misión 1 (3-4 segundos antes de decidir)
    const missionCutscene = cutscenesData[1];
    if (missionCutscene?.cause) {
      setCutscene({
        type: 'cause',
        sequence: missionCutscene.cause,
      });
    }
  }

  // Pulsar "INICIAR MISIÓN" o "VER INTRO" en la pantalla de inicio
  function handleTriggerCinematicIntro() {
    setShowCinematicIntro(true);
  }

  // Reiniciar juego
  function handleRestart() {
    setGame(freshGame());
    setCutscene(null);
    setSelectedOptionId(null);
    setLastOptionCutscene(null);
    setShowCinematicIntro(false);
  }

  // Jugador elige una opción (A, B o C)
  function handleSelectOption(option) {
    if (cutscene) return;
    setSelectedOptionId(option.id);

    // Obtener la cinemática de la opción elegida
    const missionCutscenes = cutscenesData[mission.id];
    const optionSeq = missionCutscenes?.options?.[option.id];

    if (optionSeq) {
      setLastOptionCutscene({ sequence: optionSeq, option });
      // Inicia la reproducción de la cinemática (los indicadores NO cambian aún)
      setCutscene({
        type: 'option',
        sequence: optionSeq,
        option,
      });
    } else {
      // Fallback si no hubiese cinemática definida
      setGame((current) => chooseOption(current, mission, option));
    }
  }

  // Finalización o SALTO de una cinemática
  function handleCutsceneComplete() {
    if (!cutscene) return;

    if (cutscene.type === 'cause') {
      // El plano de causa ha concluido: el jugador ahora puede decidir
      setCutscene(null);
    } else if (cutscene.type === 'option') {
      // La cinemática de la opción terminó: AHORA se aplican los cambios a los indicadores
      const chosenOpt = cutscene.option;
      setCutscene(null);
      setGame((current) => chooseOption(current, mission, chosenOpt));
    } else if (cutscene.type === 'replay') {
      // La repetición terminó: vuelve al reporte
      setCutscene(null);
    }
  }

  // Volver a ver la cinemática desde el reporte
  function handleReplayCutscene() {
    if (lastOptionCutscene) {
      setCutscene({
        type: 'replay',
        sequence: lastOptionCutscene.sequence,
        option: lastOptionCutscene.option,
        isReplay: true,
      });
    }
  }

  // Volver a ver el plano de causa
  function handleReplayCause() {
    const missionCutscene = cutscenesData[mission.id];
    if (missionCutscene?.cause) {
      setCutscene({
        type: 'cause',
        sequence: missionCutscene.cause,
        isReplay: true,
      });
    }
  }

  // Continuar al siguiente turno tras el reporte
  function handleAdvance() {
    const nextGame = continueAfterReport(game, missions.length);
    setGame(nextGame);
    setSelectedOptionId(null);
    setLastOptionCutscene(null);

    // Si sigue en juego, lanza el plano de CAUSA de la nueva misión
    if (nextGame.phase === 'play') {
      const nextMission = missions[nextGame.turn] ?? missions[0];
      const nextCutscene = cutscenesData[nextMission.id];
      if (nextCutscene?.cause) {
        setCutscene({
          type: 'cause',
          sequence: nextCutscene.cause,
        });
      }
    }
  }

  if (showCinematicIntro) {
    return (
      <CinematicIntro
        t={t}
        lang={lang}
        onChangeLang={handleSetLang}
        onStartMission={handleStartMissionDirectly}
        onBackToMenu={() => setShowCinematicIntro(false)}
      />
    );
  }

  if (game.phase === 'intro') {
    return (
      <IntroScreen
        onStart={handleTriggerCinematicIntro}
        lang={lang}
        setLang={handleSetLang}
        t={t}
      />
    );
  }

  if (game.phase === 'result') {
    return (
      <ResultScreen
        game={game}
        missions={missions}
        onRestart={handleRestart}
        lang={lang}
        onChangeLang={handleSetLang}
        t={t}
      />
    );
  }

  const isCleaned =
    game.flags.var_paneles_limpios === 1 ||
    selectedOptionId === 'A' ||
    selectedOptionId === 'B';

  return (
    <div className="game-screen-wrapper">
      {/* 1. HUD Superior Rediseñado con 4 Bloques Grandes (Mínimo 64px) */}
      <HUDTopBar
        game={game}
        missions={missions}
        meta={currentMeta}
        lang={lang}
        setLang={handleSetLang}
        onRestart={handleRestart}
        deltas={deltas}
        t={t}
      />

      {/* 2. Escenario / Cinemática de planos */}
      {cutscene ? (
        <CutscenePlayer
          sequence={cutscene.sequence}
          onComplete={handleCutsceneComplete}
          isReplay={cutscene.isReplay}
          t={t}
        />
      ) : (
        <BaseAlpha7Viewport
          energy={game.resources.energy}
          isCleaned={isCleaned}
          mission={mission}
          onReplayCause={handleReplayCause}
          t={t}
        />
      )}

      {/* 3. Consola de Decisiones con Pictogramas Pixel Art y Texto Mínimo */}
      <DecisionConsole
        mission={mission}
        meta={currentMeta}
        phase={game.phase}
        report={game.report}
        decisionEffect={game.decisionEffect}
        selectedOptionId={selectedOptionId}
        isCutscenePlaying={Boolean(cutscene)}
        onSelectOption={handleSelectOption}
        onReplayCutscene={handleReplayCutscene}
        onAdvance={handleAdvance}
        t={t}
      />
    </div>
  );
}
