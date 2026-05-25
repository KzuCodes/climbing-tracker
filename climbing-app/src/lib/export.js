// export.js — utilidades de exportación e importación

import { storage } from './storage.js';

/**
 * Exporta todos los datos a un objeto JSON.
 */
export async function exportAllJSON() {
  const sessions = await storage.getAllWithPrefix('sessions:');
  const profile = await storage.get('profile');
  const settings = await storage.get('settings');

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile,
    settings,
    sessions: sessions.sort((a, b) => a.date.localeCompare(b.date)),
  };
}

/**
 * Descarga JSON como archivo.
 */
export async function downloadJSON() {
  const data = await exportAllJSON();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `climbing-tracker-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Importa desde JSON, sobrescribiendo datos existentes.
 */
export async function importJSON(jsonString) {
  const data = JSON.parse(jsonString);
  if (!data.sessions || !Array.isArray(data.sessions)) {
    throw new Error('Formato inválido: falta "sessions".');
  }

  if (data.profile) await storage.set('profile', data.profile);
  if (data.settings) await storage.set('settings', data.settings);

  for (const session of data.sessions) {
    if (session.date) await storage.set(`sessions:${session.date}`, session);
  }

  return { imported: data.sessions.length };
}

/**
 * Genera un archivo Markdown compatible con Obsidian.
 * Frontmatter YAML + sección por sesión.
 *
 * Para sincronizar con vault Obsidian + FolderSync:
 * 1. Descargar el archivo .md desde la app.
 * 2. Guardarlo en la carpeta del vault Obsidian dentro de Google Drive.
 * 3. FolderSync lo subirá al móvil/PC automáticamente.
 */
export async function exportObsidianMarkdown() {
  const data = await exportAllJSON();
  const sessions = data.sessions || [];

  const lines = [];

  // Frontmatter
  lines.push('---');
  lines.push('type: training-log');
  lines.push('tags:');
  lines.push('  - escalada');
  lines.push('  - entrenamiento');
  lines.push(`exported: ${data.exportedAt}`);
  lines.push(`total_sessions: ${sessions.filter((s) => s.completed).length}`);
  lines.push('---');
  lines.push('');
  lines.push('# Diario de entrenamiento — Escalada');
  lines.push('');
  lines.push(`> Exportado desde Climbing Tracker el ${new Date().toLocaleDateString('es-ES')}.`);
  lines.push('');

  // Resumen
  const completed = sessions.filter((s) => s.completed);
  const rocodromo = completed.filter((s) => s.variant === 'rocodromo').length;
  const totalMinutes = completed.reduce((sum, s) => sum + (s.duration || 0), 0);

  lines.push('## Resumen');
  lines.push('');
  lines.push(`- **Sesiones completadas:** ${completed.length}`);
  lines.push(`- **Rocódromo:** ${rocodromo}`);
  lines.push(`- **Casa/parque:** ${completed.length - rocodromo}`);
  lines.push(`- **Tiempo total:** ${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}min`);
  lines.push('');

  // Sesiones cronológicas
  lines.push('## Sesiones');
  lines.push('');

  const sorted = [...completed].sort((a, b) => b.date.localeCompare(a.date));
  for (const s of sorted) {
    lines.push(`### ${s.date} — ${s.dayType.toUpperCase()}`);
    lines.push('');
    if (s.variant) lines.push(`- **Tipo:** ${s.variant === 'rocodromo' ? '🧗 Rocódromo' : '💪 Casa/Parque'}`);
    if (s.duration) lines.push(`- **Duración:** ${s.duration} min`);
    if (s.perceivedEffort) lines.push(`- **RPE:** ${s.perceivedEffort}/10`);
    if (s.maxGrade) lines.push(`- **Grado máximo:** ${s.maxGrade}`);
    if (s.completedBlocks?.length) lines.push(`- **Bloques completados:** ${s.completedBlocks.length}`);
    if (s.notes) {
      lines.push('');
      lines.push(`> ${s.notes.replace(/\n/g, '\n> ')}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

export async function downloadObsidianMarkdown() {
  const md = await exportObsidianMarkdown();
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `entrenamiento-escalada-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
