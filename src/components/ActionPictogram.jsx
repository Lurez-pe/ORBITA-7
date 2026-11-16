import React from 'react';

// =========================================================================
// PICTOGRAMAS PIXEL ART GRANDES PARA ACCIONES Y HERRAMIENTAS
// - Representan ACCIÓN y HERRAMIENTA claramente en < 1 segundo
// - Animación por cuadros corta (2 a 3 frames) en hover
// - Estilo pixel art estricto (shape-rendering: crispEdges)
// =========================================================================

export function ActionPictogram({ missionId, optionId }) {
  // -----------------------------------------------------------------------
  // MISIÓN 1: PANELES SOLARES
  // -----------------------------------------------------------------------
  if (missionId === 1) {
    if (optionId === 'A') {
      // Opción A: Rover con cepillo rotativo
      return (
        <div className="pictogram-frame pict-rover-brush" title="Rover con cepillo">
          <svg viewBox="0 0 48 48" className="pixel-svg">
            {/* Chasis del Rover */}
            <rect x="6" y="22" width="26" height="12" fill="#ffd700" />
            <rect x="8" y="20" width="14" height="4" fill="#ffaa00" />
            <rect x="10" y="16" width="10" height="4" fill="#39e6d4" />
            {/* Ruedas pixel */}
            <rect x="6" y="32" width="8" height="6" fill="#1b203c" stroke="#000" strokeWidth="1" />
            <rect x="22" y="32" width="8" height="6" fill="#1b203c" stroke="#000" strokeWidth="1" />
            {/* Brazo robótico delantero */}
            <rect x="28" y="24" width="8" height="3" fill="#8892b0" />
            <rect x="34" y="20" width="3" height="8" fill="#bac0d8" />
            {/* Cepillo rotatorio (se anima en 3 cuadros con CSS al hover) */}
            <g className="brush-rotor-anim">
              <circle cx="38" cy="24" r="7" fill="#ff2244" />
              <rect x="37" y="15" width="2" height="18" fill="#ffffff" />
              <rect x="29" y="23" width="18" height="2" fill="#ffffff" />
              <circle cx="38" cy="24" r="3" fill="#000000" />
            </g>
          </svg>
        </div>
      );
    }

    if (optionId === 'B') {
      // Opción B: Astronauta con traje y rascador / herramienta EVA
      return (
        <div className="pictogram-frame pict-eva-scraper" title="Astronauta con traje y herramienta">
          <svg viewBox="0 0 48 48" className="pixel-svg">
            {/* Casco y visor dorado */}
            <rect x="18" y="6" width="14" height="12" fill="#eff0f7" />
            <rect x="20" y="9" width="10" height="6" fill="#ffd700" />
            {/* Traje espacial EVA blanco/naranja */}
            <rect x="14" y="18" width="20" height="16" fill="#ff7700" />
            <rect x="18" y="20" width="12" height="10" fill="#eff0f7" />
            {/* Piernas */}
            <rect x="16" y="34" width="6" height="8" fill="#1b203c" />
            <rect x="26" y="34" width="6" height="8" fill="#1b203c" />
            {/* Brazo con rascador (oscila en 3 frames al hover) */}
            <g className="scraper-arm-anim">
              <rect x="30" y="20" width="10" height="4" fill="#eff0f7" />
              <rect x="38" y="14" width="3" height="14" fill="#39e6d4" />
              <rect x="36" y="12" width="7" height="4" fill="#00ff66" />
            </g>
          </svg>
        </div>
      );
    }

    if (optionId === 'C') {
      // Opción C: Interruptor de palanca / Ahorro eléctrico
      return (
        <div className="pictogram-frame pict-switch-power" title="Interruptor de ahorro">
          <svg viewBox="0 0 48 48" className="pixel-svg">
            {/* Caja de control industrial */}
            <rect x="12" y="8" width="24" height="32" fill="#1e2648" stroke="#000" strokeWidth="2" />
            <rect x="16" y="12" width="16" height="24" fill="#0a0d1e" />
            {/* Riel central */}
            <rect x="22" y="14" width="4" height="20" fill="#3d4a78" />
            {/* Palanca de interruptor (baja en 2 frames y suelta chispa al hover) */}
            <g className="switch-lever-anim">
              <rect x="18" y="14" width="12" height="8" fill="#ff2244" />
              <rect x="20" y="16" width="8" height="4" fill="#ffffff" />
            </g>
            {/* Indicador LED de ahorro */}
            <circle cx="24" cy="38" r="2" fill="#00ff66" className="led-pulse-anim" />
          </svg>
        </div>
      );
    }
  }

  // -----------------------------------------------------------------------
  // MISIÓN 2: EXTRACTOR DE HIELO
  // -----------------------------------------------------------------------
  if (missionId === 2) {
    if (optionId === 'A') {
      // Calentador térmico con bobina incandescente
      return (
        <div className="pictogram-frame pict-heater" title="Calentador térmico">
          <svg viewBox="0 0 48 48" className="pixel-svg">
            <rect x="8" y="16" width="16" height="16" fill="#445588" />
            <rect x="22" y="22" width="10" height="4" fill="#bac0d8" />
            <g className="coil-glow-anim">
              <circle cx="34" cy="24" r="8" fill="#ff2244" />
              <circle cx="34" cy="24" r="4" fill="#ffd700" />
            </g>
          </svg>
        </div>
      );
    }
    if (optionId === 'B') {
      // Reciclaje de agua / filtro
      return (
        <div className="pictogram-frame pict-water-filter" title="Filtro de reciclaje">
          <svg viewBox="0 0 48 48" className="pixel-svg">
            <rect x="12" y="10" width="24" height="28" fill="#141830" stroke="#39e6d4" strokeWidth="2" />
            <g className="water-drop-anim">
              <polygon points="24,14 18,26 30,26" fill="#39e6d4" />
              <circle cx="24" cy="26" r="6" fill="#39e6d4" />
            </g>
          </svg>
        </div>
      );
    }
    return (
      // Aislamiento manual con llave / kit
      <div className="pictogram-frame pict-wrench-insulation" title="Aislar tubería">
        <svg viewBox="0 0 48 48" className="pixel-svg">
          <rect x="8" y="18" width="32" height="12" fill="#8892b0" stroke="#000" strokeWidth="2" />
          <g className="tool-tilt-anim">
            <rect x="18" y="8" width="6" height="24" fill="#ffd700" transform="rotate(25 24 24)" />
          </g>
        </svg>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // MISIÓN 3: RADIACIÓN SOLAR
  // -----------------------------------------------------------------------
  if (missionId === 3) {
    if (optionId === 'A') {
      // Refugio subterráneo / flecha hacia abajo
      return (
        <div className="pictogram-frame pict-shelter" title="Evacuar al refugio">
          <svg viewBox="0 0 48 48" className="pixel-svg">
            <polygon points="24,8 8,22 40,22" fill="#eff0f7" />
            <rect x="12" y="22" width="24" height="18" fill="#1b203c" />
            <g className="arrow-down-anim">
              <polygon points="24,34 18,26 30,26" fill="#ff2244" />
            </g>
          </svg>
        </div>
      );
    }
    if (optionId === 'B') {
      // Blindaje regolito
      return (
        <div className="pictogram-frame pict-regolith" title="Blindaje regolito">
          <svg viewBox="0 0 48 48" className="pixel-svg">
            <circle cx="24" cy="26" r="14" fill="#ff7700" />
            <g className="shield-layer-anim">
              <path d="M 10 26 Q 24 8 38 26" stroke="#8892b0" strokeWidth="5" fill="none" />
            </g>
          </svg>
        </div>
      );
    }
    return (
      // Monitoreo radar
      <div className="pictogram-frame pict-radar" title="Monitoreo">
        <svg viewBox="0 0 48 48" className="pixel-svg">
          <circle cx="24" cy="24" r="16" fill="#090b1a" stroke="#00ff66" strokeWidth="2" />
          <g className="radar-sweep-anim">
            <line x1="24" y1="24" x2="36" y2="12" stroke="#00ff66" strokeWidth="3" />
          </g>
        </svg>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // MISIÓN 4: FUGA DE OXÍGENO
  // -----------------------------------------------------------------------
  if (missionId === 4) {
    if (optionId === 'A') {
      // Parche sellador
      return (
        <div className="pictogram-frame pict-patch" title="Sellar fuga">
          <svg viewBox="0 0 48 48" className="pixel-svg">
            <rect x="10" y="18" width="28" height="12" fill="#445588" />
            <g className="weld-spark-anim">
              <rect x="20" y="14" width="8" height="20" fill="#ffd700" />
              <polygon points="24,8 26,12 22,12" fill="#ff2244" />
            </g>
          </svg>
        </div>
      );
    }
    if (optionId === 'B') {
      // Manómetro de presión
      return (
        <div className="pictogram-frame pict-pressure" title="Bajar presión">
          <svg viewBox="0 0 48 48" className="pixel-svg">
            <circle cx="24" cy="24" r="14" fill="#141830" stroke="#eff0f7" strokeWidth="2" />
            <g className="gauge-dial-anim">
              <line x1="24" y1="24" x2="16" y2="16" stroke="#ff2244" strokeWidth="3" />
            </g>
          </svg>
        </div>
      );
    }
    return (
      // Tanques auxiliares
      <div className="pictogram-frame pict-aux-tank" title="Tanque auxiliar">
        <svg viewBox="0 0 48 48" className="pixel-svg">
          <rect x="16" y="12" width="16" height="24" rx="4" fill="#39e6d4" />
          <rect x="20" y="8" width="8" height="4" fill="#eff0f7" />
          <g className="tank-pulse-anim">
            <rect x="22" y="16" width="4" height="16" fill="#ffffff" />
          </g>
        </svg>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // MISIÓN 5: GRIETA EN EL REFUGIO
  // -----------------------------------------------------------------------
  if (missionId === 5) {
    if (optionId === 'A') {
      // Resina epóxica
      return (
        <div className="pictogram-frame pict-epoxy" title="Sellado epóxico">
          <svg viewBox="0 0 48 48" className="pixel-svg">
            <rect x="12" y="12" width="24" height="24" fill="#1e2648" />
            <g className="epoxy-seal-anim">
              <path d="M 16 16 L 32 32 M 16 32 L 32 16" stroke="#00ff66" strokeWidth="4" />
            </g>
          </svg>
        </div>
      );
    }
    if (optionId === 'B') {
      // Compuerta hermética
      return (
        <div className="pictogram-frame pict-bulkhead" title="Aislar sector">
          <svg viewBox="0 0 48 48" className="pixel-svg">
            <rect x="10" y="10" width="28" height="28" fill="#3d4a78" />
            <g className="bulkhead-close-anim">
              <rect x="14" y="14" width="10" height="20" fill="#141830" />
              <rect x="24" y="14" width="10" height="20" fill="#141830" />
            </g>
          </svg>
        </div>
      );
    }
    return (
      // Placas de acero
      <div className="pictogram-frame pict-plates" title="Reforzar placas">
        <svg viewBox="0 0 48 48" className="pixel-svg">
          <rect x="8" y="12" width="32" height="24" fill="#8892b0" stroke="#000" strokeWidth="2" />
          <circle cx="12" cy="16" r="2" fill="#ffd700" />
          <circle cx="36" cy="16" r="2" fill="#ffd700" />
          <circle cx="12" cy="32" r="2" fill="#ffd700" />
          <circle cx="36" cy="32" r="2" fill="#ffd700" />
        </svg>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // MISIÓN 6: GUIADO DE NAVE
  // -----------------------------------------------------------------------
  if (missionId === 6) {
    if (optionId === 'A') {
      // Antena de radio
      return (
        <div className="pictogram-frame pict-antenna" title="Guiar por radio">
          <svg viewBox="0 0 48 48" className="pixel-svg">
            <line x1="24" y1="20" x2="24" y2="38" stroke="#eff0f7" strokeWidth="3" />
            <path d="M 12 20 Q 24 10 36 20" stroke="#ffd700" strokeWidth="3" fill="none" />
            <g className="radio-waves-anim">
              <path d="M 8 14 Q 24 2 40 14" stroke="#39e6d4" strokeWidth="2" fill="none" />
            </g>
          </svg>
        </div>
      );
    }
    if (optionId === 'B') {
      // Baliza óptica
      return (
        <div className="pictogram-frame pict-beacon" title="Baliza visual">
          <svg viewBox="0 0 48 48" className="pixel-svg">
            <rect x="18" y="24" width="12" height="16" fill="#1b203c" stroke="#ff2244" strokeWidth="2" />
            <circle cx="24" cy="20" r="5" fill="#ffd700" />
            <g className="beacon-beam-anim">
              <polygon points="24,20 12,4 36,4" fill="rgba(255, 230, 0, 0.7)" />
            </g>
          </svg>
        </div>
      );
    }
    return (
      // Guiado dual
      <div className="pictogram-frame pict-dual" title="Guiado dual">
        <svg viewBox="0 0 48 48" className="pixel-svg">
          <rect x="8" y="18" width="14" height="20" fill="#39e6d4" />
          <rect x="26" y="18" width="14" height="20" fill="#ffd700" />
          <g className="dual-sync-anim">
            <circle cx="24" cy="12" r="5" fill="#ff2244" />
          </g>
        </svg>
      </div>
    );
  }

  // Fallback genérico
  return (
    <div className="pictogram-frame">
      <span style={{ fontSize: '24px' }}>⚙️</span>
    </div>
  );
}
