import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { HeartHandshake, Sprout, HandHeart, Info, X } from 'lucide-react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import toast from 'react-hot-toast'
import useJardinStore from '../../store/useJardinStore'
import styles from './RewardsPage.module.css'
import { useTranslation } from '../../hooks/useTranslation'

export default function RewardsPage() {
  const navigate = useNavigate()
  const { plantSeed, createRequest, getSeeds } = useJardinStore()
  const { t } = useTranslation()
  const { width, height } = useWindowSize()
  
  const [activeModal, setActiveModal] = useState(null) // 'need' or 'want'
  const [desc, setDesc] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!desc.trim()) return

    if (activeModal === 'want') {
      plantSeed() // Simula que ofrecer ayuda planta una semilla inmediatamente
      setShowConfetti(true)
      toast.success('¡Has plantado una nueva semilla de apoyo!', {
        icon: '🌱'
      })
      setTimeout(() => setShowConfetti(false), 4000)
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
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} colors={['#81B29A', '#E07A5F', '#F2CC8F', '#3D405B']} />}
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <Sprout size={32} color="var(--color-success)" />
          <h1 className={styles.title}>{t('rewards.title')}</h1>
        </div>
        <p className={styles.subtitle}>
          {t('rewards.subtitle')}
        </p>
      </header>

      <div className={styles.statusCard}>
        <div className={styles.statusInfo}>
          <h3>{t('rewards.status_title')}</h3>
          <div className={styles.seedCount}>
            <Sprout size={24} color="var(--color-success)" />
            <motion.span key={seedsCount} initial={{ scale: 1.5 }} animate={{ scale: 1 }}>
              <strong>{t('rewards.seeds_count', { count: seedsCount })}</strong> {t('rewards.seeds_desc')}
            </motion.span>
          </div>
        </div>
        <button className={styles.infoBtn} onClick={() => alert(t('rewards.info_alert'))}>
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
          <h2>{t('rewards.need_help_title')}</h2>
          <p>{t('rewards.need_help_desc')}</p>
        </motion.button>

        <motion.button 
          className={`${styles.bigBtn} ${styles.wantHelpBtn}`}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveModal('want')}
        >
          <div className={styles.btnIconWrapper}>
            <HandHeart size={48} />
          </div>
          <h2>{t('rewards.offer_help_title')}</h2>
          <p>{t('rewards.offer_help_desc')}</p>
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
                <h2>{activeModal === 'need' ? t('rewards.modal_need_title') : t('rewards.modal_offer_title')}</h2>
                <button onClick={() => setActiveModal(null)} className={styles.closeBtn}>
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className={styles.modalForm}>
                <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)'}}>
                  {activeModal === 'need' 
                    ? t('rewards.modal_need_desc')
                    : t('rewards.modal_offer_desc')}
                </p>
                <textarea 
                  placeholder={t('rewards.modal_placeholder')} 
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
                  {t('rewards.modal_submit')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
