// ORBITA-7: Game Design Data (Retro Pixel Art Edition)
// Textos reducidos al mínimo según especificaciones estrictas:
// - Título de misión: máx 4 palabras
// - Frase de S.T.A.R.: máx 12 palabras
// - Nombre de opción: máx 3 palabras
// - Lección de resumen: máx 15 palabras

export const initialResources = {
  energy: 80,    // var_energia: 80/100
  life: 80,      // var_soporte: 80/100
  supplies: 80,  // var_suministros: 80/100
  safety: 80,    // var_seguridad: 80/100
};

export const baseTurnConsumption = {
  energy: -5,    // Energía: -5 por turno
  life: -3,      // Soporte vital: -3 por turno
  supplies: -4,  // Agua y suministros: -4 por turno
  safety: 0,     // Seguridad: no baja automáticamente
};

export const resourceMeta = {
  es: {
    energy: { label: 'Energía', code: 'var_energia', short: 'ENE', icon: '⚡', image: '/assets/ORB_UI_energia.webp', color: 'energy' },
    life: { label: 'Soporte vital', code: 'var_soporte', short: 'SOP', icon: '🫁', image: '/assets/ORB_UI_soporte_vital.webp', color: 'life' },
    supplies: { label: 'Agua y suministros', code: 'var_suministros', short: 'AGU', icon: '💧', image: '/assets/ORB_UI_animo.webp', color: 'supplies' },
    safety: { label: 'Seguridad tripulación', code: 'var_seguridad', short: 'SEG', icon: '🛡️', image: '/assets/ORB_UI_proteccion.webp', color: 'safety' },
  },
  en: {
    energy: { label: 'Energy', code: 'var_energia', short: 'ENG', icon: '⚡', image: '/assets/ORB_UI_energia.webp', color: 'energy' },
    life: { label: 'Life Support', code: 'var_soporte', short: 'LIF', icon: '🫁', image: '/assets/ORB_UI_soporte_vital.webp', color: 'life' },
    supplies: { label: 'Water & Supplies', code: 'var_suministros', short: 'WAT', icon: '💧', image: '/assets/ORB_UI_animo.webp', color: 'supplies' },
    safety: { label: 'Crew Safety', code: 'var_seguridad', short: 'SAF', icon: '🛡️', image: '/assets/ORB_UI_proteccion.webp', color: 'safety' },
  },
};

export const TOTAL_GAME_HOURS = 72;

