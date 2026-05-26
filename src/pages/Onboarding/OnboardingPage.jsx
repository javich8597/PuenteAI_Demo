/**
 * OnboardingPage.jsx — Registro progresivo con cuestionario de 7 preguntas.
 * Implementa el nuevo "PERFIL BASE" y UI condicional (multi-select, desplegables).
 */

import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Sparkles, Compass, Check } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import { calculatePriorities } from '../../utils/scoring'
import styles from './OnboardingPage.module.css'

const stepVariants = {
  enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: (direction) => ({ x: direction < 0 ? 80 : -80, opacity: 0, transition: { duration: 0.25 } }),
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const setOnboardingData = useAuthStore((s) => s.setOnboardingData)

  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calcProgress, setCalcProgress] = useState(0)

  // Respuestas (q1 a q7)
  const [answers, setAnswers] = useState({
    q1: null,
    q2: [], // Multi-select array
    q2_kids_ages: [], // Sub-question for kids ages
    q3: null, // Select value
    q4: null,
    q5: null,
    q6: null,
    q7: null
  })

  // Datos finales de registro
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const totalSteps = 9 // 1: Welcome, 2-8: Q1-Q7, 9: Register
  const progressPercent = (step / totalSteps) * 100

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

  const handleSingleAnswer = (questionKey, value) => {
    setAnswers(prev => ({ ...prev, [questionKey]: value }))
    // Retardo para ux fluida solo si NO es multi-select
    setTimeout(() => goNext(), 350)
  }

  const toggleMultiSelect = (questionKey, value) => {
    setAnswers(prev => {
      const current = prev[questionKey] || []
      const isSelected = current.includes(value)
      return {
        ...prev,
        [questionKey]: isSelected ? current.filter(v => v !== value) : [...current, value]
      }
    })
  }

  const handleSkip = (questionKey) => {
    if (questionKey === 'q2') {
      setAnswers(prev => ({ ...prev, q2: ['skip'], q2_kids_ages: [] }))
    } else {
      setAnswers(prev => ({ ...prev, [questionKey]: 'skip' }))
    }
    setTimeout(() => goNext(), 300)
  }

  const handleFinish = async () => {
    setIsCalculating(true)
    let p = 0
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 15) + 5
      if (p >= 100) p = 100
      setCalcProgress(p)
      if (p === 100) {
        clearInterval(interval)
        setTimeout(() => executeFinish(), 500)
      }
    }, 300)
  }

  const executeFinish = async () => {
    try {
      const { prioritizedCategories } = calculatePriorities(answers)
      setOnboardingData(answers, prioritizedCategories)

      const userEmail = email || `${name.toLowerCase().replace(/\s+/g, '')}${Date.now()}@demo.com`;
      const userPass = password || 'puenteDemo123';
      
      await useAuthStore.getState().signUp(userEmail, userPass, name || 'Amiga', surname || '', phone || '', '', '', '');
      navigate('/');
    } catch (error) {
      console.warn('Supabase error, fallback to local session:', error.message);
      
      const { prioritizedCategories } = calculatePriorities(answers)
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

  const canContinue = () => {
    if (step === 9) return name.trim().length > 0 && email.includes('@') && password.length >= 6
    if (step === 3) return answers.q2?.length > 0 // Q2 Multi-select requires at least 1 or skip
    if (step === 4) return answers.q3 !== null && answers.q3 !== '' // Q3 dropdown
    // For single choice questions
    if (step >= 2 && step <= 8) {
      const qKey = `q${step - 1}`
      return answers[qKey] !== null
    }
    return true
  }

  const renderSkipButton = (qKey) => (
    <motion.button
      className={answers[qKey] === 'skip' || (Array.isArray(answers[qKey]) && answers[qKey].includes('skip')) ? styles.optionBtnSelected : styles.optionBtnSkip}
      onClick={() => handleSkip(qKey)}
      whileTap={{ scale: 0.98 }}
      style={{ marginTop: '1rem' }}
    >
      Prefiero no contestar / Saltar
    </motion.button>
  )

  return (
    <motion.div className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {isCalculating && (
        <motion.div className={styles.calculatingOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div className={styles.calcIconWrapper} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
            <Compass size={40} />
          </motion.div>
          <h2 className={styles.calcTitle}>Calculando ruta...</h2>
          <p className={styles.calcDesc}>Analizando tu perfil base para construir tu ruta personalizada en Barcelona.</p>
          <div className={styles.calcProgressContainer}>
            <div className={styles.calcProgressBar} style={{ width: `${calcProgress}%` }} />
          </div>
        </motion.div>
      )}

      <div className={styles.header}>
        <button className={styles.backButton} onClick={goBack}><ArrowLeft size={20} /></button>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <motion.div className={styles.progressFill} animate={{ width: `${progressPercent}%` }} />
          </div>
          <span className={styles.progressLabel}>Paso {step} de {totalSteps}</span>
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div key={step} className={styles.content} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit">
          
          {/* STEP 1: Welcome Message */}
          {step === 1 && (
            <div className={styles.welcomeContainer}>
              <div className={styles.welcomeIconWrapper}>
                <Sparkles size={48} strokeWidth={1.5} />
              </div>
              <h1 className={styles.stepHeading}>Bienvenida a Puente</h1>
              <div className={styles.welcomeMessage}>
                <p>
                  ¿Puente? es una herramienta creada para ayudarte a navegar por la vida en Barcelona a tu propio ritmo. 
                  Para guiarte mejor hacia los pasos, personas y recursos adecuados, te haremos unas pocas preguntas sobre tu situación.
                </p>
                <p style={{ marginTop: '1rem', fontWeight: 500 }}>
                  Tus respuestas son solo tuyas: no se comparte información personal con autoridades, ONGs ni con nadie más. Puedes saltarte cualquier pregunta que prefieras no contestar.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Q1 - Edad */}
          {step === 2 && (
            <div className={styles.formContainer}>
              <h1 className={styles.stepHeading}>¿Qué edad tienes?</h1>
              <div className={styles.optionsList}>
                {['18-25', '26-35', '36-45', '46-60', '60+'].map(opt => (
                  <motion.button key={opt} className={answers.q1 === opt ? styles.optionBtnSelected : styles.optionBtn} onClick={() => handleSingleAnswer('q1', opt)}>
                    {opt}
                  </motion.button>
                ))}
                {renderSkipButton('q1')}
              </div>
            </div>
          )}

          {/* STEP 3: Q2 - Acompañantes (Multi-select) */}
          {step === 3 && (
            <div className={styles.formContainer}>
              <h1 className={styles.stepHeading}>¿Quién está en Barcelona contigo?</h1>
              <p className={styles.stepSubtext}>Selecciona todas las que apliquen</p>
              <div className={styles.optionsList}>
                {['Estoy aquí sola', 'Con mi pareja', 'Con mis hijos', 'Con familia o amigos'].map(opt => {
                  const isSelected = answers.q2.includes(opt)
                  return (
                    <div key={opt} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <motion.button
                        className={isSelected ? styles.optionBtnSelected : styles.optionBtn}
                        onClick={() => {
                          // Si selecciona "sola", limpiamos las demás. Si selecciona otra, quitamos "sola" o "skip".
                          if (opt === 'Estoy aquí sola') {
                            setAnswers(p => ({ ...p, q2: [opt], q2_kids_ages: [] }))
                          } else {
                            setAnswers(p => {
                              const arr = p.q2.filter(x => x !== 'Estoy aquí sola' && x !== 'skip')
                              const hasIt = arr.includes(opt)
                              if (hasIt) return { ...p, q2: arr.filter(x => x !== opt), q2_kids_ages: opt === 'Con mis hijos' ? [] : p.q2_kids_ages }
                              return { ...p, q2: [...arr, opt] }
                            })
                          }
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <span>{opt}</span>
                          {isSelected && <Check size={18} />}
                        </div>
                      </motion.button>
                      
                      {/* Sub-pregunta reactiva para hijos */}
                      {opt === 'Con mis hijos' && isSelected && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={styles.subOptionsContainer}>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Edades de tus hijos:</p>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {['0-3', '4-11', '12-17'].map(age => (
                              <label key={age} className={styles.checkboxLabel}>
                                <input 
                                  type="checkbox" 
                                  checked={answers.q2_kids_ages.includes(age)}
                                  onChange={() => toggleMultiSelect('q2_kids_ages', age)}
                                  className={styles.checkboxInput}
                                />
                                {age} años
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )
                })}
                {renderSkipButton('q2')}
              </div>
            </div>
          )}

          {/* STEP 4: Q3 - Zona (Select Dropdown) */}
          {step === 4 && (
            <div className={styles.formContainer}>
              <h1 className={styles.stepHeading}>¿En qué zona de Barcelona vives?</h1>
              <p className={styles.stepSubtext}>O dónde pasas más tiempo</p>
              
              <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                <select 
                  className={styles.nameInput} 
                  value={answers.q3 === 'Me muevo entre varios lugares' || answers.q3 === 'skip' ? '' : answers.q3 || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val) handleSingleAnswer('q3', val)
                  }}
                  style={{ appearance: 'auto', paddingRight: '1rem', backgroundColor: 'var(--color-surface)' }}
                >
                  <option value="" disabled>Selecciona un distrito...</option>
                  {[
                    'Ciutat Vella', 'Eixample', 'Sants-Montjuïc', 'Les Corts', 'Sarrià-Sant Gervasi', 
                    'Gràcia', 'Horta-Guinardó', 'Sant Andreu', 'Sant Martí', 
                    'Hospitalet de Llobregat', 'Badalona', 'Santa Coloma', 'Sant Adrià de Besòs'
                  ].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className={styles.optionsList} style={{ marginTop: '1rem' }}>
                <motion.button 
                  className={answers.q3 === 'Me muevo entre varios lugares' ? styles.optionBtnSelected : styles.optionBtn} 
                  onClick={() => handleSingleAnswer('q3', 'Me muevo entre varios lugares')}
                >
                  Me muevo entre varios lugares
                </motion.button>
                {renderSkipButton('q3')}
              </div>
            </div>
          )}

          {/* STEP 5: Q4 - Tiempo en BCN */}
          {step === 5 && (
            <div className={styles.formContainer}>
              <h1 className={styles.stepHeading}>¿Cuánto tiempo llevas en Barcelona?</h1>
              <div className={styles.optionsList}>
                {['Menos de 3 meses', 'Menos de 1 año', '1-3 años', 'Más de 3 años'].map(opt => (
                  <motion.button key={opt} className={answers.q4 === opt ? styles.optionBtnSelected : styles.optionBtn} onClick={() => handleSingleAnswer('q4', opt)}>
                    {opt}
                  </motion.button>
                ))}
                {renderSkipButton('q4')}
              </div>
            </div>
          )}

          {/* STEP 6: Q5 - Ingresos */}
          {step === 6 && (
            <div className={styles.formContainer}>
              <h1 className={styles.stepHeading}>¿Cómo te ganas la vida ahora mismo?</h1>
              <div className={styles.optionsList}>
                {[
                  'Tengo trabajo', 
                  'Tengo trabajo pero es sin contrato', 
                  'Hago pequeños trabajos aquí y allá', 
                  'Me apoya mi familia o ahorros'
                ].map(opt => (
                  <motion.button key={opt} className={answers.q5 === opt ? styles.optionBtnSelected : styles.optionBtn} onClick={() => handleSingleAnswer('q5', opt)}>
                    {opt}
                  </motion.button>
                ))}
                {renderSkipButton('q5')}
              </div>
            </div>
          )}

          {/* STEP 7: Q6 - Papeles */}
          {step === 7 && (
            <div className={styles.formContainer}>
              <h1 className={styles.stepHeading}>¿Cómo describirías tu situación con los papeles ahora mismo?</h1>
              <div className={styles.optionsList}>
                {[
                  'Todo está en orden', 
                  'Hay algo en proceso', 
                  'Las cosas están complicadas', 
                  'No estoy segura'
                ].map(opt => (
                  <motion.button key={opt} className={answers.q6 === opt ? styles.optionBtnSelected : styles.optionBtn} onClick={() => handleSingleAnswer('q6', opt)}>
                    {opt}
                  </motion.button>
                ))}
                {renderSkipButton('q6')}
              </div>
            </div>
          )}

          {/* STEP 8: Q7 - Preocupación Principal */}
          {step === 8 && (
            <div className={styles.formContainer}>
              <h1 className={styles.stepHeading}>¿Cómo describirías tu principal preocupación en este momento?</h1>
              <div className={styles.optionsList}>
                {[
                  'Entender los trámites legales que debo hacer',
                  'Encontrar un trabajo estable',
                  'Mi situación de vivienda',
                  'Mi situación familiar',
                  'Mi salud o seguridad',
                  'Entender el sistema / me siento perdida'
                ].map(opt => (
                  <motion.button key={opt} className={answers.q7 === opt ? styles.optionBtnSelected : styles.optionBtn} onClick={() => handleSingleAnswer('q7', opt)}>
                    {opt}
                  </motion.button>
                ))}
                {renderSkipButton('q7')}
              </div>
            </div>
          )}

          {/* STEP 9: Registro Final */}
          {step === 9 && (
            <div className={styles.formContainer}>
              <h1 className={styles.stepHeading}>Tus datos básicos</h1>
              <p className={styles.stepSubtext}>Crea tu cuenta para guardar tu ruta y conectar con la comunidad MUSA.</p>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>¿Cómo te llamas?</label>
                <input type="text" className={styles.nameInput} placeholder="Ej: Ana" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Apellidos (Opcional)</label>
                <input type="text" className={styles.nameInput} value={surname} onChange={(e) => setSurname(e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Email</label>
                <input type="email" className={styles.nameInput} placeholder="ana@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Contraseña</label>
                <input type="password" className={styles.nameInput} placeholder="***" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className={styles.bottomAction}>
        {step < totalSteps ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <motion.button className={styles.continueBtn} onClick={goNext} disabled={step === 1 ? false : !canContinue()} whileTap={{ scale: 0.97 }}>
              {step === 1 ? 'Empezar' : 'Siguiente'}
            </motion.button>
          </div>
        ) : (
          <motion.button className={styles.continueBtnFinal} onClick={handleFinish} disabled={!canContinue()} whileTap={{ scale: 0.97 }}>
            Terminar y Crear Ruta
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
