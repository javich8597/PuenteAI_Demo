import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Check } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import styles from './DrillDownQuiz.module.css'

const swipeVariants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0, transition: { duration: 0.3 } })
}

const quizQuestions = [
  { id: 'dq1', title: '¿Estás empadronada en la ciudad donde vives?', options: ['Sí', 'Aún no', 'No estoy segura'], type: 'single' },
  { id: 'dq2', title: 'Si aún no lo estás, ¿qué te lo está dificultando?', options: ['El lugar donde vivo', 'Mis documentos', 'No sé cómo hacerlo', 'Me da un poco de miedo', 'Ya estoy empadronada'], type: 'single' },
  { id: 'dq3', title: '¿Cómo describirías la situación de tus papeles hoy?', options: ['Todo en orden', 'Un trámite en proceso', 'Mi tiempo aquí se está acabando', 'Ya no tengo papeles válidos', 'No estoy segura'], type: 'single' },
  { id: 'dq4', title: '¿Cuáles de estos documentos ya tienes?', options: ['Pasaporte', 'NIE', 'Tarjeta TIE', 'Tarjeta Sanitaria', 'Certificado Digital', 'Documentos colombianos apostillados', 'Ninguno todavía'], type: 'multi' },
  { id: 'dq5', title: '¿Has iniciado algún trámite oficial aquí alguna vez?', options: ['Sí, salió bien', 'Sí, sigo esperando', 'Sí, me quedé atascada', 'Sí, fue denegado', 'Aún no'], type: 'single' },
  { id: 'dq6', title: '¿Has oído hablar del "arraigo" (una vía para la residencia)?', options: ['Sí, lo conozco', 'He oído la palabra', 'Es nuevo para mí'], type: 'single' },
  { id: 'dq7', title: '¿Estás guardando pruebas de tu tiempo en España? (recibos, médicas...)', options: ['Sí, los guardo', 'Algunos', 'La verdad es que no'], type: 'single' },
  { id: 'dq8', title: '¿Alguien que vive contigo también podría necesitar ayuda?', options: ['Mis hijos', 'Mi pareja', 'Otro familiar', 'No, solo yo'], type: 'single' },
  { id: 'dq9', title: '¿Tienes algún plan que involucre a Colombia?', options: ['Traer a mi familia aquí', 'Viajar de vuelta', 'Ambos', 'Ningún plan así', 'No estoy segura'], type: 'single' },
  { id: 'dq10', title: '¿Necesitas algún documento de Colombia?', options: ['Sí, pronto', 'Quizás más adelante', 'Tengo lo que necesito', 'No estoy segura'], type: 'single' },
  { id: 'dq11', title: '¿Alguien te está ayudando con el papeleo ahora mismo?', options: ['Un abogado o gestor', 'Un servicio gratuito u ONG', 'Un amigo o familiar', 'Nadie todavía'], type: 'single' },
  { id: 'dq12', title: '¿Qué te resulta más complicado al hacer trámites aquí?', options: ['El catalán vs. el español', 'Las palabras oficiales', 'Saber a qué oficina ir', 'Los portales de internet', 'Me estresa'], type: 'multi' },
  { id: 'dq13', title: '¿Cómo te sientes frente a la idea de ir a una oficina del gobierno?', options: ['Bien yendo sola', 'Un poco ansiosa', 'Lo evito'], type: 'single' },
  { id: 'dq14', title: '¿Cuándo podrías ir a una cita?', options: ['Mañanas', 'Tardes', 'Nochecitas', 'Fines de semana', 'Tendré que planificarlo con tiempo'], type: 'multi' },
  { id: 'dq15', title: '¿Qué sientes que es el peso más grande ahora mismo?', options: ['Miedo', 'No saber por dónde empezar', 'Me faltan documentos', 'Dinero', 'Me siento cansada', 'El idioma', 'Solo necesito que me guíen'], type: 'multi', max: 2 }
]

export default function DrillDownQuiz() {
  const { id: categoryId } = useParams()
  const navigate = useNavigate()
  
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  
  // Guardamos las respuestas en estado local por ahora.
  // En una app real, esto podría ir a un store global o contexto para el ActionPlan.
  const [answers, setAnswers] = useState({})

  const totalSteps = quizQuestions.length

  const goNext = () => {
    if (stepIndex < totalSteps - 1) {
      setDirection(1)
      setStepIndex(stepIndex + 1)
    } else {
      // Finalizar: Guardamos temporalmente si es "ansiosa" para la demo
      const isAnxious = answers['dq13'] === 'Un poco ansiosa' || answers['dq13'] === 'Lo evito'
      // Pass via state in router navigate
      navigate(`/categories/${categoryId}/action-plan`, { state: { answers, isAnxious } })
    }
  }

  const goBack = () => {
    if (stepIndex > 0) {
      setDirection(-1)
      setStepIndex(stepIndex - 1)
    } else {
      navigate(-1)
    }
  }

  const handleSingleAnswer = (opt) => {
    const qId = quizQuestions[stepIndex].id
    setAnswers(p => ({ ...p, [qId]: opt }))
    setTimeout(() => goNext(), 300)
  }

  const toggleMultiSelect = (opt) => {
    const qId = quizQuestions[stepIndex].id
    const max = quizQuestions[stepIndex].max
    setAnswers(p => {
      const curr = p[qId] || []
      if (curr.includes(opt)) {
        return { ...p, [qId]: curr.filter(x => x !== opt) }
      } else {
        if (max && curr.length >= max) return p // Evitar más de max
        return { ...p, [qId]: [...curr, opt] }
      }
    })
  }

  const handleSkip = () => {
    const qId = quizQuestions[stepIndex].id
    setAnswers(p => ({ ...p, [qId]: 'skip' }))
    setTimeout(() => goNext(), 300)
  }

  const currentQ = quizQuestions[stepIndex]
  const qId = currentQ.id
  const currentAnswer = answers[qId]

  const canContinueMulti = currentQ.type === 'multi' && Array.isArray(currentAnswer) && currentAnswer.length > 0

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={goBack}>
          <ArrowLeft size={24} />
        </button>
        <div className={styles.progressText}>Pregunta {stepIndex + 1} de {totalSteps}</div>
      </header>

      <div className={styles.progressContainer}>
        <motion.div 
          className={styles.progressBar}
          animate={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className={styles.content}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stepIndex}
            className={styles.card}
            custom={direction}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <h2 className={styles.questionTitle}>{currentQ.title}</h2>
            {currentQ.type === 'multi' && (
              <p className={styles.subtext}>Selecciona todas las que apliquen {currentQ.max ? `(máximo ${currentQ.max})` : ''}</p>
            )}

            <div className={styles.optionsList}>
              {currentQ.options.map(opt => {
                let isSelected = false
                if (currentQ.type === 'single') isSelected = currentAnswer === opt
                if (currentQ.type === 'multi') isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(opt)

                return (
                  <motion.button
                    key={opt}
                    className={isSelected ? styles.optionSelected : styles.optionBtn}
                    onClick={() => {
                      if (currentQ.type === 'single') handleSingleAnswer(opt)
                      else toggleMultiSelect(opt)
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check size={18} />}
                  </motion.button>
                )
              })}
            </div>
            
            <div className={styles.actionsBox}>
              {currentQ.type === 'multi' && (
                <button 
                  className={styles.continueBtn} 
                  onClick={goNext}
                  disabled={!canContinueMulti}
                >
                  Continuar
                </button>
              )}
              <button className={styles.skipBtn} onClick={handleSkip}>
                Saltar
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
