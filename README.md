# ORBITA-7 Web

Primera versión web interactiva de **ORBITA-7: 72 horas para sobrevivir en Marte**. La experiencia conserva las seis misiones y el ciclo de decisiones del GDD; React gestiona las pantallas y el estado, CSS la presentación y JavaScript las reglas.

## Desarrollo local

Requiere Node.js 20.19+ o 22.12+.

```bash
npm install
npm run dev
```

Para crear una compilación estática:

```bash
npm run build
npm run preview
```

## Datos y NASA

- La aplicación consulta la NASA Image and Video Library API para buscar imágenes relacionadas con la misión actual. No requiere una clave API; cada resultado enlaza a su ficha de NASA Images y muestra centro y fecha cuando están disponibles.
- El botón de archivo científico consulta el endpoint público de búsqueda del Planetary Data System (PDS). Es una consulta de catálogo, no telemetría en vivo; el panel informa si el navegador no puede conectar.
- Las fichas educativas enlazan fuentes científicas de NASA/PDS. Los datos de la misión ORBITA-7 (recursos iniciales, costes, puntuaciones y finales) son **valores de simulación** del proyecto, no mediciones de Marte.
- La API antigua de Mars Rover Photos aparece archivada en el catálogo NASA; la API de InSight describe observaciones históricas. No se usan como telemetría actual.

## Recursos del proyecto

Los JPG estudiantiles se copian a `public/assets/` para que Vite pueda servirlos sin alterar los originales organizados en `06_RECURSOS_GRAFICOS/`. El tripulante y el rover conservan su fondo blanco; el escenario y el icono se mantienen como JPG.

## Estado

MVP en desarrollo: inicio, seis misiones, HUD compacto, escena marciana animada, rover y tripulación con movimiento, acciones visuales por decisión, informe/continuar, resultados, reinicio, reservas de un uso, protocolo de bienestar y archivo NASA plegable. Incluye respeto por `prefers-reduced-motion`. Balance de la matriz v2 aún provisional. La compilación de producción se verifica con `npm run build`.