export const missionsData = {
  es: [
    {
      id: 1,
      turn: 1,
      time: 'HORA 00/72',
      title: 'Polvo en paneles solares', // 4 palabras
      alert: 'Tormenta activa. Polvo cubre paneles y la luz cae a nivel crítico.', // 11 palabras
      sceneBg: '/assets/ORB_ESC_base_exterior_v01.jpg',
      options: [
        {
          id: 'A',
          title: 'Limpiar con rover', // 3 palabras
          thumb: '/assets/ORB_OBJ_rover_lateral_v01.png',
          effects: { energy: -8 },
          flag: 'var_paneles_limpios',
          flagValue: 1,
          outcome: 'Paneles limpios con rover.',
          lesson: 'Limpiar paneles no elimina la tormenta de polvo en el cielo.', // 10 palabras
        },
        {
          id: 'B',
          title: 'Salida exterior EVA', // 3 palabras
          thumb: '/assets/ORB_PERS_tripulante_naranja.webp',
          effects: { life: -8, safety: -10 },
          flag: 'var_paneles_limpios',
          flagValue: 1,
          outcome: 'Paneles limpios con astronautas.',
          lesson: 'La limpieza manual consume oxígeno vital y fatiga a tripulantes.', // 9 palabras
        },
        {
          id: 'C',
          title: 'Modo de ahorro', // 3 palabras
          thumb: '/assets/ORB_UI_icono_energia_v01.jpg',
          effects: { energy: 5, safety: -5 },
          flag: 'var_modo_ahorro',
          flagValue: 1,
          outcome: 'Ahorro eléctrico activado.',
          lesson: 'Ahorrar energía asegura soporte vital pero paraliza investigaciones de base.', // 9 palabras
        },
      ],
    },
    {
      id: 2,
      turn: 2,
      time: 'HORA 12/72',
      title: 'Fallo extractor de hielo', // 4 palabras
      alert: 'Tubería congelada. Flujo de agua detenido y reservas en riesgo urgente.', // 10 palabras
      sceneBg: '/assets/ORB_ESC_invernadero_v01.webp',
      options: [
        {
          id: 'A',
          title: 'Calentar la tubería', // 3 palabras
          thumb: '/assets/ORB_OBJ_extractor_hielo_v01.png',
          effects: { energy: -12, supplies: 12 },
          flag: 'extractorRepaired',
          outcome: 'Tubería descongelada con calentador.',
          lesson: 'Descongelar con calor recupera agua pero gasta alta energía eléctrica.', // 9 palabras
        },
        {
          id: 'B',
          title: 'Reciclar agua existente', // 3 palabras
          thumb: '/assets/ORB_UI_soporte_vital.webp',
          effects: { energy: 4, supplies: -5 },
          flag: 'recyclingActive',
          outcome: 'Reciclaje hídrico en marcha.',
          lesson: 'El reciclaje estira reservas pero no genera agua nueva.', // 8 palabras
        },
        {
          id: 'C',
          title: 'Aislar tubería manualmente', // 3 palabras
          thumb: '/assets/ORB_OBJ_kit_reparacion_v01.png',
          effects: { supplies: 4, safety: -4 },
          flag: 'waterRationed',
          outcome: 'Aislamiento colocado por tripulantes.',
          lesson: 'Racionar agua protege reservas pero causa desgaste en tripulantes.', // 8 palabras
        },
      ],
    },
    {
      id: 3,
      turn: 3,
      time: 'HORA 24/72',
      title: 'Alerta de radiación solar', // 4 palabras
      alert: 'Tormenta solar detectada. Radiación en superficie en niveles altamente peligrosos.', // 9 palabras
      sceneBg: '/assets/ORB_ESC_refugio_v01.webp',
      options: [
        {
          id: 'A',
          title: 'Evacuar al refugio', // 3 palabras
          thumb: '/assets/ORB_ESC_refugio_v01.webp',
          effects: { life: 8, safety: -6 },
          flag: 'shelterActive',
          outcome: 'Tripulación protegida bajo tierra.',
          lesson: 'Refugiarse bajo tierra protege pero suspende actividades de superficie.', // 8 palabras
        },
        {
          id: 'B',
          title: 'Añadir blindaje regolito', // 3 palabras
          thumb: '/assets/ORB_UI_proteccion.webp',
          effects: { energy: -8, safety: 8 },
          flag: 'regolithShield',
          outcome: 'Regolito extra sobre cúpula.',
          lesson: 'El regolito absorbe radiación pero exige alto trabajo exterior.', // 8 palabras
        },
        {
          id: 'C',
          title: 'Continuar con monitoreo', // 3 palabras
          thumb: '/assets/orbita7_alerta_radiacion.png',
          effects: { energy: 4, life: -10 },
          flag: 'monitoringOnly',
          outcome: 'Monitoreo activo sin resguardo.',
          lesson: 'Ignorar la radiación ahorra tiempo pero daña la salud.', // 8 palabras
        },
      ],
    },
    {
      id: 4,
      turn: 4,
      time: 'HORA 36/72',
      title: 'Fuga de oxígeno', // 3 palabras
      alert: 'Fuga en conducto principal. Presión de oxígeno descendiendo rápidamente.', // 8 palabras
      sceneBg: '/assets/ORB_ESC_sala_control_v01.webp',
      options: [
        {
          id: 'A',
          title: 'Sellar fuga exterior', // 3 palabras
          thumb: '/assets/ORB_OBJ_modulo_oxigeno_v01.png',
          effects: { energy: -6, life: 10 },
          flag: 'var_reparacion_base',
          flagValue: 1,
          outcome: 'Conducto sellado con parche.',
          lesson: 'Sellar fugas recupera atmósfera pero consume energía de soporte.', // 8 palabras
        },
        {
          id: 'B',
          title: 'Reducir presión hábitat', // 3 palabras
          thumb: '/assets/ORB_UI_soporte_vital.webp',
          effects: { energy: 4, safety: -6 },
          flag: 'pressureLowered',
          outcome: 'Presión interna reducida.',
          lesson: 'Bajar presión ahorra gas pero dificulta respiración de tripulantes.', // 8 palabras
        },
        {
          id: 'C',
          title: 'Conectar tanques auxiliares', // 3 palabras
          thumb: '/assets/ORB_OBJ_kit_reparacion_v01.png',
          effects: { supplies: -6, life: 6 },
          flag: 'auxO2Active',
          outcome: 'Tanques de reserva en línea.',
          lesson: 'Tanques auxiliares compran tiempo mientras se repara la avería.', // 8 palabras
        },
      ],
    },
    {
      id: 5,
      turn: 5,
      time: 'HORA 48/72',
      title: 'Grieta en el refugio', // 4 palabras
      alert: 'Fisura estructural en refugio. Riesgo inminente de despresurización del hábitat.', // 9 palabras
      sceneBg: '/assets/ORB_ESC_refugio_v01.webp',
      options: [
        {
          id: 'A',
          title: 'Sellado epóxico rápido', // 3 palabras
          thumb: '/assets/ORB_OBJ_kit_reparacion_v01.png',
          effects: { supplies: -8, safety: 10 },
          flag: 'epoxySeal',
          outcome: 'Fisura sellada con resina.',
          lesson: 'El sellado químico repara grietas pero agota kits de emergencia.', // 9 palabras
        },
        {
          id: 'B',
          title: 'Aislar sector dañado', // 3 palabras
          thumb: '/assets/ORB_ESC_refugio_v01.webp',
          effects: { life: -6, safety: 6 },
          flag: 'bulkheadIsolated',
          outcome: 'Compuertas de sección cerradas.',
          lesson: 'Aislar compartimentos contiene daños pero reduce espacio habitable.', // 7 palabras
        },
        {
          id: 'C',
          title: 'Reforzar con placas', // 3 palabras
          thumb: '/assets/ORB_OBJ_modulo_oxigeno_v01.png',
          effects: { energy: -8, safety: 8 },
          flag: 'plateBracing',
          outcome: 'Placas metálicas soldadas.',
          lesson: 'Placas metálicas dan solidez pero exigen soldadura eléctrica.', // 7 palabras
        },
      ],
    },
    {
      id: 6,
      turn: 6,
      time: 'HORA 60/72',
      title: 'Guiado nave de suministros', // 4 palabras
      alert: 'Nave en aproximación final. Se requiere baliza activa para aterrizar.', // 10 palabras
      sceneBg: '/assets/ORB_ESC_base_exterior_v01.jpg',
      options: [
        {
          id: 'A',
          title: 'Guiar por radio', // 3 palabras
          thumb: '/assets/ORB_PERS_tripulante_antena.webp',
          effects: { energy: -10 },
          flag: 'var_comunicaciones',
          flagValue: 1,
          outcome: 'Enlace de telemetría fijado.',
          lesson: 'La telemetría por radio guía la trayectoria pero requiere antena activa.', // 10 palabras
        },
        {
          id: 'B',
          title: 'Encender baliza visual', // 3 palabras
          thumb: '/assets/ORB_OBJ_baliza_v01.png',
          effects: { energy: -8, safety: 8 },
          flag: 'var_zona_aterrizaje',
          flagValue: 1,
          outcome: 'Baliza óptica encendida.',
          lesson: 'La baliza óptica marca la pista pero consume energía.', // 8 palabras
        },
        {
          id: 'C',
          title: 'Guiado combinado doble', // 3 palabras
          thumb: '/assets/ORB_MAP_alpha7.webp',
          effects: { energy: -16, safety: 10 },
          flag: 'dualGuidance',
          flagValue: 1,
          outcome: 'Radio y baliza coordinadas.',
          lesson: 'El guiado dual asegura aterrizaje perfecto con máximo consumo.', // 8 palabras
        },
      ],
    },
  ],
  en: [
    {
      id: 1,
      turn: 1,
      time: 'HOUR 00/72',
      title: 'Dust on solar panels',
      alert: 'Active storm. Dust covers panels and electric power drops critically.',
      sceneBg: '/assets/ORB_ESC_base_exterior_v01.jpg',
      options: [
        {
          id: 'A',
          title: 'Clean with rover',
          thumb: '/assets/ORB_OBJ_rover_lateral_v01.png',
          effects: { energy: -8 },
          flag: 'var_paneles_limpios',
          flagValue: 1,
          outcome: 'Panels cleaned by rover.',
          lesson: 'Cleaning solar panels does not remove storm clouds from sky.',
        },
        {
          id: 'B',
          title: 'Crew EVA sortie',
          thumb: '/assets/ORB_PERS_tripulante_naranja.webp',
          effects: { life: -8, safety: -10 },
          flag: 'var_paneles_limpios',
          flagValue: 1,
          outcome: 'Panels cleaned by astronauts.',
          lesson: 'Manual cleaning uses vital oxygen and fatigues the crew.',
        },
        {
          id: 'C',
          title: 'Power saving mode',
          thumb: '/assets/ORB_UI_icono_energia_v01.jpg',
          effects: { energy: 5, safety: -5 },
          flag: 'var_modo_ahorro',
          flagValue: 1,
          outcome: 'Power saving active.',
          lesson: 'Saving power protects life support but halts surface research.',
        },
      ],
    },
    {
      id: 2,
      turn: 2,
      time: 'HOUR 12/72',
      title: 'Ice extractor failure',
      alert: 'Frozen conduit. Water flow halted and reserves at risk.',
      sceneBg: '/assets/ORB_ESC_invernadero_v01.webp',
      options: [
        {
          id: 'A',
          title: 'Heat the pipe',
          thumb: '/assets/ORB_OBJ_extractor_hielo_v01.png',
          effects: { energy: -12, supplies: 12 },
          flag: 'extractorRepaired',
          outcome: 'Pipe thawed by heaters.',
          lesson: 'Thawing conduits restores water but drains electric battery.',
        },
        {
          id: 'B',
          title: 'Recycle existing water',
          thumb: '/assets/ORB_UI_soporte_vital.webp',
          effects: { energy: 4, supplies: -5 },
          flag: 'recyclingActive',
          outcome: 'Water recycling active.',
          lesson: 'Recycling extends reserves but creates no new water.',
        },
        {
          id: 'C',
          title: 'Insulate pipe manually',
          thumb: '/assets/ORB_OBJ_kit_reparacion_v01.png',
          effects: { supplies: 4, safety: -4 },
          flag: 'waterRationed',
          outcome: 'Manual insulation applied.',
          lesson: 'Rationing water protects stores but exhausts human crew.',
        },
      ],
    },
    {
      id: 3,
      turn: 3,
      time: 'HOUR 24/72',
      title: 'Solar radiation alert',
      alert: 'Solar particle storm. Surface radiation levels dangerously high.',
      sceneBg: '/assets/ORB_ESC_refugio_v01.webp',
      options: [
        {
          id: 'A',
          title: 'Evacuate to shelter',
          thumb: '/assets/ORB_ESC_refugio_v01.webp',
          effects: { life: 8, safety: -6 },
          flag: 'shelterActive',
          outcome: 'Crew sheltered underground.',
          lesson: 'Underground shelters protect crew but halt surface work.',
        },
        {
          id: 'B',
          title: 'Add regolith shield',
          thumb: '/assets/ORB_UI_proteccion.webp',
          effects: { energy: -8, safety: 8 },
          flag: 'regolithShield',
          outcome: 'Regolith added over dome.',
          lesson: 'Regolith absorbs radiation but demands heavy physical labor.',
        },
        {
          id: 'C',
          title: 'Continue with monitoring',
          thumb: '/assets/orbita7_alerta_radiacion.png',
          effects: { energy: 4, life: -10 },
          flag: 'monitoringOnly',
          outcome: 'Surface monitoring active.',
          lesson: 'Ignoring radiation saves time but damages crew health.',
        },
      ],
    },
    {
      id: 4,
      turn: 4,
      time: 'HOUR 36/72',
      title: 'Oxygen leak alert',
      alert: 'Main line leak. Oxygen levels dropping fast.',
      sceneBg: '/assets/ORB_ESC_sala_control_v01.webp',
      options: [
        {
          id: 'A',
          title: 'Seal exterior leak',
          thumb: '/assets/ORB_OBJ_modulo_oxigeno_v01.png',
          effects: { energy: -6, life: 10 },
          flag: 'var_reparacion_base',
          flagValue: 1,
          outcome: 'Conduit sealed with patch.',
          lesson: 'Sealing leaks restores atmosphere but consumes support energy.',
        },
        {
          id: 'B',
          title: 'Lower habitat pressure',
          thumb: '/assets/ORB_UI_soporte_vital.webp',
          effects: { energy: 4, safety: -6 },
          flag: 'pressureLowered',
          outcome: 'Internal pressure reduced.',
          lesson: 'Lowering pressure saves gas but hampers crew breathing.',
        },
        {
          id: 'C',
          title: 'Connect auxiliary tanks',
          thumb: '/assets/ORB_OBJ_kit_reparacion_v01.png',
          effects: { supplies: -6, life: 6 },
          flag: 'auxO2Active',
          outcome: 'Backup tanks connected.',
          lesson: 'Backup tanks buy time while main repairs finish.',
        },
      ],
    },
    {
      id: 5,
      turn: 5,
      time: 'HOUR 48/72',
      title: 'Bunker structural crack',
      alert: 'Crack in shelter wall. Imminent depressurization threat.',
      sceneBg: '/assets/ORB_ESC_refugio_v01.webp',
      options: [
        {
          id: 'A',
          title: 'Quick epoxy seal',
          thumb: '/assets/ORB_OBJ_kit_reparacion_v01.png',
          effects: { supplies: -8, safety: 10 },
          flag: 'epoxySeal',
          outcome: 'Crack sealed with resin.',
          lesson: 'Chemical sealant patches cracks but uses emergency kits.',
        },
        {
          id: 'B',
          title: 'Isolate damaged bay',
          thumb: '/assets/ORB_ESC_refugio_v01.webp',
          effects: { life: -6, safety: 6 },
          flag: 'bulkheadIsolated',
          outcome: 'Bulkheads sealed shut.',
          lesson: 'Isolating bays contains danger but shrinks living space.',
        },
        {
          id: 'C',
          title: 'Brace with plates',
          thumb: '/assets/ORB_OBJ_modulo_oxigeno_v01.png',
          effects: { energy: -8, safety: 8 },
          flag: 'plateBracing',
          outcome: 'Steel plates welded on.',
          lesson: 'Metal plates provide strength but require heavy welding.',
        },
      ],
    },
    {
      id: 6,
      turn: 6,
      time: 'HOUR 60/72',
      title: 'Resupply ship guidance',
      alert: 'Ship on final approach. Active beacon needed to land.',
      sceneBg: '/assets/ORB_ESC_base_exterior_v01.jpg',
      options: [
        {
          id: 'A',
          title: 'Guide with radio',
          thumb: '/assets/ORB_PERS_tripulante_antena.webp',
          effects: { energy: -10 },
          flag: 'var_comunicaciones',
          flagValue: 1,
          outcome: 'Radio link locked in.',
          lesson: 'Radio telemetry guides descent path through dust clouds.',
        },
        {
          id: 'B',
          title: 'Light visual beacon',
          thumb: '/assets/ORB_OBJ_baliza_v01.png',
          effects: { energy: -8, safety: 8 },
          flag: 'var_zona_aterrizaje',
          flagValue: 1,
          outcome: 'Optical beacon glowing.',
          lesson: 'Optical beacons mark runway but consume battery power.',
        },
        {
          id: 'C',
          title: 'Dual guidance system',
          thumb: '/assets/ORB_MAP_alpha7.webp',
          effects: { energy: -16, safety: 10 },
          flag: 'dualGuidance',
          flagValue: 1,
          outcome: 'Radio and beacon synchronized.',
          lesson: 'Dual guidance ensures flawless landing with maximum cost.',
        },
      ],
    },
  ],
};

