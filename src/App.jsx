import { useMemo, useState } from 'react';
import { missions, nasaSources, resourceMeta } from './data/missions.js';
import {
  chooseOption,
  continueAfterReport,
  freshGame,
  resourceStatus,
  startGame,
  useWellbeingProtocol,
} from './game/engine.js';
import { searchMarsMedia, searchPdsMarsData } from './services/nasa.js';

function ResourceGauge({ name, value }) {
  const meta = resourceMeta[name];
  return (
    <div className={`resource resource--${meta.color}`} aria-label={`${meta.label}: ${value} por ciento`}>
      <div className="resource__top">
        <span className="resource__icon"><img src={meta.image} alt="" /></span>
        <span>{meta.label}</span>
        <b>{value}<small>%</small></b>
      </div>
      <div className="resource__track"><span style={{ width: `${value}%` }} /></div>
      <div className="resource__status">{resourceStatus(value)}</div>
    </div>
  );
}

function StarBadge() {
  return <div className="star-badge" aria-label="S.T.A.R., asistente de operaciones">
    <span>✦</span><b>S.T.A.R.</b><small>ASISTENTE</small>
  </div>;
}

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

  const productCount = useMemo(() => (
    pds?.data?.length ?? pds?.products?.length ?? pds?.items?.length ?? 0
  ), [pds]);

  return <section className="evidence" aria-label="Archivo científico NASA">
    <div className="evidence__heading">
      <div><span className="eyebrow">CENTRO DE INVESTIGACIÓN</span><h3>Archivo científico NASA</h3></div>
      <span className="live-dot">API</span>
    </div>
    <p>Consulta imágenes de Marte y metadatos del archivo PDS. Los indicadores de la misión son una simulación educativa.</p>
    <div className="evidence__actions">
      <button className="small-button" onClick={loadImages} disabled={status === 'loading'}>
        {status === 'loading' ? 'Buscando…' : 'Buscar imágenes NASA'}
      </button>
      <button className="small-button small-button--quiet" onClick={loadPds} disabled={pdsStatus === 'loading'}>
        {pdsStatus === 'loading' ? 'Consultando…' : 'Consultar catálogo PDS'}
      </button>
    </div>
    {status === 'error' && <div className="api-message">No hubo conexión. <a href="https://images.nasa.gov/" target="_blank" rel="noreferrer">Abrir NASA Images</a></div>}
    {images.length > 0 && <div className="nasa-gallery">{images.slice(0, 3).map((img) => (
      <a className="nasa-card" href={img.page} target="_blank" rel="noreferrer" key={img.id}>
        <img src={img.image} alt={img.title} loading="lazy" />
        <span>{img.center} · {img.date}</span><b>{img.title}</b>
      </a>
    ))}</div>}
    {pdsStatus === 'error' && <div className="api-message">PDS no respondió desde este navegador. <a href="https://pds.nasa.gov/" target="_blank" rel="noreferrer">Explorar PDS</a></div>}
    {pdsStatus === 'ready' && <div className="api-message">El catálogo devolvió {productCount} registros. <a href="https://pds.nasa.gov/" target="_blank" rel="noreferrer">Abrir PDS</a></div>}
  </section>;
}

