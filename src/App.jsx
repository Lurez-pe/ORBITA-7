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
import { cutscenesData } from './data/cutscenes.js';
import { CutscenePlayer } from './components/CutscenePlayer.jsx';
import { ActionPictogram } from './components/ActionPictogram.jsx';

// =========================================================================
// 1. BARRA SUPERIOR (HUD) REDISEÑADA: 4 BLOQUES GRANDES (MÍNIMO 64PX)
// =========================================================================
function HUDTopBar({ game, missions, meta, lang, setLang, onRestart, deltas }) {
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
          <span className="brand-badge">O7</span>
          <b className="brand-text">ORBITA-7</b>
        </div>
        <div className="hud-clock-box">
          <div className="clock-main-line">
            <span>{mission.time}</span>
            <span>T{game.turn + 1}/6</span>
          </div>
          {/* 6 Puntos de Turno Visibles */}
          <div className="clock-turn-dots" title={`Turno ${game.turn + 1} de 6`}>
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
                    <img src={itemMeta.image} alt="" />
                  </span>
                  <span className="block-name">{itemMeta.label}</span>
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

      {/* Controles de juego */}
      <div className="hud-buttons-col">
        <button
          className="pixel-btn-sm"
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          title="Idioma"
        >
          🌐 {lang.toUpperCase()}
        </button>
        <button className="pixel-btn-sm" onClick={handleToggleSound} title="Sonido">
          {soundActive ? '🔊 ON' : '🔇 OFF'}
        </button>
        <button
          className="pixel-btn-sm btn--danger"
          onClick={() => {
            soundClick();
            onRestart();
          }}
          title="Reiniciar"
        >
          ↻ REINICIAR
        </button>
      </div>
    </header>
  );
}

