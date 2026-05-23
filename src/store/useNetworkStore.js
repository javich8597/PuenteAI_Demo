/**
 * useNetworkStore.js
 * ─────────────────────────────────────────────
 * Store para la red ego-network (GNN) de PuenteAI.
 * Gestiona nodos, enlaces y selección en el grafo.
 */

import { create } from 'zustand';
import { mockGraphData } from '../data/network-graph';

const useNetworkStore = create((set, get) => ({
  // ── Estado ──────────────────────────────

  /** Nodos del grafo (usuarios, instituciones, grupos) */
  nodes: mockGraphData.nodes,

  /** Enlaces entre nodos con fuerza de conexión */
  links: mockGraphData.links,

  /** ID del nodo seleccionado (null si ninguno) */
  selectedNode: null,

  /** Filtro por tipo de nodo */
  filterType: 'all', // 'all' | 'user' | 'institution' | 'group'

  /** Mostrar solo ring 1 o también ring 2 (sugerencias GNN) */
  showSuggestions: true,

  // ── Acciones ────────────────────────────

  /**
   * Selecciona un nodo del grafo para ver sus detalles.
   * @param {string} id - ID del nodo
   */
  selectNode: (id) => {
    const node = get().nodes.find((n) => n.id === id) || null;
    set({ selectedNode: node });
  },

  /**
   * Limpia la selección actual.
   */
  clearSelection: () => set({ selectedNode: null }),

  /**
   * Filtra los nodos por tipo.
   * @param {'all'|'user'|'institution'|'group'} type
   */
  setFilterType: (type) => set({ filterType: type }),

  /**
   * Activa/desactiva las sugerencias del GNN (ring 2).
   */
  toggleSuggestions: () =>
    set((state) => ({ showSuggestions: !state.showSuggestions })),

  /**
   * Devuelve los nodos filtrados según el tipo y el ring.
   * @returns {Array} nodos filtrados
   */
  getFilteredNodes: () => {
    const { nodes, filterType, showSuggestions } = get();
    return nodes.filter((node) => {
      const typeMatch = filterType === 'all' || node.group === filterType;
      const ringMatch = showSuggestions || node.ring <= 1;
      return typeMatch && ringMatch;
    });
  },

  /**
   * Devuelve los enlaces válidos para los nodos visibles.
   * @returns {Array} enlaces filtrados
   */
  getFilteredLinks: () => {
    const { links } = get();
    const visibleNodes = get().getFilteredNodes();
    const visibleIds = new Set(visibleNodes.map((n) => n.id));
    return links.filter(
      (link) => visibleIds.has(link.source) && visibleIds.has(link.target)
    );
  },
}));

export default useNetworkStore;
