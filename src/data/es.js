// ORBITA-7: Paquete de idioma español (Segundo idioma)
// Conserva "ORBITA-7" y "S.T.A.R." sin traducir.
// Textos cortos, directos y naturales en estilo retro sci-fi.

export const es = {
  // Pantalla de Inicio (Diseño limpio de 3 botones)
  startScreen: {
    title: 'ORBITA-7',
    tagline: '72 horas para sobrevivir en Marte',
    play: 'JUGAR',
    playTitle: 'Iniciar introducción y misión',
    langAria: 'Cambiar idioma: Español o Inglés',
    soundOn: 'SONIDO',
    soundOff: 'SILENCIO',
    soundTitle: 'Activar o silenciar sonido',
  },

  // 1. Briefing / Pantalla de introducción
  briefing: {
    eyebrow: 'MARTE, 2042 · BASE ALPHA-7',
    headline: '72 HORAS\nPARA SOBREVIVIR\nEN MARTE',
    description: 'Tormenta planetaria en curso. Gestiona los 4 indicadores durante 6 turnos de 12 horas y guía la nave de suministros.',
    turnsCount: '06',
    turnsLabel: 'TURNOS',
    systemsCount: '04',
    systemsLabel: 'SISTEMAS',
    hoursCount: '72',
    hoursLabel: 'HORAS',
    startButton: 'INICIAR MISIÓN',
    watchIntroButton: '🎬 VER INTRO',
  },

  // Menú Interactivo de la Consola (Pantalla de Inicio)
  menu: {
    play: '▶ JUGAR',
    playTitle: 'Iniciar Misión (Jugar)',
    sound: 'SONIDO',
    soundOn: '🔊 ON',
    soundOff: '🔇 OFF',
    soundTitle: 'Activar o silenciar sonido',
    lang: 'IDIOMA',
    langTitle: 'Cambiar idioma (EN | ES)',
    consoleStatus: 'BASE ALPHA-7 // CONSOLA ACTIVA',
    systemReady: 'SISTEMAS NOMINALES',
    marsStormAlert: 'TORMENTA EN APROXIMACIÓN',
  },

  // 1.1 Introducción Cinemática (5 escenas, máx 10 palabras por frase, máquina de escribir)
  cinematicIntro: {
    starTag: 'S.T.A.R. // DIRECTIVA DE BRIEFING',
    skip: 'SALTAR',
    skipTitle: 'Saltar introducción',
    startMission: 'INICIAR MISIÓN',
    watchIntro: 'VER INTRODUCCIÓN',
    watchIntroTitle: 'Ver briefing cinemático de 5 escenas',
    backToMenu: 'VOLVER AL MENÚ',
    replayIntro: 'REPETIR INTRO',
    sceneProgress: (current, total) => `Escena ${current} de ${total}`,
    scenes: [
      {
        id: 1,
        title: 'BASE ALPHA-7',
        text: 'Marte, 2042. Base Alpha-7. Cuatro tripulantes.',
        sub: 'Puesto avanzado Arcadia Planitia',
        sound: 'wind',
      },
      {
        id: 2,
        title: 'TORMENTA PLANETARIA',
        text: 'Una tormenta planetaria de polvo bloquea el sol.',
        sub: 'Generación solar crítica',
        sound: 'wind',
      },
      {
        id: 3,
        title: 'FALLO DE SISTEMAS',
        text: 'La energía cae. Las comunicaciones son inestables.',
        sub: 'Telemetría intermitente',
        sound: 'soft_alarm',
      },
      {
        id: 4,
        title: 'DIRECTOR ASIGNADO',
        text: 'Eres el Director de Operaciones.',
        sub: 'Mando operativo autorizado',
        sound: 'click',
      },
      {
        id: 5,
        title: 'NAVE EN ÓRBITA',
        text: 'Protege a la tripulación 72 horas hasta aterrizar.',
        sub: 'Nave de carga en aproximación',
        sound: 'beacon',
      },
    ],
  },

  // 2. HUD y controles comunes
  hud: {
    brandBadge: 'O7',
    brandName: 'ORBITA-7',
    baseLocation: 'BASE ALPHA-7 // ARCADIA PLANITIA',
    turnTitle: (turn) => `Turno ${turn} de 6`,
    soundOn: '🔊 ON',
    soundOff: '🔇 OFF',
    soundTitle: 'Sonido',
    restart: '↻ REINICIAR',
    restartTitle: 'Reiniciar simulación',
    langTitle: 'Idioma',
  },

  // 3. Indicadores / Recursos
  resources: {
    energy: {
      label: 'Energía',
      code: 'var_energia',
      short: 'ENE',
      desc: 'Carga de baterías y generación solar.',
    },
    life: {
      label: 'Soporte vital',
      code: 'var_soporte',
      short: 'SOP',
      desc: 'Presión atmosférica, depuración de O2 y calor.',
    },
    supplies: {
      label: 'Agua y suministros',
      code: 'var_suministros',
      short: 'AGU',
      desc: 'Reservas de agua y nutrientes de la base.',
    },
    safety: {
      label: 'Seguridad tripulación',
      code: 'var_seguridad',
      short: 'SEG',
      desc: 'Salud, blindaje radiológico y descanso.',
    },
  },

  // 4. Escenario de Base (Stage)
  stage: {
    skyLight: (light) => `CIELO: ${light}% LUZ (TORMENTA)`,
    dustStatus: (dust) => `POLVO EN PANELES: ${dust}%`,
    solarOutput: (output) => `SALIDA SOLAR: ${output}%`,
    viewCause: '👁️ VER CAUSA',
    viewCauseTitle: 'Ver plano de causa nuevamente',
    unitPanels: 'PANELES FOTOVOLTAICOS',
    unitRover: 'ROVER A-7',
    unitCrew: 'TRIPULACIÓN EVA',
    sunTitle: 'Sol atenuado por tormenta',
    domeBeaconTitle: 'Alerta roja en cúpula',
    crewCommanderTitle: 'Astronauta Líder con traje y casco',
    crewSpecialistTitle: 'Astronauta EVA con traje y casco',
    panelAlertTitle: 'Alerta de tormenta de polvo',
  },

  // 5. Consola de decisiones
  console: {
    starHeader: (id) => `S.T.A.R. // MISIÓN ${id}`,
    decisionLabel: 'DECISIÓN:',
    baseConsumptionLabel: 'CONSUMO BASE:',
    lessonHeader: 'LECCIÓN:',
    viewAgain: '🎬 VER DE NUEVO',
    viewAgainTitle: 'Volver a ver la cinemática de este turno',
    continueTurn: (nextTurn) => `CONTINUAR AL TURNO ${nextTurn}`,
  },

  // 6. Misiones (1 a 6)
  missions: [
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

  // 7. Cinemáticas (Subtítulos máx 5 palabras y UI)
  cutscenes: {
    skip: 'SALTAR',
    skipTitle: 'Saltar cinemática',
    replay: 'REPETICIÓN',
    shotTypes: {
      general: 'GENERAL',
      medium: 'MEDIO',
      detail: 'DETALLE',
    },
    timelineTooltip: (current, total) => `Plano ${current} de ${total}`,
    captions: {
      m1_cause: 'Tormenta de polvo activa',
      m1_A_1: 'Compuerta de garaje abierta',
      m1_A_2: 'Rover en terreno marciano',
      m1_A_3: 'Cepillo de limpieza',
      m1_A_4: 'Limpieza activa de paneles',
      m1_A_5: 'Sigue la tormenta',
      m1_B_1: 'Esclusa principal abierta',
      m1_B_2: 'Oxígeno del traje',
      m1_B_3: 'Caminando contra el viento',
      m1_B_4: 'Limpieza manual intensiva',
      m1_B_5: 'Salida de riesgo',
      m1_C_1: 'Módulos secundarios apagados',
      m1_C_2: 'Interruptores de ahorro activados',
      m1_C_3: 'Tripulación en espera estática',
      m1_C_4: 'Ahorro, sin limpiar',
      m2_cause: 'Tubería de hielo congelada',
      m2_A_1: 'Unidad térmica en camino',
      m2_A_2: 'Calentador térmico activado',
      m2_A_3: 'Hielo derritiéndose rápidamente',
      m2_A_4: 'Agua fluyendo al hábitat',
      m2_B_1: 'Sistema de reciclaje activo',
      m2_B_2: 'Válvulas secundarias abiertas',
      m2_B_3: 'Filtración en ciclo cerrado',
      m2_B_4: 'Agua reciclada con éxito',
      m2_C_1: 'Salida con material aislante',
      m2_C_2: 'Colocación de mantas térmicas',
      m2_C_3: 'Sellado contra congelamiento',
      m2_C_4: 'Protección térmica completada',
      m3_cause: 'Destello de radiación solar',
      m3_A_1: 'Alarma de evacuación activada',
      m3_A_2: 'Tripulantes corriendo hacia refugio',
      m3_A_3: 'Compuerta blindada sellada',
      m3_A_4: 'Refugio activo bajo tierra',
      m3_B_1: 'Rover pala cargando regolito',
      m3_B_2: 'Apilando tierra sobre cúpula',
      m3_B_3: 'Capa protectora absorbiendo radiación',
      m3_B_4: 'Blindaje de regolito completo',
      m3_C_1: 'Base expuesta en superficie',
      m3_C_2: 'Dosímetros en nivel crítico',
      m3_C_3: 'Monitoreo continuo en pantallas',
      m3_C_4: 'Tormenta solar en declive',
      m4_cause: 'Fuga en conducto principal',
      m4_A_1: 'Salida de reparación urgente',
      m4_A_2: 'Parche colocado en conducto',
      m4_A_3: 'Soldadura hermética completa',
      m4_A_4: 'Presión de oxígeno normal',
      m4_B_1: 'Consola de presión ambiental',
      m4_B_2: 'Regulación de presión hábitat',
      m4_B_3: 'Presión estabilizada a 0.6',
      m4_B_4: 'Fuga contenida exitosamente',
      m4_C_1: 'Depósito de tanques auxiliares',
      m4_C_2: 'Mangueras auxiliares conectadas',
      m4_C_3: 'Flujo de reserva activo',
      m4_C_4: 'Reserva de oxígeno conectada',
      m5_cause: 'Fisura en mamparo estructural',
      m5_A_1: 'Equipo epóxico de emergencia',
      m5_A_2: 'Inyección de resina química',
      m5_A_3: 'Resina epóxica fraguada',
      m5_A_4: 'Grieta sellada con resina',
      m5_B_1: 'Alarma de despresurización',
      m5_B_2: 'Mamparos herméticos bajando',
      m5_B_3: 'Bloqueo neumático cerrado',
      m5_B_4: 'Compartimento aislado seguro',
      m5_C_1: 'Transportando placas de acero',
      m5_C_2: 'Remachando placas metálicas',
      m5_C_3: 'Soldadura estructural sólida',
      m5_C_4: 'Refuerzo estructural completado',
      m6_cause: 'Nave en aproximación final',
      m6_A_1: 'Antena orientándose al cielo',
      m6_A_2: 'Transmisión de telemetría continua',
      m6_A_3: 'Coordenadas fijadas en nave',
      m6_A_4: 'Trayectoria de descenso confirmada',
      m6_B_1: 'Baliza óptica de pista',
      m6_B_2: 'Luz de xenón encendida',
      m6_B_3: 'Haz luminoso hacia órbita',
      m6_B_4: 'Pista de aterrizaje visible',
      m6_C_1: 'Sistemas combinados en línea',
      m6_C_2: 'Enlace dual sincronizado',
      m6_C_3: 'Nave en descenso guiado',
      m6_C_4: 'Aterrizaje seguro completado',
    },
    macroUi: {
      energyDropping: '⚡ ENERGÍA CAYENDO',
      suitO2: 'O₂ TRAJE EVA',
      criticalDrain: 'CONSUMO CRÍTICO',
      mod2: 'MOD-2',
      lights: 'LUCES',
      aux: 'AUX',
      powerSavingActive: 'MODO AHORRO ACTIVADO',
      noSignal: 'SIN ENLACE',
      systemZero: 'SISTEMA A CERO',
    },
  },

  // 8. Pantalla final (Result Screen)
  results: {
    section02Num: '02',
    section02Label: 'SISTEMAS VITALES · BALANCE FINAL',
    section03Num: '03',
    section03Label: 'LÍNEA DE TIEMPO · 6 MISIONES',
    section04Num: '04',
    section04Label: 'ESTADO DE LA BASE · HITOS CLAVE',
    section05Num: '05',
    section05Label: 'APRENDIZAJES CLAVE · DECISIONES TOMADAS',
    playAgain: '↻ JUGAR DE NUEVO',
    playAgainTitle: 'Reiniciar simulación desde el inicio',
    viewRoutes: '🗺️ VER LAS OTRAS RUTAS',
    viewRoutesTitle: 'Consultar los 4 finales y sus requisitos',
    replayBadge: '🎬 REPETICIÓN',
    starsAria: (stars) => `${stars} estrellas`,
    bestDecision: '✔ MEJOR DECISIÓN',
    costliestDecision: '✘ MAYOR COSTO',
    optionBadge: (id) => `OPC ${id}`,
    noData: 'Sin datos',
    flags: {
      comms: {
        title: 'COMUNICACIONES',
        ok: 'ENLACE ACTIVO',
        fail: 'SIN CONEXIÓN',
      },
      landing: {
        title: 'ZONA ATERRIZAJE',
        ok: 'BALIZA GUIADA',
        fail: 'A OSCURAS',
      },
      repair: {
        title: 'REPARACIÓN BASE',
        ok: 'MÓDULO SELLADO',
        fail: 'DAÑOS PENDIENTES',
      },
    },
    lessons: {
      titlePrefix: (missionId) => `LECCIÓN · MISIÓN ${missionId}`,
      bestOption: 'MEJOR OPCIÓN',
      highestCost: 'MAYOR COSTO',
      generalTitle: 'LECCIÓN GENERAL',
      generalText: 'Cada recurso en Marte exige sacrificios tácticos constantes.',
      generalBadge: 'PROTOCOLO',
    },
    modal: {
      badge: 'MANUAL S.T.A.R.',
      title: 'LOS 4 FINALES DE ORBITA-7',
      close: '✖ CERRAR GUÍA',
      routeA: {
        name: 'FINAL A · ÉXITO TOTAL (★★★)',
        tag: 'REQUISITOS COMPLETOS',
        desc: 'Requiere activar Comunicaciones (✔), Baliza de aterrizaje (✔) y Reparación del hábitat (✔). La nave aterriza intacta y la colonia subsiste al 100%.',
      },
      routeB: {
        name: 'FINAL B · SUPERVIVENCIA LÍMITE (★★☆)',
        tag: 'ATERRIZAJE FORZOSO',
        desc: 'Requiere Comunicaciones (✔) y Baliza (✔), pero sin reparar la base (✘). La nave toca tierra con daños y se requiere racionamiento.',
      },
      routeC: {
        name: 'FINAL C · MISIÓN INCOMPLETA (★☆☆)',
        tag: 'NAVE EN ÓRBITA',
        desc: 'Si falta la Baliza de pista o el enlace de radio (✘). La nave no puede alinearse y permanece varada en órbita marciana.',
      },
      routeD: {
        name: 'FINAL D · COLAPSO CRÍTICO (☆☆☆)',
        tag: 'EVACUACIÓN',
        desc: 'Ocurre si cualquiera de los 4 indicadores (Energía, Soporte, Agua, Seguridad) cae a cero en cualquier turno. La misión se interrumpe de inmediato.',
      },
    },
  },

  // 9. Metadatos de finales (A, B, C, D)
  endings: {
    finalA: {
      tag: 'FINAL A · ÉXITO TOTAL',
      title: 'Aterrizaje seguro',
      stars: 3,
      phrase: 'La nave aterrizó segura. Base Alpha-7 sobrevive con todos sus sistemas operativos.', // 12 palabras
      color: 'gold',
    },
    finalB: {
      tag: 'FINAL B · SUPERVIVENCIA LÍMITE',
      title: 'Aterrizaje forzoso',
      stars: 2,
      phrase: 'Aterrizaje con daños menores. La tripulación sobrevive racionando suministros críticos.', // 10 palabras
      color: 'yellow',
    },
    finalC: {
      tag: 'FINAL C · MISIÓN INCOMPLETA',
      title: 'Nave en órbita',
      stars: 1,
      phrase: 'Sin baliza ni enlace, la nave no descendió y espera en órbita.', // 11 palabras
      color: 'cyan',
    },
    finalD: {
      tag: 'FINAL D · COLAPSO DE SISTEMAS',
      title: 'Evacuación de emergencia',
      stars: 1,
      phrase: 'Un sistema vital colapsó. Se activó el protocolo de emergencia de base.', // 11 palabras
      color: 'red',
    },
  },

  // 10. Descripciones de pictogramas
  pictograms: {
    m1A: 'Rover con cepillo',
    m1B: 'Astronauta con traje y herramienta',
    m1C: 'Interruptor de ahorro',
    m2A: 'Calentador térmico',
    m2B: 'Filtro de reciclaje',
    m2C: 'Aislar tubería',
    m3A: 'Evacuar al refugio',
    m3B: 'Blindaje regolito',
    m3C: 'Monitoreo radar',
    m4A: 'Sellar fuga',
    m4B: 'Bajar presión',
    m4C: 'Tanque auxiliar',
    m5A: 'Sellado epóxico',
    m5B: 'Aislar sector',
    m5C: 'Reforzar placas',
    m6A: 'Guiar por radio',
    m6B: 'Baliza visual',
    m6C: 'Guiado dual',
  },
};
