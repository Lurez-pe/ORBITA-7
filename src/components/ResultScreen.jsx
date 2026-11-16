import React, { useEffect, useState } from 'react';
import { initialResources, resourceMeta } from '../data/missions.js';
import { soundClick, soundConfirm, soundHover, soundResultsEntrance } from '../game/audio.js';
import { EndingIllustration } from './EndingIllustration.jsx';

// =========================================================================
// PANTALLA FINAL DE MISIÓN (RESULT SCREEN) - PIXEL ART RETRO
// Estructura en 6 secciones en orden estricto:
// 1. Cabecera (Título grande, ilustración pixel art, 1-3 estrellas, frase máx 12 palabras)
// 2. Indicadores (4 iconos en fila, 80 → Final, barra verde/amarillo/rojo)
// 3. Línea de tiempo (6 filas, M1-M6, opción elegida, cambios icono+num, mejor en verde, peor en rojo)
// 4. Estado de la misión (3 iconos: comunicaciones, aterrizaje, reparación con ✔ o ✘)
// 5. Aprendizajes (Máximo 3 tarjetas de una sola frase de las decisiones tomadas)
// 6. Botones grandes (JUGAR DE NUEVO y VER LAS OTRAS RUTAS)
// =========================================================================

export function ResultScreen({ game, missions, onRestart, lang = 'es' }) {
  const [showRoutesModal, setShowRoutesModal] = useState(false);
  const meta = resourceMeta[lang] ?? resourceMeta.es;

  // Sonido corto de entrada al montar la pantalla
  useEffect(() => {
    soundResultsEntrance();
  }, []);

  const endingKey = game.result ?? 'finalA';

  // Configuración de los 4 finales posibles
  const endingMetaMap = {
    finalA: {
      letter: 'A',
      tag: 'FINAL A · ÉXITO TOTAL',
      title: 'Aterrizaje seguro',
      stars: 3,
      phrase: 'La nave aterrizó segura. Base Alpha-7 sobrevive con todos sus sistemas operativos.', // 12 palabras
      color: 'gold',
    },
    finalB: {
      letter: 'B',
      tag: 'FINAL B · SUPERVIVENCIA LÍMITE',
      title: 'Aterrizaje forzoso',
      stars: 2,
      phrase: 'Aterrizaje con daños menores. La tripulación sobrevive racionando suministros críticos.', // 10 palabras
      color: 'yellow',
    },
    finalC: {
      letter: 'C',
      tag: 'FINAL C · MISIÓN INCOMPLETA',
      title: 'Nave en órbita',
      stars: 1,
      phrase: 'Sin baliza ni enlace, la nave no descendió y espera en órbita.', // 11 palabras
      color: 'cyan',
    },
    finalD: {
      letter: 'D',
      tag: 'FINAL D · COLAPSO DE SISTEMAS',
      title: 'Evacuación de emergencia',
      stars: 1,
      phrase: 'Un sistema vital colapsó. Se activó el protocolo de emergencia de base.', // 11 palabras
      color: 'red',
    },
  };

  const currentEnding = endingMetaMap[endingKey] ?? endingMetaMap.finalA;

  // -----------------------------------------------------------------------
  // SECCIÓN 3: CÁLCULO DE LA LÍNEA DE TIEMPO (6 MISIONES)
  // - Identifica la mejor decisión (verde) y la que más costó (rojo)
  // -----------------------------------------------------------------------
  const history = game.history ?? [];

  // Calcular balance neto de cada decisión en el historial
  let bestScore = -Infinity;
  let worstScore = Infinity;
  let bestMissionId = null;
  let worstMissionId = null;

  if (history.length > 0) {
    history.forEach((item) => {
      const netChange = Object.values(item.effects ?? {}).reduce(
        (sum, v) => sum + v,
        0
      );
      if (netChange > bestScore) {
        bestScore = netChange;
        bestMissionId = item.missionId;
      }
      if (netChange < worstScore) {
        worstScore = netChange;
        worstMissionId = item.missionId;
      }
    });
  }

  // Si todas tuvieron el mismo score, desempatar
  if (bestMissionId === worstMissionId && history.length > 1) {
    worstMissionId = null;
  }

  // -----------------------------------------------------------------------
  // SECCIÓN 4: ESTADO DE LA MISIÓN (3 BANDERAS CLAVE)
  // -----------------------------------------------------------------------
  const commsOk = game.flags?.var_comunicaciones === 1;
  const landingOk = game.flags?.var_zona_aterrizaje === 1;
  const repairedOk = game.flags?.var_reparacion_base === 1;

  // -----------------------------------------------------------------------
  // SECCIÓN 5: APRENDIZAJES (MÁXIMO 3 TARJETAS)
  // - Extraídas de las decisiones tomadas por el jugador
  // -----------------------------------------------------------------------
  const playerLessons = [];
  const seenLessons = new Set();

  // Priorizar la lección de la mejor decisión
  const bestItem = history.find((h) => h.missionId === bestMissionId);
  if (bestItem?.lesson && !seenLessons.has(bestItem.lesson)) {
    playerLessons.push({
      title: `LECCIÓN · MISIÓN ${bestItem.missionId}`,
      text: bestItem.lesson,
      badge: 'MEJOR OPCIÓN',
    });
    seenLessons.add(bestItem.lesson);
  }

  // Priorizar la lección de la decisión de mayor costo
  const worstItem = history.find((h) => h.missionId === worstMissionId);
  if (worstItem?.lesson && !seenLessons.has(worstItem.lesson)) {
    playerLessons.push({
      title: `LECCIÓN · MISIÓN ${worstItem.missionId}`,
      text: worstItem.lesson,
      badge: 'MAYOR COSTO',
    });
    seenLessons.add(worstItem.lesson);
  }

  // Completar hasta 3 lecciones con otras decisiones
  for (const item of history) {
    if (playerLessons.length >= 3) break;
    if (item.lesson && !seenLessons.has(item.lesson)) {
      playerLessons.push({
        title: `LECCIÓN · MISIÓN ${item.missionId}`,
        text: item.lesson,
        badge: `OPCIÓN ${item.optionId}`,
      });
      seenLessons.add(item.lesson);
    }
  }

  // Fallback si no hubiese lecciones
  if (playerLessons.length === 0) {
    playerLessons.push({
      title: 'LECCIÓN GENERAL',
      text: 'Cada recurso en Marte exige sacrificios tácticos constantes.',
      badge: 'PROTOCOLO',
    });
  }

  return (
    <main className="result-screen-layout" aria-label="Pantalla Final de Misión">
      <div className="result-content-container">
        {/* =================================================================
            1. CABECERA: TÍTULO GRANDE, ILUSTRACIÓN PIXEL ART, ESTRELLAS, FRASE
            ================================================================= */}
        <section className="result-section result-block-1 header-block">
          <div className="header-meta-row">
            <span className={`ending-tag-badge tag--${currentEnding.color}`}>
              {currentEnding.tag}
            </span>
            {/* 1 a 3 Estrellas según el resultado */}
            <div className="ending-stars-row" title={`${currentEnding.stars} estrellas`}>
              {Array.from({ length: 3 }, (_, i) => (
                <span
                  key={i}
                  className={`star-pixel ${i < currentEnding.stars ? 'is-filled' : 'is-empty'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <h1 className="ending-main-title">{currentEnding.title}</h1>

          {/* Ilustración pixel art distinta para cada uno */}
          <div className="header-illustration-wrapper">
            <EndingIllustration endingType={endingKey} />
          </div>

          {/* Frase de máximo 12 palabras */}
          <p className="ending-phrase-text">{currentEnding.phrase}</p>
        </section>

        {/* =================================================================
            2. INDICADORES: 4 ICONOS EN FILA, 80 → FINAL, BARRA COLOR
            ================================================================= */}
        <section className="result-section result-block-2">
          <div className="section-title-strip">
            <span className="strip-num">02</span>
            <b className="strip-label">SISTEMAS VITALES · BALANCE FINAL</b>
          </div>

          <div className="result-indicators-row">
            {Object.entries(game.resources).map(([resKey, finalVal]) => {
              const res = meta[resKey];
              const initVal = initialResources[resKey] ?? 80;
              const colorClass =
                finalVal > 60 ? 'green' : finalVal >= 30 ? 'yellow' : 'red';
              const segments = 10;
              const activeSegments = Math.round((finalVal / 100) * segments);

              return (
                <div key={resKey} className="res-indicator-card">
                  <div className="res-card-top">
                    <span className="res-card-icon">{res?.icon}</span>
                    <span className="res-card-name">{res?.label}</span>
                  </div>

                  {/* Valor Inicial y Final (ej. 80 → 45) */}
                  <div className="res-card-values">
                    <span className="val-init">{initVal}</span>
                    <span className="val-arrow">➔</span>
                    <b className={`val-final state--${colorClass}`}>{finalVal}</b>
                  </div>

                  {/* Barra segmentada con color Verde / Amarillo / Rojo */}
                  <div className={`res-card-bar state--${colorClass}`}>
                    {Array.from({ length: segments }, (_, i) => (
                      <span
                        key={i}
                        className={`bar-seg ${i < activeSegments ? 'is-filled' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =================================================================
            3. LÍNEA DE TIEMPO: 6 FILAS (M1 A M6), MEJOR VERDE, PEOR ROJO
            ================================================================= */}
        <section className="result-section result-block-3">
          <div className="section-title-strip">
            <span className="strip-num">03</span>
            <b className="strip-label">LÍNEA DE TIEMPO · 6 MISIONES</b>
          </div>

          <div className="timeline-table-grid">
            {missions.map((mission, idx) => {
              const decision = history.find((h) => h.missionId === mission.id);
              const isBest = decision && decision.missionId === bestMissionId;
              const isWorst = decision && decision.missionId === worstMissionId;

              const highlightClass = isBest
                ? 'row--best'
                : isWorst
                ? 'row--worst'
                : '';

              return (
                <div key={mission.id} className={`timeline-row-item ${highlightClass}`}>
                  {/* Número de misión */}
                  <div className="col-mission-num">
                    <span className="pixel-badge-m">M{mission.id}</span>
                  </div>

                  {/* Nombre corto */}
                  <div className="col-mission-name">
                    <b className="mission-name-text">{mission.title}</b>
                    <span className="mission-time-tag">{mission.time}</span>
                  </div>

                  {/* Opción elegida (A, B o C) */}
                  <div className="col-option-choice">
                    {decision ? (
                      <span className="option-choice-badge">
                        OPC {decision.optionId}
                      </span>
                    ) : (
                      <span className="option-choice-badge not-played">---</span>
                    )}
                  </div>

                  {/* Cambios como icono + número */}
                  <div className="col-effects-pills">
                    {decision && decision.effects ? (
                      Object.entries(decision.effects).map(([k, val]) => (
                        <span
                          key={k}
                          className={`effect-tag-pixel ${val >= 0 ? 'gain' : 'loss'}`}
                        >
                          {meta[k]?.icon} {val > 0 ? `+${val}` : val}
                        </span>
                      ))
                    ) : (
                      <span className="no-change-tag">Sin datos</span>
                    )}
                  </div>

                  {/* Etiqueta de mejor o peor decisión */}
                  <div className="col-badge-eval">
                    {isBest && (
                      <span className="eval-badge best">✔ MEJOR DECISIÓN</span>
                    )}
                    {isWorst && (
                      <span className="eval-badge worst">✘ MAYOR COSTO</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =================================================================
            4. ESTADO DE LA MISIÓN: 3 ICONOS CON ✔ O ✘
            ================================================================= */}
        <section className="result-section result-block-4">
          <div className="section-title-strip">
            <span className="strip-num">04</span>
            <b className="strip-label">ESTADO DE LA BASE · HITOS CLAVE</b>
          </div>

          <div className="mission-flags-grid">
            {/* 1. Comunicaciones */}
            <div className={`flag-card ${commsOk ? 'is-ok' : 'is-fail'}`}>
              <div className="flag-card-header">
                <span className="flag-icon">📡</span>
                <span className="flag-status-symbol">{commsOk ? '✔' : '✘'}</span>
              </div>
              <b className="flag-name">COMUNICACIONES</b>
              <span className="flag-desc">
                {commsOk ? 'ENLACE ACTIVO' : 'SIN CONEXIÓN'}
              </span>
            </div>

            {/* 2. Zona de aterrizaje */}
            <div className={`flag-card ${landingOk ? 'is-ok' : 'is-fail'}`}>
              <div className="flag-card-header">
                <span className="flag-icon">🚨</span>
                <span className="flag-status-symbol">{landingOk ? '✔' : '✘'}</span>
              </div>
              <b className="flag-name">ZONA ATERRIZAJE</b>
              <span className="flag-desc">
                {landingOk ? 'BALIZA GUIADA' : 'A OSCURAS'}
              </span>
            </div>

            {/* 3. Reparación de base */}
            <div className={`flag-card ${repairedOk ? 'is-ok' : 'is-fail'}`}>
              <div className="flag-card-header">
                <span className="flag-icon">🛠️</span>
                <span className="flag-status-symbol">{repairedOk ? '✔' : '✘'}</span>
              </div>
              <b className="flag-name">REPARACIÓN BASE</b>
              <span className="flag-desc">
                {repairedOk ? 'MÓDULO SELLADO' : 'DAÑOS PENDIENTES'}
              </span>
            </div>
          </div>
        </section>

        {/* =================================================================
            5. APRENDIZAJES: MÁXIMO 3 TARJETAS DE UNA FRASE CADA UNA
            ================================================================= */}
        <section className="result-section result-block-5">
          <div className="section-title-strip">
            <span className="strip-num">05</span>
            <b className="strip-label">APRENDIZAJES CLAVE · DECISIONES TOMADAS</b>
          </div>

          <div className="lessons-cards-grid">
            {playerLessons.map((item, idx) => (
              <div key={idx} className="lesson-pixel-card">
                <div className="lesson-card-header">
                  <span className="lesson-card-badge">{item.badge}</span>
                  <span className="lesson-card-num">0{idx + 1}</span>
                </div>
                <p className="lesson-card-phrase">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================
            6. BOTONES GRANDES: JUGAR DE NUEVO Y VER LAS OTRAS RUTAS
            ================================================================= */}
        <section className="result-section result-block-6 actions-block">
          <button
            className="big-pixel-btn btn-restart"
            onClick={() => {
              soundConfirm();
              onRestart();
            }}
            onMouseEnter={soundHover}
            title="Reiniciar simulación desde el inicio"
          >
            <span>↻ JUGAR DE NUEVO</span>
          </button>

          <button
            className="big-pixel-btn btn-routes"
            onClick={() => {
              soundClick();
              setShowRoutesModal(true);
            }}
            onMouseEnter={soundHover}
            title="Consultar los 4 finales y sus requisitos"
          >
            <span>🗺️ VER LAS OTRAS RUTAS</span>
          </button>
        </section>
      </div>

      {/* ===================================================================
          MODAL INTERACTIVO: GUÍA DE LAS OTRAS RUTAS Y FINALES
          =================================================================== */}
      {showRoutesModal && (
        <div className="pixel-modal-backdrop" onClick={() => setShowRoutesModal(false)}>
          <div
            className="pixel-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Guía de rutas y finales"
          >
            <div className="modal-header-row">
              <span className="modal-badge">MANUAL S.T.A.R.</span>
              <h2 className="modal-title">LOS 4 FINALES DE ORBITA-7</h2>
              <button
                className="pixel-btn-sm btn--danger"
                onClick={() => {
                  soundClick();
                  setShowRoutesModal(false);
                }}
              >
                ✖
              </button>
            </div>

            <div className="routes-list-grid">
              {/* Ruta A */}
              <div className="route-detail-card route--a">
                <div className="route-card-top">
                  <b className="route-name">FINAL A · ÉXITO TOTAL (★★★)</b>
                  <span className="route-req-tag">REQUISITOS COMPLETOS</span>
                </div>
                <p className="route-text">
                  Requiere activar Comunicaciones (✔), Baliza de aterrizaje (✔) y Reparación del hábitat (✔). La nave aterriza intacta y la colonia subsiste al 100%.
                </p>
              </div>

              {/* Ruta B */}
              <div className="route-detail-card route--b">
                <div className="route-card-top">
                  <b className="route-name">FINAL B · SUPERVIVENCIA LÍMITE (★★☆)</b>
                  <span className="route-req-tag">ATERRIZAJE FORZOSO</span>
                </div>
                <p className="route-text">
                  Requiere Comunicaciones (✔) y Baliza (✔), pero sin reparar la base (✘). La nave toca tierra con daños y se requiere racionamiento.
                </p>
              </div>

              {/* Ruta C */}
              <div className="route-detail-card route--c">
                <div className="route-card-top">
                  <b className="route-name">FINAL C · MISIÓN INCOMPLETA (★☆☆)</b>
                  <span className="route-req-tag">NAVE EN ÓRBITA</span>
                </div>
                <p className="route-text">
                  Si falta la Baliza de pista o el enlace de radio (✘). La nave no puede alinearse y permanece varada en órbita marciana.
                </p>
              </div>

              {/* Ruta D */}
              <div className="route-detail-card route--d">
                <div className="route-card-top">
                  <b className="route-name">FINAL D · COLAPSO CRÍTICO (☆☆☆)</b>
                  <span className="route-req-tag">EVACUACIÓN</span>
                </div>
                <p className="route-text">
                  Ocurre si cualquiera de los 4 indicadores (Energía, Soporte, Agua, Seguridad) cae a cero en cualquier turno. La misión se interrumpe de inmediato.
                </p>
              </div>
            </div>

            <div className="modal-footer-row">
              <button
                className="big-pixel-btn btn-routes"
                onClick={() => {
                  soundClick();
                  setShowRoutesModal(false);
                }}
              >
                <span>✖ CERRAR GUÍA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
