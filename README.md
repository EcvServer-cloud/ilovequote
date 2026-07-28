# iLoveQuote (i❤️Quote)

Crea cotizaciones profesionales en minutos. Gratis, sin registro, 100% en el navegador.

No hay backend, no hay base de datos, no hay login. Todo el estado vive en `localStorage`
del dispositivo del usuario; los PDFs se generan en el propio navegador.

## Stack

- SvelteKit (modo SPA, `ssr = false`) + `@sveltejs/adapter-static`
- Tailwind CSS
- jsPDF + jspdf-autotable (generación de PDF en el cliente)
- Web Share API con fallback a `wa.me` para compartir por WhatsApp

## Ejecutar en local

Requiere Node.js 18 o superior.

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

Para probar el build de producción localmente:

```bash
npm run build
npm run preview
```

## Publicar en GitHub Pages

Este repo ya incluye `.github/workflows/deploy.yml`, así que el despliegue es automático:

1. Crea un repositorio en GitHub (por ejemplo `ilovequote`) y sube este proyecto:
   ```bash
   git init
   git add .
   git commit -m "iLoveQuote v1.0"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
   git push -u origin main
   ```
2. En GitHub, ve a **Settings → Pages** y en "Build and deployment" elige **GitHub Actions** como origen.
3. Cada `push` a `main` construye el proyecto y lo publica automáticamente en
   `https://<tu-usuario>.github.io/<tu-repo>/`.

### Sobre la ruta base (`BASE_PATH`)

GitHub Pages sirve un "project site" desde una subruta (`/tu-repo/`), así que el workflow
compila la app pasando `BASE_PATH="/<nombre-del-repo>"` automáticamente usando el nombre
real del repositorio — no necesitas tocar nada.

Si en cambio usas un **user/organization page** (un repo llamado exactamente
`<tu-usuario>.github.io`), edita `.github/workflows/deploy.yml` y deja `BASE_PATH=""`.

### Despliegue manual (sin Actions)

```bash
BASE_PATH="/tu-repo" npm run build
# sube el contenido de la carpeta build/ a la rama gh-pages con la herramienta que prefieras
```

## Estructura del proyecto

```
src/
  routes/
    +layout.svelte       Layout raíz, importa app.css
    +layout.js            ssr = false (modo SPA)
    +page.svelte           Router de pantallas + vista dividida en escritorio
  lib/
    stores/quote.js         Estado global de la cotización + navegación + persistencia
    utils/
      calculations.js       Subtotal, descuento, impuestos, total
      folio.js               Generación del folio SIGLAS-DDMMYY-HHMM
      pdf.js                  Construcción del PDF con jsPDF
      whatsapp.js             Mensaje + compartir (Web Share API / fallback wa.me)
      storage.js              Wrapper seguro sobre localStorage
    components/
      Logo.svelte, Input.svelte, ProgressIndicator.svelte,
      Toast.svelte, ResumeDraftModal.svelte, QuoteItem.svelte, QuotePreview.svelte
      screens/               Una pantalla del flujo por archivo
```

## Flujo de la app

Inicio → Tipo de cotización → Datos del negocio → Datos del cliente → Productos/servicios
→ Opciones → Vista previa → Cotización generada.

El borrador se guarda automáticamente en `localStorage` en cada cambio. Si el usuario
cierra el navegador a medias, al volver se le ofrece continuar o empezar de nuevo. El
borrador se borra al generar la cotización y pulsar "Crear otra cotización", o al elegir
"Empezar una nueva" explícitamente.

## Notas de diseño

- La identidad visual (tipografía Poppins/Inter, corazón rojo `#E11D2E`, alto contraste
  blanco/negro) sigue el logotipo de referencia proporcionado — no fue rediseñado.
- El indicador de progreso usa corazones (❤ / ♡) como firma visual de la marca.
- En escritorio, las pantallas de formulario muestran una vista previa en vivo al costado;
  en móvil, el flujo es paso a paso con una pantalla de "Vista previa" dedicada.
