import React, { useEffect, useState } from 'react';
import { initialResources } from '../data/missions.js';
import { soundClick, soundConfirm, soundHover, soundResultsEntrance } from '../game/audio.js';
import { EndingIllustration } from './EndingIllustration.jsx';
import { LanguageSelector } from './LanguageSelector.jsx';

// =========================================================================
// PANTALLA FINAL DE MISIÓN (RESULT SCREEN) - PIXEL ART RETRO
// Estructura en 6 secciones en orden estricto:
// 1. Cabecera (Título grande, ilustración pixel art, 1-3 estrellas, frase máx 12 palabras)
// 2. Indicadores (4 iconos en fila, 80 → Final, barra verde/amarillo/rojo)
// 3. Línea de tiempo (6 filas, M1-M6, opción elegida, cambios icono+num, mejor en verde, peor en rojo)
// 4. Estado de la misión (3 iconos: comunicaciones, aterrizaje, reparación con ✔ o ✘)
// 5. Aprendizajes (Máximo 3 tarjetas de una sola frase de las decisiones tomadas)
// 6. Botones grandes (JUGAR DE NUEVO y VER LAS OTRAS RUTAS)
// 100% traducida mediante prop `t` sin textos escritos directamente
// =========================================================================

export function ResultScreen({ game, missions, onRestart, lang = 'en', onChangeLang, t }) {
  const [showRoutesModal, setShowRoutesModal] = useState(false);

  // Sonido corto de entrada al montar la pantalla
  useEffect(() => {
    soundResultsEntrance();
  }, []);

  const endingKey = game.result ?? 'finalA';
  const currentEnding = t?.endings?.[endingKey] ?? t?.endings?.finalA;
  const resultsLocale = t?.results;

  // -----------------------------------------------------------------------
  // SECCIÓN 3: CÁLCULO DE LA LÍNEA DE TIEMPO (6 MISIONES)
  // - Identifica la mejor decisión (verde) y la que más costó (rojo)
  // -----------------------------------------------------------------------
  const history = game.history ?? [];

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
  // - Dinámicamente resueltas desde `missions` para actualizarse al instante al cambiar de idioma
  // -----------------------------------------------------------------------
  const playerLessons = [];
  const seenLessons = new Set();

  function getOptionLesson(missionId, optionId) {
    const m = missions.find((item) => item.id === missionId);
    const opt = m?.options?.find((o) => o.id === optionId);
    return opt?.lesson ?? '';
  }

  // Priorizar la lección de la mejor decisión
  const bestItem = history.find((h) => h.missionId === bestMissionId);
  if (bestItem) {
    const lessonText = getOptionLesson(bestItem.missionId, bestItem.optionId);
    if (lessonText && !seenLessons.has(lessonText)) {
      playerLessons.push({
        title: resultsLocale?.lessons?.titlePrefix
          ? resultsLocale.lessons.titlePrefix(bestItem.missionId)
          : `M${bestItem.missionId}`,
        text: lessonText,
        badge: resultsLocale?.lessons?.bestOption ?? 'BEST OPTION',
      });
      seenLessons.add(lessonText);
    }
  }

  // Priorizar la lección de la decisión de mayor costo
  const worstItem = history.find((h) => h.missionId === worstMissionId);
  if (worstItem) {
    const lessonText = getOptionLesson(worstItem.missionId, worstItem.optionId);
    if (lessonText && !seenLessons.has(lessonText)) {
      playerLessons.push({
        title: resultsLocale?.lessons?.titlePrefix
          ? resultsLocale.lessons.titlePrefix(worstItem.missionId)
          : `M${worstItem.missionId}`,
        text: lessonText,
        badge: resultsLocale?.lessons?.highestCost ?? 'HIGHEST COST',
      });
      seenLessons.add(lessonText);
    }
  }

  // Completar hasta 3 lecciones con otras decisiones del jugador
  for (const item of history) {
    if (playerLessons.length >= 3) break;
    const lessonText = getOptionLesson(item.missionId, item.optionId);
    if (lessonText && !seenLessons.has(lessonText)) {
      playerLessons.push({
        title: resultsLocale?.lessons?.titlePrefix
          ? resultsLocale.lessons.titlePrefix(item.missionId)
          : `M${item.missionId}`,
        text: lessonText,
        badge: resultsLocale?.optionBadge
          ? resultsLocale.optionBadge(item.optionId)
          : `OPT ${item.optionId}`,
      });
      seenLessons.add(lessonText);
    }
  }

  // Fallback si no hubiese lecciones
  if (playerLessons.length === 0) {
    playerLessons.push({
      title: resultsLocale?.lessons?.generalTitle ?? 'GENERAL LESSON',
      text: resultsLocale?.lessons?.generalText ?? 'Every resource requires deliberate trade-offs.',
      badge: resultsLocale?.lessons?.generalBadge ?? 'PROTOCOL',
    });
  }

  return (
    <main className="result-screen-layout" aria-label="Pantalla Final de Misión">
      <div className="result-content-container">
        {/* =================================================================
            1. CABECERA: TÍTULO GRANDE, ILUSTRACIÓN PIXEL ART, ESTRELLAS, FRASE
            ================================================================= */}
        <section className="result-section result-block-1 header-block">
          {/* Selector de idioma y badges */}
          <div className="header-meta-row">
            <span className={`ending-tag-badge tag--${currentEnding?.color ?? 'gold'}`}>
              {currentEnding?.tag}
            </span>

            {/* 1 a 3 Estrellas según el resultado */}
            <div
              className="ending-stars-row"
              title={resultsLocale?.starsAria ? resultsLocale.starsAria(currentEnding?.stars ?? 3) : ''}
            >
              {Array.from({ length: 3 }, (_, i) => (
                <span
                  key={i}
                  className={`star-pixel ${i < (currentEnding?.stars ?? 3) ? 'is-filled' : 'is-empty'}`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Selector de idioma siempre visible */}
            {onChangeLang && (
              <LanguageSelector
                currentLang={lang}
                onChangeLang={onChangeLang}
                className="result-lang-pill"
              />
            )}
          </div>

          <h1 className="ending-main-title">{currentEnding?.title}</h1>

          {/* Ilustración pixel art distinta para cada uno */}
          <div className="header-illustration-wrapper">
            <EndingIllustration endingType={endingKey} t={t} />
          </div>

          {/* Frase de máximo 12 palabras */}
          <p className="ending-phrase-text">{currentEnding?.phrase}</p>
        </section>

        {/* =================================================================
            2. INDICADORES: 4 ICONOS EN FILA, 80 → FINAL, BARRA COLOR
            ================================================================= */}
        <section className="result-section result-block-2">
          <div className="section-title-strip">
            <span className="strip-num">{resultsLocale?.section02Num ?? '02'}</span>
            <b className="strip-label">{resultsLocale?.section02Label ?? 'VITAL SYSTEMS'}</b>
          </div>

          <div className="result-indicators-row">
            {Object.entries(game.resources).map(([resKey, finalVal]) => {
              const res = t?.resources?.[resKey];
              const initVal = initialResources[resKey] ?? 80;
              const colorClass =
                finalVal > 60 ? 'green' : finalVal >= 30 ? 'yellow' : 'red';
              const segments = 10;
              const activeSegments = Math.round((finalVal / 100) * segments);

              return (
                <div key={resKey} className="res-indicator-card">
                  <div className="res-card-top">
                    <span className="res-card-icon">
                      {resKey === 'energy' ? '⚡' : resKey === 'life' ? '🫁' : resKey === 'supplies' ? '💧' : '🛡️'}
                    </span>
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
            <span className="strip-num">{resultsLocale?.section03Num ?? '03'}</span>
            <b className="strip-label">{resultsLocale?.section03Label ?? 'MISSION TIMELINE'}</b>
          </div>

          <div className="timeline-table-grid">
            {missions.map((mission) => {
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
                        {resultsLocale?.optionBadge
                          ? resultsLocale.optionBadge(decision.optionId)
                          : `OPT ${decision.optionId}`}
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
                          {k === 'energy' ? '⚡' : k === 'life' ? '🫁' : k === 'supplies' ? '💧' : '🛡️'}{' '}
                          {val > 0 ? `+${val}` : val}
                        </span>
                      ))
                    ) : (
                      <span className="no-change-tag">
                        {resultsLocale?.noData ?? 'No data'}
                      </span>
                    )}
                  </div>

                  {/* Etiqueta de mejor o peor decisión */}
                  <div className="col-badge-eval">
                    {isBest && (
                      <span className="eval-badge best">
                        {resultsLocale?.bestDecision ?? '✔ BEST DECISION'}
                      </span>
                    )}
                    {isWorst && (
                      <span className="eval-badge worst">
                        {resultsLocale?.costliestDecision ?? '✘ HIGHEST COST'}
                      </span>
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
            <span className="strip-num">{resultsLocale?.section04Num ?? '04'}</span>
            <b className="strip-label">{resultsLocale?.section04Label ?? 'BASE STATUS'}</b>
          </div>

          <div className="mission-flags-grid">
            {/* 1. Comunicaciones */}
            <div className={`flag-card ${commsOk ? 'is-ok' : 'is-fail'}`}>
              <div className="flag-card-header">
                <span className="flag-icon">📡</span>
                <span className="flag-status-symbol">{commsOk ? '✔' : '✘'}</span>
              </div>
              <b className="flag-name">{resultsLocale?.flags?.comms?.title ?? 'COMMUNICATIONS'}</b>
              <span className="flag-desc">
                {commsOk
                  ? resultsLocale?.flags?.comms?.ok ?? 'UPLINK ACTIVE'
                  : resultsLocale?.flags?.comms?.fail ?? 'NO SIGNAL'}
              </span>
            </div>

            {/* 2. Zona de aterrizaje */}
            <div className={`flag-card ${landingOk ? 'is-ok' : 'is-fail'}`}>
              <div className="flag-card-header">
                <span className="flag-icon">🚨</span>
                <span className="flag-status-symbol">{landingOk ? '✔' : '✘'}</span>
              </div>
              <b className="flag-name">{resultsLocale?.flags?.landing?.title ?? 'LANDING ZONE'}</b>
              <span className="flag-desc">
                {landingOk
                  ? resultsLocale?.flags?.landing?.ok ?? 'BEACON GUIDED'
                  : resultsLocale?.flags?.landing?.fail ?? 'DARK RUNWAY'}
              </span>
            </div>

            {/* 3. Reparación de base */}
            <div className={`flag-card ${repairedOk ? 'is-ok' : 'is-fail'}`}>
              <div className="flag-card-header">
                <span className="flag-icon">🛠️</span>
                <span className="flag-status-symbol">{repairedOk ? '✔' : '✘'}</span>
              </div>
              <b className="flag-name">{resultsLocale?.flags?.repair?.title ?? 'BASE REPAIR'}</b>
              <span className="flag-desc">
                {repairedOk
                  ? resultsLocale?.flags?.repair?.ok ?? 'MODULE SEALED'
                  : resultsLocale?.flags?.repair?.fail ?? 'DAMAGE PENDING'}
              </span>
            </div>
          </div>
        </section>

        {/* =================================================================
            5. APRENDIZAJES: MÁXIMO 3 TARJETAS DE UNA FRASE CADA UNA
            ================================================================= */}
        <section className="result-section result-block-5">
          <div className="section-title-strip">
            <span className="strip-num">{resultsLocale?.section05Num ?? '05'}</span>
            <b className="strip-label">{resultsLocale?.section05Label ?? 'KEY LEARNINGS'}</b>
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
            title={resultsLocale?.playAgainTitle ?? 'Restart'}
          >
            <span>{resultsLocale?.playAgain ?? '↻ PLAY AGAIN'}</span>
          </button>

          <button
            className="big-pixel-btn btn-routes"
            onClick={() => {
              soundClick();
              setShowRoutesModal(true);
            }}
            onMouseEnter={soundHover}
            title={resultsLocale?.viewRoutesTitle ?? 'View paths'}
          >
            <span>{resultsLocale?.viewRoutes ?? '🗺️ VIEW OTHER PATHS'}</span>
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
            aria-label={resultsLocale?.modal?.title ?? 'Routes guide'}
          >
            <div className="modal-header-row">
              <span className="modal-badge">{resultsLocale?.modal?.badge ?? 'MANUAL S.T.A.R.'}</span>
              <h2 className="modal-title">{resultsLocale?.modal?.title ?? 'THE 4 ENDINGS'}</h2>
              <button
                className="pixel-btn-sm btn--danger"
                onClick={() => {
                  soundClick();
                  setShowRoutesModal(false);
                }}
                title={resultsLocale?.modal?.close ?? 'Close'}
              >
                ✖
              </button>
            </div>

            <div className="routes-list-grid">
              {/* Ruta A */}
              <div className="route-detail-card route--a">
                <div className="route-card-top">
                  <b className="route-name">{resultsLocale?.modal?.routeA?.name}</b>
                  <span className="route-req-tag">{resultsLocale?.modal?.routeA?.tag}</span>
                </div>
                <p className="route-text">{resultsLocale?.modal?.routeA?.desc}</p>
              </div>

              {/* Ruta B */}
              <div className="route-detail-card route--b">
                <div className="route-card-top">
                  <b className="route-name">{resultsLocale?.modal?.routeB?.name}</b>
                  <span className="route-req-tag">{resultsLocale?.modal?.routeB?.tag}</span>
                </div>
                <p className="route-text">{resultsLocale?.modal?.routeB?.desc}</p>
              </div>

              {/* Ruta C */}
              <div className="route-detail-card route--c">
                <div className="route-card-top">
                  <b className="route-name">{resultsLocale?.modal?.routeC?.name}</b>
                  <span className="route-req-tag">{resultsLocale?.modal?.routeC?.tag}</span>
                </div>
                <p className="route-text">{resultsLocale?.modal?.routeC?.desc}</p>
              </div>

              {/* Ruta D */}
              <div className="route-detail-card route--d">
                <div className="route-card-top">
                  <b className="route-name">{resultsLocale?.modal?.routeD?.name}</b>
                  <span className="route-req-tag">{resultsLocale?.modal?.routeD?.tag}</span>
                </div>
                <p className="route-text">{resultsLocale?.modal?.routeD?.desc}</p>
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
                <span>{resultsLocale?.modal?.close ?? '✖ CLOSE GUIDE'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
