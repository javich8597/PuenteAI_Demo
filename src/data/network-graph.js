export const mockGraphData = {
  nodes: [
    { id: 'me', name: 'Tú', type: 'user', ring: 0, group: 'user' },
    
    // Ring 1 - Conocidos
    { id: 'maria', name: 'María C.', type: 'user', ring: 1, group: 'user', trustScore: 95 },
    { id: 'cruz_roja', name: 'Cruz Roja', type: 'institution', ring: 1, group: 'institution', trustScore: 100 },
    { id: 'grupo_madres', name: 'Madres BCN', type: 'group', ring: 1, group: 'group', trustScore: 88 },
    { id: 'laura', name: 'Laura', type: 'user', ring: 1, group: 'user', trustScore: 92 },
    
    // Ring 2 - Sugerencias GNN
    { id: 'ana', name: 'Ana M.', type: 'user', ring: 2, group: 'user', trustScore: 78 },
    { id: 'caritas', name: 'Cáritas', type: 'institution', ring: 2, group: 'institution', trustScore: 95 },
    { id: 'taller_empleo', name: 'Empleo Tech', type: 'group', ring: 2, group: 'group', trustScore: 82 },
    { id: 'hospital_clinic', name: 'Clínic', type: 'institution', ring: 2, group: 'institution', trustScore: 100 },
    { id: 'sofia', name: 'Sofía', type: 'user', ring: 2, group: 'user', trustScore: 85 }
  ],
  links: [
    // Mis conexiones (Ring 1)
    { source: 'me', target: 'maria', strength: 2 },
    { source: 'me', target: 'cruz_roja', strength: 2 },
    { source: 'me', target: 'grupo_madres', strength: 2 },
    { source: 'me', target: 'laura', strength: 2 },
    
    // Conexiones de mis conocidos a las sugerencias GNN (Ring 2)
    { source: 'maria', target: 'ana', strength: 1 },
    { source: 'cruz_roja', target: 'caritas', strength: 1 },
    { source: 'grupo_madres', target: 'taller_empleo', strength: 1 },
    { source: 'cruz_roja', target: 'hospital_clinic', strength: 1 },
    { source: 'laura', target: 'sofia', strength: 1 },
    
    // Cross connections
    { source: 'ana', target: 'taller_empleo', strength: 1 },
    { source: 'sofia', target: 'grupo_madres', strength: 1 }
  ]
};
