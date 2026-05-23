import { X } from 'lucide-react'
import styles from './QuickExitButton.module.css'

export default function QuickExitButton() {
  const handleExit = () => {
    // Immediately redirect to a safe site like Google and replace history
    window.location.replace('https://www.google.com')
  }

  return (
    <button 
      className={styles.quickExit} 
      onClick={handleExit}
      title="Salida Rápida"
      aria-label="Cerrar aplicación rápidamente"
    >
      <X size={16} />
    </button>
  )
}