export const briefingScript = {
  es: {
    welcome: 'DIRECTOR DE OPERACIONES · BASE ALPHA-7',
    lines: [
      'Una tormenta de polvo regional azota Arcadia Planitia.',
      'Gestiona los 4 indicadores durante 6 turnos de 12 horas.',
      'Guía la nave de suministros para salvar la colonia marciana.',
    ],
    startButton: 'INICIAR MISIÓN',
  },
  en: {
    welcome: 'OPERATIONS DIRECTOR · BASE ALPHA-7',
    lines: [
      'A regional dust storm batters Arcadia Planitia.',
      'Balance all 4 indicators across 6 twelve-hour turns.',
      'Guide the resupply ship to save the Martian colony.',
    ],
    startButton: 'START MISSION',
  },
};

export const endingsData = {
  es: {
    finalA: {
      tag: 'FINAL A · ÉXITO TOTAL',
      title: 'Aterrizaje seguro',
      text: 'La nave de carga aterrizó en las coordenadas fijadas. La base está operativa y la colonia sobrevive.',
    },
    finalB: {
      tag: 'FINAL B · SUPERVIVENCIA LÍMITE',
      title: 'Aterrizaje forzoso',
      text: 'La nave tocó tierra pero con daños menores. La tripulación sobrevive con racionamiento.',
    },
    finalC: {
      tag: 'FINAL C · MISIÓN INCOMPLETA',
      title: 'Nave en órbita',
      text: 'Sin baliza ni comunicaciones, la nave no pudo descender y espera en órbita marciana.',
    },
    finalD: {
      tag: 'FINAL D · EVACUACIÓN DE EMERGENCIA',
      title: 'Colapso de sistemas',
      text: 'Uno de los indicadores vitales llegó a cero. Se activó el protocolo de emergencia de la base.',
    },
  },
  en: {
    finalA: {
      tag: 'ENDING A · FULL SUCCESS',
      title: 'Safe touchdown',
      text: 'The resupply vessel landed at planned coordinates. Base Alpha-7 remains fully operational.',
    },
    finalB: {
      tag: 'ENDING B · BARE SURVIVAL',
      title: 'Rough landing',
      text: 'The vessel touched down with minor hull damage. Crew survives under strict rationing.',
    },
    finalC: {
      tag: 'ENDING C · INCOMPLETE MISSION',
      title: 'Vessel in orbit',
      text: 'Without beacon or comms lock, the vessel stays in parking orbit awaiting clearance.',
    },
    finalD: {
      tag: 'ENDING D · EMERGENCY COLLAPSE',
      title: 'Critical systems failure',
      text: 'A vital indicator reached zero. The colony emergency evacuation protocol was triggered.',
    },
  },
};
