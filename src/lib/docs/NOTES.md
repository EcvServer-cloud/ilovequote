# Notas de arquitectura — ecosistema `docs`

Este archivo documenta observaciones sobre posible reutilización futura.
Ninguna de estas se implementa todavía — es solo el registro pedido antes de
tocar nada del módulo de cotización.

## Componentes ya 100% genéricos (se reutilizan por import directo, sin cambios)

- `$lib/components/Logo.svelte`
- `$lib/components/Input.svelte`
- `$lib/components/ProgressIndicator.svelte`
- `$lib/components/Toast.svelte`
- `$lib/components/ResumeDraftModal.svelte` (solo emite eventos `resume`/`discard`,
  no depende del store de cotización — se puede envolver en cualquier flujo)
- Clases utilitarias de `src/app.css` (`.btn-primary`, `.btn-secondary`, `.btn-ghost`,
  `.field-input`, `.field-label`, `.card`) y los tokens de `tailwind.config.js`
  ya son compartidos porque son globales al proyecto.

## Candidatos a compartir más adelante (NO se tocan en esta etapa)

- **`QuoteItem.svelte` / `QuotePreview.svelte`**: están acoplados al store
  `quote.js` (importan `$quote` directamente). Si un documento de RH termina
  necesitando una UX de "lista de conceptos editable" muy similar (percepciones,
  deducciones), tendría sentido extraer un `ConceptListEditor` genérico que
  reciba `items`/`onAdd`/`onRemove` por props en vez de leer el store
  directamente. Por ahora, `docs` construye su propio equivalente en
  `shared/components` sin tocar estos archivos.
- **El patrón de "screen shell"** (contenedor `max-w-md`, `ProgressIndicator`,
  título/subtítulo, botones continuar/volver) estaba duplicado en cada pantalla
  de cotización (`BusinessForm.svelte`, `ClientForm.svelte`, etc.). Para `docs`
  ya se extrajo como `shared/components/StepShell.svelte`. Si en el futuro se
  decide refactorizar cotización para usar el mismo shell, sería un cambio
  aislado y explícito — no forma parte de esta etapa.
- **Generador de PDF**: `src/lib/utils/pdf.js` (cotización) y el futuro
  `src/lib/docs/*/template.js` de cada documento comparten la idea de
  "header con logo + tabla autotable + footer de marca", pero se mantienen
  como implementaciones independientes por ahora, tal como se acordó.

## Namespacing de estado (ya implementado)

- Cotización: store `quote.js`, localStorage key `ilovequote:draft`.
- Docs: motor `createDocFlow`, localStorage key `docs:draft:<documentId>`
  (una por tipo de documento, para que nunca se pisen entre sí ni con
  cotización).
