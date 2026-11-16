// ORBITA-7: Cutscenes Data System (Retro Pixel Art Cinemáticas)
// Separación total de datos y código en un solo archivo.
// Cada secuencia consta de 4 a 6 planos de 1.5 a 2.5s (8 a 12s total).
// Plano de CAUSA: 3 a 4 segundos antes de decidir.
// Regla de texto: Máximo 5 palabras por plano.
// Sprites: Únicamente assets originales del equipo.

export const cutscenesData = {
  // =========================================================================
  // MISIÓN 1: POLVO EN PANELES SOLARES
  // =========================================================================
  1: {
    // 1. PLANO DE CAUSA (3 a 4 segundos antes de decidir)
    cause: {
      id: 'm1_cause',
      title: 'Tormenta de polvo',
      duration: 3600,
      shotType: 'general',
      camera: 'cam-pan-left',
      sound: 'storm',
      text: 'Tormenta de polvo activa', // 4 palabras
      sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
      skyDarkness: 90,
      dustStorm: true,
      sunDimmed: true,
      panelsCovered: true,
      energyDrop: true,
      actors: [
        { type: 'panel_matrix', dirty: true },
        { type: 'storm_overlay', density: 'heavy' },
        { type: 'alert_beacon', color: 'red' },
      ],
    },

    // 2. CINEMÁTICAS DE OPCIONES (A, B, C)
    options: {
      // OPCIÓN A: ROVER LIMPIA LOS PANELES (5 planos)
      A: {
        id: 'm1_opt_A',
        title: 'Limpiar con rover',
        shots: [
          {
            id: 'm1_A_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-pan-right',
            sound: 'garage_open',
            text: 'Compuerta de garaje abierta', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            garageDoor: 'opening',
            rover: { state: 'exiting', progress: 30 },
            skyDarkness: 80,
            dustStorm: true,
            panelsCovered: true,
          },
          {
            id: 'm1_A_2',
            shotType: 'medium',
            duration: 2200,
            camera: 'cam-pan-right',
            sound: 'rover_drive',
            text: 'Rover en terreno marciano', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            rover: { state: 'driving_forward', progress: 60 },
            skyDarkness: 80,
            dustStorm: true,
            panelsCovered: true,
          },
          {
            id: 'm1_A_3',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-zoom-in',
            sound: 'brush_extend',
            text: 'Cepillo de limpieza', // 3 palabras (especificación exacta)
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            detailView: 'rover_brush_arm',
            brushActive: true,
          },
          {
            id: 'm1_A_4',
            shotType: 'medium',
            duration: 2300,
            camera: 'cam-pan-right',
            sound: 'brush_clean',
            text: 'Limpieza activa de paneles', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            rover: { state: 'sweeping_panels', progress: 90 },
            panelsCovered: 'clearing_chunks',
            skyDarkness: 80,
            dustStorm: true,
          },
          {
            id: 'm1_A_5',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Sigue la tormenta', // 3 palabras (especificación exacta)
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            panelsCovered: false,
            panelsGlint: true,
            skyDarkness: 85,
            dustStorm: true,
            rover: { state: 'idle_at_panels' },
          },
        ],
      },

      // OPCIÓN B: DOS ASTRONAUTAS SALEN (5 planos)
      B: {
        id: 'm1_opt_B',
        title: 'Salida exterior EVA',
        shots: [
          {
            id: 'm1_B_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-zoom-in',
            sound: 'airlock_whoosh',
            text: 'Esclusa principal abierta', // 3 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            airlockDoor: 'open',
            crew: { state: 'exiting', count: 2 },
            skyDarkness: 85,
            dustStorm: true,
            panelsCovered: true,
          },
          {
            id: 'm1_B_2',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-shake',
            sound: 'oxygen_vent',
            text: 'Oxígeno del traje', // 3 palabras (especificación exacta)
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            detailView: 'suit_o2_meter',
            oxygenLevel: 72,
          },
          {
            id: 'm1_B_3',
            shotType: 'medium',
            duration: 2200,
            camera: 'cam-pan-left',
            sound: 'footsteps',
            text: 'Caminando contra el viento', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            crew: { state: 'walking_wind', count: 2, tools: true },
            skyDarkness: 85,
            dustStorm: true,
            panelsCovered: true,
          },
          {
            id: 'm1_B_4',
            shotType: 'medium',
            duration: 2200,
            camera: 'cam-shake',
            sound: 'manual_scrub',
            text: 'Limpieza manual intensiva', // 3 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            crew: { state: 'cleaning_panels', count: 2 },
            panelsCovered: 'clearing_chunks',
            skyDarkness: 85,
            dustStorm: true,
          },
          {
            id: 'm1_B_5',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'airlock_close',
            text: 'Salida de riesgo', // 3 palabras (especificación exacta)
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            airlockDoor: 'closing',
            crew: { state: 'entered', count: 2 },
            panelsCovered: false,
            panelsGlint: true,
            skyDarkness: 85,
            dustStorm: true,
          },
        ],
      },

      // OPCIÓN C: MODO AHORRO (4 planos)
      C: {
        id: 'm1_opt_C',
        title: 'Modo de ahorro',
        shots: [
          {
            id: 'm1_C_1',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-zoom-in',
            sound: 'power_down',
            text: 'Módulos secundarios apagados', // 3 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            lightsShutoffSequence: true,
            skyDarkness: 90,
            dustStorm: true,
            panelsCovered: true,
          },
          {
            id: 'm1_C_2',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-none',
            sound: 'switch_click',
            text: 'Interruptores de ahorro activados', // 4 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            detailView: 'breaker_switches',
            switchesFlipped: true,
          },
          {
            id: 'm1_C_3',
            shotType: 'medium',
            duration: 2000,
            camera: 'cam-none',
            sound: 'crew_hum',
            text: 'Tripulación en espera estática', // 4 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            interiorDim: true,
            crewInside: true,
          },
          {
            id: 'm1_C_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'battery_charge',
            text: 'Ahorro, sin limpiar', // 3 palabras (especificación exacta)
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            batteryRebound: true,
            panelsCovered: true,
            skyDarkness: 90,
            dustStorm: true,
          },
        ],
      },
    },
  },

  // =========================================================================
  // MISIÓN 2: FALLO EXTRACTOR DE HIELO
  // =========================================================================
  2: {
    cause: {
      id: 'm2_cause',
      title: 'Tubería congelada',
      duration: 3600,
      shotType: 'medium',
      camera: 'cam-zoom-in',
      sound: 'alarm',
      text: 'Tubería de hielo congelada', // 4 palabras
      sceneBg: 'assets/ORB_ESC_invernadero_v01.webp',
      extractorFrozen: true,
      iceCrystals: true,
      flowMeter: 0,
    },
    options: {
      A: {
        id: 'm2_opt_A',
        title: 'Calentar la tubería',
        shots: [
          {
            id: 'm2_A_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-pan-right',
            sound: 'rover_motor',
            text: 'Unidad térmica en camino', // 4 palabras
            sceneBg: 'assets/ORB_ESC_invernadero_v01.webp',
            rover: { state: 'delivering_heater' },
          },
          {
            id: 'm2_A_2',
            shotType: 'medium',
            duration: 2100,
            camera: 'cam-zoom-in',
            sound: 'heater',
            text: 'Calentador térmico activado', // 3 palabras
            sceneBg: 'assets/ORB_ESC_invernadero_v01.webp',
            thermalTorch: true,
          },
          {
            id: 'm2_A_3',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-none',
            sound: 'steam',
            text: 'Hielo derritiéndose rápidamente', // 3 palabras
            sceneBg: 'assets/ORB_ESC_invernadero_v01.webp',
            detailView: 'thawing_pipe',
            steamJets: true,
          },
          {
            id: 'm2_A_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Agua fluyendo al hábitat', // 4 palabras
            sceneBg: 'assets/ORB_ESC_invernadero_v01.webp',
            flowMeter: 85,
            waterNormal: true,
          },
        ],
      },
      B: {
        id: 'm2_opt_B',
        title: 'Reciclar agua existente',
        shots: [
          {
            id: 'm2_B_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-zoom-in',
            sound: 'switch_click',
            text: 'Sistema de reciclaje activo', // 4 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            recyclingActive: true,
          },
          {
            id: 'm2_B_2',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-none',
            sound: 'switch_click',
            text: 'Válvulas secundarias abiertas', // 3 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            detailView: 'water_valves',
          },
          {
            id: 'm2_B_3',
            shotType: 'medium',
            duration: 2100,
            camera: 'cam-none',
            sound: 'steam',
            text: 'Filtración en ciclo cerrado', // 4 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            filterFlow: true,
          },
          {
            id: 'm2_B_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Agua reciclada con éxito', // 4 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            recyclingComplete: true,
          },
        ],
      },
      C: {
        id: 'm2_opt_C',
        title: 'Aislar tubería manualmente',
        shots: [
          {
            id: 'm2_C_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-pan-left',
            sound: 'airlock_whoosh',
            text: 'Salida con material aislante', // 4 palabras
            sceneBg: 'assets/ORB_ESC_invernadero_v01.webp',
            crew: { state: 'carrying_insulation' },
          },
          {
            id: 'm2_C_2',
            shotType: 'medium',
            duration: 2200,
            camera: 'cam-shake',
            sound: 'manual_scrub',
            text: 'Colocación de mantas térmicas', // 4 palabras
            sceneBg: 'assets/ORB_ESC_invernadero_v01.webp',
            crewWrapping: true,
          },
          {
            id: 'm2_C_3',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-zoom-in',
            sound: 'switch_click',
            text: 'Sellado contra congelamiento', // 3 palabras
            sceneBg: 'assets/ORB_ESC_invernadero_v01.webp',
            detailView: 'insulated_pipe',
          },
          {
            id: 'm2_C_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Protección térmica completada', // 3 palabras
            sceneBg: 'assets/ORB_ESC_invernadero_v01.webp',
            protectionComplete: true,
          },
        ],
      },
    },
  },

  // =========================================================================
  // MISIÓN 3: ALERTA DE RADIACIÓN SOLAR
  // =========================================================================
  3: {
    cause: {
      id: 'm3_cause',
      title: 'Destello de radiación',
      duration: 3600,
      shotType: 'general',
      camera: 'cam-shake',
      sound: 'alarm',
      text: 'Destello de radiación solar', // 4 palabras
      sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
      radiationFlare: true,
      skyGlow: 'orange-bright',
      dosimeterRed: true,
    },
    options: {
      A: {
        id: 'm3_opt_A',
        title: 'Evacuar al refugio',
        shots: [
          {
            id: 'm3_A_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-zoom-in',
            sound: 'alarm',
            text: 'Alarma de evacuación activada', // 4 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            alarmKlaxon: true,
          },
          {
            id: 'm3_A_2',
            shotType: 'medium',
            duration: 2100,
            camera: 'cam-pan-left',
            sound: 'footsteps',
            text: 'Tripulantes corriendo hacia refugio', // 4 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            crewRunning: true,
          },
          {
            id: 'm3_A_3',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-shake',
            sound: 'airlock_close',
            text: 'Compuerta blindada sellada herméticamente', // 4 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            detailView: 'heavy_bulkhead',
          },
          {
            id: 'm3_A_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Refugio activo bajo tierra', // 4 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            bunkerSafe: true,
          },
        ],
      },
      B: {
        id: 'm3_opt_B',
        title: 'Añadir blindaje regolito',
        shots: [
          {
            id: 'm3_B_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-pan-right',
            sound: 'rover_motor',
            text: 'Rover pala cargando regolito', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            rover: { state: 'scooping_regolith' },
          },
          {
            id: 'm3_B_2',
            shotType: 'medium',
            duration: 2200,
            camera: 'cam-shake',
            sound: 'footsteps',
            text: 'Apilando tierra sobre cúpula', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            pilingRegolith: true,
          },
          {
            id: 'm3_B_3',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Capa protectora absorbiendo radiación', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            detailView: 'regolith_layer',
          },
          {
            id: 'm3_B_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Blindaje de regolito completo', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            domeShielded: true,
          },
        ],
      },
      C: {
        id: 'm3_opt_C',
        title: 'Continuar con monitoreo',
        shots: [
          {
            id: 'm3_C_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-shake',
            sound: 'alarm',
            text: 'Base expuesta en superficie', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            surfaceRadiation: true,
          },
          {
            id: 'm3_C_2',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-none',
            sound: 'alarm',
            text: 'Dosímetros en nivel crítico', // 4 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            detailView: 'dosimeter_gauges',
          },
          {
            id: 'm3_C_3',
            shotType: 'medium',
            duration: 2100,
            camera: 'cam-none',
            sound: 'crew_hum',
            text: 'Monitoreo continuo en pantallas', // 4 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            monitoringActive: true,
          },
          {
            id: 'm3_C_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Tormenta solar en declive', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            radiationDeclining: true,
          },
        ],
      },
    },
  },

  // =========================================================================
  // MISIÓN 4: FUGA DE OXÍGENO
  // =========================================================================
  4: {
    cause: {
      id: 'm4_cause',
      title: 'Fuga de oxígeno',
      duration: 3600,
      shotType: 'detail',
      camera: 'cam-shake',
      sound: 'oxygen_vent',
      text: 'Fuga en conducto principal', // 4 palabras
      sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
      oxygenJet: true,
      pressureGaugeDrop: true,
    },
    options: {
      A: {
        id: 'm4_opt_A',
        title: 'Sellar fuga exterior',
        shots: [
          {
            id: 'm4_A_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-zoom-in',
            sound: 'airlock_whoosh',
            text: 'Salida de reparación urgente', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            crewEVA: true,
          },
          {
            id: 'm4_A_2',
            shotType: 'medium',
            duration: 2200,
            camera: 'cam-pan-right',
            sound: 'manual_scrub',
            text: 'Parche colocado en conducto', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            patchPlaced: true,
          },
          {
            id: 'm4_A_3',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-shake',
            sound: 'spark_shine',
            text: 'Soldadura hermética completa', // 3 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            detailView: 'welded_patch',
          },
          {
            id: 'm4_A_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Presión de oxígeno normal', // 4 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            pressureRestored: true,
          },
        ],
      },
      B: {
        id: 'm4_opt_B',
        title: 'Reducir presión hábitat',
        shots: [
          {
            id: 'm4_B_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-zoom-in',
            sound: 'switch_click',
            text: 'Consola de presión ambiental', // 4 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            consoleView: true,
          },
          {
            id: 'm4_B_2',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-none',
            sound: 'switch_click',
            text: 'Regulación de presión hábitat', // 4 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            detailView: 'valve_dials',
          },
          {
            id: 'm4_B_3',
            shotType: 'medium',
            duration: 2100,
            camera: 'cam-none',
            sound: 'oxygen_vent',
            text: 'Presión estabilizada a 0.6', // 4 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            pressureGauge: 0.6,
          },
          {
            id: 'm4_B_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Fuga contenida exitosamente', // 3 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            leakContained: true,
          },
        ],
      },
      C: {
        id: 'm4_opt_C',
        title: 'Conectar tanques auxiliares',
        shots: [
          {
            id: 'm4_C_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-pan-left',
            sound: 'footsteps',
            text: 'Depósito de tanques auxiliares', // 4 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            tanksDepot: true,
          },
          {
            id: 'm4_C_2',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-none',
            sound: 'airlock_whoosh',
            text: 'Mangueras auxiliares conectadas', // 3 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            detailView: 'tank_valves',
          },
          {
            id: 'm4_C_3',
            shotType: 'medium',
            duration: 2100,
            camera: 'cam-none',
            sound: 'oxygen_vent',
            text: 'Flujo de reserva activo', // 4 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            reserveActive: true,
          },
          {
            id: 'm4_C_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Reserva de oxígeno conectada', // 4 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            oxygenSafe: true,
          },
        ],
      },
    },
  },

  // =========================================================================
  // MISIÓN 5: GRIETA EN EL REFUGIO
  // =========================================================================
  5: {
    cause: {
      id: 'm5_cause',
      title: 'Fisura estructural',
      duration: 3600,
      shotType: 'detail',
      camera: 'cam-shake',
      sound: 'alarm',
      text: 'Fisura en mamparo estructural', // 4 palabras
      sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
      wallCrack: true,
      dustPuff: true,
      alarmKlaxon: true,
    },
    options: {
      A: {
        id: 'm5_opt_A',
        title: 'Sellado epóxico rápido',
        shots: [
          {
            id: 'm5_A_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-pan-right',
            sound: 'footsteps',
            text: 'Equipo epóxico de emergencia', // 4 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            crewEpoxy: true,
          },
          {
            id: 'm5_A_2',
            shotType: 'medium',
            duration: 2100,
            camera: 'cam-zoom-in',
            sound: 'steam',
            text: 'Inyección de resina química', // 4 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            injectingResin: true,
          },
          {
            id: 'm5_A_3',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Resina epóxica fraguada', // 3 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            detailView: 'cured_epoxy',
          },
          {
            id: 'm5_A_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Grieta sellada con resina', // 4 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            crackRepaired: true,
          },
        ],
      },
      B: {
        id: 'm5_opt_B',
        title: 'Aislar sector dañado',
        shots: [
          {
            id: 'm5_B_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-zoom-in',
            sound: 'alarm',
            text: 'Alarma de despresurización', // 3 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            alarmBeacons: true,
          },
          {
            id: 'm5_B_2',
            shotType: 'medium',
            duration: 2100,
            camera: 'cam-shake',
            sound: 'airlock_close',
            text: 'Mamparos herméticos bajando', // 3 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            bulkheadsClosing: true,
          },
          {
            id: 'm5_B_3',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-none',
            sound: 'switch_click',
            text: 'Bloqueo neumático cerrado', // 3 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            detailView: 'airlock_latch',
          },
          {
            id: 'm5_B_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Compartimento aislado seguro', // 3 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            sectorIsolated: true,
          },
        ],
      },
      C: {
        id: 'm5_opt_C',
        title: 'Reforzar con placas',
        shots: [
          {
            id: 'm5_C_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-pan-left',
            sound: 'footsteps',
            text: 'Transportando placas de acero', // 4 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            carryingPlates: true,
          },
          {
            id: 'm5_C_2',
            shotType: 'medium',
            duration: 2200,
            camera: 'cam-shake',
            sound: 'manual_scrub',
            text: 'Remachando placas metálicas', // 3 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            rivetingPlates: true,
          },
          {
            id: 'm5_C_3',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-shake',
            sound: 'spark_shine',
            text: 'Soldadura estructural sólida', // 3 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            detailView: 'welded_plates',
          },
          {
            id: 'm5_C_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Refuerzo estructural completado', // 3 palabras
            sceneBg: 'assets/ORB_ESC_refugio_v01.webp',
            bracingComplete: true,
          },
        ],
      },
    },
  },

  // =========================================================================
  // MISIÓN 6: GUIADO NAVE DE SUMINISTROS
  // =========================================================================
  6: {
    cause: {
      id: 'm6_cause',
      title: 'Aproximación de nave',
      duration: 3600,
      shotType: 'general',
      camera: 'cam-pan-left',
      sound: 'beacon',
      text: 'Nave en aproximación final', // 4 palabras
      sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
      skyShipOrbit: true,
      seekingSignal: true,
    },
    options: {
      A: {
        id: 'm6_opt_A',
        title: 'Guiar por radio',
        shots: [
          {
            id: 'm6_A_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-zoom-in',
            sound: 'beacon',
            text: 'Antena orientándose al cielo', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            antennaTracking: true,
          },
          {
            id: 'm6_A_2',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-none',
            sound: 'beacon',
            text: 'Transmisión de telemetría continua', // 4 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            detailView: 'radio_waves',
          },
          {
            id: 'm6_A_3',
            shotType: 'medium',
            duration: 2100,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Coordenadas fijadas en nave', // 4 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            pilotReceiving: true,
          },
          {
            id: 'm6_A_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Trayectoria de descenso confirmada', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            shipAligned: true,
          },
        ],
      },
      B: {
        id: 'm6_opt_B',
        title: 'Encender baliza visual',
        shots: [
          {
            id: 'm6_B_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-pan-right',
            sound: 'switch_click',
            text: 'Baliza óptica de pista', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            beaconTurnOn: true,
          },
          {
            id: 'm6_B_2',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-shake',
            sound: 'spark_shine',
            text: 'Luz de xenón encendida', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            detailView: 'beacon_strobe',
          },
          {
            id: 'm6_B_3',
            shotType: 'medium',
            duration: 2100,
            camera: 'cam-none',
            sound: 'beacon',
            text: 'Haz luminoso hacia órbita', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            verticalLightBeam: true,
          },
          {
            id: 'm6_B_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Pista de aterrizaje visible', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            shipLandingPath: true,
          },
        ],
      },
      C: {
        id: 'm6_opt_C',
        title: 'Guiado combinado doble',
        shots: [
          {
            id: 'm6_C_1',
            shotType: 'general',
            duration: 2000,
            camera: 'cam-zoom-in',
            sound: 'switch_click',
            text: 'Sistemas combinados en línea', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            dualGuidanceReady: true,
          },
          {
            id: 'm6_C_2',
            shotType: 'detail',
            duration: 2000,
            camera: 'cam-none',
            sound: 'beacon',
            text: 'Enlace dual sincronizado', // 3 palabras
            sceneBg: 'assets/ORB_ESC_sala_control_v01.webp',
            detailView: 'dual_telemetry',
          },
          {
            id: 'm6_C_3',
            shotType: 'medium',
            duration: 2200,
            camera: 'cam-shake',
            sound: 'rover_motor',
            text: 'Nave en descenso guiado', // 4 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            shipRetroThrusters: true,
          },
          {
            id: 'm6_C_4',
            shotType: 'general',
            duration: 2200,
            camera: 'cam-none',
            sound: 'spark_shine',
            text: 'Aterrizaje seguro completado', // 3 palabras
            sceneBg: 'assets/ORB_ESC_base_exterior_v01.jpg',
            landingComplete: true,
          },
        ],
      },
    },
  },
};