function Intro({ onStart, motionReduced, onToggleMotion }) {
  const [menuPanel, setMenuPanel] = useState(null);
  return <main className={`intro-screen${motionReduced ? ' is-motion-reduced' : ''}`}>
    <div className="intro-backdrop" />
    <header className="topbar">
      <a className="brand" href="#top"><span className="brand-mark">O7</span><span>AP EDUCATION<small>NASA SPACE APPS</small></span></a>
      <span className="topbar__tag">MISIÓN INTERACTIVA · VERSIÓN WEB</span>
    </header>
    <section className="intro-hero" id="top">
      <div className="intro-copy">
        <span className="eyebrow"><i /> MISIÓN 2042 · BASE ALPHA-7</span>
        <h1>72 horas<br /><em>para sobrevivir</em><br />en Marte.</h1>
        <p>Una tormenta global pone en riesgo la base. Toma decisiones, protege a la tripulación y prepara la llegada de suministros.</p>
        <div className="intro-meta"><span><b>06</b> MISIONES</span><span><b>04</b> SISTEMAS</span><span><b>72</b> HORAS</span></div>
        <button className="primary-button" onClick={onStart}>Entrar en la base <span>↗</span></button>
        <small className="simulation-note">Los indicadores y efectos son valores de juego, no mediciones reales de Marte.</small>
      </div>
      <div className="intro-art intro-art--menu">
        <img src="/assets/orbita7_menu_inicio.png" alt="Arte del menú de ORBITA-7 con controles pixel art" />
        <div className="menu-hotspots">
          <button className="menu-hotspot menu-hotspot--start" aria-label="Iniciar misión" title="Iniciar misión" onClick={onStart}><span>INICIAR</span></button>
          <button className="menu-hotspot menu-hotspot--settings" aria-label="Abrir ajustes" title="Ajustes" onClick={() => setMenuPanel('settings')}><span>AJUSTES</span></button>
          <button className="menu-hotspot menu-hotspot--credits" aria-label="Ver fuentes científicas" title="Fuentes NASA" onClick={() => setMenuPanel('credits')}><span>FUENTES</span></button>
        </div>
        <div className="art-scan" />
      </div>
    </section>
    <section className="intro-lower">
      <div className="intro-lower__title"><span className="eyebrow">REPORTE DE SITUACIÓN</span><h2>La misión te necesita.</h2></div>
      <div className="brief-card"><StarBadge /><div><b>Hola, comandante.</b><p>La tormenta redujo la energía. Tenemos seis turnos para mantener la base y preparar la llegada de la nave.</p><small>S.T.A.R. · asistente de operaciones</small></div></div>
      <div className="intro-data"><span className="data-icon">⌁</span><b>Dato real, simulación clara.</b><p>El polvo puede reducir la luz solar disponible para los paneles.</p><a href="https://www.nasa.gov/solar-system/the-fact-and-fiction-of-martian-dust-storms/" target="_blank" rel="noreferrer">Ver fuente NASA ↗</a></div>
    </section>
    <footer className="page-footer"><span>ORBITA-7 // FLIGHT OPERATIONS</span><span>UN PROYECTO AP EDUCATION</span><span>01 / 06</span></footer>
    {menuPanel && <div className="menu-overlay" role="presentation" onClick={() => setMenuPanel(null)}>
      <section className={`menu-modal menu-modal--${menuPanel}`} role="dialog" aria-modal="true" aria-labelledby="menu-modal-title" onClick={(event) => event.stopPropagation()}>
        {menuPanel === 'settings' ? <>
          <img className="menu-modal__art" src="/assets/orbita7_ajustes.png" alt="" />
          <div className="menu-modal__content"><span className="eyebrow">PREFERENCIAS DE JUEGO</span><h2 id="menu-modal-title">Ajustes de misión</h2>
            <button className="settings-toggle" onClick={onToggleMotion}><span className={motionReduced ? 'toggle-dot is-off' : 'toggle-dot'} />{motionReduced ? 'Animaciones reducidas' : 'Animaciones activas'}</button>
            <p>Respeta también la preferencia de movimiento de tu dispositivo.</p><button className="primary-button" onClick={() => setMenuPanel(null)}>Volver al menú <span>↩</span></button>
          </div>
        </> : <>
          <img className="menu-modal__art menu-modal__art--credits" src="/assets/orbita7_alerta_radiacion.png" alt="" />
          <div className="menu-modal__content"><span className="eyebrow">CIENCIA Y ATRIBUCIÓN</span><h2 id="menu-modal-title">Fuentes NASA</h2>
            <ul className="source-list">{nasaSources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a></li>)}</ul>
            <button className="primary-button" onClick={() => setMenuPanel(null)}>Volver al menú <span>↩</span></button>
          </div>
        </>}
      </section>
    </div>}
  </main>;
}

