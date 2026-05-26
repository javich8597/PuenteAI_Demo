import { useNavigate, useParams } from 'react-router'
import { motion } from 'motion/react'
import { PlayCircle, CheckCircle, ChevronLeft, Video, Lightbulb, Users, FileText } from 'lucide-react'
import categories from '../../data/categories'
import { useTranslation } from '../../hooks/useTranslation'
import styles from './CategoryDetail.module.css'

export default function CategoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  const category = categories.find(c => c.id === id) || categories[0]

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <header className={styles.header} style={{ backgroundColor: `${category.color}15` }}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={24} color={category.color} />
        </button>
        <h1 className={styles.title} style={{ color: category.color }}>{t(`categories.${category.id}.name`)}</h1>
      </header>

      <div className={styles.content}>
        <section className={styles.videoSection}>
          <div className={styles.videoMock}>
            <div className={styles.videoThumbnail} style={{ backgroundColor: category.color }}>
              <PlayCircle size={64} color="white" className={styles.playIcon} />
            </div>
            <div className={styles.videoInfo}>
              <h2>{t('category_detail.microtutorial')}</h2>
              <p>{t('category_detail.by_tutor', { name: 'María C.' })}</p>
            </div>
          </div>
        </section>

        <section className={styles.actionSection}>
          <button 
            className={styles.primaryBtn} 
            style={{ backgroundColor: category.color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}
            onClick={() => navigate(`/categories/${category.id}/drilldown`)}
          >
            <FileText size={24} />
            Solicitar ayuda personalizada (Plan de Acción)
          </button>

          <button className={styles.primaryBtn} style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', border: `1px solid ${category.color}` }}>
            <Video size={24} color={category.color} />
            {t('category_detail.watch_full')}
          </button>
          
          <div className={styles.tipsBox} style={{ borderColor: `${category.color}50`, backgroundColor: `${category.color}10`, marginTop: '1.5rem' }}>
            <div className={styles.tipsHeader}>
              <Lightbulb size={20} color={category.color} />
              <h3>{t('category_detail.important')}</h3>
            </div>
            <ul className={styles.tipsList}>
              <li><CheckCircle size={16} color="var(--color-success)" /> {t('category_detail.tip1')}</li>
              <li><CheckCircle size={16} color="var(--color-success)" /> {t('category_detail.tip2')}</li>
              <li><CheckCircle size={16} color="var(--color-success)" /> {t('category_detail.tip3')}</li>
            </ul>
          </div>
        </section>

        <section className={styles.tutorsSection}>
          <h3 className={styles.sectionTitle}>{t('category_detail.tutors_available')}</h3>
          <div className={styles.tutorCard}>
            <div className={styles.tutorAvatar}>M</div>
            <div className={styles.tutorInfo}>
              <h4>María C.</h4>
              <p>{t('category_detail.tutor_expert')}</p>
            </div>
            <button className={styles.connectBtn} onClick={() => navigate('/chat/new')}>{t('category_detail.chat')}</button>
          </div>
        </section>
      </div>
    </motion.div>
  )
}
