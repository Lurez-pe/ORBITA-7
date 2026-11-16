import React from 'react';

// =========================================================================
// ILUSTRACIONES PIXEL ART DISTINTAS PARA CADA FINAL (A, B, C, D)
// - Sprites originales del equipo (nave, base, baliza, astronautas)
// - Estilo pixel art estricto (crispEdges, image-rendering: pixelated)
// =========================================================================

export function EndingIllustration({ endingType }) {
  if (endingType === 'finalA') {
    return (
      <div className="ending-art-box ending-art--finalA" title="Final A: Aterrizaje seguro">
        <img
          src="/assets/ORB_ESC_base_exterior_v01.jpg"
          alt="Base Alpha-7"
          className="ending-art-bg"
        />
        {/* Cielo despejado con sol y estrellas */}
        <div className="ending-sky-clear" />

        {/* Haz dorado de baliza activa */}
        <div className="ending-beacon-beam-gold" />
        <img
          src="/assets/ORB_OBJ_baliza_v01.png"
          alt="Baliza de pista"
          className="ending-beacon-obj"
        />

        {/* Nave de suministros posada con éxito */}
        <div className="ending-ship-landed">
          <img
            src="/assets/ORB_OBJ_nave_suministros_v01.png"
            alt="Nave de suministros"
            className="ending-ship-img"
          />
          <div className="landing-gear-pads" />
        </div>

        {/* Tripulación celebrando */}
        <div className="ending-crew-celebrating">
          <img
            src="/assets/ORB_PERS_tripulante_lider.webp"
            alt="Comandante"
            className="ending-crew-sprite"
          />
          <img
            src="/assets/ORB_PERS_tripulante_naranja.webp"
            alt="Especialista"
            className="ending-crew-sprite"
          />
        </div>

        {/* Destellos de éxito */}
        <div className="ending-glints-gold" />
      </div>
    );
  }

  if (endingType === 'finalB') {
    return (
      <div className="ending-art-box ending-art--finalB" title="Final B: Aterrizaje forzoso">
        <img
          src="/assets/ORB_ESC_base_exterior_v01.jpg"
          alt="Base Alpha-7"
          className="ending-art-bg"
        />
        {/* Polvo residual en cielo */}
        <div className="ending-sky-dusty" />

        {/* Baliza amarilla parpadeante */}
        <div className="ending-beacon-beam-yellow" />
        <img
          src="/assets/ORB_OBJ_baliza_v01.png"
          alt="Baliza de pista"
          className="ending-beacon-obj"
        />

        {/* Nave inclinada con polvo */}
        <div className="ending-ship-rough">
          <img
            src="/assets/ORB_OBJ_nave_suministros_v01.png"
            alt="Nave de suministros"
            className="ending-ship-img"
          />
          <div className="dust-puff-cloud" />
        </div>

        {/* Tripulante evaluando daños */}
        <div className="ending-crew-standing">
          <img
            src="/assets/ORB_PERS_tripulante_lider.webp"
            alt="Comandante"
            className="ending-crew-sprite"
          />
        </div>
      </div>
    );
  }

  if (endingType === 'finalC') {
    return (
      <div className="ending-art-box ending-art--finalC" title="Final C: Nave en órbita">
        {/* Espacio exterior oscuro con horizonte marciano */}
        <div className="ending-space-canvas">
          <div className="space-star-field" />
          <div className="mars-horizon-curve" />
        </div>

        {/* Nave en órbita alta */}
        <div className="ending-ship-in-orbit">
          <img
            src="/assets/ORB_OBJ_nave_suministros_v01.png"
            alt="Nave en órbita"
            className="ending-ship-orbit-img"
          />
          <div className="orbit-telemetry-loss-tag">SIN ENLACE</div>
        </div>

        {/* Base abajo a oscuras */}
        <div className="ending-ground-silhouette">
          <img
            src="/assets/ORB_OBJ_baliza_v01.png"
            alt="Baliza inactiva"
            className="ending-beacon-dark"
          />
        </div>
      </div>
    );
  }

  // Final D: Colapso de sistemas
  return (
    <div className="ending-art-box ending-art--finalD" title="Final D: Colapso de sistemas">
      <div className="ending-emergency-grid">
        <div className="emergency-red-flash-layer" />
        <div className="emergency-siren-center">
          <img
            src="/assets/orbita7_alerta_radiacion.png"
            alt="Alerta crítica"
            className="emergency-badge-img"
          />
          <span className="emergency-critical-tag">SISTEMA A CERO</span>
        </div>
      </div>
    </div>
  );
}