function Scene({ mission, game, effect }) {
  const dustCount = 18;
  const sceneAssets = {
    1: { background: '/assets/ORB_ESC_base_exterior_v01.jpg', prop: '/assets/ORB_OBJ_panel_solar_v01.png', propAlt: 'Panel solar' },
    2: { background: '/assets/ORB_ESC_invernadero_v01.webp', prop: '/assets/ORB_OBJ_extractor_hielo_v01.png', propAlt: 'Extractor de hielo' },
    3: { background: '/assets/ORB_ESC_refugio_v01.webp', prop: '/assets/ORB_OBJ_kit_reparacion_v01.png', propAlt: 'Equipo de reparación' },
    4: { background: '/assets/ORB_ESC_sala_control_v01.webp', prop: '/assets/ORB_OBJ_modulo_oxigeno_v01.png', propAlt: 'Módulo de oxígeno' },
    5: { background: '/assets/ORB_ESC_base_exterior_v01.jpg', prop: '/assets/ORB_OBJ_kit_reparacion_v01.png', propAlt: 'Kit de reparación' },
    6: { background: '/assets/ORB_ESC_sala_control_v01.webp', prop: null, propAlt: '' },
  }[mission.id];
  const interior = [2, 3, 4, 6].includes(mission.id);
  const alertImage = mission.id === 1
    ? '/assets/orbita7_alerta_tormenta_de_polvo_v3.png'
    : mission.id === 3 ? '/assets/orbita7_alerta_radiacion.png' : null;
  const beaconActive = effect === 'beacon' || game.flags.beacon;
  return <div className={`playfield playfield--mission-${mission.id}${interior ? ' playfield--interior' : ''}`}>
    <img className="playfield__landscape" src={sceneAssets.background} alt="" aria-hidden="true" />
    <div className="playfield__vignette" />
    <div className="playfield__stars" aria-hidden="true" />
    <div className="playfield__planet" aria-hidden="true" />
    <div className="playfield__dust" aria-hidden="true">
      {Array.from({ length: dustCount }, (_, i) => <i key={i} style={{ '--dust-index': i, '--dust-left': `${(i * 41) % 100}%` }} />)}
    </div>
    <div className="playfield__horizon" aria-hidden="true" />
    <div className="playfield__base-light" aria-hidden="true"><i /><i /><i /></div>
    {sceneAssets.prop && <img className={`scene-prop scene-prop--${mission.id}`} src={sceneAssets.prop} alt={sceneAssets.propAlt} />}
    <img className="scene-rover" src="/assets/ORB_OBJ_rover_lateral_v01.png" alt="Rover de la base" />
    <div className="scene-crew">
      <div className="scene-crew__sprites"><img src="/assets/ORB_PERS_tripulante_naranja.webp" alt="Tripulante con parche naranja" /><img src="/assets/ORB_PERS_tripulante_antena.webp" alt="Tripulante con antena" /></div>
      <span>TRIPULACIÓN · 4</span>
    </div>
    {mission.id === 6 && <div className="scene-map"><img src="/assets/ORB_MAP_alpha7.webp" alt="Mapa cenital de la base Alpha-7" /><span>MAPA DE ZONA · ALPHA-7</span><i /></div>}
    {mission.id === 6 && <img className={`scene-beacon${beaconActive ? ' scene-beacon--active' : ''}`} src="/assets/ORB_OBJ_baliza_v01.png" alt="Baliza de emergencia" />}
    <img className={`scene-supply-ship${mission.id === 6 ? ' scene-supply-ship--visible' : ''}`} src="/assets/ORB_OBJ_nave_suministros_v01.png" alt={mission.id === 6 ? 'Nave de suministros en aproximación' : ''} aria-hidden={mission.id !== 6} />
    <div className="playfield__warning" aria-hidden="true">PÉRDIDA DE PRESIÓN</div>
    {alertImage && <div className="mission-alert-emblem" style={{ backgroundImage: `url(${alertImage})` }} aria-hidden="true" />}
    <div className="playfield__title">
      <div className="mission-tag"><i /> TURNO {String(mission.id).padStart(2, '0')} / 06 <b>·</b> {mission.time}</div>
      <h1>{mission.title}</h1><p>{mission.subtitle}</p>
    </div>
    <div className="playfield__corner">ALPHA-7 <span>·</span> 18.4° N</div>
    <div className="mission-progress" aria-label={`Misión ${mission.id} de 6`}>
      {missions.map((item, i) => <i key={item.id} className={i < game.turn ? 'is-done' : i === game.turn ? 'is-active' : ''} />)}
    </div>
  </div>;
}

