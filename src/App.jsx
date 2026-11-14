import { useMemo, useState } from 'react';
import { missions, resourceMeta } from './data/missions.js';
import { continueAfterReport, chooseOption, freshGame, resourceStatus, startGame, useWellbeingProtocol } from './game/engine.js';
import { searchMarsMedia, searchPdsMarsData } from './services/nasa.js';

function ResourceGauge({ name, value }) {
  const meta = resourceMeta[name];
  return <div className={`resource resource--${meta.color}`}>
    <div className="resource__top"><span className="resource__icon">{meta.icon}</span><span>{meta.label}</span><b>{value}<small>%</small></b></div>
    <div className="resource__track"><span style={{ width: `${value}%` }} /></div>
    <div className="resource__status">{resourceStatus(value)}</div>
  </div>;
}

function StarBadge() { return <div className="star-badge" aria-label="S.T.A.R."><span>✦</span><b>S.T.A.R.</b><small>ASISTENTE</small></div>; }

function NasaEvidence({ query }) {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('idle');
  const [pds, setPds] = useState(null);
  const [pdsStatus, setPdsStatus] = useState('idle');
  async function loadImages() {
    setStatus('loading');
    try { setImages(await searchMarsMedia(query)); setStatus('ready'); }
    catch { setStatus('error'); }
  }
  async function loadPds() {
    setPdsStatus('loading');
    try { setPds(await searchPdsMarsData()); setPdsStatus('ready'); }
    catch { setPdsStatus('error'); }
  }
  const productCount = useMemo(() => {
    if (!pds) return 0;
    return pds.data?.length ?? pds.products?.length ?? pds.items?.length ?? 0;
  }, [pds]);
  return <section className="evidence" aria-label="Datos y fuentes de NASA">
    <div className="evidence__heading"><div><span className="eyebrow">ARCHIVO CIENTÍFICO</span><h3>Conexión NASA</h3></div><span className="live-dot">API</span></div>
    <p>Busca imágenes de Marte en NASA y metadatos del archivo PDS. Las mecánicas y barras son una simulación educativa.</p>
    <div className="evidence__actions">
      <button className="small-button" onClick={loadImages} disabled={status === 'loading'}>{status === 'loading' ? 'Buscando…' : 'Buscar imágenes NASA'}</button>
      <button className="small-button small-button--quiet" onClick={loadPds} disabled={pdsStatus === 'loading'}>{pdsStatus === 'loading' ? 'Consultando…' : 'Consultar archivo PDS'}</button>
    </div>
    {status === 'error' && <div className="api-message">No se pudo cargar la API ahora. <a href="https://images.nasa.gov/" target="_blank" rel="noreferrer">Abrir NASA Images</a></div>}
    {images.length > 0 && <div className="nasa-gallery">{images.slice(0, 3).map((img) => <a className="nasa-card" href={img.page} target="_blank" rel="noreferrer" key={img.id}>
      <img src={img.image} alt={img.title} loading="lazy"/><span>{img.center} · {img.date}</span><b>{img.title}</b>
    </a>)}</div>}
    {pdsStatus === 'error' && <div className="api-message">El servicio PDS no respondió desde este navegador. <a href="https://pds.nasa.gov/" target="_blank" rel="noreferrer">Explorar el archivo PDS</a></div>}
    {pdsStatus === 'ready' && <div className="api-message">Consulta PDS completada: {productCount} registros devueltos. <a href="https://pds.nasa.gov/" target="_blank" rel="noreferrer">Abrir PDS</a></div>}
  </section>;
}

function Intro({ onStart }) {
  return <main className="intro-screen">
    <div className="intro-backdrop" />
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">O7</span><span>AP EDUCATION<small>NASA SPACE APPS</small></span></a><span className="topbar__tag">SIMULADOR DE MISIÓN · VERSIÓN WEB</span></header>
    <section className="intro-hero" id="top">
      <div className="intro-copy"><span className="eyebrow"><i /> MISIÓN 2042 · BASE ALPHA-7</span><h1>72 horas<br/><em>para sobrevivir</em><br/>en Marte.</h1>
        <p>Una tormenta global pone en riesgo la base. Toma decisiones, protege a la tripulación y prepara la llegada de suministros.</p>
        <div className="intro-meta"><span><b>06</b> MISIONES</span><span><b>04</b> SISTEMAS</span><span><b>72</b> HORAS</span></div>
        <button className="primary-button" onClick={onStart}>Iniciar misión <span>↗</span></button>
        <small className="simulation-note">Los indicadores y efectos son valores de juego, no mediciones reales de Marte.</small>
      </div>
      <div className="intro-art"><img src="/assets/ORB_ESC_base_exterior_v01.jpg" alt="Base Alpha-7 sobre la superficie de Marte"/><div className="art-stamp"><b>ALPHA-7</b><span>HABITAT · SECTOR 03</span></div><div className="art-scan" /></div>
    </section>
    <section className="intro-lower"><div className="intro-lower__title"><span className="eyebrow">ANTES DEL PRIMER TURNO</span><h2>La misión te necesita.</h2></div><div className="brief-card"><StarBadge/><div><b>Hola, comandante.</b><p>La tormenta redujo la energía. Tenemos seis turnos para mantener la base en condiciones y recibir la nave. Tú eliges la estrategia; yo te explicaré sus consecuencias.</p><small>S.T.A.R. · asistente de operaciones</small></div></div><div className="intro-data"><span className="data-icon">⌁</span><b>Dato real, simulación clara.</b><p>La NASA ha observado cómo el polvo puede reducir la luz disponible para los paneles solares. Los porcentajes del juego son abstractos.</p><a href="https://www.nasa.gov/solar-system/the-fact-and-fiction-of-martian-dust-storms/" target="_blank" rel="noreferrer">Ver fuente NASA ↗</a></div></section>
    <footer className="page-footer"><span>ORBITA-7 // FLIGHT OPERATIONS</span><span>UN PROYECTO AP EDUCATION</span><span>01 / 06</span></footer>
  </main>;
}

