import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { Search, MessageSquare, ShieldCheck, HelpCircle, X } from 'lucide-react'
import useForumStore from '../../store/useForumStore'
import { useTranslation } from '../../hooks/useTranslation'
import styles from './QandAPage.module.css'

export default function QandAPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { questions, addQuestion, fetchQuestions, subscribeToChanges } = useForumStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [newQTitle, setNewQTitle] = useState('')
  const [newQContent, setNewQContent] = useState('')

  useEffect(() => {
    fetchQuestions()
    const unsubscribe = subscribeToChanges()
    return () => unsubscribe()
  }, [fetchQuestions, subscribeToChanges])

  const handleCreateQuestion = (e) => {
    e.preventDefault()
    if (!newQTitle.trim() || !newQContent.trim()) return
    addQuestion(newQTitle, newQContent, 'General')
    setNewQTitle('')
    setNewQContent('')
    setIsModalOpen(false)
  }

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className={styles.header}>
        <div className={styles.headerTitleRow}>
          <HelpCircle size={32} color="var(--color-primary)" />
          <h1 className={styles.title}>{t('qanda.title')}</h1>
        </div>
        <p className={styles.subtitle}>{t('qanda.subtitle')}</p>
      </header>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input 
          type="text" 
          placeholder={t('qanda.search_placeholder')}
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.questionsList}>
        {questions.map(q => (
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
                <span className={styles.qTime}>{t('qanda.recent')}</span>
              </div>
              
              <div className={styles.qStats}>
                {q.isValidated && (
                  <div className={styles.validatedBadge}>
                    <ShieldCheck size={16} /> {t('qanda.validated')}
                  </div>
                )}
                <div className={styles.answersCount}>
                  <MessageSquare size={16} /> {q.answers}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className={styles.fabBtn} onClick={() => setIsModalOpen(true)}>
        <span>{t('qanda.ask_button')}</span>
      </button>

      <AnimatePresence>
        {isModalOpen && (
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
                <h2>{t('qanda.modal_title')}</h2>
                <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}>
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateQuestion} className={styles.modalForm}>
                <input 
                  type="text" 
                  placeholder={t('qanda.modal_placeholder_title')}
                  className={styles.modalInput}
                  value={newQTitle}
                  onChange={(e) => setNewQTitle(e.target.value)}
                  maxLength={100}
                />
                <textarea 
                  placeholder={t('qanda.modal_placeholder_desc')}
                  className={styles.modalTextarea}
                  value={newQContent}
                  onChange={(e) => setNewQContent(e.target.value)}
                  rows={6}
                />
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={!newQTitle.trim() || !newQContent.trim()}
                >
                  {t('qanda.modal_submit')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
