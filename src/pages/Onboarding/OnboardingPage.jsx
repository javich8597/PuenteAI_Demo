/**
 * OnboardingPage.jsx — Registro progresivo en 3 pasos
 * ─────────────────────────────────────────────────────
 * Paso 1: Nombre  |  Paso 2: Tiempo en BCN  |  Paso 3: Intereses
 * Diseñado para completarse en menos de 2 minutos.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Check } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import { categories } from '../../data/categories'
import styles from './OnboardingPage.module.css'

/* ─── Opciones de tiempo en Barcelona ─── */
const timeOptions = [
  { id: 'less3m', label: 'Menos de 3 meses', emoji: '🌱' },
  { id: '3to12m', label: '3 a 12 meses', emoji: '🌿' },
  { id: '1to3y', label: '1 a 3 años', emoji: '🌳' },
  { id: 'more3y', label: 'Más de 3 años', emoji: '🌲' },
]

/* ─── Iconos de categoría como componente ─── */
const categoryIcons = {
  legal: '⚖️',
  health: '❤️',
  education: '🎓',
  work: '💼',
  community: '👥',
  housing: '🏠',
}

/* ─── Animación de los pasos ─── */
const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
    transition: { duration: 0.25 },
  }),
}

/* ══════════════════════════════════════════════
   Componente Principal
   ══════════════════════════════════════════════ */
export default function OnboardingPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  // Estado del onboarding
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1) // 1 = avanzar, -1 = retroceder
  const [name, setName] = useState('')
  const [timeInBarcelona, setTimeInBarcelona] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])

  const totalSteps = 3
  const progressPercent = (step / totalSteps) * 100

  /* ── Navegación entre pasos ── */
  const goNext = () => {
    if (step < totalSteps) {
      setDirection(1)
      setStep(step + 1)
    }
  }

  const goBack = () => {
    if (step > 1) {
      setDirection(-1)
      setStep(step - 1)
    } else {
      navigate('/entry')
    }
  }

  /* ── Toggle selección de categoría ── */
  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  /* ── Login social simulado ── */
  const handleSocialLogin = (provider) => {
    login({
      id: 'user-social-' + Date.now(),
      name: 'Amiga',
      avatar: null,
      timeInBarcelona: '',
      categories: [],
      points: 0,
      badges: [],
    })
    navigate('/')
  }

  /* ── Finalizar onboarding ── */
  const handleFinish = () => {
    login({
      id: 'user-' + Date.now(),
      name: name || 'Amiga',
      avatar: null,
      timeInBarcelona,
      categories: selectedCategories,
      points: 0,
      badges: [],
    })
    navigate('/')
  }

  /* ── Validar si puede avanzar ── */
  const canContinue = () => {
    if (step === 1) return name.trim().length > 0
    if (step === 2) return timeInBarcelona !== null
    if (step === 3) return true // Categorías opcionales
    return false
  }

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* ── Cabecera con progreso ── */}
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={goBack}
          aria-label="Volver atrás"
        >
          <ArrowLeft size={20} />
        </button>

        <div className={styles.progressContainer}>
          <div className={styles.progressBar} role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
            <motion.div
              className={styles.progressFill}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className={styles.progressLabel}>
            Paso {step} de {totalSteps}
          </span>
        </div>
      </div>

      {/* ── Contenido del paso actual ── */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          className={styles.content}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {/* ────── PASO 1: Nombre ────── */}
          {step === 1 && (
            <>
              <h1 className={styles.stepHeading}>
                ¡Hola! 👋 ¿Cómo te llamas?
              </h1>
              <p className={styles.stepSubtext}>
                Este es el nombre que verán otras mamás en la comunidad
              </p>

              <input
                type="text"
                className={styles.nameInput}
                placeholder="Tu nombre..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                aria-label="Tu nombre"
              />
              <p className={styles.inputHint}>
                Puedes usar un apodo si lo prefieres 😊
              </p>

              {/* Login social simulado */}
              <div className={styles.socialSection}>
                <span className={styles.socialLabel}>
                  O regístrate con:
                </span>
                <div className={styles.socialButtons}>
                  <button
                    className={styles.socialBtn}
                    onClick={() => handleSocialLogin('google')}
                    aria-label="Registrarse con Google"
                  >
                    🔵
                  </button>
                  <button
                    className={styles.socialBtn}
                    onClick={() => handleSocialLogin('apple')}
                    aria-label="Registrarse con Apple"
                  >
                    🍎
                  </button>
                  <button
                    className={styles.socialBtn}
                    onClick={() => handleSocialLogin('whatsapp')}
                    aria-label="Registrarse con WhatsApp"
                  >
                    💬
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ────── PASO 2: Tiempo en Barcelona ────── */}
          {step === 2 && (
            <>
              <h1 className={styles.stepHeading}>
                ¿Cuánto tiempo llevas en Barcelona?
              </h1>
              <p className={styles.stepSubtext}>
                Esto nos ayuda a personalizar tu experiencia
              </p>

              <div className={styles.timeCards}>
                {timeOptions.map((opt) => (
                  <motion.div
                    key={opt.id}
                    className={
                      timeInBarcelona === opt.id
                        ? styles.timeCardSelected
                        : styles.timeCard
                    }
                    onClick={() => setTimeInBarcelona(opt.id)}
                    whileTap={{ scale: 0.97 }}
                    role="radio"
                    aria-checked={timeInBarcelona === opt.id}
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && setTimeInBarcelona(opt.id)
                    }
                  >
                    <span className={styles.timeEmoji}>{opt.emoji}</span>
                    <span className={styles.timeLabel}>{opt.label}</span>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* ────── PASO 3: Intereses ────── */}
          {step === 3 && (
            <>
              <h1 className={styles.stepHeading}>
                ¿Qué necesitas ahora mismo?
              </h1>
              <p className={styles.stepSubtext}>
                Puedes seleccionar varias opciones. Puedes cambiar esto después.
              </p>

              <div className={styles.categoryGrid}>
                {categories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.id)
                  return (
                    <motion.div
                      key={cat.id}
                      className={
                        isSelected
                          ? styles.categoryCardSelected
                          : styles.categoryCard
                      }
                      onClick={() => toggleCategory(cat.id)}
                      whileTap={{ scale: 0.95 }}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && toggleCategory(cat.id)
                      }
                    >
                      {isSelected && (
                        <motion.div
                          className={styles.checkMark}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          <Check size={14} strokeWidth={3} />
                        </motion.div>
                      )}
                      <div
                        className={styles.categoryIcon}
                        style={{ backgroundColor: cat.color + '18' }}
                      >
                        <span>{categoryIcons[cat.id] || '📌'}</span>
                      </div>
                      <span className={styles.categoryName}>{cat.name}</span>
                      <span className={styles.categoryDesc}>
                        {cat.description}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Botón de acción ── */}
      <div className={styles.bottomAction}>
        {step < totalSteps ? (
          <motion.button
            className={styles.continueBtn}
            onClick={goNext}
            disabled={!canContinue()}
            whileTap={{ scale: 0.97 }}
          >
            Continuar
          </motion.button>
        ) : (
          <motion.button
            className={styles.continueBtnFinal}
            onClick={handleFinish}
            whileTap={{ scale: 0.97 }}
          >
            ✨ Empezar mi camino
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
