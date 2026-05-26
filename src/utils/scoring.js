/**
 * Algoritmo de Priorización (Cascade Hints) & PERFIL BASE
 * Calcula una puntuación para cada categoría de integración basada en las respuestas
 * del nuevo cuestionario de Onboarding (7 preguntas).
 */

export function calculatePriorities(answers) {
  const scores = {
    legal: 0,
    housing: 0,
    work: 0,
    health: 0,
    safety: 0,
    family: 0,
    sociocultural: 0,
    community: 0
  };

  const alerts = [];
  const profile = {
    requiresMusa: false,
    needsEmpadronamiento: false,
    needsTSI: false,
    needsArraigo: false
  };

  // q1: Edad (18-25, 26-35, 36-45, 46-60, 60+)
  if (answers.q1 === '60+') {
    scores.health += 2;
    scores.community += 2;
  }

  // q2: Acompañantes (Array)
  const hasKids = answers.q2?.includes('Con mis hijos');
  const isAlone = answers.q2?.includes('Estoy aquí sola');
  
  if (hasKids) {
    scores.family += 4;
    scores.sociocultural += 2;
  }
  if (isAlone) {
    scores.community += 3;
    scores.safety += 1;
  }

  // q3: Zona (Distrito)
  // No afecta directamente prioridades globales, pero sirve para MUSA

  // q4: Tiempo en BCN
  const isNew = answers.q4 === 'Menos de 3 meses' || answers.q4 === 'Menos de 1 año';
  if (isNew) {
    scores.legal += 2;
    scores.housing += 1;
  }

  // q5: Trabajo
  if (answers.q5 === 'Tengo trabajo pero es sin contrato' || answers.q5 === 'Hago pequeños trabajos aquí y allá') {
    scores.work += 4;
    scores.legal += 2;
  } else if (answers.q5 === 'Me apoya mi familia o ahorros') {
    scores.work += 2;
  }

  // q6: Papeles
  const papelesComplicados = answers.q6 === 'Las cosas están complicadas' || answers.q6 === 'No estoy segura';
  const papelesProceso = answers.q6 === 'Hay algo en proceso';
  
  if (papelesComplicados) {
    scores.legal += 5;
    scores.safety += 2;
  }

  // q7: Preocupación
  if (answers.q7 === 'Entender los trámites legales que debo hacer') scores.legal += 5;
  if (answers.q7 === 'Encontrar un trabajo estable') scores.work += 5;
  if (answers.q7 === 'Mi situación de vivienda') scores.housing += 5;
  if (answers.q7 === 'Mi situación familiar') scores.family += 5;
  if (answers.q7 === 'Mi salud o seguridad') {
    scores.health += 5;
    scores.safety += 5;
  }
  if (answers.q7 === 'Entender el sistema / me siento perdida') {
    scores.community += 4;
    scores.legal += 2;
  }

  // --- REGLAS DEL MOTOR LÓGICO (PERFIL BASE) ---

  // 1. Priorización de Empadronamiento
  // SI la usuaria no tiene empadronamiento (inferido por papeles complicados) Y el bloqueo es vivienda
  if ((papelesComplicados || papelesProceso) && answers.q7 === 'Mi situación de vivienda') {
    profile.needsEmpadronamiento = true;
    alerts.push('Necesita la ruta de declaración de terceros');
    scores.housing += 10; // Fijar como Prioridad 1 (Housing suele incluir Padrón)
    scores.legal += 8;
  }

  // 2. Prioridad Sanitaria Infantil
  // SI papeles complicados/en proceso Y tiene hijos presentes
  if ((papelesComplicados || papelesProceso) && hasKids) {
    profile.needsTSI = true;
    alerts.push('Menor desprotegido detectado. TSI prioritaria.');
    scores.health += 10; // Fijar como Prioridad 2 (o alta)
    scores.family += 8;
  }

  // 3. Ventana de Arraigo
  // SI estatus está expirando/complicado Y tiempo en España es menor a 2 años (menos de 3m, menos de 1a, o 1-3a)
  // Usaremos < 3 años para cubrir la recopilación de pruebas.
  if (papelesComplicados && (isNew || answers.q4 === '1-3 años')) {
    profile.needsArraigo = true;
    alerts.push('Arraigo aún no posible (o en ventana), debe iniciar recopilación de pruebas.');
    scores.legal += 9; // Prioridad 3
  }

  // 4. Acompañamiento MUSA
  // SI se siente ansiosa/perdida Y está sola
  if (answers.q7 === 'Entender el sistema / me siento perdida' && isAlone) {
    profile.requiresMusa = true;
    alerts.push('Oferta de acompañamiento presencial MUSA recomendada.');
    scores.community += 10; // Prioridad alta para integración comunitaria
  }

  // Convertir el objeto de puntuaciones en un array ordenado
  const sortedCategories = Object.keys(scores)
    .map(key => ({ id: key, score: scores[key] }))
    .sort((a, b) => b.score - a.score);

  // Devolver solo los IDs en orden de prioridad
  return {
    prioritizedCategories: sortedCategories.map(cat => cat.id),
    alerts,
    profile
  };
}
