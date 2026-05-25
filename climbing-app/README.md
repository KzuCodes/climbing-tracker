# Climbing Tracker

PWA de seguimiento de entrenamiento de escalada con plan personalizado y persistencia local.

## ✨ Características

- 📋 **Plan semanal completo** con bloques detallados de cada día
- ✅ **Registro de sesiones** con duración, RPE, notas, bloques completados, grado máximo
- 🔥 **Racha flexible** (rompe solo si saltas 2+ días)
- 📊 **Estadísticas**: adherencia semanal, distribución rocódromo/casa, progresión de grado
- 💾 **Persistencia local** con localStorage (funciona offline)
- 📝 **Export a Obsidian** en formato Markdown con frontmatter
- 📥 **Backup/restore** vía JSON
- 📱 **Instalable como PWA** en móvil

## 🚀 Instalación local

```bash
cd climbing-app
npm install
npm run dev
```

Abre `http://localhost:5173` en el navegador.

## 📦 Build de producción

```bash
npm run build
npm run preview
```

Los archivos optimizados quedan en `dist/`.

## 🌐 Deploy

### Opción A — Vercel (recomendada, gratis)

1. Sube el proyecto a GitHub (cuenta `a_ignflesan`).
2. Ve a [vercel.com](https://vercel.com), conecta el repo.
3. Vercel detecta Vite automáticamente. Deploy.
4. Tendrás un dominio tipo `climbing-tracker-xyz.vercel.app`.

### Opción B — Netlify

1. `npm run build`.
2. Arrastra la carpeta `dist/` a [app.netlify.com/drop](https://app.netlify.com/drop).
3. Listo.

### Opción C — Cloudflare Pages

1. Conecta el repo de GitHub a [pages.cloudflare.com](https://pages.cloudflare.com).
2. Build command: `npm run build`. Output: `dist`.

## 📱 Instalar en el móvil (Android)

1. Abre la URL del deploy en Chrome.
2. Menú → "Añadir a pantalla de inicio".
3. La app aparecerá con icono propio y funcionará offline.

En iOS:
1. Abre en Safari.
2. Botón compartir → "Añadir a pantalla de inicio".

## 🔗 Sincronización con Vault de Obsidian

El flujo de sincronización aprovecha tu stack ya existente (Obsidian + FolderSync + Google Drive):

1. En la app, ve a **Ajustes → Exportar a Obsidian (.md)**.
2. Se descarga `entrenamiento-escalada-YYYY-MM-DD.md`.
3. Guárdalo en la carpeta de tu vault Obsidian dentro de Google Drive.
4. FolderSync sincroniza automáticamente a móvil y PC.

**Recomendación**: crea una nota fija en tu vault llamada `Entrenamiento Escalada.md` y sobreescríbela cada vez que exportes. Así mantienes una sola nota actualizada.

### Frontmatter generado

```yaml
---
type: training-log
tags:
  - escalada
  - entrenamiento
exported: 2026-05-25T18:30:00.000Z
total_sessions: 23
---
```

Esto permite consultas Dataview en Obsidian:

````markdown
```dataview
TABLE total_sessions, exported
FROM #escalada AND #entrenamiento
```
````

## 🗂️ Estructura del proyecto

```
climbing-app/
├── public/                  # Static assets
├── src/
│   ├── components/          # UI compartido
│   │   ├── BottomNav.jsx
│   │   └── SessionLogModal.jsx
│   ├── hooks/               # React hooks
│   │   ├── useSessions.js
│   │   └── useSettings.js
│   ├── lib/                 # Lógica de negocio
│   │   ├── storage.js       # Abstracción localStorage / window.storage
│   │   ├── dates.js         # Utilidades de fecha + ISO weeks
│   │   ├── plan.js          # Datos del plan de entrenamiento
│   │   ├── stats.js         # Racha, adherencia, etc.
│   │   └── export.js        # JSON + Markdown Obsidian
│   ├── views/               # Pantallas
│   │   ├── HomeView.jsx
│   │   ├── PlanView.jsx
│   │   ├── HistoryView.jsx
│   │   ├── StatsView.jsx
│   │   └── SettingsView.jsx
│   ├── styles/global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## 🧠 Decisiones de diseño

- **localStorage en vez de IndexedDB**: los datos son ligeros (1 entrada por día), localStorage es más simple y suficiente.
- **Racha flexible**: cuenta días consecutivos con sesión completada permitiendo 1 día de hueco. Rompe solo con 2+ días seguidos sin sesión.
- **Solo informativa la regla "lunes o miércoles rocódromo"**: la app no penaliza, solo registra y muestra estadísticas.
- **Grado máximo solo en rocódromo o sábado**: el campo aparece condicional para no contaminar sesiones de fuerza.
- **Sin backend**: todo es local. Para sincronizar entre dispositivos, usa export/import o el flujo de Obsidian.

## 🛣️ Roadmap

Pendientes para iteraciones futuras (de menor a mayor complejidad):

- [ ] Notificaciones push para recordar sesión
- [ ] Modo "entrenando ahora" con cronómetro por bloque
- [ ] Sugerencias automáticas de progresión (ej: "llevas 3 semanas con 5×15s, sube a 5×20s")
- [ ] Sincronización con Google Calendar (vía MCP ya disponible)
- [ ] Backup automático a Google Drive vía API
- [ ] Modo multi-perfil para usar también con alumnos
- [ ] Integración con un wearable para detectar inicio/fin de sesión

## 📄 Licencia

Uso personal. Stack: React 18 + Vite + Recharts + vite-plugin-pwa.
