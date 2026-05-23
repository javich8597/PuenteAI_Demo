import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { Shield, EyeOff, UserX, Database, ChevronLeft, AlertTriangle } from 'lucide-react'
import Switch from '../../components/ui/Switch'
import useAuthStore from '../../store/useAuthStore'
import styles from './PrivacyPage.module.css'

export default function PrivacyPage() {
  const navigate = useNavigate()
  const { user, logout, isGuest } = useAuthStore()
  
  // Local state for toggles (mocking real privacy settings)
  const [incognito, setIncognito] = useState(isGuest)
  const [hideLocation, setHideLocation] = useState(false)
  const [hideStatus, setHideStatus] = useState(false)

  const handleDeleteData = () => {
    if (window.confirm('¿Estás segura de que quieres eliminar todos tus datos de PuenteAI? Esta acción no se puede deshacer.')) {
      logout()
      navigate('/entry')
    }
  }

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className={styles.header}>
        <div className={styles.headerIcon}>
          <Shield size={32} color="var(--color-secondary)" />
        </div>
        <h1 className={styles.title}>Privacidad y Seguridad</h1>
        <p className={styles.subtitle}>
          Tú controlas quién ve qué. PuenteAI está diseñado para proteger tu identidad.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Modo Incógnito</h2>
        <div className={styles.card}>
          <Switch 
            label="Navegar en Modo Incógnito" 
            description="Nadie podrá ver que estás conectada ni ver tu perfil. Te mostrarás como 'Usuaria Anónima'."
            checked={incognito}
            onChange={setIncognito}
          />
          {incognito && (
            <motion.div 
              className={styles.alertBox}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <EyeOff size={16} />
              <span>Estás navegando de forma totalmente anónima.</span>
            </motion.div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tus Datos en la Comunidad</h2>
        <div className={styles.cardGroup}>
          <div className={styles.cardItem}>
            <Switch 
              label="Ocultar mi barrio" 
              description="No recomendaremos grupos locales ni mostraremos tu ubicación aproximada."
              checked={hideLocation}
              onChange={setHideLocation}
            />
          </div>
          <div className={styles.divider} />
          <div className={styles.cardItem}>
            <Switch 
              label="Ocultar mi tiempo en Barcelona" 
              description="No mostraremos tu experiencia a otras madres."
              checked={hideStatus}
              onChange={setHideStatus}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tus Datos y MUSA</h2>
        <div className={styles.infoCard}>
          <Database size={24} className={styles.infoIcon} />
          <div className={styles.infoText}>
            <h3>¿Qué sabemos de ti?</h3>
            <p>
              Solo guardamos tu nombre o apodo ({user?.name || 'Invitada'}) y tus preferencias de categoría para la GNN de recomendaciones. No guardamos IPs, ubicaciones exactas ni datos bancarios.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.dangerZone}>
        <h2 className={styles.dangerTitle}>Zona de Peligro</h2>
        <button className={styles.dangerBtn} onClick={handleDeleteData}>
          <UserX size={18} />
          Borrar mi cuenta y todos mis datos
        </button>
      </section>

    </motion.div>
  )
}
