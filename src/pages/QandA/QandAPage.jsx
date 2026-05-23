import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { Search, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react'
import styles from './QandAPage.module.css'

const mockQuestions = [
  {
    id: 'q1',
    title: '¿Alguien sabe qué papeles piden para inscribir al niño en el colegio?',
    author: 'Rosa M.',
    answersCount: 3,
    hasValidatedAnswer: true,
    time: 'Hace 2 horas',
  },
  {
    id: 'q2',
    title: 'Duda urgente sobre la tarjeta sanitaria si aún no tengo NIE',
    author: 'Elena G.',
    answersCount: 1,
    hasValidatedAnswer: false,
    time: 'Hace 5 horas',
  },
  {
    id: 'q3',
    title: '¿Dónde recomiendan buscar alquiler que acepten sin contrato indefinido?',
    author: 'Julissa P.',
    answersCount: 8,
    hasValidatedAnswer: true,
    time: 'Ayer',
  }
]

export default function QandAPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className={styles.header}>
        <div className={styles.headerTitleRow}>
          <HelpCircle size={32} color="var(--color-primary)" />
          <h1 className={styles.title}>Foro de Dudas</h1>
        </div>
        <p className={styles.subtitle}>Pregunta a la comunidad. Busca el escudo verde para respuestas seguras.</p>
      </header>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input 
          type="text" 
          placeholder="Busca tu duda antes de preguntar..." 
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.questionsList}>
        {mockQuestions.map(q => (
          <motion.div 
            key={q.id} 
            className={styles.questionCard}
            onClick={() => navigate(`/qanda/${q.id}`)}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className={styles.qTitle}>{q.title}</h3>
            
            <div className={styles.qFooter}>
              <div className={styles.qMeta}>
                <span className={styles.qAuthor}>{q.author}</span>
                <span className={styles.dot}>•</span>
                <span className={styles.qTime}>{q.time}</span>
              </div>
              
              <div className={styles.qStats}>
                {q.hasValidatedAnswer && (
                  <div className={styles.validatedBadge}>
                    <ShieldCheck size={16} /> Validada
                  </div>
                )}
                <div className={styles.answersCount}>
                  <MessageSquare size={16} /> {q.answersCount}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className={styles.fabBtn} onClick={() => alert('Abrir modal de nueva pregunta')}>
        <span>+ Haz una Pregunta</span>
      </button>

    </motion.div>
  )
}
