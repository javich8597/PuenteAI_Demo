import { create } from 'zustand'

const useJardinStore = create((set) => ({
  seeds: 3,
  requests: [],

  plantSeed: () => set((state) => ({ seeds: state.seeds + 1 })),
  
  createRequest: (type, description) => set((state) => ({
    requests: [
      { id: Date.now(), type, description, timestamp: new Date().toISOString() },
      ...state.requests
    ]
  }))
}))

export default useJardinStore
