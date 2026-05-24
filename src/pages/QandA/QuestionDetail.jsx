import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { motion } from 'motion/react'
import { ChevronLeft, ShieldCheck, Heart, Share2, MoreHorizontal } from 'lucide-react'
import useForumStore from '../../store/useForumStore'
import styles from './QuestionDetail.module.css'

export default function QuestionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { questions, addAnswer } = useForumStore()
  
  const [replyText, setReplyText] = useState('')

  const question = questions.find(q => q.id === id)

  if (!question) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
          <h1 className={styles.title}>Duda no encontrada</h1>
        </header>
      </div>
    )
  }

  const handleSendReply = () => {
    if (!replyText.trim()) return
    addAnswer(id, replyText)
    setReplyText('')
  }

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Duda de la Comunidad</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.questionCard}>
          <div className={styles.qHeader}>
            <div className={styles.authorAvatar}>
              {question.author.charAt(0)}
            </div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{question.author}</span>
              <span className={styles.postTime}>
                {new Date(question.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>
          <h2 className={styles.questionTitle}>
            {question.title}
          </h2>
          <p className={styles.questionBody}>
            {question.content}
          </p>
        </div>

        <div className={styles.answersSection}>
          <h3 className={styles.answersCount}>{question.answers} Respuestas</h3>

          {question.answersList.map((answer) => (
            <div 
              key={answer.id} 
              className={answer.isValidated ? styles.validatedAnswerCard : styles.answerCard}
            >
              {answer.isValidated && (
                <div className={styles.validatedHeader}>
                  <ShieldCheck size={20} color="var(--color-success)" />
                  <span>Respuesta Validada por Madre Tutora</span>
                </div>
              )}
              <div className={styles.aHeader}>
                <div className={styles.authorAvatar} style={answer.isValidated ? { backgroundColor: 'var(--color-primary-light)'} : {}}>
                  {answer.author.charAt(0)}
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>
                    {answer.author} 
                    {answer.isValidated && <ShieldCheck size={14} color="var(--color-primary)"/>}
                  </span>
                  <span className={styles.postTime}>
                    {new Date(answer.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className={styles.answerBody}>
                {answer.content}
              </p>
              <div className={styles.answerActions}>
                <button className={styles.actionBtn}><Heart size={18} /> Útil</button>
                {answer.isValidated && <button className={styles.actionBtn}><Share2 size={18} /></button>}
              </div>
            </div>
          ))}

          {question.answersList.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: '2rem' }}>
              Aún no hay respuestas. ¡Sé la primera en ayudar!
            </div>
          )}

        </div>
      </div>

      <div className={styles.replyBar}>
        <input 
          type="text" 
          placeholder="Escribe una respuesta..." 
          className={styles.replyInput} 
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button 
          className={styles.sendBtn}
          onClick={handleSendReply}
          disabled={!replyText.trim()}
          style={{ opacity: replyText.trim() ? 1 : 0.5 }}
        >
          Enviar
        </button>
      </div>

    </motion.div>
  )
}
