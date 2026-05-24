import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import useAuthStore from './useAuthStore'

const useJardinStore = create((set) => ({
  requests: [],

  // Las semillas ahora se leen desde el useAuthStore, pero mantenemos esta función 
  // para la UI del Jardín
  getSeeds: () => useAuthStore.getState().user?.seeds || 0,

  plantSeed: async () => {
    const { user, updateProfile } = useAuthStore.getState()
    if (!user || user.id === 'guest') return
    
    const newSeeds = (user.seeds || 0) + 1
    
    // Actualizamos en local y en Supabase
    await updateProfile({ seeds: newSeeds })
  },
  
  createRequest: async (type, description) => {
    // Por ahora esto es solo en local / demo temporal hasta crear la tabla groups_requests
    set((state) => ({
      requests: [
        { id: Date.now(), type, description, timestamp: new Date().toISOString() },
        ...state.requests
      ]
    }))
  }
}))

export default useJardinStore
