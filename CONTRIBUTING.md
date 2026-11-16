# Contribuir a ORBITA-7

## Preparar el entorno

Requiere Node.js 22 (o Node.js 20.19+).

```bash
git clone https://github.com/Lurez-pe/ORBITA-7.git
cd ORBITA-7
npm ci
npm run dev
```

Antes de proponer cambios, comprueba la compilación:

```bash
npm run build
```

## Flujo de trabajo

1. Actualiza `main` y crea una rama de trabajo, por ejemplo `feat/animacion-rover` o `fix/pages-assets`.
2. Haz commits pequeños con mensajes que expliquen el cambio.
3. Sube la rama y abre un pull request hacia `main`.
4. Espera a que la compilación y el despliegue pasen; revisa la vista publicada tras integrar el cambio.

No subas `node_modules/`, `dist/` ni secretos o claves API. GitHub Pages compila desde `main` mediante `.github/workflows/deploy.yml`; no publiques manualmente una copia de archivos fuente.

## Proyecto

La aplicación está en la raíz del repositorio. El código se organiza en `src/`, las imágenes web en `public/assets/` y las reglas de misiones en `src/data/`. Mantén los datos educativos atribuidos y diferencia los valores simulados de datos reales.

