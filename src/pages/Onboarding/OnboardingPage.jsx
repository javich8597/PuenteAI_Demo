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

/* ─── Opciones de tiempo en Barcelona (Situación) ─── */
const timeOptions = [
  { id: 'less3m', label: 'Recién llegada', emoji: '🌱' },
  { id: '3to12m', label: 'Buscando estabilidad', emoji: '🌿' },
  { id: '1to3y', label: 'Asentándome', emoji: '🌳' },
  { id: 'more3y', label: 'Establecida', emoji: '🌲' },
]

/* ─── Opciones de Barrios ─── */
const neighborhoodOptions = [
  'Ciutat Vella', 'Eixample', 'Sants-Montjuïc', 'Les Corts', 
  'Sarrià-Sant Gervasi', 'Gràcia', 'Horta-Guinardó', 
  'Nou Barris', 'Sant Andreu', 'Sant Martí', 'Fuera de Barcelona'
]

/* ─── Opciones de Idiomas ─── */
const languageOptions = ['Español', 'Català', 'English', 'Français', 'العربية', 'Otra']

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
  const [surname, setSurname] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [language, setLanguage] = useState('')
  const [timeInBarcelona, setTimeInBarcelona] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])

  const totalSteps = 5
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

  /* ── Finalizar onboarding (Supabase) ── */
  const handleFinish = async () => {
    try {
      const userEmail = email || `${name.toLowerCase().replace(/\s+/g, '')}${Date.now()}@demo.com`;
      const userPass = password || 'puenteDemo123';
      
      await useAuthStore.getState().signUp(userEmail, userPass, name || 'Amiga', surname || '', phone || '', neighborhood || '', language || '', timeInBarcelona || '');
      
      navigate('/');
    } catch (error) {
      console.warn('Supabase error, fallback to local session for demo:', error.message);
      // Forzar sesión local para que la demo no se rompa por límites de Supabase
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
    if (step === 1) {
      return name.trim().length > 0 && 
             surname.trim().length > 0 && 
             phone.trim().length >= 9 && 
             email.includes('@') && 
             password.length >= 6
    }
    // Pasos 2, 3, 4 y 5 son opcionales o informativos, siempre pueden avanzar
    return true
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
          {/* ────── PASO 1: Datos Personales ────── */}
          {step === 1 && (
            <div className={styles.formContainer}>
              <h1 className={styles.stepHeading}>
                Tus Datos Básicos
              </h1>
              <p className={styles.stepSubtext}>
                Para proteger la comunidad, necesitamos validar tu identidad
              </p>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Nombre</label>
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
                <label className={styles.inputLabel}>Apellidos</label>
                <input
                  type="text"
                  className={styles.nameInput}
                  placeholder="Ej: García López"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Teléfono Móvil</label>
                <input
                  type="tel"
                  className={styles.nameInput}
                  placeholder="Ej: 600 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Correo Electrónico</label>
                <input
                  type="email"
                  className={styles.nameInput}
                  placeholder="Ej: ana@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Contraseña</label>
                <input
                  type="password"
                  className={styles.nameInput}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

            </div>
          )}

          {/* ────── PASO 2: Barrio (Opcional) ────── */}
          {step === 2 && (
            <div className={styles.formContainer}>
              <h1 className={styles.stepHeading}>
                ¿En qué zona de Barcelona vives?
              </h1>
              <p className={styles.stepSubtext}>
                Esto nos permite conectarte con recursos y Madres Mentoras cerca de ti. (Opcional)
              </p>

              <div className={styles.neighborhoodGrid}>
                {neighborhoodOptions.map((nb) => (
                  <motion.button
                    key={nb}
                    className={
                      neighborhood === nb ? styles.optionBtnSelected : styles.optionBtn
                    }
                    onClick={() => setNeighborhood(nb)}
                    whileTap={{ scale: 0.95 }}
                  >
                    {nb}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* ────── PASO 3: Idioma y Situación (Opcional) ────── */}
          {step === 3 && (
            <div className={styles.formContainer}>
              <h1 className={styles.stepHeading}>
                Conozcámonos un poco más
              </h1>
              <p className={styles.stepSubtext}>
                Selecciona tu idioma preferido y tu situación actual. (Opcional)
              </p>

              <label className={styles.inputLabel} style={{ marginTop: '1rem' }}>Idioma preferido</label>
              <div className={styles.neighborhoodGrid}>
                {languageOptions.map((lang) => (
                  <motion.button
                    key={lang}
                    className={
                      language === lang ? styles.optionBtnSelected : styles.optionBtn
                    }
                    onClick={() => setLanguage(lang)}
                    whileTap={{ scale: 0.95 }}
                  >
                    {lang}
                  </motion.button>
                ))}
              </div>

              <label className={styles.inputLabel} style={{ marginTop: '1.5rem' }}>Tu situación actual en Barcelona</label>
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
            </div>
          )}

          {/* ────── PASO 4: Intereses (Opcional) ────── */}
          {step === 4 && (
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

          {/* ────── PASO 5: Microtutorial ────── */}
          {step === 5 && (
            <div className={styles.tutorialContainer}>
              <h1 className={styles.stepHeading}>
                ¡Bienvenida a PuenteAI! 🎉
              </h1>
              <p className={styles.stepSubtext}>
                Antes de empezar, aquí tienes una guía rápida de cómo podemos ayudarte.
              </p>
              
              <div className={styles.tutorialCard}>
                <div className={styles.tutorialItem}>
                  <div className={styles.tutorialIcon}>🤝</div>
                  <div className={styles.tutorialText}>
                    <strong>Conexión con Madres Mentoras</strong>
                    <p>La inteligencia artificial te asignará una madre experimentada en tu barrio que habla tu idioma.</p>
                  </div>
                </div>
                
                <div className={styles.tutorialItem}>
                  <div className={styles.tutorialIcon}>💬</div>
                  <div className={styles.tutorialText}>
                    <strong>Foro de Dudas Seguras</strong>
                    <p>Haz preguntas y recibe respuestas validadas por expertas en trámites, salud y educación.</p>
                  </div>
                </div>

                <div className={styles.tutorialItem}>
                  <div className={styles.tutorialIcon}>🆘</div>
                  <div className={styles.tutorialText}>
                    <strong>Botón de Emergencias</strong>
                    <p>En caso de urgencia, tendrás acceso rápido a los servicios de emergencia de Barcelona con un toque.</p>
                  </div>
                </div>
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
              disabled={!canContinue()}
              whileTap={{ scale: 0.97 }}
            >
              Continuar
            </motion.button>
            {step > 1 && (
              <button className={styles.skipBtn} onClick={goNext}>
                Saltar este paso
              </button>
            )}
          </div>
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
