import React, { useState, useRef } from 'react';
import { useSettings } from '../hooks/useSettings.js';
import { useSessions } from '../hooks/useSessions.js';
import { downloadJSON, downloadObsidianMarkdown, importJSON } from '../lib/export.js';
import { storage } from '../lib/storage.js';

export default function SettingsView() {
  const { settings, updateSetting } = useSettings();
  const { reload } = useSessions();
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  const showMsg = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const result = await importJSON(text);
      await reload();
      showMsg(`Importadas ${result.imported} sesiones.`, 'success');
    } catch (err) {
      showMsg('Error al importar: ' + err.message, 'error');
    }
    e.target.value = '';
  };

  const handleReset = async () => {
    if (!confirm('¿Borrar TODOS los datos? Esto no se puede deshacer.')) return;
    if (!confirm('Última oportunidad. ¿Confirmar borrado total?')) return;
    await storage.wipe();
    await reload();
    showMsg('Todos los datos borrados.', 'success');
  };

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: 'var(--accent)', marginBottom: 6 }}>
          CONFIGURACIÓN
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: 'var(--text)' }}>
          AJUSTES
        </h1>
      </div>

      {message && (
        <div style={{
          padding: 12,
          marginBottom: 16,
          background: message.type === 'error' ? 'var(--danger)' : 'var(--success)',
          color: 'var(--bg)',
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 700,
        }}>
          {message.text}
        </div>
      )}

      {/* Preferences */}
      <Section title="PREFERENCIAS">
        <Label text="Día preferido para rocódromo">
          <select
            value={settings.defaultRocodromoDay}
            onChange={(e) => updateSetting('defaultRocodromoDay', e.target.value)}>
            <option value="lunes">Lunes</option>
            <option value="miercoles">Miércoles</option>
          </select>
        </Label>
        <Label text="Recordatorio diario">
          <input
            type="time"
            value={settings.reminderTime}
            onChange={(e) => updateSetting('reminderTime', e.target.value)}
          />
        </Label>
      </Section>

      {/* Export */}
      <Section title="EXPORTAR DATOS">
        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.6 }}>
          Descarga tus datos en JSON (backup) o en Markdown compatible con Obsidian.
        </p>
        <ActionButton onClick={() => downloadJSON()} icon="💾">
          Descargar JSON (backup)
        </ActionButton>
        <ActionButton onClick={() => downloadObsidianMarkdown()} icon="📝">
          Exportar a Obsidian (.md)
        </ActionButton>
      </Section>

      {/* Obsidian instructions */}
      <Section title="SINCRONIZAR CON OBSIDIAN VAULT">
        <ol style={{
          fontSize: 11, color: 'var(--text-soft)', lineHeight: 1.8,
          paddingLeft: 18, margin: 0,
        }}>
          <li>Pulsa "Exportar a Obsidian (.md)" arriba.</li>
          <li>Guarda el archivo descargado en la carpeta de tu vault Obsidian dentro de Google Drive.</li>
          <li>FolderSync sincronizará el archivo automáticamente a tu móvil y PC.</li>
          <li>Recomendado: crea una nota fija en el vault llamada <code>Entrenamiento Escalada.md</code> y sobreescríbela en cada export.</li>
        </ol>
      </Section>

      {/* Import */}
      <Section title="IMPORTAR DATOS">
        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.6 }}>
          Importar un backup JSON sobreescribe las sesiones existentes con el mismo día.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
        <ActionButton onClick={() => fileInputRef.current?.click()} icon="📂">
          Importar desde JSON
        </ActionButton>
      </Section>

      {/* Danger zone */}
      <Section title="ZONA PELIGROSA">
        <ActionButton onClick={handleReset} icon="⚠️" danger>
          Borrar todos los datos
        </ActionButton>
      </Section>

      {/* About */}
      <div style={{ marginTop: 32, textAlign: 'center', fontSize: 10, color: 'var(--text-dim)' }}>
        Climbing Tracker · v0.1.0<br />
        Datos guardados localmente en este dispositivo.
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontSize: 10, letterSpacing: 3, color: 'var(--text-dim)',
        marginBottom: 12, fontWeight: 700,
        paddingBottom: 6, borderBottom: '1px solid var(--border)',
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Label({ text, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: 'var(--text-soft)', marginBottom: 6 }}>{text}</div>
      {children}
    </div>
  );
}

function ActionButton({ onClick, icon, children, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%',
        padding: '12px 14px',
        background: danger ? 'transparent' : 'var(--bg-card)',
        border: `1px solid ${danger ? 'var(--danger)' : 'var(--border-strong)'}`,
        color: danger ? 'var(--danger)' : 'var(--text)',
        borderRadius: 4,
        fontSize: 12,
        marginBottom: 8,
        textAlign: 'left',
      }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ fontWeight: 600 }}>{children}</span>
    </button>
  );
}
