import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { Shield, EyeOff, UserX, Database, ChevronLeft, AlertTriangle } from 'lucide-react'
import Switch from '../../components/ui/Switch'
import useAuthStore from '../../store/useAuthStore'
import { useTranslation } from '../../hooks/useTranslation'
import styles from './PrivacyPage.module.css'

export default function PrivacyPage() {
  const navigate = useNavigate()
  const { user, logout, isGuest, isAdmin } = useAuthStore()
  const { t } = useTranslation()

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
        <h1 className={styles.title}>{t('privacy.title')}</h1>
        <p className={styles.subtitle}>
          {t('privacy.subtitle')}
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('privacy.incognito_title')}</h2>
        <div className={styles.card}>
          <Switch 
            label={t('privacy.incognito_label')}
            description={t('privacy.incognito_desc')}
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
              <span>{t('privacy.incognito_alert')}</span>
            </motion.div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('privacy.community_data')}</h2>
        <div className={styles.cardGroup}>
          <div className={styles.cardItem}>
            <Switch 
              label={t('privacy.hide_location')}
              description={t('privacy.hide_location_desc')}
              checked={hideLocation}
              onChange={setHideLocation}
            />
          </div>
          <div className={styles.divider} />
          <div className={styles.cardItem}>
            <Switch 
              label={t('privacy.hide_time')}
              description={t('privacy.hide_time_desc')}
              checked={hideStatus}
              onChange={setHideStatus}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('privacy.musa_data')}</h2>
        <div className={styles.infoCard}>
          <Database size={24} className={styles.infoIcon} />
          <div className={styles.infoText}>
            <h3>{t('privacy.what_we_know')}</h3>
            <p>
              {t('privacy.musa_desc', { name: user?.name || 'Invitada' })}
            </p>
          </div>
        </div>
      </section>

      {isAdmin && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Administración</h2>
          <div className={styles.card} style={{ borderLeft: '4px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Panel de Administración</h3>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Accede al panel MUSA para moderar y gestionar contenidos.
                </p>
              </div>
              <button 
                onClick={() => navigate('/admin')}
                style={{ 
                  margin: 0, 
                  backgroundColor: 'var(--color-primary)', 
                  color: 'white', 
                  border: 'none',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap'
                }}
              >
                Abrir Panel
              </button>
            </div>
          </div>
        </section>
      )}

      <section className={styles.dangerZone}>
        <h2 className={styles.dangerTitle}>{t('privacy.account_mgmt')}</h2>
        
        <button className={styles.logoutBtn} onClick={() => { logout(); navigate('/entry'); }}>
          {t('privacy.logout')}
        </button>

        <button className={styles.dangerBtn} onClick={handleDeleteData}>
          <UserX size={18} />
          {t('privacy.delete_account')}
        </button>
      </section>

    </motion.div>
  )
}
