import { useNavigate } from 'react-router'
import { Phone } from 'lucide-react'
import styles from './EmergencyFAB.module.css'

export default function EmergencyFAB() {
  const navigate = useNavigate()

  return (
    <button 
      className={styles.fab} 
      onClick={() => navigate('/safety')}
      aria-label="Emergencia - Ayuda rápida"
    >
      <Phone size={24} color="white" />
      <span className={styles.pulse}></span>
    </button>
  )
}
