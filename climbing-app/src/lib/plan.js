// plan.js — datos del plan de entrenamiento

export const PLAN = [
  {
    id: 'lunes',
    label: 'LUNES',
    tag: 'Rocódromo o Fuerza',
    tagColor: '#ff6b35',
    alt: true,
    variants: [
      {
        id: 'rocodromo',
        label: '🧗 Con rocódromo',
        blocks: [
          { id: 'cal', title: 'Calentamiento', duration: '15 min', color: '#ffd166',
            items: ['Movilidad muñecas, hombros y caderas — 5 min', 'Traversing fácil (mínimo grado) sin parar — 10 min'] },
          { id: 'tech', title: 'Técnica de pies', duration: '20 min', color: '#06d6a0',
            items: ['Boulder fácil (2 grados bajo tu máximo) pisando con precisión', "Ejercicio 'pies silenciosos': si el pie hace ruido, repite el movimiento", '4 series de 4 min con 2 min de descanso'] },
          { id: 'main', title: 'Bloque principal — Resistencia', duration: '30 min', color: '#118ab2',
            items: ['ARC training: escalar continuamente a baja intensidad sin bombear', '2 × 20 min con 5 min de descanso en vías fáciles (3 grados bajo tu max)', 'Objetivo: antebrazo levemente hinchado pero sin fallo'] },
          { id: 'str', title: 'Fuerza complementaria', duration: '15 min', color: '#ef476f',
            items: ['Dominadas australianas en barra baja: 3 × 8', 'Dead hangs pasivos en barra: 3 × 10 seg (agarre completo)', 'Flexiones con manos juntas: 3 × 6'] },
          { id: 'cool', title: 'Vuelta a la calma', duration: '10 min', color: '#9b5de5',
            items: ['Estirar flexores de dedos (dobla dedos hacia atrás suavemente)', 'Estiramiento de antebrazo pronado y supinado', 'Rotaciones de hombro con banda imaginaria'] },
        ],
      },
      {
        id: 'casa',
        label: '💪 Sin rocódromo (fuerza)',
        blocks: [
          { id: 'cal', title: 'Calentamiento', duration: '10 min', color: '#ffd166',
            items: ['Jumping jacks + movilidad articular — 5 min', 'Activación de escápulas: retracciones en barra — 2 × 10'] },
          { id: 'grip', title: 'Fuerza de agarre', duration: '25 min', color: '#118ab2',
            items: ['Dead hangs en barra: 5 × 15 seg con 45 seg descanso', 'Progresión: semana 1-2 agarre completo, semana 3-4 un dedo doblado (crimp suave)', 'Intentar aumentar 5 seg por semana'] },
          { id: 'pull', title: 'Tirón y empuje', duration: '20 min', color: '#06d6a0',
            items: ['Dominadas negativas (bajar lento 5 seg): 4 × 4', 'Remo invertido en barra baja: 3 × 8', 'Fondos en paralelas o banco: 3 × 8'] },
          { id: 'core', title: 'Core específico escalada', duration: '10 min', color: '#ef476f',
            items: ['Hollow body hold: 3 × 20 seg', 'Elevación de piernas en barra: 3 × 8', 'Planchas laterales: 2 × 20 seg cada lado'] },
        ],
      },
    ],
  },
  {
    id: 'miercoles',
    label: 'MIÉRCOLES',
    tag: 'Rocódromo o Movilidad',
    tagColor: '#118ab2',
    alt: true,
    variants: [
      {
        id: 'rocodromo',
        label: '🧗 Con rocódromo',
        blocks: [
          { id: 'cal', title: 'Calentamiento', duration: '15 min', color: '#ffd166',
            items: ['Traversing fácil — 10 min', 'Ejercicios de apertura de cadera dinámica — 5 min'] },
          { id: 'proj', title: 'Proyecto del día — Boulder', duration: '35 min', color: '#ff6b35',
            items: ['Elige 2-3 problemas de boulder en tu límite (6a o justo debajo)', '4-6 intentos por problema con 3-4 min descanso entre intentos', 'Foco en leer la secuencia antes de intentar'] },
          { id: 'res', title: 'Resistencia de contacto', duration: '20 min', color: '#118ab2',
            items: ['4 × 4: escala 4 movimientos difíciles, descansa 4 min — repite 4 veces', 'Intensidad alta pero controlada, sin fallo muscular total'] },
          { id: 'ant', title: 'Antagonistas (crucial para lesiones)', duration: '10 min', color: '#9b5de5',
            items: ['Extensiones de dedos con goma o pelota de tenis: 3 × 15', 'Rotación externa de hombro con banda: 3 × 12', 'Estiramientos de pecho y bíceps'] },
        ],
      },
      {
        id: 'casa',
        label: '🧘 Sin rocódromo (movilidad)',
        blocks: [
          { id: 'mob', title: 'Movilidad activa', duration: '20 min', color: '#06d6a0',
            items: ['Apertura de cadera: Pigeon pose dinámica 3 × 30 seg', 'Hip flexor stretch con rotación de torso', 'Yoga squat profundo: 3 × 30 seg'] },
          { id: 'pre', title: 'Prehabilitación dedos', duration: '15 min', color: '#ffd166',
            items: ['Rice bucket (si tienes) o extensiones con goma: 3 × 20', 'Puño cerrado → dedos extendidos lento: 3 × 15', 'Masaje con pelota de tenis en palma y antebrazo'] },
          { id: 'sho', title: 'Fuerza de hombro y escápula', duration: '20 min', color: '#ef476f',
            items: ['YTW en barra: Y (brazos arriba), T (lateral), W (doblado) — 3 × 8', 'Retracciones escapulares en barra muerta: 3 × 10', 'Face pulls imaginarios con tensión muscular consciente: 3 × 15'] },
        ],
      },
    ],
  },
  {
    id: 'viernes',
    label: 'VIERNES',
    tag: 'Fuerza + Resistencia',
    tagColor: '#06d6a0',
    alt: false,
    blocks: [
      { id: 'cal', title: 'Calentamiento', duration: '10 min', color: '#ffd166',
        items: ['Movilidad completa: muñecas, codos, hombros, caderas — 5 min', 'Cardio ligero: saltar a la comba o trote — 5 min'] },
      { id: 'grip', title: 'Fuerza de dedos — Bloque A', duration: '25 min', color: '#ff6b35',
        items: ['Dead hangs progresivos en barra (agarre crimp cerrado suave): 6 × 10 seg', 'Descanso 2 min entre series', 'Si puedes hacer 10 seg con facilidad → añade 5 seg la siguiente sesión'] },
      { id: 'pull', title: 'Tirón vertical y horizontal', duration: '20 min', color: '#118ab2',
        items: ['Dominadas o negativas: 4 × máx (mín. 3 reps) con 3 min descanso', 'Remo invertido: 3 × 10', 'Si no puedes hacer dominadas: jump-and-lower (salta arriba y baja lento 5 seg)'] },
      { id: 'res', title: 'Circuito de resistencia', duration: '15 min', color: '#9b5de5',
        items: ['3 rondas sin descanso entre ejercicios:', 'Dead hang 10 seg → Remo invertido × 6 → Hollow hold 20 seg', '2 min descanso entre rondas'] },
      { id: 'cool', title: 'Vuelta a la calma obligatoria', duration: '10 min', color: '#06d6a0',
        items: ['Estiramiento de dedos (hacia atrás) sostenido 30 seg × 3', 'Masaje con pelota en antebrazo y palma', 'Estiramiento de lats y dorsales en barra (colgar relajado 30 seg)'] },
    ],
  },
  {
    id: 'sabado',
    label: 'SÁBADO',
    tag: 'Sesión larga + técnica',
    tagColor: '#9b5de5',
    alt: false,
    blocks: [
      { id: 'cal', title: 'Calentamiento largo', duration: '20 min', color: '#ffd166',
        items: ['Movilidad completa de cuerpo — 10 min', 'Traversing o escalada muy fácil para activar — 10 min'] },
      { id: 'tech', title: 'Técnica consciente', duration: '40 min', color: '#06d6a0',
        items: ['Escoge 4 rutas/bloques y escálalas con foco en un aspecto técnico distinto:', 'Ruta 1: centro de gravedad bajo y próximo a la pared', 'Ruta 2: transiciones de pie precisas (sin mirar las manos)', 'Ruta 3: respiración controlada en cada movimiento', 'Ruta 4: lectura de ruta completa antes de salir del suelo'] },
      { id: 'arc', title: 'Resistencia aeróbica (ARC)', duration: '30 min', color: '#118ab2',
        items: ['2 × 15 min de escalada continua en rutas fáciles (sin parar)', 'Objetivo: mantener el antebrazo bombeado levemente pero nunca fallar', '5 min descanso entre bloques'] },
      { id: 'free', title: 'Juego libre', duration: '20 min', color: '#ff6b35',
        items: ['Escala lo que quieras sin estructura — disfruta', 'Intenta ese proyecto que llevas semanas mirando', 'Muévete por el rocódromo sin agenda'] },
    ],
  },
  {
    id: 'domingo',
    label: 'DOMINGO',
    tag: 'Recuperación activa',
    tagColor: '#ffd166',
    alt: false,
    blocks: [
      { id: 'a', title: 'Opción A — Recuperación activa', duration: '30-45 min', color: '#06d6a0',
        items: ['Caminata o rodada suave de bici — 30 min', 'Yoga o stretching general — 15 min', 'Foco en hombros, espalda baja y caderas'] },
      { id: 'b', title: 'Opción B — Descanso total', duration: '—', color: '#9b5de5',
        items: ['Reposo completo si tienes agujetas o sensación de fatiga acumulada', 'Masaje de dedos y antebrazo con aceite o crema', 'Visualización mental: repasa secuencias de tus proyectos'] },
      { id: 'chk', title: 'Check semanal', duration: '5 min', color: '#ef476f',
        items: ['¿Algún dedo o tendón molesto? → Reduce volumen la próxima semana', '¿Te sentiste fuerte? → Añade 5-10% de volumen o intensidad', 'Anota en una libreta el grado más alto escalado esta semana'] },
    ],
  },
];

export function getDayPlan(dayId) {
  return PLAN.find((d) => d.id === dayId);
}

export function getBlocksForSession(dayId, variantId = null) {
  const day = getDayPlan(dayId);
  if (!day) return [];
  if (day.alt && variantId) {
    const variant = day.variants.find((v) => v.id === variantId);
    return variant?.blocks || [];
  }
  return day.blocks || [];
}