function ResultScreen({ game, onRestart }) {
  const results = {
    success: { label: 'MISIÓN CUMPLIDA', title: 'La base está lista.', text: 'La tripulación llega al final con sistemas clave conservados, zona revisada y una señal disponible.' },
    partial: { label: 'MISIÓN CON DIFICULTADES', title: 'La base resistió.', text: 'La tripulación contuvo el daño y logró una señal o inspección. Algunas condiciones siguen pendientes.' },
    risk: { label: 'MISIÓN EN RIESGO', title: 'Queda trabajo por hacer.', text: 'La tripulación sobrevivió, pero faltan condiciones para recibir suministros con seguridad.' },
    failure: { label: 'SEÑAL PERDIDA', title: 'La base necesita apoyo.', text: 'Un sistema crítico llegó a cero. Revisa las decisiones y prueba otra estrategia.' },
  }[game.result] ?? { label: 'MISIÓN FINALIZADA', title: 'Buen trabajo, comandante.', text: 'Revisa qué decisiones prepararon la base para la llegada.' };
  return <main className="result-screen"><div className="result-orbit"/><header className="topbar"><a className="brand" href="#top"><span className="brand-mark">O7</span><span>AP EDUCATION<small>NASA SPACE APPS</small></span></a><span className="topbar__tag">INFORME DE MISIÓN · T + 72 H</span></header>
    <section className="result-panel"><div className="result-mark">{game.result === 'success' ? '✓' : '!'}</div><span className="eyebrow">{results.label}</span><h1>{results.title}</h1><p>{results.text}</p><div className="result-stats">{Object.entries(game.resources).map(([key,value]) => <div key={key}><span>{resourceMeta[key].label}</span><b>{value}<small>%</small></b></div>)}</div><div className="history"><span className="eyebrow">REGISTRO DE DECISIONES</span>{game.history.map((item) => <div key={item.missionId}><span>M{String(item.missionId).padStart(2,'0')}</span>{item.title}</div>)}</div><button className="primary-button" onClick={onRestart}>Jugar de nuevo <span>↻</span></button></section>
    <footer className="page-footer"><span>ORBITA-7 // FLIGHT OPERATIONS</span><span>LOS RESULTADOS DEPENDEN DE TUS DECISIONES</span><span>06 / 06</span></footer></main>;
}

