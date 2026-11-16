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

## GitHub Pages

El despliegue compila Vite mediante `.github/workflows/deploy.yml`. En GitHub, configura **Settings → Pages → Build and deployment → Source: GitHub Actions**. La compilación de producción usa la base `/ORBITA-7/`, correspondiente a la URL de proyecto `https://lurez-pe.github.io/ORBITA-7/`; los recursos gráficos se resuelven de forma relativa a esa ruta.

## Contribuir

El flujo recomendado para colaborar está en [`CONTRIBUTING.md`](CONTRIBUTING.md). Los cambios se trabajan en una rama y se integran a `main` mediante pull request; cada merge a `main` vuelve a desplegar GitHub Pages.

## Datos y NASA

- La aplicación consulta la NASA Image and Video Library API para buscar imágenes relacionadas con la misión actual. No requiere una clave API; cada resultado enlaza a su ficha de NASA Images y muestra centro y fecha cuando están disponibles.
- El botón de archivo científico consulta el endpoint público de búsqueda del Planetary Data System (PDS). Es una consulta de catálogo, no telemetría en vivo; el panel informa si el navegador no puede conectar.
- Las fichas educativas enlazan fuentes científicas de NASA/PDS. Los datos de la misión ORBITA-7 (recursos iniciales, costes, puntuaciones y finales) son **valores de simulación** del proyecto, no mediciones de Marte.
- La API antigua de Mars Rover Photos aparece archivada en el catálogo NASA; la API de InSight describe observaciones históricas. No se usan como telemetría actual.

## Recursos del proyecto

Las copias para la web están en `public/assets/`; los originales organizados en `06_RECURSOS_GRAFICOS/` se conservan intactos. Cada misión selecciona el escenario apropiado (exterior, invernadero, refugio o sala de control) y presenta los objetos, el rover y las variantes de tripulante en pixel art. El HUD usa los cuatro iconos ilustrados; M6 incorpora el mapa de zona y la nave de suministros. El arte de menú, alertas y ajustes se integra en la navegación y en sus paneles interactivos.

## Estado

MVP en desarrollo: menú interactivo, seis misiones con escenas específicas, HUD ilustrado, tripulación y objetos animados, acciones visuales por decisión, pausa con ajustes, informe/continuar, resultados, reinicio, reservas de un uso, protocolo de bienestar y archivo NASA plegable. Incluye respeto por `prefers-reduced-motion`. Balance de la matriz v2 aún provisional. La compilación de producción se verifica con `npm run build`.

