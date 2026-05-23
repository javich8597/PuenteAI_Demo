import { useAppStore } from '../../store/useAppStore'
import styles from './LanguageToggle.module.css'

export default function LanguageToggle() {
  const { language, setLanguage } = useAppStore()

  return (
    <div className={styles.toggle}>
      <button 
        className={`${styles.langBtn} ${language === 'es' ? styles.active : ''}`}
        onClick={() => setLanguage('es')}
      >
        ES
      </button>
      <span className={styles.separator}>|</span>
      <button 
        className={`${styles.langBtn} ${language === 'ca' ? styles.active : ''}`}
        onClick={() => setLanguage('ca')}
      >
        CA
      </button>
      <span className={styles.separator}>|</span>
      <button 
        className={`${styles.langBtn} ${language === 'en' ? styles.active : ''}`}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
    </div>
  )
}