// =========================================================================
// 2. ESCENARIO VISUAL PIXEL ART ESTÁTICO DE BASE ALPHA-7
// =========================================================================
function BaseAlpha7Viewport({ energy = 80, isCleaned, mission, onReplayCause }) {
  const lightsState = energy > 60 ? 'on' : energy >= 30 ? 'flicker' : 'blackout';
  const skyLight = 30;
  const dustVal = isCleaned ? 0 : 85;
  const powerOutput = isCleaned ? 30 : 12;

  return (
    <section className="pixel-stage-wrapper" aria-label="Escenario Base Alpha-7">
      <img
        src={mission.sceneBg ?? '/assets/ORB_ESC_base_exterior_v01.jpg'}
        className="pixel-stage-bg"
        alt="Escenario marciano"
      />

      <div className="pixel-storm-sky-overlay" />
      <div className="pixel-sun-marker" title="Sol atenuado por tormenta" />

      {/* Telemetría retro en pantalla */}
      <div className="pixel-stage-hud-bar">
        <span className="stage-hud-stat">
          CIELO: <b>{skyLight}% LUZ</b> (TORMENTA)
        </span>
        <span className={`stage-hud-stat ${isCleaned ? 'stat-clean' : 'stat-dirty'}`}>
          POLVO EN PANELES: <b>{dustVal}%</b>
        </span>
        <span className={`stage-hud-stat ${isCleaned ? 'stat-clean' : 'stat-dirty'}`}>
          SALIDA SOLAR: <b>{powerOutput}%</b>
        </span>
        {onReplayCause && (
          <button
            className="pixel-btn-sm"
            style={{ marginLeft: 'auto', padding: '2px 6px', fontSize: '7px' }}
            onClick={onReplayCause}
            title="Ver plano de causa nuevamente"
          >
            👁️ VER CAUSA
          </button>
        )}
      </div>

      {/* Luces del hábitat */}
      <div className={`pixel-base-lights-block state--${lightsState}`}>
        <span className="pixel-light-square" />
        <span className="pixel-light-square" />
        <span className="pixel-light-square" />
      </div>
      {energy < 30 && <div className="pixel-dome-red-beacon" title="Alerta roja en cúpula" />}

      {/* Matriz de paneles solares */}
      <div className="pixel-panels-unit">
        <div className="pixel-panel-frame">
          <img
            src="/assets/ORB_OBJ_panel_solar_v01.png"
            className="pixel-panel-img"
            alt="Paneles solares"
          />
          <div className={`pixel-dust-blanket ${isCleaned ? 'is-cleared' : ''}`} />
          {!isCleaned && (
            <div className="pixel-panel-alert">
              <img
                src="/assets/orbita7_alerta_tormenta_de_polvo_v3.png"
                alt="Alerta de polvo"
              />
            </div>
          )}
        </div>
        <span className="pixel-unit-tag">PANELES FOTOVOLTAICOS</span>
      </div>

      {/* Rover autónomo */}
      <div className="pixel-rover-unit">
        <img
          src="/assets/ORB_OBJ_rover_lateral_v01.png"
          className="pixel-rover-img"
          alt="Rover Alpha-7"
        />
        <span className="pixel-unit-tag">ROVER A-7</span>
      </div>

      {/* Astronautas con traje y casco */}
      <div className="pixel-astronauts-unit">
        <div className="astronaut-sprites-row">
          <img
            src="/assets/ORB_PERS_tripulante_lider.webp"
            alt="Comandante EVA"
            title="Astronauta Líder con traje y casco"
          />
          <img
            src="/assets/ORB_PERS_tripulante_naranja.webp"
            alt="Especialista EVA"
            title="Astronauta EVA con traje y casco"
          />
        </div>
        <span className="pixel-unit-tag">TRIPULACIÓN EVA</span>
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
}) {
  return (
    <footer className="pixel-decision-console" aria-label="Consola de decisiones">
      {/* Cabecera S.T.A.R. con directiva corta (máx 12 palabras) */}
      <div className="pixel-console-header">
        <span className="console-star-tag">S.T.A.R. // MISIÓN {mission.id}</span>
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
                title={`Opción ${option.id}: ${option.title}`}
              >
                {/* 1. Letra + Nombre de máximo 3 palabras */}
                <div className="card-top-row">
                  <span className="card-letter-box">{option.id}</span>
                  <b className="card-title-text">{option.title}</b>
                </div>

                {/* 2. Pictograma pixel art grande animado en hover */}
                <div className="card-pictogram-box">
                  <ActionPictogram missionId={mission.id} optionId={option.id} />
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
              <span className="num-col-title">DECISIÓN:</span>
              <div className="num-pills-row">
                {Object.entries(decisionEffect ?? {}).map(([resKey, val]) => (
                  <span key={resKey} className={`effect-chip-pixel ${val >= 0 ? 'gain' : 'loss'}`}>
                    {meta[resKey]?.icon} {val > 0 ? `+${val}` : val}
                  </span>
                ))}
              </div>
            </div>

            <div className="num-col">
              <span className="num-col-title">CONSUMO BASE:</span>
              <div className="num-pills-row">
                <span className="effect-chip-pixel loss">⚡ -5</span>
                <span className="effect-chip-pixel loss">🫁 -3</span>
                <span className="effect-chip-pixel loss">💧 -4</span>
              </div>
            </div>
          </div>

          {/* Lección única (máximo 15 palabras) */}
          <div className="report-lesson-pixel-box">
            <span className="lesson-header">LECCIÓN:</span>
            <p className="lesson-single-phrase">{report?.lesson}</p>
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
              title="Volver a ver la cinemática de este turno"
            >
              <span>🎬 VER DE NUEVO</span>
            </button>

            <button
              className="btn-pixel-advance"
              onClick={() => {
                soundConfirm();
                onAdvance();
              }}
              onMouseEnter={soundHover}
            >
              <span>CONTINUAR AL TURNO {mission.turn + 1}</span>
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
        </div>
      </header>

      <section className="intro-hero" id="top">
        <div className="intro-copy">
          <span className="eyebrow"><i /> MARTE, 2042 · BASE ALPHA-7</span>
          <h1>72 HORAS<br />PARA SOBREVIVIR<br />EN MARTE</h1>
          <p>
            Tormenta planetaria en curso. Gestiona los 4 indicadores durante 6 turnos de 12 horas y guía la nave de suministros.
          </p>

          <div className="intro-meta">
            <span><b>06</b> TURNOS</span>
            <span><b>04</b> SISTEMAS</span>
            <span><b>72</b> HORAS</span>
          </div>

          <button
            className="primary-button"
            onClick={() => {
              soundConfirm();
              onStart();
            }}
            onMouseEnter={soundHover}
          >
            {script.startButton} <span>➔</span>
          </button>
        </div>

        <div className="intro-art intro-art--menu">
          <img src="/assets/orbita7_menu_inicio.png" alt="Menú inicial de ORBITA-7" />
        </div>
      </section>
    </main>
  );
}