function ResultScreen({ game, onRestart }) {
  const results = {
    success: { label: 'MISIÓN CUMPLIDA', title: 'La base está lista.', text: 'La tripulación llega al final con sistemas clave conservados, zona revisada y una señal disponible.' },
    partial: { label: 'MISIÓN CON DIFICULTADES', title: 'La base resistió.', text: 'La tripulación contuvo el daño y logró una señal o inspección. Algunas condiciones siguen pendientes.' },
    risk: { label: 'MISIÓN EN RIESGO', title: 'Queda trabajo por hacer.', text: 'La tripulación sobrevivió, pero faltan condiciones para recibir suministros con seguridad.' },
    failure: { label: 'SEÑAL PERDIDA', title: 'La base necesita apoyo.', text: 'Un sistema crítico llegó a cero. Revisa las decisiones y prueba otra estrategia.' },
  }[game.result] ?? { label: 'MISIÓN FINALIZADA', title: 'Buen trabajo, comandante.', text: 'Revisa qué decisiones prepararon la base para la llegada.' };
  return <main className="result-screen">
    <div className="result-orbit" /><header className="topbar"><a className="brand" href="#top"><span className="brand-mark">O7</span><span>AP EDUCATION<small>NASA SPACE APPS</small></span></a><span className="topbar__tag">INFORME DE MISIÓN · T + 72 H</span></header>
    <section className="result-panel"><div className="result-mark">{game.result === 'success' ? '✓' : '!'}</div><span className="eyebrow">{results.label}</span><h1>{results.title}</h1><p>{results.text}</p>
      <div className="result-stats">{Object.entries(game.resources).map(([key, value]) => <div key={key}><span>{resourceMeta[key].label}</span><b>{value}<small>%</small></b></div>)}</div>
      <div className="history"><span className="eyebrow">REGISTRO DE DECISIONES</span>{game.history.map((item) => <div key={item.missionId}><span>M{String(item.missionId).padStart(2, '0')}</span>{item.title}</div>)}</div>
      <button className="primary-button" onClick={onRestart}>Volver a jugar <span>↻</span></button>
    </section>
    <footer className="page-footer"><span>ORBITA-7 // FLIGHT OPERATIONS</span><span>LOS RESULTADOS DEPENDEN DE TUS DECISIONES</span><span>06 / 06</span></footer>
  </main>;
}

function PauseOverlay({ onResume, onMenu, motionReduced, onToggleMotion }) {
  return <div className="pause-overlay" role="presentation">
    <section className="pause-console" role="dialog" aria-modal="true" aria-labelledby="pause-title">
      <img className="pause-console__art" src="/assets/orbita7_ajustes.png" alt="" />
      <div className="pause-console__controls">
        <span className="eyebrow">SISTEMAS EN ESPERA</span><h2 id="pause-title">Misión en pausa</h2>
        <button className="settings-toggle" onClick={onToggleMotion}><span className={motionReduced ? 'toggle-dot is-off' : 'toggle-dot'} />{motionReduced ? 'Animaciones reducidas' : 'Animaciones activas'}</button>
        <button className="primary-button" onClick={onResume}>Reanudar misión <span>▶</span></button>
        <button className="pause-menu-button" onClick={onMenu}>Salir al menú principal</button>
      </div>
    </section>
  </div>;
}

