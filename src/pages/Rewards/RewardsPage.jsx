import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { HeartHandshake, Sprout, HandHeart, Coffee, Info, X } from 'lucide-react'
import useJardinStore from '../../store/useJardinStore'
import styles from './RewardsPage.module.css'

export default function RewardsPage() {
  const navigate = useNavigate()
  const { plantSeed, createRequest, getSeeds } = useJardinStore()
  
  const [activeModal, setActiveModal] = useState(null) // 'need' or 'want'
  const [desc, setDesc] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!desc.trim()) return

    if (activeModal === 'want') {
      plantSeed() // Simula que ofrecer ayuda planta una semilla inmediatamente
    }
    
    createRequest(activeModal, desc)
    setDesc('')
    setActiveModal(null)
    
    // Simula navegación visual a grupos
    setTimeout(() => {
      navigate('/groups')
    }, 1500)
  }

  const seedsCount = getSeeds()

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
            <motion.span key={seedsCount} initial={{ scale: 1.5 }} animate={{ scale: 1 }}>
              <strong>{seedsCount} Semillas</strong> plantadas (tiempo donado)
            </motion.span>
          </div>
        </div>
        <button className={styles.infoBtn} onClick={() => alert('Planta semillas ayudando a otras madres en la comunidad.')}>
          <Info size={20} />
        </button>
      </div>

      <div className={styles.actionsContainer}>
        <motion.button 
          className={`${styles.bigBtn} ${styles.needHelpBtn}`}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveModal('need')}
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
          onClick={() => setActiveModal('want')}
        >
          <div className={styles.btnIconWrapper}>
            <HandHeart size={48} />
          </div>
          <h2>Quiero ayudar hoy</h2>
          <p>Ver quién lo necesita</p>
        </motion.button>
      </div>

      <AnimatePresence>
        {activeModal && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
            >
              <div className={styles.modalHeader}>
                <h2>{activeModal === 'need' ? 'Pedir Ayuda' : 'Ofrecer Ayuda'}</h2>
                <button onClick={() => setActiveModal(null)} className={styles.closeBtn}>
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className={styles.modalForm}>
                <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)'}}>
                  {activeModal === 'need' 
                    ? '¿En qué te podemos ayudar? (Ej: "Necesito alguien que recoja a mi niño a las 17h")'
                    : '¿En qué te gustaría ayudar hoy? (Ej: "Tengo un par de horas libres para acompañar al médico")'}
                </p>
                <textarea 
                  placeholder="Escribe aquí..." 
                  className={styles.modalTextarea}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={4}
                />
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={!desc.trim()}
                  style={{ backgroundColor: activeModal === 'need' ? 'var(--color-primary)' : 'var(--color-success)' }}
                >
                  Publicar en la Comunidad
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