// =========================================================================
// PANTALLA DE RESULTADOS / FINALES
// =========================================================================
function ResultScreen({ game, onRestart, lang }) {
  const ending = (endingsData[lang] ?? endingsData.es)[game.result] ?? (endingsData[lang] ?? endingsData.es).finalA;
  const meta = resourceMeta[lang] ?? resourceMeta.es;

  return (
    <main className="result-screen">
      <div className="result-panel">
        <span className="eyebrow">{ending.tag}</span>
        <h1>{ending.title}</h1>
        <p>{ending.text}</p>

        <div className="result-stats">
          {Object.entries(game.resources).map(([key, value]) => (
            <div key={key}>
              <span>{meta[key]?.icon} {meta[key]?.label ?? key}</span>
              <b>{value}/100</b>
            </div>
          ))}
        </div>

        <button
          className="primary-button"
          onClick={() => {
            soundConfirm();
            onRestart();
          }}
          onMouseEnter={soundHover}
        >
          REINICIAR SIMULACIÓN <span>↻</span>
        </button>
      </div>
    </main>
  );
}

// =========================================================================
// COMPONENTE PRINCIPAL (ORBITA-7)
// =========================================================================
export default function App() {
  const [lang, setLang] = useState('es');
  const [game, setGame] = useState(freshGame);

  // Estado del sistema de cinemáticas
  // cutscene: null | { type: 'cause' | 'option' | 'replay', sequence: object, option?: object, isReplay?: boolean }
  const [cutscene, setCutscene] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [lastOptionCutscene, setLastOptionCutscene] = useState(null);

  // Control de números flotantes y destello al cambiar recursos
  const [deltas, setDeltas] = useState({});
  const prevResourcesRef = useRef(game.resources);

  const missions = missionsData[lang] ?? missionsData.es;
  const currentMeta = resourceMeta[lang] ?? resourceMeta.es;
  const mission = missions[game.turn] ?? missions[0];

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

  // Inicia la partida desde el Briefing
  function handleStartGame() {
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

  // Reiniciar juego
  function handleRestart() {
    setGame(freshGame());
    setCutscene(null);
    setSelectedOptionId(null);
    setLastOptionCutscene(null);
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

  if (game.phase === 'intro') {
    return <IntroScreen onStart={handleStartGame} lang={lang} setLang={setLang} />;
  }

  if (game.phase === 'result') {
    return <ResultScreen game={game} onRestart={handleRestart} lang={lang} />;
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
        setLang={setLang}
        onRestart={handleRestart}
        deltas={deltas}
      />

      {/* 2. Escenario / Cinemática de planos */}
      {cutscene ? (
        <CutscenePlayer
          sequence={cutscene.sequence}
          onComplete={handleCutsceneComplete}
          isReplay={cutscene.isReplay}
        />
      ) : (
        <BaseAlpha7Viewport
          energy={game.resources.energy}
          isCleaned={isCleaned}
          mission={mission}
          onReplayCause={handleReplayCause}
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
      />
    </div>
  );
}
