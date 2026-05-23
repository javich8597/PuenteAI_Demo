/**
 * users.js
 * ─────────────────────────────────────────────
 * Datos mock de usuarios para PuenteAI.
 * Perfiles realistas de madres colombianas en Barcelona.
 */

export const mockUsers = [
  {
    id: 'user-001',
    name: 'Carolina Restrepo',
    avatar: 'CR',
    timeInBarcelona: '3 meses',
    neighborhood: 'Raval',
    categories: ['vivienda', 'salud', 'educacion'],
    points: 120,
    badges: ['primera-pregunta', 'verificada'],
    bio: 'Mamá de dos niños, recién llegada de Medellín. Buscando colegio para mis hijos y orientación con el empadronamiento.',
    isVerified: true,
  },
  {
    id: 'user-002',
    name: 'Valentina Ospina',
    avatar: 'VO',
    timeInBarcelona: '1 año',
    neighborhood: 'Eixample',
    categories: ['trabajo', 'legal', 'social'],
    points: 450,
    badges: ['mentora', 'primera-pregunta', 'verificada', '10-respuestas'],
    bio: 'Psicóloga de Bogotá, en proceso de homologar mi título. Trabajo como cuidadora mientras tanto. Feliz de ayudar a quien pueda.',
    isVerified: true,
  },
  {
    id: 'user-003',
    name: 'Luisa Hernández',
    avatar: 'LH',
    timeInBarcelona: '6 meses',
    neighborhood: 'Sants-Montjuïc',
    categories: ['vivienda', 'trabajo', 'legal'],
    points: 230,
    badges: ['primera-pregunta', '5-respuestas'],
    bio: 'Mamá soltera de un bebé de 8 meses. Vine de Cali buscando mejores oportunidades. Necesito ayuda con temas de NIE.',
    isVerified: false,
  },
  {
    id: 'user-004',
    name: 'Andrea Muñoz',
    avatar: 'AM',
    timeInBarcelona: '2 años',
    neighborhood: 'Gràcia',
    categories: ['educacion', 'social', 'salud'],
    points: 780,
    badges: ['mentora', 'experta-educacion', 'verificada', '25-respuestas', 'primera-pregunta'],
    bio: 'Profesora de primaria de Barranquilla. Ya tengo mi título homologado y trabajo en un colegio. Encantada de compartir mi experiencia.',
    isVerified: true,
  },
  {
    id: 'user-005',
    name: 'Marcela Gómez',
    avatar: 'MG',
    timeInBarcelona: '4 meses',
    neighborhood: 'Nou Barris',
    categories: ['salud', 'vivienda', 'legal'],
    points: 90,
    badges: ['primera-pregunta'],
    bio: 'Llegué de Pereira con mis dos hijas. Estoy buscando piso y necesito la tarjeta sanitaria para las niñas.',
    isVerified: false,
  },
  {
    id: 'user-006',
    name: 'Natalia Cardona',
    avatar: 'NC',
    timeInBarcelona: '8 meses',
    neighborhood: 'Sant Martí',
    categories: ['trabajo', 'educacion', 'social'],
    points: 310,
    badges: ['primera-pregunta', 'verificada', '10-respuestas'],
    bio: 'Contadora de Bucaramanga. Trabajo en hostelería y estudio catalán por las noches. Busco grupo de estudio.',
    isVerified: true,
  },
  {
    id: 'user-007',
    name: 'Diana Torres',
    avatar: 'DT',
    timeInBarcelona: '1 año y medio',
    neighborhood: 'Horta-Guinardó',
    categories: ['legal', 'salud', 'trabajo'],
    points: 560,
    badges: ['mentora', 'experta-legal', 'verificada', '15-respuestas'],
    bio: 'Abogada de Cartagena. Conozco bien los trámites de extranjería. Pregúntame lo que necesites sobre papeles.',
    isVerified: true,
  },
  {
    id: 'user-008',
    name: 'Camila Ríos',
    avatar: 'CRi',
    timeInBarcelona: '2 meses',
    neighborhood: 'Ciutat Vella',
    categories: ['vivienda', 'salud', 'educacion'],
    points: 40,
    badges: [],
    bio: 'Acabo de llegar de Manizales con mi hijo de 5 años. Todo es muy nuevo para mí, agradezco cualquier consejo.',
    isVerified: false,
  },
];

/**
 * Busca un usuario por su ID.
 * @param {string} id
 * @returns {Object|undefined}
 */
export const getUserById = (id) => mockUsers.find((u) => u.id === id);

/**
 * Filtra usuarios por barrio.
 * @param {string} neighborhood
 * @returns {Array}
 */
export const getUsersByNeighborhood = (neighborhood) =>
  mockUsers.filter((u) => u.neighborhood === neighborhood);

export default mockUsers;
