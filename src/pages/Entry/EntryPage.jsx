/**
 * EntryPage.jsx — Primera pantalla de PuenteAI
 * ─────────────────────────────────────────────
 * Construye confianza inmediata con un diseño cálido,
 * acceso a emergencias y acciones claras.
 */

import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { Shield, Eye } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import { useAppStore } from '../../store/useAppStore'
import { useTranslation } from '../../hooks/useTranslation'
import styles from './EntryPage.module.css'

/* ──────────────────────────────────────────────
   Logo SVG — Arco de puente con nodos de color
   ────────────────────────────────────────────── */
function PuenteLogo() {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.logoSvg}
      role="img"
      aria-label="PuenteAI logo"
    >
      {/* Arco del puente */}
      <path
        d="M30 110 Q120 10 210 110"
        stroke="#E07A5F"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Pilares del puente */}
      <line x1="60" y1="87" x2="60" y2="110" stroke="#E07A5F" strokeWidth="4" strokeLinecap="round" />
      <line x1="120" y1="40" x2="120" y2="110" stroke="#E07A5F" strokeWidth="4" strokeLinecap="round" />
      <line x1="180" y1="87" x2="180" y2="110" stroke="#E07A5F" strokeWidth="4" strokeLinecap="round" />
      {/* Base del puente */}
      <line x1="20" y1="110" x2="220" y2="110" stroke="#E07A5F" strokeWidth="4" strokeLinecap="round" />

      {/* Nodos de conexión (3 colores del brand) */}
      <circle cx="60" cy="82" r="10" fill="#E07A5F" /> {/* Coral */}
      <circle cx="120" cy="34" r="12" fill="#81B29A" /> {/* Sage green */}
      <circle cx="180" cy="82" r="10" fill="#F2CC8F" /> {/* Golden amber */}

      {/* Nombre de la app */}
      <text
        x="120"
        y="140"
        textAnchor="middle"
        fontFamily="Nunito, sans-serif"
        fontWeight="800"
        fontSize="28"
        fill="#3D405B"
      >
        PuenteAI
      </text>
    </svg>
  )
}

/* ──────────────────────────────────────────────
   Variantes de animación para motion
   ────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
}

/* ──────────────────────────────────────────────
   EntryPage Component
   ────────────────────────────────────────────── */
export default function EntryPage() {
  const navigate = useNavigate()
  const loginAsGuest = useAuthStore((s) => s.loginAsGuest)
  const { language, setLanguage } = useAppStore()
  const { t } = useTranslation()

  /** Explorar sin registro → modo invitado */
  const handleExploreAsGuest = async () => {
    await loginAsGuest()
    navigate('/')
  }

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Logo y tagline ── */}
      <motion.div
        className={styles.logoSection}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <PuenteLogo />
        <p className={styles.tagline}>
          {t('entry.tagline')}
        </p>
      </motion.div>

      {/* ── Botones de acción ── */}
      <motion.div
        className={styles.actions}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <button
          className={styles.btnPrimary}
          onClick={() => navigate('/onboarding')}
          aria-label={t('entry.create_account')}
        >
          {t('entry.create_account')}
        </button>

        <button
          className={styles.btnSecondary}
          onClick={() => navigate('/login')}
          aria-label={t('entry.login')}
        >
          {t('entry.login')}
        </button>

        <button
          className={styles.btnGhost}
          onClick={handleExploreAsGuest}
          aria-label={t('entry.explore')}
        >
          <Eye size={18} />
          {t('entry.explore')}
        </button>
      </motion.div>

      {/* ── Sección inferior ── */}
      <motion.div
        className={styles.bottomSection}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        {/* Tarjeta de emergencia */}
        <div
          className={styles.emergencyCard}
          onClick={() => navigate('/safety')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/safety')}
          aria-label={t('entry.emergency_title')}
        >
          <div className={styles.emergencyIcon}>
            <Shield size={22} />
          </div>
          <div className={styles.emergencyText}>
            <span className={styles.emergencyTitle}>
              {t('entry.emergency_title')}
            </span>
            <span className={styles.emergencyDesc}>
              {t('entry.emergency_desc')}
            </span>
          </div>
        </div>

        {/* Toggle de idioma */}
        <div className={styles.languageToggle} role="group" aria-label="Seleccionar idioma">
          <button
            className={language === 'es' ? styles.langBtnActive : styles.langBtn}
            onClick={() => setLanguage('es')}
            aria-pressed={language === 'es'}
          >
            ES
          </button>
          <button
            className={language === 'ca' ? styles.langBtnActive : styles.langBtn}
            onClick={() => setLanguage('ca')}
            aria-pressed={language === 'ca'}
          >
            CA
          </button>
          <button
            className={language === 'en' ? styles.langBtnActive : styles.langBtn}
            onClick={() => setLanguage('en')}
            aria-pressed={language === 'en'}
          >
            EN
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