export default function App() {
  const [game, setGame] = useState(freshGame);
  const [paused, setPaused] = useState(false);
  const [motionReduced, setMotionReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  const mission = missions[game.turn] ?? missions[0];
  const selectedOption = mission.options.find((option) => option.id === game.report?.optionId);
  const totalDelta = game.reportChanges ?? {};

  const toggleMotion = () => setMotionReduced((current) => !current);
  if (game.phase === 'intro') return <Intro motionReduced={motionReduced} onToggleMotion={toggleMotion} onStart={() => { setPaused(false); setGame(startGame()); }} />;
  if (game.phase === 'result') return <ResultScreen game={game} onRestart={() => setGame(freshGame())} />;

  function advance() { setGame((current) => continueAfterReport(current, missions.length)); }

  return <main className={`game-screen${motionReduced ? ' is-motion-reduced' : ''}${paused ? ' is-paused' : ''}`}>
    <header className="game-topbar">
      <a className="brand" href="#top" onClick={(event) => event.preventDefault()}><span className="brand-mark">O7</span><span>ORBITA-7<small>FLIGHT OPERATIONS</small></span></a>
      <div className="mission-clock"><span className="live-dot" /> TIEMPO MARCIANO <b>{mission.time}</b></div>
      <button className="exit-button" onClick={() => setPaused(true)}>Pausar misión <span>Ⅱ</span></button>
    </header>

    <section className="game-shell">
      <div className="command-rail">
        <div className="command-rail__label"><span className="eyebrow">ESTADO DE LA BASE</span><span className="signal-status"><i /> SISTEMAS ACTIVOS</span></div>
        <div className="resource-ribbon">{Object.entries(game.resources).map(([key, value]) => <ResourceGauge key={key} name={key} value={value} />)}</div>
        <button className="wellbeing-button" disabled={game.flags.wellbeingUsed} onClick={() => setGame((current) => useWellbeingProtocol(current))}>
          <span>✦</span>{game.flags.wellbeingUsed ? 'Protocolo usado' : 'Bienestar +10'}
        </button>
      </div>

      <section className={`mission-column mission-column--${game.phase}`} data-effect={selectedOption?.flag ?? ''}>
        <div className="game-stage" key={mission.id}>
          <Scene mission={mission} game={game} effect={selectedOption?.flag} />
          <section className={`dialogue-dock dialogue-dock--${game.phase}`}>
            <div className="dialogue-dock__speaker"><StarBadge /><span className="eyebrow">{game.phase === 'report' ? 'REPORTE DE OPERACIONES' : 'CANAL DE MISIÓN · S.T.A.R.'}</span></div>
            {game.phase === 'play' ? <>
              <p className="dialogue-dock__line">{mission.alert}</p>
              <div className="choice-list">{mission.options.map((option) => {
                const reserveAvailable = option.needsReserve === 'water' ? game.flags.waterReserveAvailable : option.needsReserve === 'oxygen' ? game.flags.oxygenReserveAvailable : true;
                return <button className={`choice-card${reserveAvailable ? '' : ' choice-card--disabled'}`} key={option.id} disabled={!reserveAvailable} onClick={() => setGame((current) => chooseOption(current, mission, option))}>
                  <span className="choice-key">{option.id}</span>
                  <span className="choice-text"><b>{option.title}</b><small>{reserveAvailable ? option.detail : 'Reserva agotada'}</small></span>
                  <span className="choice-effects">{Object.entries(option.effects).map(([key, value]) => <i key={key} className={value >= 0 ? 'gain' : 'loss'}>{resourceMeta[key].short} {value > 0 ? '+' : ''}{value}</i>)}{option.teamwork && <i className="cost-note">−5 ENE* si ánimo &lt;60</i>}</span>
                  <span className="choice-arrow">↗</span>
                </button>;
              })}</div>
              {game.entryNotes?.map((note) => <p className="entry-note" key={note}>↳ {note}</p>)}
            </> : <>
              <p className="dialogue-dock__line">{game.report.outcome}</p>
              <p className="dialogue-dock__lesson"><span>LECCIÓN DE LA MISIÓN</span>{game.report.lesson}</p>
              <div className="report-strip">
                {Object.entries(game.resources).map(([key, value]) => <div key={key} className="report-chip"><span>{resourceMeta[key].short}</span><b className={totalDelta[key] >= 0 ? 'gain' : 'loss'}>{totalDelta[key] > 0 ? '+' : ''}{totalDelta[key]}</b><small>{value}%</small></div>)}
                {game.report.teamworkCost > 0 && <span className="report-note">−5 Energía por coordinación</span>}
              </div>
              <div className="dialogue-dock__footer"><span>AL CERRAR: −5 ENERGÍA · −5 SOPORTE VITAL</span><button className="primary-button" onClick={advance}>{game.turn === missions.length - 1 ? 'Ver resultado' : 'Continuar · +12 h'} <span>→</span></button></div>
            </>}
          </section>
          {game.phase === 'report' && <div className="action-confirmation"><i /> DECISIÓN REGISTRADA</div>}
        </div>
        <details className="nasa-drawer">
          <summary><span>⌁</span> Archivo de investigación NASA <small>NASA Images · PDS</small></summary>
          <div className="nasa-drawer__body"><p className="mission-fact">{mission.data} <a href={mission.sourceUrl} target="_blank" rel="noreferrer">{mission.sourceLabel} ↗</a></p><NasaEvidence query={`Mars ${mission.title} NASA`} /></div>
        </details>
        <footer className="mission-footer"><span>SIMULACIÓN EDUCATIVA · SIN TELEMETRÍA EN VIVO</span><span>ORBITA-7 // ALPHA-7</span></footer>
      </section>
    </section>
    {paused && <PauseOverlay onResume={() => setPaused(false)} onMenu={() => { setPaused(false); setGame(freshGame()); }} motionReduced={motionReduced} onToggleMotion={toggleMotion} />}
  </main>;
}
