/**
 * Algoritmo de Priorización (Cascade Hints)
 * Calcula una puntuación para cada categoría de integración basada en las respuestas
 * del cuestionario de Onboarding.
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

  // q1: Tiempo en Barcelona
  if (answers.q1 === 'q1_a1') { // Menos de 3 meses
    scores.legal += 3;
    scores.housing += 2;
  } else if (answers.q1 === 'q1_a2') {
    scores.work += 2;
    scores.community += 1;
  }

  // q2: Trabajo
  if (answers.q2 === 'q2_a2') { // Sin contrato
    scores.legal += 2;
    scores.work += 3;
    scores.safety += 1;
  } else if (answers.q2 === 'q2_a3') { // Inestable
    scores.work += 3;
    scores.housing += 1;
  } else if (answers.q2 === 'q2_a4') { // No
    scores.work += 4;
  }

  // q3: Vivienda
  if (answers.q3 === 'q3_a1') { // Sin vivienda estable
    scores.housing += 5;
    scores.safety += 2;
    scores.health += 1;
  } else if (answers.q3 === 'q3_a2') { // Con alguien
    scores.housing += 2;
  }

  // q4: Dependientes
  if (answers.q4 === 'q4_a1') { // Hijos en BCN
    scores.family += 4;
    scores.sociocultural += 2; // Educación
    scores.health += 1;
  } else if (answers.q4 === 'q4_a3') { // Familiar mayor
    scores.family += 3;
    scores.health += 2;
  }

  // q5: Documentos
  if (answers.q5 === 'q5_a1') { // Solo pasaporte
    scores.legal += 4;
    scores.work += 1;
  } else if (answers.q5 === 'q5_a4') { // No segura
    scores.legal += 5;
  }

  // q6: Principal preocupación
  if (answers.q6 === 'q6_a1') scores.legal += 5;
  if (answers.q6 === 'q6_a2') scores.work += 5;
  if (answers.q6 === 'q6_a3') scores.housing += 5;
  if (answers.q6 === 'q6_a4') scores.family += 5;
  if (answers.q6 === 'q6_a5') {
    scores.health += 4;
    scores.safety += 4;
  }
  if (answers.q6 === 'q6_a6') {
    scores.community += 3;
    scores.sociocultural += 3;
  }

  // Convertir el objeto de puntuaciones en un array ordenado
  const sortedCategories = Object.keys(scores)
    .map(key => ({ id: key, score: scores[key] }))
    .sort((a, b) => b.score - a.score);

  // Devolver solo los IDs en orden de prioridad
  return sortedCategories.map(cat => cat.id);
}
