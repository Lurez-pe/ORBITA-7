export const initialResources = {
  energy: 80,
  life: 80,
  protection: 80,
  morale: 80,
};

export const resourceMeta = {
  energy: { label: 'Energía', short: 'ENE', icon: 'ϟ', color: 'energy' },
  life: { label: 'Soporte vital', short: 'SOP', icon: '◉', color: 'life' },
  protection: { label: 'Protección', short: 'PRO', icon: '⬡', color: 'protection' },
  morale: { label: 'Ánimo', short: 'ANI', icon: '✦', color: 'morale' },
};

export const missions = [
  {
    id: 1,
    time: 'T + 00 h',
    title: 'Tormenta de polvo',
    subtitle: 'La luz cae. La base debe priorizar.',
    alert: 'El polvo oscurece el cielo y baja la generación de los paneles solares. ¿Qué sistema atiende primero la tripulación?',
    data: 'El polvo suspendido puede reducir la luz que llega a los paneles; misiones de NASA han tenido que conservar batería durante tormentas marcianas.',
    sourceLabel: 'NASA · tormentas y energía solar',
    sourceUrl: 'https://www.nasa.gov/solar-system/the-fact-and-fiction-of-martian-dust-storms/',
    options: [
      { id: 'A', title: 'Limpiar los paneles con el rover', detail: 'Gastas energía para intentar recuperar generación.', effects: { energy: -10 }, flag: 'panelsCleaned', outcome: 'El rover retira parte del polvo. La limpieza consume energía ahora y puede ayudar a recuperar generación más adelante.', lesson: 'La energía solar depende de la luz disponible y de mantener los paneles operativos.' },
      { id: 'B', title: 'Activar modo de ahorro', detail: 'Proteges energía reduciendo algunos sistemas.', effects: { energy: 10, life: -5, morale: -5 }, flag: 'savingMode', outcome: 'La base reduce el consumo; el soporte y el ánimo sienten el costo de las restricciones.', lesson: 'Ahorrar energía puede obligar a limitar otros sistemas.' },
      { id: 'C', title: 'Inspeccionar los paneles', detail: 'Buscas daños antes de hacer una intervención.', effects: { energy: -5 }, flag: 'panelsInspected', outcome: 'La revisión identifica el estado de los paneles y evita una limpieza a ciegas.', lesson: 'Inspeccionar primero puede reducir incertidumbre, aunque toma tiempo y energía.' },
    ],
  },
  {
    id: 2,
    time: 'T + 12 h',
    title: 'Agua y alimentos',
    subtitle: 'Las reservas necesitan una decisión.',
    alert: 'El depósito de agua baja y el invernadero consume recursos. Debes decidir cómo cuidar el soporte vital.',
    data: 'Las observaciones orbitales de NASA identifican zonas donde podría haber hielo de agua enterrado. La presencia y profundidad cambian según el lugar.',
    sourceLabel: 'NASA/JPL · mapa de hielo enterrado',
    sourceUrl: 'https://www.jpl.nasa.gov/images/pia26046-distribution-of-buried-ice-on-mars/',
    options: [
      { id: 'A', title: 'Reparar el extractor', detail: 'Usas energía y coordinación para recuperar capacidad de agua.', effects: { energy: -15, life: 15, morale: 5 }, flag: 'extractorRepaired', teamwork: true, outcome: 'El extractor vuelve a funcionar y mejora la reserva de agua. No produce alimentos de inmediato.', lesson: 'El agua disponible en el subsuelo es una posibilidad que depende del sitio y del equipo.' },
      { id: 'B', title: 'Reducir el riego', detail: 'Proteges agua hoy, pero el cultivo crecerá menos.', effects: { energy: -5, life: -5, morale: -5 }, flag: 'irrigationReduced', outcome: 'La base reduce el riego para conservar agua; el invernadero tendrá menos producción.', lesson: 'Proteger una reserva puede tener consecuencias posteriores en otro sistema.' },
      { id: 'C', title: 'Usar reservas de agua', detail: 'Recuperas soporte ahora, con menos margen para después.', effects: { energy: 5, life: -15, morale: -5 }, flag: 'lowWaterReserve', needsReserve: 'water', outcome: 'La tripulación usa una reserva limitada. El alivio de hoy reduce el margen futuro.', lesson: 'Una reserva no es una fuente ilimitada: conviene saber cuánto queda.' },
    ],
  },
  {
    id: 3,
    time: 'T + 24 h',
    title: 'Alerta de radiación',
    subtitle: 'La protección del equipo importa.',
    alert: 'Un evento solar aumenta la alerta. La tripulación debe decidir entre refugiarse, reforzar el módulo o continuar fuera.',
    data: 'El instrumento RAD de Curiosity mide radiación en la superficie marciana para ayudar a planear la protección de futuras misiones humanas.',
    sourceLabel: 'NASA · instrumento RAD',
    sourceUrl: 'https://science.nasa.gov/mission/msl-curiosity/science-instruments/',
    options: [
      { id: 'A', title: 'Entrar al refugio', detail: 'Pausas la tarea exterior y proteges a la tripulación.', effects: { energy: -10, morale: -5 }, flag: 'crewSheltered', outcome: 'La tripulación se resguarda durante la alerta. El trabajo exterior se detiene.', lesson: 'El refugio protege a las personas; Protección representa la capacidad del módulo, no una dosis recibida.' },
      { id: 'B', title: 'Reforzar el refugio', detail: 'Mejoras la protección estructural de la base.', effects: { energy: -10, protection: 20 }, flag: 'shelterReinforced', outcome: 'El equipo refuerza el módulo y mejora la protección de la base.', lesson: 'El blindaje de una estructura y la exposición personal son conceptos relacionados, pero distintos.' },
      { id: 'C', title: 'Continuar la tarea exterior', detail: 'Mantienes la operación, con más riesgo para la tripulación.', effects: { morale: -10 }, flag: 'radiationRisk', outcome: 'La tarea continúa mientras la tripulación queda expuesta al riesgo del evento.', lesson: 'Una medición de radiación ayuda a planificar protección; no equivale al indicador estructural de la base.' },
    ],
  },
  {
    id: 4,
    time: 'T + 36 h',
    title: 'Sistema de oxígeno',
    subtitle: '¿Reparar, reservar o apagar cargas?',
    alert: 'El sistema experimental de oxígeno muestra una falla. Hay que mantener el soporte vital sin dejar de mirar la energía.',
    data: 'MOXIE, a bordo de Perseverance, demostró que puede extraer oxígeno del dióxido de carbono marciano; fue una demostración tecnológica y necesitó energía.',
    sourceLabel: 'NASA · demostración MOXIE',
    sourceUrl: 'https://science.nasa.gov/mission/mars-2020-perseverance/moxie/',
    options: [
      { id: 'A', title: 'Reparar el sistema', detail: 'Inviertes energía para recuperar soporte vital.', effects: { energy: -15, life: 15, morale: 5 }, flag: 'oxygenRepaired', outcome: 'El sistema vuelve a operar y el soporte vital se recupera.', lesson: 'Una tecnología experimental demuestra una capacidad, pero no sustituye por sí sola un sistema completo.' },
      { id: 'B', title: 'Usar la reserva de oxígeno', detail: 'Recuperas soporte ahora y reduces la reserva.', effects: { energy: 5, life: -15, morale: -5 }, flag: 'lowOxygenReserve', needsReserve: 'oxygen', outcome: 'La base usa una reserva limitada de oxígeno.', lesson: 'Agua y oxígeno son recursos distintos y deben registrarse por separado.' },
      { id: 'C', title: 'Apagar cargas secundarias', detail: 'Reduces demanda eléctrica para proteger los sistemas esenciales.', effects: { energy: -5, morale: -5 }, flag: 'loadsReduced', outcome: 'La base desconecta cargas no esenciales. El ahorro ayudará frente al daño que se aproxima.', lesson: 'El orden y el momento de una medida de ahorro pueden cambiar su efecto.' },
    ],
  },
  {
    id: 5,
    time: 'T + 48 h',
    title: 'Fuga de presión',
    subtitle: 'Aísla el daño o intenta repararlo.',
    alert: 'Una junta cede y un módulo pierde presión. El equipo debe contener el daño antes de que empeore.',
    data: 'La presión media de la superficie marciana es de unos 6,36 milibares, con variaciones por estación y ubicación. La base debe mantener su propio ambiente presurizado.',
    sourceLabel: 'NASA NSSDC · ficha de Marte',
    sourceUrl: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html',
    options: [
      { id: 'A', title: 'Aislar el módulo', detail: 'Contienes la fuga y proteges el resto de la base.', effects: { energy: -10, life: -5, morale: -5 }, flag: 'moduleIsolated', teamwork: true, outcome: 'El módulo queda aislado. La fuga está contenida, aunque todavía no reparada.', lesson: 'Aislar evita que un problema se propague; no significa que el sistema haya quedado reparado.' },
      { id: 'B', title: 'Reparación exterior', detail: 'La tripulación intenta reparar desde fuera.', effects: { energy: -5, protection: 10, morale: -10 }, flag: 'finalRepair', teamwork: true, outcome: 'La reparación exterior cierra la fuga, pero exige un esfuerzo de alto riesgo.', lesson: 'Una solución definitiva puede exigir más recursos y coordinación.' },
      { id: 'C', title: 'Aplicar sellado temporal', detail: 'Ganas margen para revisar la reparación antes de la llegada.', effects: { energy: -10, life: 5, protection: 5, morale: 5 }, flag: 'temporarySeal', teamwork: true, outcome: 'El sellado reduce la fuga por ahora; el equipo debe revisar su estado antes de la llegada.', lesson: 'Una solución temporal compra tiempo, pero necesita seguimiento.' },
    ],
  },
  {
    id: 6,
    time: 'T + 60 h',
    title: 'Llegada de suministros',
    subtitle: 'Prepara una llegada con información suficiente.',
    alert: 'La nave se aproxima. La base puede restablecer comunicación, inspeccionar la zona o activar una baliza.',
    data: 'Las señales entre Marte y la Tierra tardan varios minutos; según la distancia, el retardo de ida puede rondar de 4 a 24 minutos. La nave no recibe respuesta instantánea.',
    sourceLabel: 'NASA SCaN · latencia de comunicación',
    sourceUrl: 'https://www.nasa.gov/missions/tech-demonstration/space-communications-7-things-you-need-to-know/',
    options: [
      { id: 'A', title: 'Reparar la antena', detail: 'Restableces comunicación, con demora de señal.', effects: { energy: -10, morale: 5 }, flag: 'communications', teamwork: true, outcome: 'La antena vuelve a transmitir. La respuesta llegará con la demora propia de la distancia a Marte.', lesson: 'Las comunicaciones interplanetarias no ocurren en tiempo real.' },
      { id: 'B', title: 'Inspeccionar la zona', detail: 'Compruebas obstáculos y condiciones del área.', effects: { energy: -10, morale: 5 }, flag: 'siteInspected', teamwork: true, outcome: 'La zona queda inspeccionada y se conocen mejor sus obstáculos.', lesson: 'Una señal de llegada no reemplaza la revisión del lugar.' },
      { id: 'C', title: 'Activar la baliza', detail: 'Ayudas a la nave a localizar la base.', effects: { energy: -15, morale: 5 }, flag: 'beacon', outcome: 'La baliza envía una señal para localizar la base; no garantiza un aterrizaje seguro.', lesson: 'Una ayuda de navegación no elimina los riesgos de aterrizaje.' },
    ],
  },
];

export const nasaSources = [
  { label: 'Tormentas y paneles solares', url: 'https://www.nasa.gov/solar-system/the-fact-and-fiction-of-martian-dust-storms/' },
  { label: 'Hielo de agua enterrado', url: 'https://www.jpl.nasa.gov/images/pia26046-distribution-of-buried-ice-on-mars/' },
  { label: 'Radiación y RAD', url: 'https://science.nasa.gov/mission/msl-curiosity/science-instruments/' },
  { label: 'Oxígeno y MOXIE', url: 'https://science.nasa.gov/mission/mars-2020-perseverance/moxie/' },
  { label: 'Presión atmosférica', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html' },
  { label: 'Demora de comunicación', url: 'https://www.nasa.gov/missions/tech-demonstration/space-communications-7-things-you-need-to-know/' },
];
