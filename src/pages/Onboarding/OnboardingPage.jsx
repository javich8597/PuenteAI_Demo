/**
 * OnboardingPage.jsx — Registro progresivo con cuestionario de 6 preguntas.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Sparkles, Heart } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import { useTranslation } from '../../hooks/useTranslation'
import { calculatePriorities } from '../../utils/scoring'
import styles from './OnboardingPage.module.css'

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

export default function OnboardingPage() {
  const navigate = useNavigate()
  const setOnboardingData = useAuthStore((s) => s.setOnboardingData)
  const { t } = useTranslation()

  // Estado del onboarding
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1) // 1 = avanzar, -1 = retroceder

  // Respuestas del formulario
  const [answers, setAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null
  })

  // Datos básicos (último paso)
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const totalSteps = 8
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

  const handleAnswer = (question, answer) => {
    setAnswers(prev => ({ ...prev, [question]: answer }))
    // Autoadvance after brief delay for better UX
    setTimeout(() => {
      goNext()
    }, 400)
  }

  /* ── Finalizar onboarding (Supabase) ── */
  const handleFinish = async () => {
    try {
      // Calcular prioridades basadas en las respuestas
      const prioritizedCategories = calculatePriorities(answers)
      setOnboardingData(answers, prioritizedCategories)

      const userEmail = email || `${name.toLowerCase().replace(/\s+/g, '')}${Date.now()}@demo.com`;
      const userPass = password || 'puenteDemo123';
      
      await useAuthStore.getState().signUp(userEmail, userPass, name || 'Amiga', surname || '', phone || '', '', '', '');
      
      navigate('/');
    } catch (error) {
      console.warn('Supabase error, fallback to local session for demo:', error.message);
      
      const prioritizedCategories = calculatePriorities(answers)
      setOnboardingData(answers, prioritizedCategories)

      useAuthStore.setState({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'demo-user-' + Date.now(),
          email: email || 'demo@puente.ai',
          name: name || 'Amiga',
          avatar: name ? name.charAt(0).toUpperCase() : '👤',
          role: 'user',
          seeds: 0
        }
      });
      navigate('/');
    }
  }

  /* ── Validar si puede avanzar ── */
  const canContinue = () => {
    if (step === 8) {
      return name.trim().length > 0 && 
             email.includes('@') && 
             password.length >= 6
    }
    // Para las preguntas, requerimos que hayan seleccionado algo, 
    // pero también tienen el botón explícito de "saltar" o "prefiero no contestar"
    if (step >= 2 && step <= 7) {
      const qKey = `q${step - 1}`;
      return answers[qKey] !== null;
    }
    return true
  }

  // Opciones para las preguntas
  const questions = [
    {
      id: 'q1',
      options: ['q1_a1', 'q1_a2', 'q1_a3', 'q1_a4']
    },
    {
      id: 'q2',
      options: ['q2_a1', 'q2_a2', 'q2_a3', 'q2_a4']
    },
    {
      id: 'q3',
      options: ['q3_a1', 'q3_a2', 'q3_a3', 'q3_a4']
    },
    {
      id: 'q4',
      options: ['q4_a1', 'q4_a2', 'q4_a3', 'q4_a4']
    },
    {
      id: 'q5',
      options: ['q5_a1', 'q5_a2', 'q5_a3', 'q5_a4']
    },
    {
      id: 'q6',
      options: ['q6_a1', 'q6_a2', 'q6_a3', 'q6_a4', 'q6_a5', 'q6_a6']
    }
  ]

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
            {t('onboarding.step_of', { step, total: totalSteps })}
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
          {/* ────── PASO 1: Bienvenida ────── */}
          {step === 1 && (
            <div className={styles.welcomeContainer}>
              <div className={styles.welcomeIconWrapper}>
                <Sparkles size={48} strokeWidth={1.5} />
              </div>
              <h1 className={styles.stepHeading}>
                {t('onboarding.welcome')}
              </h1>
              <div className={styles.welcomeMessage}>
                <p>{t('onboarding.welcome_msg')}</p>
              </div>
            </div>
          )}

          {/* ────── PASOS 2 a 7: Cuestionario ────── */}
          {step >= 2 && step <= 7 && (
            <div className={styles.formContainer}>
              <h1 className={styles.stepHeading}>
                {t(`onboarding.q${step - 1}`)}
              </h1>
              
              <div className={styles.optionsList}>
                {questions[step - 2].options.map(opt => (
                  <motion.button
                    key={opt}
                    className={answers[`q${step - 1}`] === opt ? styles.optionBtnSelected : styles.optionBtn}
                    onClick={() => handleAnswer(`q${step - 1}`, opt)}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t(`onboarding.${opt}`)}
                  </motion.button>
                ))}
                
                {/* Opción obligatoria: Prefiero no contestar */}
                <motion.button
                  className={answers[`q${step - 1}`] === 'skip' ? styles.optionBtnSelected : styles.optionBtnSkip}
                  onClick={() => handleAnswer(`q${step - 1}`, 'skip')}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('onboarding.prefer_not')}
                </motion.button>
              </div>
            </div>
          )}

          {/* ────── PASO 8: Registro final ────── */}
          {step === 8 && (
            <div className={styles.formContainer}>
              <h1 className={styles.stepHeading}>
                {t('onboarding.basic_data')}
              </h1>
              <p className={styles.stepSubtext}>
                {t('onboarding.basic_desc')}
              </p>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t('onboarding.name')}</label>
                <input
                  type="text"
                  className={styles.nameInput}
                  placeholder="Ej: Ana"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t('onboarding.surname')}</label>
                <input
                  type="text"
                  className={styles.nameInput}
                  placeholder="Opcional"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t('onboarding.phone')}</label>
                <input
                  type="tel"
                  className={styles.nameInput}
                  placeholder="Opcional"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t('onboarding.email')}</label>
                <input
                  type="email"
                  className={styles.nameInput}
                  placeholder="Ej: ana@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t('onboarding.password')}</label>
                <input
                  type="password"
                  className={styles.nameInput}
                  placeholder="***"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className={styles.bottomAction}>
        {step < totalSteps ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <motion.button
              className={styles.continueBtn}
              onClick={goNext}
              disabled={step === 1 ? false : !canContinue()}
              whileTap={{ scale: 0.97 }}
            >
              {t('onboarding.btn_continue')}
            </motion.button>
          </div>
        ) : (
          <motion.button
            className={styles.continueBtnFinal}
            onClick={handleFinish}
            disabled={!canContinue()}
            whileTap={{ scale: 0.97 }}
          >
            {t('onboarding.btn_start')}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
