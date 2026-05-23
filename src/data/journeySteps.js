/**
 * journeySteps.js — Pasos del camino de integración
 * Define los hitos que cada usuaria puede completar en su viaje.
 */

export const journeySteps = [
  {
    id: 1,
    title: 'Llegada a Barcelona',
    description: 'Registrar tu llegada y primeros pasos',
    status: 'completed', // 'completed' | 'current' | 'locked'
    icon: '✈️',
  },
  {
    id: 2,
    title: 'Empadronamiento',
    description: 'Inscripción en el padrón municipal',
    status: 'completed',
    icon: '📋',
  },
  {
    id: 3,
    title: 'Tarjeta Sanitaria',
    description: 'Acceso al sistema de salud público',
    status: 'completed',
    icon: '🏥',
  },
  {
    id: 4,
    title: 'Escolarización',
    description: 'Matricular a tus hijos en la escuela',
    status: 'current',
    icon: '🎒',
  },
  {
    id: 5,
    title: 'NIE / TIE',
    description: 'Número de identidad de extranjero',
    status: 'locked',
    icon: '🪪',
  },
  {
    id: 6,
    title: 'Homologación de títulos',
    description: 'Validar tus estudios en España',
    status: 'locked',
    icon: '📜',
  },
  {
    id: 7,
    title: 'Primer empleo',
    description: 'Encontrar tu primer trabajo en Barcelona',
    status: 'locked',
    icon: '💼',
  },
  {
    id: 8,
    title: 'Ciudadanía',
    description: 'Camino a la nacionalidad española',
    status: 'locked',
    icon: '⭐',
  },
]

export default journeySteps
