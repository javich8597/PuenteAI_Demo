import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { HeartHandshake, Sprout, HandHeart, Coffee, Info } from 'lucide-react'
import styles from './RewardsPage.module.css'

export default function RewardsPage() {
  const navigate = useNavigate()

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <Sprout size={32} color="var(--color-success)" />
          <h1 className={styles.title}>Jardín de Apoyo</h1>
        </div>
        <p className={styles.subtitle}>
          Nuestra comunidad funciona intercambiando tiempo. Pide ayuda cuando la necesites, y ayuda cuando puedas.
        </p>
      </header>

      <div className={styles.statusCard}>
        <div className={styles.statusInfo}>
          <h3>Tu Jardín ha crecido:</h3>
          <div className={styles.seedCount}>
            <Coffee size={24} color="var(--color-primary)" />
            <span><strong>3 Semillas</strong> plantadas (tiempo donado)</span>
          </div>
        </div>
        <button className={styles.infoBtn}>
          <Info size={20} />
        </button>
      </div>

      <div className={styles.actionsContainer}>
        <motion.button 
          className={`${styles.bigBtn} ${styles.needHelpBtn}`}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/groups')}
        >
          <div className={styles.btnIconWrapper}>
            <HeartHandshake size={48} />
          </div>
          <h2>Necesito una mano</h2>
          <p>Crear petición</p>
        </motion.button>

        <motion.button 
          className={`${styles.bigBtn} ${styles.wantHelpBtn}`}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/groups')}
        >
          <div className={styles.btnIconWrapper}>
            <HandHeart size={48} />
          </div>
          <h2>Quiero ayudar hoy</h2>
          <p>Ver quién lo necesita</p>
        </motion.button>
      </div>

    </motion.div>
  )
}