export default function App() {
  const [game, setGame] = useState(freshGame);
  const mission = missions[game.turn] ?? missions[0];
  const selectedOption = mission.options.find((option) => option.id === game.report?.optionId);
  const totalDelta = game.reportChanges ?? {};

  if (game.phase === 'intro') return <Intro onStart={() => setGame(startGame())}/>;
  if (game.phase === 'result') return <ResultScreen game={game} onRestart={() => setGame(freshGame())}/>;

  function advance() {
    setGame((current) => continueAfterReport(current, missions.length));
  }
  return <main className="game-screen">
    <header className="game-topbar"><a className="brand" href="#top" onClick={(e) => e.preventDefault()}><span className="brand-mark">O7</span><span>ORBITA-7<small>FLIGHT OPERATIONS</small></span></a><div className="mission-clock"><span className="live-dot"/> MARS LOCAL TIME <b>{mission.time}</b></div><button className="exit-button" onClick={() => setGame(freshGame())}>Salir al inicio <span>↗</span></button></header>
    <section className="game-layout">
      <aside className="hud-column"><div className="hud-heading"><span className="eyebrow">ESTADO DE LA BASE</span><span className="hud-coord">ALPHA-7 · 18.4° N</span></div><div className="resource-list">{Object.entries(game.resources).map(([key, value]) => <ResourceGauge key={key} name={key} value={value}/>)}</div><button className="wellbeing-button" disabled={game.flags.wellbeingUsed} onClick={() => setGame((current) => useWellbeingProtocol(current))}>{game.flags.wellbeingUsed ? 'Protocolo de bienestar utilizado' : 'Activar bienestar · +10 ánimo'}</button><div className="hud-crew"><img src="/assets/ORB_PERS_TRIPULANTE_BASE_v01.jpg" alt="Tripulante de Base Alpha-7"/><div><b>Tripulación</b><span>4 integrantes · en misión</span></div><i>●</i></div><NasaEvidence query={`Mars ${mission.title} NASA`} /></aside>
      <section className="mission-column">
        <div className="mission-banner" style={{ backgroundImage: 'linear-gradient(90deg, rgba(12,14,34,.91), rgba(12,14,34,.18)), url(/assets/ORB_ESC_base_exterior_v01.jpg)' }}>
          <div><span className="eyebrow"><i/> TURNO {String(mission.id).padStart(2,'0')} / 06 <b>·</b> {mission.time}</span><h1>{mission.title}</h1><p>{mission.subtitle}</p></div><div className="mission-progress">{missions.map((item, i) => <span key={item.id} className={i < game.turn ? 'is-done' : i === game.turn ? 'is-active' : ''}/>)}</div>
        </div>
        <div className="briefing"><StarBadge/><div><span className="eyebrow">{game.phase === 'report' ? 'INFORME DE S.T.A.R.' : 'ALERTA DE MISIÓN'}</span><p>{game.phase === 'report' ? game.report.outcome : mission.alert}</p>{game.phase === 'report' && <small className="lesson-line">PRINCIPIO DE INGENIERÍA <b>·</b> {game.report.lesson}</small>}</div></div>
        {game.phase === 'play' && game.entryNotes?.map((note) => <p className="entry-note entry-note--play" key={note}>↳ {note}</p>)}
        {game.phase === 'play' ? <div className="decision-area"><div className="decision-header"><div><span className="eyebrow">TU DECISIÓN</span><h2>Elige una estrategia</h2></div><span className="decision-hint">Los efectos se aplican una vez</span></div><div className="choice-list">{mission.options.map((option) => {
          const reserveAvailable = option.needsReserve === 'water' ? game.flags.waterReserveAvailable : option.needsReserve === 'oxygen' ? game.flags.oxygenReserveAvailable : true;
          return <button className={`choice-card${reserveAvailable ? '' : ' choice-card--disabled'}`} key={option.id} disabled={!reserveAvailable} onClick={() => setGame((current) => chooseOption(current, mission, option))}>
          <span className="choice-key">{option.id}</span><span className="choice-text"><b>{option.title}</b><small>{reserveAvailable ? option.detail : 'Reserva agotada: esta opción ya no está disponible.'}</small></span><span className="choice-effects">{Object.entries(option.effects).map(([key, val]) => <i key={key} className={val >= 0 ? 'gain' : 'loss'}>{resourceMeta[key].short} {val > 0 ? '+' : ''}{val}</i>)}{option.teamwork && <i className="cost-note">−5 ENE* si ánimo &lt;60</i>}</span><span className="choice-arrow">↗</span>
        </button>})}</div><div className="mission-data"><span className="data-icon">⌁</span><div><span className="eyebrow">DATO PARA PENSAR</span><p>{mission.data}</p><a href={mission.sourceUrl} target="_blank" rel="noreferrer">{mission.sourceLabel} ↗</a></div><span className="data-tag">NASA</span></div></div> : <div className="report-area"><div className="report-title"><span className="eyebrow">CAMBIO EN LOS INDICADORES</span><span className="simulation-note">Balance de prototipo</span></div><div className="delta-list">{Object.entries(game.resources).map(([key, value]) => <div key={key} className="delta-item"><span>{resourceMeta[key].label}</span><b className={totalDelta[key] >= 0 ? 'gain' : 'loss'}>{totalDelta[key] > 0 ? '+' : ''}{totalDelta[key]}</b><small>{value}% ahora</small></div>)}</div>{game.report.teamworkCost > 0 && <p className="coord-note">Se aplicó coste de coordinación de 5 puntos de Energía porque el ánimo era menor a 60.</p>}{game.entryNotes?.map((note) => <p className="entry-note" key={note}>↳ {note}</p>)}<div className="report-footer"><span><b>CIERRE DEL TURNO</b> · Consumo común: −5 Energía / −5 Soporte vital</span><button className="primary-button" onClick={advance}>{game.turn === missions.length - 1 ? 'Ver resultado' : 'Continuar'} <span>→</span></button></div></div>}
        <div className="mission-footer"><span>SIMULACIÓN EDUCATIVA · LOS VALORES NO SON TELEMETRÍA REAL</span><span>FUENTES NASA EN CADA MISIÓN</span></div>
      </section>
    </section>
  </main>;
}
